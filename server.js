// Kundencockpit – kleiner Webserver für den Workshop.
//
// Was diese Datei macht:
//   1. Sie liefert die Webseite aus dem Ordner public/ aus.
//   2. Sie liest die Markdown-Dateien aus kunden/ und gespraeche/ und gibt sie als JSON weiter.
//   3. Sie startet auf Knopfdruck die KI (Codex CLI) im Hintergrund und gibt deren Antwort zurück.
//      Klappt das nicht, kommt ein vorbereitetes Beispielergebnis aus fallback/.
//
// Start: npm run dev   –   danach im Browser http://localhost:3000 öffnen.

const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ZEITLIMIT_SEKUNDEN = 180;

// Der KI-Befehl, genau so wie man ihn im Terminal eintippen würde. Die Frage kommt über die Eingabe (stdin).
// Standard: Codex, darf nur lesen. Beispiel für Claude Code:  AGENT_CLI="claude -p"
const AGENT_CLI = process.env.AGENT_CLI || 'codex exec --sandbox read-only --skip-git-repo-check -';

// ---------------------------------------------------------------------------
// Dateien lesen
// ---------------------------------------------------------------------------

// Wandelt einen Wert aus dem Kopfbereich um: Anführungszeichen weg, Zahlen als Zahl.
function wert(text) {
  const s = text.trim().replace(/^"(.*)"$/, '$1');
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : s;
}

// Liest den Kopfbereich einer Markdown-Datei (zwischen den beiden "---").
// Kann genau das, was unsere Dateien brauchen: "schluessel: wert", Listen mit "- eintrag"
// und Einträge mit mehreren Feldern (z. B. Ansprechpartner mit name und rolle).
function parseFrontmatter(inhalt) {
  const treffer = inhalt.replace(/^﻿/, '').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!treffer) return { daten: {}, text: inhalt };
  const daten = {};
  let schluessel = null;
  let eintrag = null;
  for (const zeile of treffer[1].split(/\r?\n/)) {
    if (!zeile.trim() || zeile.trim().startsWith('#')) continue;
    let t;
    if ((t = zeile.match(/^(\S[^:]*):\s*(.*)$/))) {
      // "schluessel: wert" (ganz links)
      schluessel = t[1].trim();
      daten[schluessel] = t[2] ? wert(t[2]) : null;
      eintrag = null;
    } else if ((t = zeile.match(/^\s+-\s+(.*)$/))) {
      // "  - eintrag" oder "  - name: Wert"
      if (!Array.isArray(daten[schluessel])) daten[schluessel] = [];
      const feld = t[1].match(/^([^:]+):\s*(.*)$/);
      eintrag = feld ? { [feld[1].trim()]: wert(feld[2]) } : null;
      daten[schluessel].push(eintrag ?? wert(t[1]));
    } else if ((t = zeile.match(/^\s+([^:]+):\s*(.*)$/))) {
      // "    feld: wert" (eingerückt, gehört zum Eintrag oder Schlüssel darüber)
      const ziel = eintrag ?? (daten[schluessel] ??= {});
      ziel[t[1].trim()] = wert(t[2]);
    }
  }
  return { daten, text: treffer[2] };
}

// Liest alle .md-Dateien eines Ordners. Jede Datei wird zu { ...kopfdaten, datei, inhalt }.
function leseOrdner(ordner) {
  const pfad = path.join(__dirname, ordner);
  return fs.readdirSync(pfad)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => {
      const inhalt = fs.readFileSync(path.join(pfad, name), 'utf8');
      return { ...parseFrontmatter(inhalt).daten, datei: `${ordner}/${name}`, inhalt };
    });
}

const findeKunde = (id) => leseOrdner('kunden').find((k) => k.id === id);

// Gesprächsnotizen eines Kunden, neueste zuerst.
const gespraecheVon = (id) => leseOrdner('gespraeche')
  .filter((g) => g.kunde === id)
  .sort((a, b) => String(b.datum).localeCompare(String(a.datum)));

// ---------------------------------------------------------------------------
// KI-Agent starten
// ---------------------------------------------------------------------------

// Holt JSON aus einer KI-Antwort, auch wenn Text oder ```-Blöcke drumherum stehen.
function alsJson(text) {
  const start = text.search(/[[{]/);
  const ende = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'));
  if (start < 0 || ende < start) return null;
  try {
    return JSON.parse(text.slice(start, ende + 1));
  } catch {
    return null;
  }
}

// Startet die KI wie im Terminal: im Projektordner, Frage über die Eingabe, Antwort über die Ausgabe.
// Gibt immer ein Ergebnis zurück, wirft nie: { ok, text, sekunden }.
function runAgent(prompt, titel = 'KI-Aufruf') {
  console.log(`\n[KI] START  ${titel}: ${prompt}`);
  const start = Date.now();
  const kind = spawn(AGENT_CLI, { cwd: __dirname, shell: true });
  let stdout = '';
  let stderr = '';
  kind.stdout.on('data', (d) => { stdout += d; });
  kind.stderr.on('data', (d) => { stderr += d; });
  kind.stdin.on('error', () => {}); // passiert, wenn die CLI sofort wieder endet
  kind.stdin.end(prompt);

  return new Promise((resolve) => {
    let erledigt = false;
    const fertig = (ok, text) => {
      if (erledigt) return;
      erledigt = true;
      clearTimeout(timer);
      const sekunden = Math.round((Date.now() - start) / 1000);
      console.log(ok
        ? `[KI] OK     ${titel} – fertig nach ${sekunden} s`
        : `[KI] FEHLER ${titel} – nach ${sekunden} s: ${text}`);
      resolve({ ok, text, sekunden });
    };

    const timer = setTimeout(() => {
      stoppe(kind);
      fertig(false, `Die KI hat nicht innerhalb von ${ZEITLIMIT_SEKUNDEN} Sekunden geantwortet.`);
    }, ZEITLIMIT_SEKUNDEN * 1000);

    kind.on('error', (fehler) => fertig(false, `Die KI-CLI konnte nicht gestartet werden: ${fehler.message}`));
    kind.on('close', (code) => {
      if (code === 0 && stdout.trim()) return fertig(true, stdout.trim());
      if (code === 9009 || code === 127) {
        return fertig(false, `Der Befehl "${AGENT_CLI.split(' ')[0]}" wurde nicht gefunden. Ist die Codex CLI installiert (npm run check)?`);
      }
      if (/401|unauthorized|not logged in/i.test(stderr)) {
        return fertig(false, 'Codex ist nicht angemeldet. Im Terminal "codex login" ausführen.');
      }
      const details = stderr.trim().split(/\r?\n/).slice(-3).join(' | ');
      fertig(false, `Die KI-CLI hat mit Fehlercode ${code} abgebrochen. ${details}`);
    });
  });
}

// Beendet die KI-CLI samt Unterprozessen.
function stoppe(kind) {
  if (!kind || kind.exitCode !== null) return;
  if (process.platform === 'win32') spawn('taskkill', ['/pid', String(kind.pid), '/T', '/F']);
  else kind.kill('SIGTERM');
}

// Schickt das vorbereitete Beispielergebnis aus fallback/, wenn die KI nicht geliefert hat.
function sendeFallback(res, datei, grund) {
  const pfad = path.join(__dirname, 'fallback', datei);
  if (!fs.existsSync(pfad)) {
    return res.status(502).json({ fehler: `${grund} (Für diesen Fall gibt es kein Beispielergebnis in fallback/.)` });
  }
  console.log(`[KI]   -> Beispielergebnis fallback/${datei} wird angezeigt.`);
  const text = fs.readFileSync(pfad, 'utf8');
  res.json({ text, json: datei.endsWith('.json') ? alsJson(text) : null, fallback: true, grund });
}

// ---------------------------------------------------------------------------
// Webserver und Schnittstellen
// ---------------------------------------------------------------------------

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Liste aller Kunden (nur Kopfdaten).
app.get('/api/kunden', (req, res) => {
  res.json(leseOrdner('kunden').map(({ inhalt, ...kopfdaten }) => kopfdaten));
});

// Ein Kunde mit Stammdaten und allen Gesprächsnotizen.
app.get('/api/kunden/:id', (req, res) => {
  const kunde = findeKunde(req.params.id);
  if (!kunde) return res.status(404).json({ fehler: `Kunde "${req.params.id}" nicht gefunden.` });
  res.json({ kunde, gespraeche: gespraecheVon(kunde.id) });
});

// Vertriebs-Assistent: Die Frage geht unverändert an die KI.
app.post('/api/agent/frage', async (req, res) => {
  const frage = String(req.body?.frage ?? '').trim();
  if (!frage) return res.status(400).json({ fehler: 'Bitte eine Frage eingeben.' });
  const ergebnis = await runAgent(frage, 'Frage');
  if (!ergebnis.ok) {
    const mitAnleitung = fs.readdirSync(path.join(__dirname, 'anleitungen')).some((n) => n.endsWith('.md'));
    return sendeFallback(res, mitAnleitung ? 'frage-mit.md' : 'frage-ohne.md', ergebnis.text);
  }
  res.json({ text: ergebnis.text, json: null, fallback: false, sekunden: ergebnis.sekunden });
});

// Nächste Schritte für alle Kunden. Das letzte gute Ergebnis wird in fallback/ gespeichert.
app.post('/api/agent/next-best-action', async (req, res) => {
  if (!fs.existsSync(path.join(__dirname, 'anleitungen', 'next-best-action.md'))) {
    return sendeFallback(res, 'next-best-action.json', 'anleitungen/next-best-action.md fehlt – bitte aus vorlagen/ kopieren.');
  }
  const ergebnis = await runAgent('Befolge anleitungen/next-best-action.md. Antworte nur mit dem JSON.', 'Nächste Schritte');
  const json = ergebnis.ok ? alsJson(ergebnis.text) : null;
  const liste = Array.isArray(json) ? json : Object.values(json ?? {}).find(Array.isArray);
  if (!liste) {
    return sendeFallback(res, 'next-best-action.json', ergebnis.ok ? 'Die Antwort der KI war kein gültiges JSON.' : ergebnis.text);
  }
  fs.writeFileSync(path.join(__dirname, 'fallback', 'next-best-action.json'), `${JSON.stringify(liste, null, 2)}\n`);
  res.json({ text: ergebnis.text, json: liste, fallback: false, sekunden: ergebnis.sekunden });
});

// Unerwartete Fehler: verständliche Meldung statt Absturz.
app.use((fehler, req, res, next) => {
  console.error(`[Server] Unerwarteter Fehler: ${fehler.message}`);
  res.status(500).json({ fehler: `Interner Fehler: ${fehler.message}` });
});

// Nur starten, wenn die Datei direkt mit "node server.js" aufgerufen wird
// (scripts/check.js lädt sie ebenfalls, um runAgent zu testen).
if (require.main === module) {
  app.listen(PORT, (fehler) => {
    if (fehler) {
      console.error(fehler.code === 'EADDRINUSE'
        ? `FEHLER: Port ${PORT} ist schon belegt. Läuft die App bereits in einem anderen Terminal?`
        : `FEHLER: Server konnte nicht starten: ${fehler.message}`);
      process.exit(1);
    }
    console.log(`Kundencockpit läuft: http://localhost:${PORT}`);
    console.log(`KI-Befehl: ${AGENT_CLI}   Beenden: Strg+C`);
  });
}

module.exports = { runAgent, parseFrontmatter, leseOrdner, AGENT_CLI };
