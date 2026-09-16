// Vorab-Prüfung für den Workshop:  npm run check
// Prüft, ob alles bereit ist, und schreibt für jeden Punkt OK oder FEHLER.

const { spawnSync } = require('child_process');
const fs = require('fs');
const net = require('net');
const path = require('path');

const WURZEL = path.join(__dirname, '..');
const PORT = Number(process.env.PORT || 3000);
let fehlerAnzahl = 0;

function ok(text) { console.log(`OK      ${text}`); }
function fehler(text, tipp) {
  fehlerAnzahl += 1;
  console.log(`FEHLER  ${text}`);
  if (tipp) console.log(`        Tipp: ${tipp}`);
}

async function main() {
  console.log('Vorab-Prüfung Kundencockpit\n');

  // 1. Node.js
  const hauptversion = Number(process.versions.node.split('.')[0]);
  if (hauptversion >= 20) ok(`Node.js ${process.version}`);
  else fehler(`Node.js ${process.version} ist zu alt (mindestens 20).`, 'Aktuelle LTS-Version von https://nodejs.org installieren.');

  // 2. Express
  let expressDa = false;
  try {
    require.resolve('express', { paths: [WURZEL] });
    ok('Express ist installiert');
    expressDa = true;
  } catch {
    fehler('Express ist nicht installiert.', 'Im Projektordner "npm install" ausführen.');
  }

  // 3. Datenordner
  for (const ordner of ['kunden', 'gespraeche', 'markt', 'vorlagen', 'eingang', 'fallback']) {
    let dateien = [];
    try { dateien = fs.readdirSync(path.join(WURZEL, ordner)).filter((d) => !d.startsWith('.')); } catch { /* fehlt */ }
    if (dateien.length) ok(`Ordner ${ordner}/ (${dateien.length} Dateien)`);
    else fehler(`Ordner ${ordner}/ fehlt oder ist leer.`);
  }

  // 4. Daten lesbar? (Kunden haben id und name, jede Gesprächsnotiz gehört zu einem Kunden)
  if (expressDa) {
    const { leseOrdner } = require('../server');
    const kunden = leseOrdner('kunden');
    const ids = new Set(kunden.map((k) => k.id));
    const ohneId = kunden.filter((k) => !k.id || !k.name).map((k) => k.datei);
    const verwaist = leseOrdner('gespraeche').filter((g) => !ids.has(g.kunde) || !g.datum).map((g) => g.datei);
    if (ohneId.length) fehler(`Kundendatei ohne id oder name: ${ohneId.join(', ')}`);
    else if (verwaist.length) fehler(`Gesprächsnotiz ohne gültigen Kunden oder ohne Datum: ${verwaist.join(', ')}`, 'Kopfbereich prüfen (datum, kunde).');
    else ok(`Daten lesbar (${kunden.length} Kunden, alle Gesprächsnotizen zugeordnet)`);
  }

  // 5. Port frei?
  const portFrei = await new Promise((fertig) => {
    const server = net.createServer()
      .once('error', () => fertig(false))
      .once('listening', () => server.close(() => fertig(true)))
      .listen(PORT);
  });
  if (portFrei) ok(`Port ${PORT} ist frei`);
  else fehler(`Port ${PORT} ist belegt.`, 'Läuft die App schon in einem anderen Terminal? Dort mit Strg+C beenden.');

  // 6. Codex CLI vorhanden?
  if (!expressDa) {
    fehler('KI-Test übersprungen, weil Express fehlt.');
    return;
  }
  const { runAgent, AGENT_CLI } = require('../server');
  const befehl = AGENT_CLI.split(' ')[0];
  const version = spawnSync(`${befehl} --version`, { shell: true, encoding: 'utf8' });
  if (version.status === 0) {
    ok(`KI-CLI gefunden: ${(version.stdout || '').trim() || befehl}`);
  } else {
    fehler(`KI-CLI "${befehl}" wurde nicht gefunden.`, 'Installieren mit "npm install -g @openai/codex", danach "codex login".');
    return;
  }

  // 7. Kurzer Testaufruf
  console.log('        Teste einen kurzen KI-Aufruf (kann bis zu einer Minute dauern) …');
  const ergebnis = await runAgent('Antworte nur mit dem Wort OK.', 'Vorab-Test');
  if (ergebnis.ok) ok(`KI-Testaufruf erfolgreich nach ${ergebnis.sekunden} s (Antwort: ${ergebnis.text.slice(0, 40)})`);
  else fehler(`KI-Testaufruf fehlgeschlagen: ${ergebnis.text}`, 'Angemeldet? "codex login" ausführen. Internetverbindung prüfen.');
}

main()
  .catch((e) => fehler(`Unerwarteter Fehler: ${e.message}`))
  .finally(() => {
    console.log(fehlerAnzahl
      ? `\nErgebnis: ${fehlerAnzahl} Problem(e) gefunden – siehe FEHLER oben. Ohne KI zeigen die KI-Knöpfe Beispielergebnisse aus fallback/.`
      : '\nErgebnis: Alles bereit.');
    process.exitCode = fehlerAnzahl ? 1 : 0;
  });
