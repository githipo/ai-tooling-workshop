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
const os = require('os');
const path = require('path');

const PORT = process.env.PORT || 3000;
const STICHTAG = process.env.STICHTAG || new Date().toISOString().slice(0, 10); // Datum, auf das sich "überfällig" bezieht
const ZEITLIMIT_SEKUNDEN = 180;
const IST_WINDOWS = process.platform === 'win32';

// Welche KI-CLI benutzt wird. Standard: "codex".
// Beispiel für Claude Code:  AGENT_CLI="claude -p"  (Prompt kommt per stdin, Antwort über stdout)
const AGENT_CLI = process.env.AGENT_CLI || 'codex';

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

// Startet die KI-CLI ohne Bildschirm ("headless") und wartet auf die Antwort.
// Gibt immer ein Ergebnis zurück, wirft nie: { ok, text, sekunden }.
//
// Codex wird so aufgerufen (geprüft mit codex-cli 0.154.0, "codex exec --help"):
//   codex exec --sandbox read-only --skip-git-repo-check --ephemeral --color never
//              --output-last-message <datei> -
//   read-only            = die KI darf nur lesen, nichts ändern
//   --skip-git-repo-check = läuft auch in Ordnern ohne git (Modus "ohne")
//   --ephemeral          = keine Sitzungsdateien speichern
//   -                    = der Prompt kommt über stdin (vermeidet Probleme mit Anführungszeichen unter Windows)
function runAgent({ prompt, cwd, outputFile, titel = 'KI-Aufruf' }) {
  outputFile ??= path.join(os.tmpdir(), `ki-antwort-${Date.now()}-${Math.random().toString(36).slice(2)}.txt`);
  const [befehl, ...extra] = AGENT_CLI.split(' ').filter(Boolean);
  const args = AGENT_CLI.includes('codex')
    ? [...extra, 'exec', '--sandbox', 'read-only', '--skip-git-repo-check', '--ephemeral',
      '--color', 'never', '--output-last-message', outputFile, '-']
    : extra;

  console.log(`\n[KI] START  ${titel}`);
  console.log(`[KI]   Ordner: ${cwd}`);
  console.log(`[KI]   Prompt: ${prompt}`);
  const start = Date.now();

  return new Promise((resolve) => {
    let erledigt = false;
    let stdout = '';
    let stderr = '';
    let kind;

    const fertig = (ok, text) => {
      if (erledigt) return;
      erledigt = true;
      clearTimeout(timer);
      fs.rmSync(outputFile, { force: true });
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

    try {
      // Unter Windows ist "codex" eine .cmd-Datei, die nur über die Shell startet.
      // Dann bauen wir eine Befehlszeile; Argumente mit Leerzeichen (z. B. Pfade) kommen in Anführungszeichen.
      kind = IST_WINDOWS
        ? spawn([befehl, ...args].map((a) => (/\s/.test(a) ? `"${a}"` : a)).join(' '), { cwd, shell: true })
        : spawn(befehl, args, { cwd });
    } catch (fehler) {
      return fertig(false, `Die KI-CLI konnte nicht gestartet werden: ${fehler.message}`);
    }

    kind.stdout.on('data', (d) => { stdout += d; });
    kind.stderr.on('data', (d) => { stderr += d; });
    kind.on('error', (fehler) => fertig(false, fehler.code === 'ENOENT'
      ? `Der Befehl "${befehl}" wurde nicht gefunden. Ist die Codex CLI installiert (npm run check)?`
      : `Die KI-CLI konnte nicht gestartet werden: ${fehler.message}`));
    kind.on('close', (code) => {
      if (code === 9009 || code === 127) {
        return fertig(false, `Der Befehl "${befehl}" wurde nicht gefunden. Ist die Codex CLI installiert (npm run check)?`);
      }
      if (code !== 0 && /401|unauthorized|not logged in/i.test(stderr)) {
        return fertig(false, 'Codex ist nicht angemeldet. Im Terminal "codex login" ausführen.');
      }
      if (code !== 0) {
        const details = stderr.trim().split(/\r?\n/).slice(-3).join(' | ');
        return fertig(false, `Die KI-CLI hat mit Fehlercode ${code} abgebrochen. ${details}`);
      }
      let antwort = '';
      try { antwort = fs.readFileSync(outputFile, 'utf8').trim(); } catch { /* Datei fehlt: stdout nehmen */ }
      antwort ||= stdout.trim();
      if (antwort) fertig(true, antwort);
      else fertig(false, 'Die KI hat eine leere Antwort geliefert.');
    });

    kind.stdin.on('error', () => {}); // passiert, wenn die CLI sofort wieder endet
    kind.stdin.end(prompt);
  });
}

// Beendet die KI-CLI samt Unterprozessen.
function stoppe(kind) {
  if (!kind || kind.exitCode !== null) return;
  if (IST_WINDOWS) spawn('taskkill', ['/pid', String(kind.pid), '/T', '/F']);
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

// Kundenübersicht durch die KI – "ohne" oder "mit" Anleitung.
app.post('/api/agent/uebersicht', async (req, res) => {
  const { kundeId, modus } = req.body ?? {};
  const kunde = findeKunde(kundeId);
  if (!kunde) return res.status(404).json({ fehler: `Kunde "${kundeId}" nicht gefunden.` });

  if (modus === 'ohne') {
    // Nur die Rohdaten dieses Kunden in einen leeren Ordner kopieren – keine AGENTS.md, keine Anleitungen.
    const ordner = fs.mkdtempSync(path.join(os.tmpdir(), 'workshop-ohne-'));
    for (const d of [kunde, ...gespraecheVon(kunde.id)]) {
      fs.copyFileSync(path.join(__dirname, d.datei), path.join(ordner, path.basename(d.datei)));
    }
    const ergebnis = await runAgent({
      prompt: 'Fasse die Informationen zu diesem Kunden zusammen.',
      cwd: ordner,
      titel: `Übersicht OHNE Anleitung – ${kunde.name}`,
    });
    fs.rmSync(ordner, { recursive: true, force: true });
    if (!ergebnis.ok) return sendeFallback(res, `uebersicht-ohne-${kunde.id}.md`, ergebnis.text);
    return res.json({ text: ergebnis.text, json: null, fallback: false, sekunden: ergebnis.sekunden });
  }

  if (modus === 'mit') {
    const ergebnis = await runAgent({
      prompt: `Befolge die Anleitung in anleitungen/kunden-uebersicht.md für den Kunden mit der id "${kunde.id}" (${kunde.name}). `
        + `Stichtag ist der ${STICHTAG}. Antworte nur mit dem JSON.`,
      cwd: __dirname,
      titel: `Übersicht MIT Anleitung – ${kunde.name}`,
    });
    if (!ergebnis.ok) return sendeFallback(res, `uebersicht-mit-${kunde.id}.json`, ergebnis.text);
    return res.json({ text: ergebnis.text, json: alsJson(ergebnis.text), fallback: false, sekunden: ergebnis.sekunden });
  }

  res.status(400).json({ fehler: 'modus muss "ohne" oder "mit" sein.' });
});

// Freie Frage zu einem Kunden (für Schritt 3 – ein Fragefeld in der App).
app.post('/api/agent/frage', async (req, res) => {
  const { kundeId, frage } = req.body ?? {};
  const kunde = findeKunde(kundeId);
  if (!kunde || !frage) return res.status(400).json({ fehler: 'Bitte kundeId und frage mitschicken.' });
  const ergebnis = await runAgent({
    prompt: `Befolge die Anleitung in anleitungen/kundenabfrage.md. Kunde: ${kunde.name} (id "${kunde.id}"). `
      + `Stichtag ist der ${STICHTAG}. Frage: ${frage}`,
    cwd: __dirname,
    titel: `Kundenabfrage – ${kunde.name}`,
  });
  if (!ergebnis.ok) return res.status(502).json({ fehler: ergebnis.text });
  res.json({ text: ergebnis.text, json: null, fallback: false, sekunden: ergebnis.sekunden });
});

// Nächste Schritte für alle Kunden. Das letzte gute Ergebnis wird in fallback/ gespeichert.
app.post('/api/agent/next-best-action', async (req, res) => {
  const ergebnis = await runAgent({
    prompt: `Befolge die Anleitung in anleitungen/next-best-action.md. Stichtag ist der ${STICHTAG}. Antworte nur mit dem JSON.`,
    cwd: __dirname,
    titel: 'Nächste Schritte',
  });
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
    console.log(`KI-CLI: ${AGENT_CLI}   Stichtag: ${STICHTAG}   Beenden: Strg+C`);
  });
}

module.exports = { runAgent, parseFrontmatter, leseOrdner, AGENT_CLI };
