# Kundencockpit – Hinweise für die Moderation

Die Teilnehmenden arbeiten mit der [README.md](README.md). Dort steht pro Schritt nur, **warum** er wichtig ist, plus ein Beispiel-Prompt. Die Details für die Moderation stehen hier.

## Zeitplan (2,5 Stunden)

| Start | Block | Dauer | Bei Zeitnot |
|---|---|---|---|
| 0:00 | Begrüßung und Schritt 0 – Umschauen | 15 min | Nur den Beispiel-Prompt |
| 0:15 | Schritt 1 – App starten und gestalten | 15 min | Nur starten, nicht gestalten |
| 0:30 | Schritt 2 – Ohne und mit Anleitung | 40 min | Bau am Beamer vormachen oder zu `stufe-2-fertig` springen |
| 1:10 | Pause | 10 min | |
| 1:20 | Schritt 3 – Fragen zu einem Kunden | 25 min | Nur den Beispiel-Prompt |
| 1:45 | Schritt 4 – Nächste Schritte | 40 min | Zu `stufe-4-start` springen, nur die Gewichtung ändern |
| 2:25 | Abschluss | 5 min | |
| – | Schritt 5 – Diktat | – | Nur wenn eine Gruppe früher fertig ist |

## Was in den Schritten passieren soll

**Schritt 0:** Codex erklärt Ordner und Dateien. Gut ist, wenn jemand selbst eine Datei in `gespraeche/` öffnet: Es ist nur Text.

**Schritt 1:** Codex sagt, dass `npm run dev` im Terminal nötig ist (so steht es in `AGENTS.md`). Das Terminal muss offen bleiben. Am Anfang zeigt die App nur die Kundenliste und die Rohdaten.

**Schritt 2:**

- Den ersten Bau am Beamer vormachen, dann nachmachen lassen.
- **Erwartetes Ergebnis:** zwei Knöpfe, eine Ladeanzeige mit Sekunden und beide Ergebnisse nebeneinander. Die Version „mit Anleitung“ zeigt feste Abschnitte mit Quellen.
- **Für die Vorführung Lahntal Caravanwerk oder Wiesental Reisemobile nehmen.** Nur für diese beiden gibt es Beispielergebnisse.
- **Worauf man achten kann:** Die Version „ohne“ kennt keine Marktmeldungen, hat keine einheitliche Gliederung und meist keine Quellen.
- **Nach dem Nachhaltigkeits-Prompt** erscheint der neue Abschnitt ohne Programmierung. Die App zeigt die Abschnitte so an, wie die KI sie liefert.
- **Hilfe bei Problemen:** Nach zwei erfolglosen Versuchen zum Zwischenstand springen.

**Schritt 3:** Wer noch Zeit hat, lässt ein Fragefeld bauen. Es gibt dafür kein Beispielergebnis. Ist die KI nicht erreichbar, zeigt die App eine Fehlermeldung.

**Schritt 4:**

- Die Beispieldaten sind so gebaut, dass sich die Reihenfolge sichtbar ändert:
  - **Wettbewerbssignal 25 → 40:** Kessler & Voigt steigt von Platz 3 auf Platz 2.
  - **Notiz zu Odra Panele:** Der C-Kunde steigt von „mittel“ auf „hoch“.
- Jede erfolgreiche Aktualisierung überschreibt `fallback/next-best-action.json`. So bleibt das Beispiel aktuell.

**Schritt 5:** Windows+H braucht ein Mikrofon und die Einstellung „Online-Spracherkennung“.

## Ohne und mit Anleitung: So bleibt der Vergleich fair

Der Vergleich läuft bewusst **nur über die Knöpfe der App** und nicht im Codex-Chat. Im Chat liest Codex immer `AGENTS.md` und kann jederzeit in `anleitungen/` schauen.

- **Modus „ohne“:** Der Server kopiert nur die Kundendatei und die Gesprächsnotizen dieses Kunden in einen leeren Temp-Ordner. Dort startet er Codex mit dem Prompt „Fasse die Informationen zu diesem Kunden zusammen. Nutze nur die Dateien in diesem Ordner.“ In diesem Ordner gibt es weder `AGENTS.md` noch `anleitungen/` noch `markt/`.
- **Modus „mit“:** Codex läuft im Projektordner und bekommt die Anweisung, `anleitungen/kunden-uebersicht.md` zu befolgen.
- **Kontrolle:** Das Terminal von `npm run dev` zeigt bei jedem Aufruf Ordner und Prompt (`[KI] START …`).
- **Wichtig:** Auf den Laptops darf es **keine persönliche Codex-Anleitung** geben, also keine Datei `%USERPROFILE%\.codex\AGENTS.md`. Codex liest diese Datei in jedem Ordner, also auch im Modus „ohne“.
- **Zusätzliche Regel in `AGENTS.md`:** Bittet jemand im Chat um ein Ergebnis „ohne Anleitung“, öffnet Codex keine Datei in `anleitungen/`. Das ist eine Anweisung, keine technische Sperre.

## Vorbereitung (am Vortag, je Laptop)

1. Node.js LTS, Git, VS Code und die Codex-Erweiterung installieren.
2. Codex CLI installieren und anmelden:

   ```text
   npm install -g @openai/codex
   codex login
   ```

3. Repository in VS Code öffnen und im Terminal `npm install` ausführen.
4. `npm run check` ausführen. Alle Zeilen sollen mit **OK** beginnen. Jede **FEHLER**-Zeile nennt einen Tipp.
5. Prüfen, dass es `%USERPROFILE%\.codex\AGENTS.md` nicht gibt (siehe oben).
6. Die Musterlösung einmal durchklicken:

   ```text
   git switch --detach stufe-4-fertig
   npm run dev
   ```

   Dann http://localhost:3000 öffnen:
   - bei Lahntal Caravanwerk beide Zusammenfassungen testen,
   - im Reiter „Nächste Schritte“ auf „Aktualisieren“ klicken.

   Danach mit **Strg+C** beenden und zurücksetzen:

   ```text
   git switch -f main
   ```

7. Windows+H einmal ausprobieren.

## Zwischenstände (Git-Tags)

| Tag | Stand |
|---|---|
| `stufe-0-start` | Ausgangszustand (entspricht `main`): nur Kundenliste und Rohdaten |
| `stufe-2-fertig` | Nach Schritt 2: Design, Kundenansicht mit Steckbrief, Knöpfe für beide Zusammenfassungen, Abschnitt „Nachhaltigkeit“ |
| `stufe-4-start` | Zusätzlich Fragefeld und Reiter „Nächste Schritte“. Gewichtung und Notizen sind noch unverändert. |
| `stufe-4-fertig` | Zusätzlich Gewichtung „Wettbewerbssignal 40“ und neue Notiz zu Odra Panele |

Hängt eine Gruppe fest, die App mit **Strg+C** beenden und im Terminal eingeben:

```text
git stash push --include-untracked -m "eigener Stand"
git switch --detach stufe-2-fertig
```

Zurück zum eigenen Stand:

```text
git switch main
git stash pop
```

Nach dem Workshop alles zurücksetzen. **Achtung: Das löscht alle Änderungen der Teilnehmenden.**

```text
git switch -f main
git clean -fd
```

## Gesperrte Dateien

- **Welche Dateien:** `server.js`, `scripts/check.js`, `package.json` und `package-lock.json`. Laut `AGENTS.md` ändert Codex sie nicht, auch nicht auf ausdrückliche Bitte. Das ist eine Anweisung an Codex, kein technischer Schutz.
- **Wenn doch etwas geändert wurde:** die App beenden und im Terminal eingeben:

  ```text
  git checkout -- server.js scripts/check.js package.json package-lock.json
  ```

- **Fehlt Codex eine Information über den Server:** Die Schnittstellen stehen in `AGENTS.md` im Abschnitt „Schnittstellen des Servers“. Dort ergänzen, nicht in `server.js`.

## Wenn Codex hängt

- **In der App:**
  - Nach spätestens 180 Sekunden bricht der Server ab.
  - Danach zeigt die App ein Beispielergebnis aus `fallback/` mit gelbem Hinweis. Das gibt es für die Zusammenfassungen von Lahntal Caravanwerk und Wiesental Reisemobile sowie für „Nächste Schritte“.
- **Im Codex-Chat:** Antwort stoppen, neuen Chat beginnen und den Prompt erneut senden. Hilft das nicht, am Moderationsbildschirm weitermachen oder zum passenden Tag springen.
- **Im Terminal des Servers:** Jeder KI-Aufruf wird protokolliert (`[KI] START`, `[KI] OK` oder `[KI] FEHLER`), mit Ordner, Prompt und Dauer.

## Technische Einstellungen

Einstellungen werden vor dem Start im Terminal gesetzt (PowerShell):

```text
$env:PORT="3001"; npm run dev
$env:STICHTAG="2026-09-16"; npm run dev
$env:AGENT_CLI="claude -p"; npm run dev
```

| Variable | Standard | Wirkung |
|---|---|---|
| `PORT` | `3000` | Port der App |
| `STICHTAG` | heutiges Datum | Datum, gegen das „überfällig“ berechnet wird. Die Beispieldaten sind auf Mitte September 2026 ausgelegt, die Beispielergebnisse auf den 16.09.2026. |
| `AGENT_CLI` | `codex` | Welche KI-CLI der Server startet. Enthält der Wert „codex“, hängt der Server die Codex-Optionen unten an. Jeder andere Wert (z. B. `claude -p`) bekommt den Prompt über die Standardeingabe und liefert die Antwort über die Standardausgabe. Pfade mit Leerzeichen funktionieren hier nicht. |

Der Server ruft Codex so auf (geprüft mit codex-cli 0.154.0):

```text
codex exec --sandbox read-only --skip-git-repo-check --ephemeral --color never --output-last-message <temporäre Datei> -
```

- `--sandbox read-only`: Codex darf nur lesen.
- `--skip-git-repo-check`: Codex läuft auch im Temp-Ordner des Modus „ohne“.
- `--ephemeral`: Codex speichert keine Sitzungsdateien.
- `--output-last-message`: Codex schreibt seine Antwort in eine Datei, die der Server ausliest.
- `-`: Der Prompt kommt über die Standardeingabe. So gibt es unter Windows keine Probleme mit Anführungszeichen.

Für schnellere Antworten: `$env:AGENT_CLI="codex -c model_reasoning_effort=low"`.

## Dateien, die die Teilnehmenden nicht brauchen

| Datei / Ordner | Inhalt |
|---|---|
| `public/index.html` | Oberfläche der App. Hier baut Codex die Knöpfe ein. |
| `server.js` | Webserver: liefert die Daten und startet Codex im Hintergrund (gesperrt) |
| `fallback/` | Beispielergebnisse, falls die KI nicht antwortet |
| `scripts/check.js` | Vorab-Prüfung (`npm run check`) |

## Häufige Probleme

| Problem | Lösung |
|---|---|
| `npm` wird in PowerShell blockiert („Ausführung von Skripts ist deaktiviert“) | `npm.cmd run dev` verwenden oder im Terminal-Menü auf „Command Prompt“ wechseln |
| „Port 3000 ist schon belegt“ | Läuft die App schon in einem anderen Terminal? Dort Strg+C drücken. Oder `$env:PORT="3001"` setzen. |
| „Codex ist nicht angemeldet“ | `codex login` im Terminal |
| „Der Befehl codex wurde nicht gefunden“ | `npm install -g @openai/codex`, danach VS Code neu starten |
| `npm install` scheitert im Firmennetz | Proxy für npm einrichten lassen oder `node_modules` von einem funktionierenden Laptop kopieren |
| Neue Gesprächsnotiz erscheint nicht | `npm run check` zeigt, ob der Kopfbereich (`datum`, `kunde`) stimmt |

## Abhängigkeiten

| Was | Wofür | Wer stellt es bereit | Kosten | Wenn es fehlt oder ausfällt |
|---|---|---|---|---|
| **Node.js** (LTS, ab Version 20) | Führt die App aus | IT oder Moderation | kostenlos | App startet nicht; am Moderationsbildschirm weitermachen |
| **Express** (Version 5) | Baustein für den Webserver, einzige Programmbibliothek | `npm install` aus dem npm-Verzeichnis im Internet | kostenlos | App startet nicht; `node_modules` von einem anderen Laptop kopieren |
| **Codex CLI** und **Codex-Erweiterung für VS Code** | Der KI-Agent im Chat und hinter den App-Knöpfen | Installation durch IT oder Moderation, Anmeldung mit ChatGPT-Abo | im ChatGPT-Abo enthalten (mit Nutzungsgrenzen) | App zeigt Beispielergebnisse aus `fallback/`; Chat-Übungen am Moderationsbildschirm |
| **Internetzugang** | Codex arbeitet mit den Servern von OpenAI | Firmennetz; OpenAI-Dienste müssen erreichbar sein | – | wie oben: Beispielergebnisse und Git-Tags |
| **Windows-Diktat** (Windows+H) | Schritt 5 | In Windows enthalten; nutzt die Online-Spracherkennung von Microsoft | kostenlos | Schritt 5 mit getipptem Text oder nur mit `eingang/diktat-wiesental.txt` |
| **Git** | Zwischenstände (Tags) und Zurücksetzen | IT oder Moderation | kostenlos | Keine Zwischenstände; Ordner vorab als ZIP-Kopien je Stufe bereithalten |
| **VS Code** | Arbeitsoberfläche | IT oder Moderation | kostenlos | Codex nur im Terminal nutzbar |
