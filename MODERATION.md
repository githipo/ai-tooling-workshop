# Kundencockpit – Hinweise für die Moderation

Die Teilnehmenden arbeiten mit der [README.md](README.md). Dort steht pro Schritt nur, **warum** er wichtig ist, plus ein Beispiel-Prompt. Die Details für die Moderation stehen hier.

## Zeitplan (2,5 Stunden)

| Start | Block | Dauer | Bei Zeitnot |
|---|---|---|---|
| 0:00 | Begrüßung und Schritt 0 – Umschauen | 10 min | Nur den Beispiel-Prompt |
| 0:10 | Schritt 1 – App starten und Assistenten bauen | 20 min | Design überspringen; Bau am Beamer vormachen oder zu `stufe-1-fertig` springen |
| 0:30 | Schritt 2 – Ohne und mit Anleitung | 35 min | Anleitung nicht ändern, nur vergleichen |
| 1:05 | Pause | 10 min | |
| 1:15 | Schritt 3 – Eigene Fragen | 20 min | Nur den Beispiel-Prompt |
| 1:35 | Schritt 4 – Nächste Schritte | 35 min | Zu `stufe-4-start` springen, nur die Gewichtung ändern |
| 2:10 | Schritt 5 – Freies Experimentieren | 15 min | Eine Idee gemeinsam am Beamer |
| 2:25 | Abschluss | 5 min | |

## Was in den Schritten passieren soll

**Schritt 0:** Codex erklärt Ordner und Dateien. Gut ist, wenn jemand selbst eine Datei in `gespraeche/` öffnet: Es ist nur Text.

**Schritt 1:**

- Codex sagt, dass `npm run dev` im Terminal nötig ist (so steht es in `AGENTS.md`). Das Terminal muss offen bleiben. Am Anfang zeigt die App nur die Kundenliste und die Rohdaten.
- Den Bau des Assistenten am Beamer vormachen, dann nachmachen lassen.
- **Erwartetes Ergebnis:** Eingabefeld, Knopf „Fragen“, Ladeanzeige mit Sekunden. Die Antworten stehen als Verlauf untereinander.
- **Den Unterschied betonen:** Codex baut die App, der Assistent beantwortet Fragen und darf nur lesen.
- **Hilfe bei Problemen:** Nach zwei erfolglosen Versuchen zu `stufe-1-fertig` springen.

**Schritt 2:**

- **Ablauf:** Erst fragen, dann `vorlagen/kunden-uebersicht.md` nach `anleitungen/` kopieren und dieselbe Frage noch einmal stellen.
- **Vorführfrage:** „Fasse Lahntal Caravanwerk zusammen.“ Für diese Frage gibt es Beispielantworten, ohne und mit Anleitung.
- **Achtung:** Wer eine Vorlage zu früh einfügt, hat keinen Vergleich mehr. Dann die Datei aus `anleitungen/` wieder löschen.
- **Ohne Anleitung:** keine feste Gliederung, meist keine Quellen, Marktmeldungen nur zufällig.
- **Mit Anleitung:** vier feste Abschnitte mit Quellen, der erste ist ein Steckbrief. Der letzte Besuch liegt 182 Tage zurück, das Besuchsziel ist um 122 Tage überschritten.
- **Die Vorlagen sind bewusst knapp.** Wettbewerb, Chancen oder Beziehung fehlen – das ergänzen die Teilnehmenden selbst.
- **Nach dem Nachhaltigkeits-Prompt** hat die Antwort fünf Abschnitte, ohne dass jemand programmiert hat.

**Schritt 3:**

- Zuerst `vorlagen/kundenabfrage.md` nach `anleitungen/` kopieren.
- Die Antworten folgen dann dem Aufbau Kurzantwort, Details, Offen / unklar – die Details jeweils mit Quellen.
- **Die KI wählt die Anleitung selbst.** Der Server sagt ihr nur: „Gibt es unter anleitungen/ eine passende Anleitung, befolge sie.“ Bei einer Zusammenfassung nimmt sie `kunden-uebersicht.md`, bei einer Frage `kundenabfrage.md`.

**Schritt 4:**

- Zuerst `vorlagen/next-best-action.md` nach `anleitungen/` kopieren. Ohne diese Datei zeigt „Aktualisieren“ nur das Beispielergebnis.
- Die Beispieldaten sind so gebaut, dass sich die Reihenfolge sichtbar ändert:
  - **Wettbewerbssignal 25 → 40:** Kessler & Voigt steigt von Platz 3 auf Platz 2.
  - **Notiz zu Odra Panele:** Der C-Kunde steigt von „mittel“ (40 Punkte) auf „hoch“ (50 Punkte, mit Wettbewerbssignal 40 sogar 65).
  - **Bewusst nicht in der Punkteliste:** Marktmeldungen, Potenzialkunden ohne Umsatz, Angebots- und Reaktionszeiten je Klasse (`reaktion_in_tagen`, `angebot_in_tagen` in `kunden/`). Gute Ideen für eigene Kriterien.
- Jede erfolgreiche Aktualisierung überschreibt `fallback/next-best-action.json`. So bleibt das Beispiel aktuell.

**Schritt 5:**

- Ziel: Die Teilnehmenden legen selbst eine Wissensdatei oder Anleitung an und sehen, wie der Assistent sie nutzt.
- Bewährt: `wissen/preise.md` anlegen und in `AGENTS.md` eintragen lassen, dann „Was wäre unser Angebot für Odra Panele?“ fragen. Im Test hat die KI die Datei auch ohne Eintrag gefunden; mit Eintrag ist es verlässlicher.
- Windows+H braucht ein Mikrofon und die Einstellung „Online-Spracherkennung“.
- Beim Zurücksetzen nach dem Workshop entfernt `git clean -fd` auch die neuen Ordner.

## Ohne und mit Anleitung

- **So arbeitet der Assistent:** Der Server startet bei jeder Frage den KI-Befehl im Projektordner, genau wie im Terminal. Die Frage geht unverändert hinein. Die KI liest dabei `AGENTS.md` und alle Dateien, die sie braucht.
- **Warum der Vergleich funktioniert:** In `AGENTS.md` steht: Liegt in `anleitungen/` eine passende Anleitung, befolge sie. Sonst antworte ohne und nutze nichts aus `vorlagen/`. Am Anfang ist `anleitungen/` leer; der Ordner enthält nur `.gitkeep`, damit Git ihn speichert.
- **Nur eine Anweisung:** Das ist keine technische Sperre. Liest die KI trotzdem eine Vorlage, fällt das im Vergleich auf und ist ein guter Gesprächsanlass.
- **Kontrolle:** Das Terminal von `npm run dev` zeigt bei jedem Aufruf die Frage und die Dauer (`[KI] START …`, `[KI] OK …`).
- **Wichtig:** Auf den Laptops darf es **keine persönliche Codex-Anleitung** geben, also keine Datei `%USERPROFILE%\.codex\AGENTS.md`. Sie könnte dem Projekt-`AGENTS.md` widersprechen.

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
   - im Assistenten „Fasse Lahntal Caravanwerk zusammen.“ fragen (dort liegen alle Anleitungen schon in `anleitungen/`),
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
| `stufe-1-fertig` | Nach Schritt 1: Design und Vertriebs-Assistent; `anleitungen/` noch leer |
| `stufe-4-start` | Zusätzlich alle drei Anleitungen in `anleitungen/` (Kundenübersicht mit „Nachhaltigkeit“) und Reiter „Nächste Schritte“. Gewichtung und Notizen sind noch unverändert. |
| `stufe-4-fertig` | Zusätzlich Gewichtung „Wettbewerbssignal 40“ und neue Notiz zu Odra Panele |

Hängt eine Gruppe fest, die App mit **Strg+C** beenden und im Terminal eingeben:

```text
git stash push --include-untracked -m "eigener Stand"
git switch --detach stufe-1-fertig
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

Das entfernt auch die eingefügten Anleitungen, danach ist `anleitungen/` wieder leer.

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
  - Danach zeigt die App ein Beispielergebnis aus `fallback/` mit gelbem Hinweis.
  - **Im Assistenten** ist das immer die Antwort auf „Fasse Lahntal Caravanwerk zusammen.“, egal welche Frage gestellt wurde. Die Beispielantwort sagt das in der ersten Zeile. Ist `anleitungen/` leer, kommt die Version ohne Anleitung, sonst die mit Anleitung.
  - **Bei „Nächste Schritte“** ist es die zuletzt erfolgreiche Liste.
- **Im Codex-Chat:** Antwort stoppen, neuen Chat beginnen und den Prompt erneut senden. Hilft das nicht, am Moderationsbildschirm weitermachen oder zum passenden Tag springen.
- **Im Terminal des Servers:** Jeder KI-Aufruf wird protokolliert (`[KI] START`, `[KI] OK` oder `[KI] FEHLER`), mit Ordner, Prompt und Dauer.

## Technische Einstellungen

Einstellungen werden vor dem Start im Terminal gesetzt (PowerShell):

```text
$env:PORT="3001"; npm run dev
$env:AGENT_CLI="claude -p"; npm run dev
```

| Variable | Standard | Wirkung |
|---|---|---|
| `PORT` | `3000` | Port der App |
| `AGENT_CLI` | `codex exec --sandbox read-only --skip-git-repo-check -` | Der KI-Befehl, genau so wie man ihn im Terminal eintippt. Der Server startet ihn im Projektordner, schickt die Frage über die Eingabe und liest die Antwort aus der Ausgabe. |

Die Codex-Optionen:

- `--sandbox read-only`: Codex darf nur lesen.
- `--skip-git-repo-check`: Codex läuft auch, wenn der Ordner kein Git-Repository ist (z. B. aus einer ZIP-Datei).
- `-`: Die Frage kommt über die Eingabe. So gibt es unter Windows keine Probleme mit Anführungszeichen.

**Vor dem Workshop einmal mit Codex prüfen:** `npm run check` muss als Antwort nur „OK“ zeigen. Codex schreibt die fertige Antwort in die Ausgabe und Fortschrittsmeldungen separat. Ohne Codex-Login ließ sich das bisher nicht testen.

Stichtag für „überfällig“ ist der 16.09.2026. Er steht in `AGENTS.md`.

Für schnellere Antworten (die KI denkt weniger lange nach):

```text
$env:AGENT_CLI="codex exec --sandbox read-only --skip-git-repo-check -c model_reasoning_effort=low -"
$env:AGENT_CLI="claude -p --setting-sources project,local --effort low"
```

`--setting-sources project,local` lässt bei Claude die persönlichen Plugins und Hooks weg.

## Dateien, die die Teilnehmenden nicht brauchen

| Datei / Ordner | Inhalt |
|---|---|
| `public/index.html` | Oberfläche der App. Hier baut Codex den Assistenten und den Reiter ein. |
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
| **Codex CLI** und **Codex-Erweiterung für VS Code** | Der KI-Agent im Chat und hinter dem Assistenten und den Empfehlungen | Installation durch IT oder Moderation, Anmeldung mit ChatGPT-Abo | im ChatGPT-Abo enthalten (mit Nutzungsgrenzen) | App zeigt Beispielergebnisse aus `fallback/`; Chat-Übungen am Moderationsbildschirm |
| **Internetzugang** | Codex arbeitet mit den Servern von OpenAI | Firmennetz; OpenAI-Dienste müssen erreichbar sein | – | wie oben: Beispielergebnisse und Git-Tags |
| **Windows-Diktat** (Windows+H) | Schritt 5 | In Windows enthalten; nutzt die Online-Spracherkennung von Microsoft | kostenlos | Schritt 5 mit getipptem Text oder nur mit `eingang/diktat-wiesental.txt` |
| **Git** | Zwischenstände (Tags) und Zurücksetzen | IT oder Moderation | kostenlos | Keine Zwischenstände; Ordner vorab als ZIP-Kopien je Stufe bereithalten |
| **VS Code** | Arbeitsoberfläche | IT oder Moderation | kostenlos | Codex nur im Terminal nutzbar |
