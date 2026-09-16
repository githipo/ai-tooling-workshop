# KI-Workshop: Kundencockpit

In diesem Workshop steuern Sie einen KI-Agenten (**Codex**) nur mit Sprache – ohne selbst zu programmieren. Sie arbeiten an einer kleinen App, die Kundendaten, Gesprächsnotizen und Marktmeldungen zusammenführt.

**Die Kernbotschaft:** Gute Ergebnisse kommen nicht vom „besten Modell“, sondern von **Struktur** – klaren Ordnern und schriftlichen Anleitungen, denen die KI folgt.

> Alle Firmen, Personen und Zahlen in diesem Repository sind **frei erfunden**. Verwenden Sie hier keine echten Kundendaten.

**Inhalt**

- [Was liegt wo?](#was-liegt-wo)
- [Schritt 0 – Orientierung](#schritt-0--orientierung-15-min)
- [Schritt 1 – App starten](#schritt-1--app-starten-15-min)
- [Schritt 2 – Ohne vs. mit Kontext](#schritt-2--ohne-vs-mit-kontext-40-min)
- [Schritt 3 – Kundenabfrage](#schritt-3--kundenabfrage-25-min)
- [Schritt 4 – Nächste Schritte](#schritt-4--nächste-schritte-40-min)
- [Schritt 5 (optional) – Diktat](#schritt-5-optional--diktat)
- [Abschluss](#abschluss)
- [Für die Moderation](#für-die-moderation)
- [Abhängigkeiten](#abhängigkeiten)

---

## Was liegt wo?

| Ordner / Datei | Inhalt |
|---|---|
| `kunden/` | Eine Datei pro Kunde: Kundenklasse, Betreuungsziel, Ansprechpartner, Anwendungen |
| `gespraeche/` | Gesprächsnotizen, eine Datei pro Kontakt (`Datum_Kunde_Thema.md`) |
| `markt/` | Markt- und Wettbewerbsmeldungen (erfunden) |
| `anleitungen/` | **Die Anleitungen für die KI** – hier steckt das Wissen, *wie* gearbeitet wird |
| `eingang/` | Unsortierte Rohtexte, z. B. ein Diktat |
| `fallback/` | Vorbereitete Beispielergebnisse, falls die KI nicht antwortet |
| `public/index.html` | Die Oberfläche der App |
| `server.js` | Der Webserver, der die Daten liefert und die KI startet |
| `AGENTS.md` | Allgemeine Hinweise für Codex zu diesem Repository |
| `scripts/check.js` | Vorab-Prüfung (`npm run check`) |

**So funktioniert die App:** Am Anfang zeigt die App nur die Kundenliste und die Rohdaten. Der Server kann aber schon mehr: Auf Anfrage startet er Codex im Hintergrund (Codex darf dabei nur lesen), Codex liest die Dateien, folgt der passenden Anleitung und schickt die Antwort zurück. **Die Knöpfe dafür bauen Sie im Workshop selbst – per Prompt.** Welche Schnittstellen der Server anbietet, steht in `AGENTS.md`. Diese Datei liest Codex automatisch, deshalb reichen kurze Prompts.

**Codex öffnen:** In VS Code links in der Seitenleiste auf das Codex-Symbol klicken. Für jeden Schritt am besten einen **neuen Chat** beginnen, damit Codex nicht aus dem vorherigen Schritt „weiß“, was Sie wollen.

---

## Schritt 0 – Orientierung (15 min)

**Ziel:** Verstehen, was Codex ist, und Vertrauen in das Repository gewinnen.

Codex ist ein **Agent**: Er liest und schreibt Dateien und führt Befehle aus – gesteuert durch Ihre Prompts. Er erklärt, was er tut, und Sie sehen jede Änderung.

Stellen Sie Codex für diesen Schritt auf den Modus, in dem er **nur lesen** darf (je nach Version „Chat“ oder „Read Only“).

**Start-Prompts** (nacheinander in den Codex-Chat kopieren):

```text
Erkläre mir dieses Repository in einfachen Worten. Wofür ist es da, und was steckt in den einzelnen Ordnern?
```

```text
Was kann der Server schon, was die App noch nicht anzeigt? Erkläre es Schritt für Schritt, ohne Fachbegriffe.
```

```text
Was steht in AGENTS.md, und warum liest du diese Datei?
```

```text
Zeig mir, wo die Kundendaten liegen und wie eine Gesprächsnotiz aufgebaut ist.
```

**Freiraum:**

- „Welche Kunden sind A-Kunden, und wer betreut sie bei uns?“
- „Welche Datei müsste man ändern, um die Farbe der Knöpfe zu ändern? Ändere noch nichts.“
- Öffnen Sie selbst eine Datei in `gespraeche/` – es ist nur Text.

**Zwischenergebnis:** Sie wissen, wo Kundendaten, Notizen und Anleitungen liegen, dass die App nur aus wenigen, lesbaren Dateien besteht und dass `AGENTS.md` Codex den nötigen Hintergrund gibt.

**Abkürzung bei Zeitnot:** Nur den ersten Prompt verwenden.

---

## Schritt 1 – App starten (15 min)

**Ziel:** Die App läuft im Browser, und Sie haben ihr Aussehen per Prompt verändert.

1. In VS Code: Menü **Terminal → Neues Terminal**.
2. Diesen Befehl eingeben und Enter drücken (das Fenster bleibt danach offen und „läuft“):

   ```text
   npm run dev
   ```

3. Im Browser öffnen: **http://localhost:3000**
4. Links einen Kunden anklicken. Sie sehen die Rohdaten und die Gesprächsnotizen – mehr kann die App noch nicht.

Stellen Sie Codex jetzt auf den Modus, in dem er **Dateien ändern** darf (je nach Version „Agent“).

**Start-Prompt:**

```text
Gestalte die App in public/index.html freundlicher: ruhige Farben, eine moderne Schrift, die Kundenliste links als Karten mit etwas Abstand. Ändere nur public/index.html.
```

Danach im Browser die Seite neu laden (**F5**).

**Freiraum:**

- „Zeige die Kundenklasse in der Kundenliste als farbiges Abzeichen (A grün, B blau, C grau, D hellgrau).“
- „Setze oben links den Schriftzug ‚Kundencockpit‘ in unserer Hausfarbe Dunkelblau.“
- „Mach eine dunkle Variante, die man oben umschalten kann.“

**Zwischenergebnis:** Die App läuft und sieht anders aus als am Anfang.

**Abkürzung bei Zeitnot:** Nur die App starten, Design-Prompt überspringen.

> Hinweis: Änderungen an `public/index.html` sind nach **F5** sichtbar. Nur nach Änderungen an `server.js` muss die App neu gestartet werden: im Terminal **Strg+C**, dann wieder `npm run dev`.

---

## Schritt 2 – Ohne vs. mit Kontext (40 min)

**Ziel:** Erleben, dass dieselbe KI mit einer klaren Anleitung deutlich bessere und prüfbare Ergebnisse liefert.

### 2a – Ohne Anleitung (Codex-Chat)

**Neuen Chat** beginnen. **Start-Prompt:**

```text
Zeige die Daten eines Kunden in der App übersichtlich an, wenn man ihn links anklickt.
```

Seite neu laden (F5), **Lahntal Caravanwerk** anklicken und anschauen: Welche Abschnitte gibt es? Sieht man, wann der letzte Kontakt war? Woher stammen die Aussagen? Tipp: mit **Windows+Umschalt+S** einen Screenshot machen, um später zu vergleichen.

### 2b – Mit Anleitung (Codex-Chat)

Öffnen Sie zuerst `anleitungen/kunden-uebersicht.md` und lesen Sie sie kurz. **Neuen Chat** beginnen. **Start-Prompt:**

```text
Zeige die Daten eines Kunden in der App übersichtlich an, wenn man ihn links anklickt. Befolge dabei anleitungen/kunden-uebersicht.md. Ersetze eine eventuell schon vorhandene Kundenansicht.
```

Seite neu laden und vergleichen: feste Abschnitte, Betreuungsziel, überfällige Tage, Platz für Quellen.

### 2c – KI-Zusammenfassung selbst einbauen und vergleichen

Jetzt lassen Sie die KI **live** zusammenfassen – einmal ohne, einmal mit Anleitung. Die Knöpfe dafür baut Codex. **Neuen Chat** beginnen. **Start-Prompt:**

```text
Baue in der Kundenansicht zwei Knöpfe „Zusammenfassung ohne Anleitung“ und „Zusammenfassung mit Anleitung“. Sie rufen POST /api/agent/uebersicht mit modus "ohne" bzw. "mit" auf. Zeige beide Ergebnisse nebeneinander. Ändere nur public/index.html.
```

Seite neu laden, prüfen:

- Sind beide Knöpfe da? Läuft beim Klick eine Ladeanzeige mit Sekunden?
- Erscheinen die Ergebnisse nebeneinander? (Dauert jeweils etwa 30 bis 120 Sekunden.)
- Falls ein gelber Hinweis „Beispielergebnis“ erscheint: Die KI war nicht erreichbar, die App zeigt ein vorbereitetes Ergebnis.

Klappt etwas nicht, beschreiben Sie Codex einfach, was Sie sehen – z. B. „Beim Klick passiert nichts“ oder „Die Ergebnisse stehen untereinander statt nebeneinander“.

Dann **Lahntal Caravanwerk** anklicken und beide Knöpfe drücken.

Worauf achten?

- Hat die Zusammenfassung ohne Anleitung Quellenangaben? Ist die Gliederung bei jedem Kunden gleich?
- Kennt sie die Marktmeldungen? (Nein – sie bekommt nur die Dateien dieses Kunden.)
- Erkennt sie, ob der Kunde überfällig ist?

### 2d – Anleitung ändern

**Start-Prompt:**

```text
Ergänze in anleitungen/kunden-uebersicht.md einen Abschnitt „Nachhaltigkeit“ (Rezyklatanteil, CO2-Daten, EPD-Anfragen) zwischen „Wettbewerb“ und „Offene Punkte & Risiken“. Ändere sonst nichts.
```

Dann in der App **Havelland Kühlfahrzeugbau** anklicken und erneut **„Zusammenfassung mit Anleitung“** drücken. Der neue Abschnitt erscheint – ohne dass jemand programmiert hat.

**Freiraum:**

- Einen eigenen Abschnitt erfinden, z. B. „Gesprächsvorbereitung: 3 Fragen für den nächsten Termin“.
- Regel ergänzen: „Beträge immer auch als Jahresumsatz in Euro angeben.“
- In der App prüfen: Stimmen die Quellenangaben? Datei öffnen und nachlesen.

**Zwischenergebnis:** Sie haben gesehen: **Struktur schlägt Modell.** Die Anleitung ist ein Stück Firmenwissen, das jeder lesen und ändern kann.

**Abkürzung bei Zeitnot:** 2a und 2b überspringen, direkt mit 2c beginnen und Lahntal Caravanwerk verwenden (dafür gibt es auch Beispielergebnisse). Klappt der Einbau in 2c nicht, zum Zwischenstand `stufe-2-fertig` springen (siehe [Für die Moderation](#für-die-moderation)).

---

☕ **Pause (10 min)**

---

## Schritt 3 – Kundenabfrage (25 min)

**Ziel:** Freie Fragen zu einem Kunden stellen und nachvollziehbare Antworten mit Quellen bekommen.

Öffnen Sie kurz `anleitungen/kundenabfrage.md`. **Neuen Chat** beginnen.

**Start-Prompts:**

```text
Befolge anleitungen/kundenabfrage.md: Welche Zusagen haben wir Wiesental Reisemobile gemacht, und welche sind noch offen?
```

```text
Befolge anleitungen/kundenabfrage.md: Wie steht Havelland Kühlfahrzeugbau beim Thema Rezyklat, und was bedeutet das für die Ausschreibung?
```

Zum Vergleich in einem **neuen Chat** dieselbe Frage **ohne** den Hinweis auf die Anleitung stellen.

**Freiraum:**

- Eigene Fragen, z. B. „Wo droht uns bei Kessler & Voigt Umsatz verloren zu gehen?“
- Die Anleitung erweitern: „Am Ende immer eine konkrete Empfehlung für das nächste Gespräch.“
- Fragefeld in der App bauen:

  ```text
  Baue in der Kundenansicht ein Eingabefeld mit dem Knopf „Frage stellen“. Es nutzt POST /api/agent/frage und zeigt die Antwort an. Ändere nur public/index.html.
  ```

**Zwischenergebnis:** Antworten sind immer gleich gegliedert (kommerziell / Wettbewerb / technisch) und jede Aussage ist mit einer Datei belegt.

**Abkürzung bei Zeitnot:** Nur den ersten Start-Prompt.

---

## Schritt 4 – Nächste Schritte (40 min)

**Ziel:** Die KI schlägt vor, um welche Kunden man sich zuerst kümmern sollte – und Sie steuern die Logik über eine einfache Punkteliste.

### 4a – Reiter „Nächste Schritte“ einbauen

**Neuen Chat** beginnen. **Start-Prompt:**

```text
Baue oben in der App einen zweiten Reiter „Nächste Schritte“ mit einem Knopf „Aktualisieren“. Der Knopf ruft POST /api/agent/next-best-action auf und zeigt die Empfehlungen als Liste mit Priorität, Punkten, Kunde, Thema, Ansprechpartner, Begründung und Quellen. Ändere nur public/index.html.
```

Seite neu laden, auf **„Nächste Schritte“** und dann auf **„Aktualisieren“** klicken (dauert 1 bis 3 Minuten).

### 4b – Gewichtung ändern

`anleitungen/next-best-action.md` öffnen und den Abschnitt **„Gewichtung – hier anpassen“** lesen.

**Start-Prompt:**

```text
Ändere in anleitungen/next-best-action.md die Gewichtung: Ein Wettbewerbssignal zählt 40 statt 25 Punkte. Ändere sonst nichts.
```

Sie können die Zahl auch direkt in der Datei ändern und speichern (**Strg+S**). Danach **„Aktualisieren“** – wie verändert sich die Reihenfolge?

### 4c – Neue Gesprächsnotiz

**Start-Prompt:**

```text
Lege in gespraeche/ eine neue Gesprächsnotiz im gleichen Aufbau wie die anderen an: Heute Telefonat mit Tomasz Wójcik von Odra Panele. Die zweite Paneel-Linie ist beschlossen, Start April 2027. Sie brauchen in 10 Tagen ein Angebot für ca. 63.000 m² pro Jahr. Ein anderer Anbieter aus Polen hat bereits ein Angebot abgegeben.
```

Wieder **„Aktualisieren“**: Odra Panele – ein C-Kunde – rückt nach oben.

**Freiraum:**

- Neues Kriterium ergänzen, z. B. „Offene Rechnung: 10 Punkte“.
- „Zeige die Punkte in der App als Balken und färbe hoch/mittel/niedrig rot/gelb/grün.“ (nur `public/index.html`)
- „Füge in der App einen Filter nach Außendienst-Mitarbeiter hinzu.“
- Eigene Gesprächsnotiz zu einem anderen Kunden anlegen und beobachten, was passiert.

**Zwischenergebnis:** Sie haben die Empfehlungsliste selbst in die App gebracht und die Priorisierung verändert – durch Ändern einer Textdatei.

**Abkürzung bei Zeitnot:** Klappt der Einbau in 4a nicht, zum Zwischenstand `stufe-4-start` springen. Nur einmal aktualisieren und die Gewichtung besprechen. Dauert die KI zu lange, zeigt die App automatisch ein Beispielergebnis.

---

## Schritt 5 (optional) – Diktat

**Ziel:** Vom gesprochenen Wort zur sauberen Gesprächsnotiz.

1. In das Codex-Eingabefeld klicken und **Windows+H** drücken. Einen kurzen Satz diktieren und wieder mit **Windows+H** beenden.
2. Die Datei `eingang/diktat-wiesental.txt` öffnen: So sieht ein unbearbeitetes Diktat aus.

**Start-Prompt:**

```text
Mach aus dem Text in eingang/diktat-wiesental.txt eine Gesprächsnotiz in gespraeche/ im gleichen Aufbau wie die anderen Notizen (Kunde Wiesental Reisemobile, Datum heute, Art Besuch, Ansprechpartner Thomas Brückner). Gliedere in Stichpunkte, korrigiere Rechtschreibung und erfinde nichts dazu.
```

Dann in der App **„Nächste Schritte“ → „Aktualisieren“**: Wie verändert sich die Empfehlung für Wiesental?

**Freiraum:** Eine eigene Notiz per Windows+H diktieren und Codex bitten, daraus eine Gesprächsnotiz für einen Kunden Ihrer Wahl anzulegen.

**Zwischenergebnis:** Aus einem Diktat wird in einer Minute eine strukturierte Notiz, die sofort in die Priorisierung einfließt.

**Abkürzung bei Zeitnot:** Weglassen.

---

## Abschluss

Drei Kernaussagen:

1. **Struktur schlägt Modell.** Klare Ordner, Anleitungen und eine gute `AGENTS.md` machen Ergebnisse gut, gleichmäßig und prüfbar – und kurze Prompts reichen, um echte Funktionen zu bauen.
2. **Anleitungen sind Firmenwissen.** Sie sind lesbar, änderbar und gehören den Fachleuten – nicht der IT.
3. **Quellen schaffen Vertrauen.** Jede Aussage lässt sich in Sekunden nachprüfen.

Fragen für den Transfer:

- Welches Wissen steckt bei uns heute nur in Köpfen und könnte eine Anleitung werden?
- Welche Daten müssten wir dafür wie ablegen?
- Wo wäre ein erster kleiner Versuch mit echten, freigegebenen Daten sinnvoll?

> Datenschutz: Codex schickt Dateiinhalte zur Verarbeitung an OpenAI. Mit echten Kundendaten erst arbeiten, wenn das mit IT und Datenschutz geklärt ist.

---

## Für die Moderation

### Zeitplan (2,5 Stunden)

| Start | Block | Dauer |
|---|---|---|
| 0:00 | Begrüßung und Schritt 0 – Orientierung | 15 min |
| 0:15 | Schritt 1 – App starten | 15 min |
| 0:30 | Schritt 2 – Ohne vs. mit Kontext | 40 min |
| 1:10 | Pause | 10 min |
| 1:20 | Schritt 3 – Kundenabfrage | 25 min |
| 1:45 | Schritt 4 – Nächste Schritte | 40 min |
| 2:25 | Abschluss | 5 min |
| – | Schritt 5 – Diktat: nur, wenn eine Gruppe früher fertig ist | – |

### Vorbereitung (am Vortag, je Laptop)

1. Node.js LTS, Git, VS Code und die Codex-Erweiterung installieren.
2. Codex CLI installieren und anmelden (im Terminal):

   ```text
   npm install -g @openai/codex
   codex login
   ```

3. Repository in VS Code öffnen, im Terminal `npm install` ausführen.
4. Prüfen:

   ```text
   npm run check
   ```

   Alle Zeilen sollen mit **OK** beginnen. Jede **FEHLER**-Zeile nennt einen Tipp.
5. Die fertige Musterlösung einmal durchklicken:

   ```text
   git switch --detach stufe-4-fertig
   npm run dev
   ```

   http://localhost:3000 öffnen, bei einem Kunden beide Zusammenfassungen und im Reiter „Nächste Schritte“ „Aktualisieren“ testen. Danach **Strg+C** und zurück zum Ausgangszustand:

   ```text
   git switch -f main
   ```
6. Windows+H einmal ausprobieren (Mikrofon, Einstellung „Online-Spracherkennung“).

### Tipps für die Bau-Schritte (2c und 4a)

- Den ersten Einbau (2c) einmal am Beamer vormachen, dann nachmachen lassen.
- Codex kennt die Schnittstellen aus `AGENTS.md` (Abschnitt „Schnittstellen des Servers“). Fehlt etwas, dort ergänzen – nicht in `server.js`.
- Funktioniert ein Einbau nicht, hilft meist eine Beschreibung dessen, was man sieht („Beim Klick passiert nichts“). Nach zwei erfolglosen Versuchen zum Zwischenstand springen.
- Die beiden technisch erfahrenen Teilnehmenden können in dieser Zeit die Freiraum-Aufgaben angehen oder anderen helfen.

### Zwischenstände (Git-Tags)

| Tag | Stand |
|---|---|
| `stufe-0-start` | Ausgangszustand (entspricht `main`): nur Kundenliste und Rohdaten |
| `stufe-2-fertig` | Nach Schritt 2: freundlicheres Design, Kundenansicht nach Anleitung, Knöpfe für beide Zusammenfassungen, Abschnitt „Nachhaltigkeit“ |
| `stufe-4-start` | Nach Schritt 3 und 4a: zusätzlich Fragefeld und Reiter „Nächste Schritte“, Gewichtung und Notizen noch unverändert |
| `stufe-4-fertig` | Nach Schritt 4: zusätzlich Gewichtung „Wettbewerbssignal 40“ und neue Notiz zu Odra Panele |

Hängt eine Gruppe fest, im Terminal (App vorher mit **Strg+C** beenden):

```text
git stash push --include-untracked -m "eigener Stand"
git switch --detach stufe-2-fertig
```

Zurück zum eigenen Stand:

```text
git switch main
git stash pop
```

Nach dem Workshop alles auf den Anfang zurücksetzen (**löscht alle Änderungen der Teilnehmenden**):

```text
git switch -f main
git clean -fd
```

### Wenn Codex hängt

- **In der App** (sobald die Knöpfe eingebaut sind): Nach spätestens 180 Sekunden bricht der Server ab und zeigt ein Beispielergebnis aus `fallback/` mit gelbem Hinweis. Beispielergebnisse gibt es für **Lahntal Caravanwerk**, **Wiesental Reisemobile** und die **Nächsten Schritte**. Deshalb in der Vorführung diese Kunden verwenden.
- **Im Codex-Chat:** Laufende Antwort stoppen, neuen Chat beginnen, Prompt erneut senden. Hilft das nicht: auf dem Moderationsbildschirm weitermachen oder zum passenden Git-Tag springen.
- **Im Terminal** des Servers steht zu jedem KI-Aufruf, was passiert ist (`[KI] START`, `[KI] OK`, `[KI] FEHLER`, inklusive Prompt und Dauer).
- Jede erfolgreiche Aktualisierung der „Nächsten Schritte“ überschreibt `fallback/next-best-action.json` mit dem neuesten Ergebnis. So ist das Beispiel immer aktuell.

### Technische Einstellungen

Einstellungen werden vor dem Start im Terminal gesetzt (PowerShell-Schreibweise):

```text
$env:PORT="3001"; npm run dev
$env:STICHTAG="2026-09-16"; npm run dev
$env:AGENT_CLI="claude -p"; npm run dev
```

| Variable | Standard | Wirkung |
|---|---|---|
| `PORT` | `3000` | Port der App |
| `STICHTAG` | heutiges Datum | Datum, gegen das „überfällig“ berechnet wird. Die Beispieldaten sind auf Mitte September 2026 ausgelegt, die Beispielergebnisse auf den 16.09.2026. |
| `AGENT_CLI` | `codex` | Welche KI-CLI der Server startet. Enthält der Wert „codex“, hängt der Server die Codex-Optionen unten an. Jeder andere Wert (z. B. `claude -p` für Claude Code) bekommt den Prompt über die Standardeingabe und liefert die Antwort über die Standardausgabe. Pfade mit Leerzeichen funktionieren hier nicht. |

Der Server ruft Codex so auf (geprüft mit `codex exec --help`, codex-cli 0.154.0):

```text
codex exec --sandbox read-only --skip-git-repo-check --ephemeral --color never --output-last-message <temporäre Datei> -
```

- `--sandbox read-only`: Codex darf in der App nur lesen.
- `--skip-git-repo-check`: nötig für den Modus „ohne“, der in einem leeren Temp-Ordner läuft.
- `--ephemeral`: keine Sitzungsdateien speichern.
- `--output-last-message`: Codex schreibt seine letzte Antwort in eine Datei, die der Server ausliest.
- `-`: Der Prompt kommt über die Standardeingabe – so gibt es unter Windows keine Probleme mit Anführungszeichen.

Tipp für schnellere Antworten: `$env:AGENT_CLI="codex -c model_reasoning_effort=low"`.

### Häufige Probleme

| Problem | Lösung |
|---|---|
| `npm` wird in PowerShell blockiert („Ausführung von Skripts ist deaktiviert“) | `npm.cmd run dev` verwenden oder im Terminal-Menü auf „Command Prompt“ wechseln |
| „Port 3000 ist schon belegt“ | Läuft die App schon in einem anderen Terminal? Dort Strg+C. Oder `$env:PORT="3001"` |
| „Codex ist nicht angemeldet“ | `codex login` im Terminal |
| „Der Befehl codex wurde nicht gefunden“ | `npm install -g @openai/codex`, danach VS Code neu starten |
| `npm install` scheitert im Firmennetz | Proxy für npm einrichten lassen oder den Ordner `node_modules` von einem funktionierenden Laptop kopieren |
| Neue Gesprächsnotiz erscheint nicht | `npm run check` zeigt, ob Kopfbereich (`datum`, `kunde`) stimmt |

---

## Abhängigkeiten

| Was | Wofür | Wer stellt es bereit | Kosten | Wenn es fehlt oder ausfällt |
|---|---|---|---|---|
| **Node.js** (LTS, ab Version 20) | Führt die App aus | IT oder Moderation installiert | kostenlos | App startet nicht → Moderationsbildschirm |
| **Express** (Version 5) | Baustein für den Webserver, einzige Programmbibliothek | `npm install` aus dem npm-Verzeichnis im Internet | kostenlos | App startet nicht → `node_modules` von einem anderen Laptop kopieren |
| **Codex CLI** und **Codex-Erweiterung für VS Code** | Der KI-Agent im Chat und hinter den App-Knöpfen | Installation durch IT/Moderation, Anmeldung mit ChatGPT-Abo | im ChatGPT-Abo enthalten (mit Nutzungsgrenzen) | App zeigt Beispielergebnisse aus `fallback/`; Chat-Übungen am Moderationsbildschirm |
| **Internetzugang** | Codex arbeitet mit den Servern von OpenAI | Firmennetz; OpenAI-Dienste müssen erreichbar sein | – | Wie oben: Beispielergebnisse und Git-Tags |
| **Windows-Diktat** (Windows+H) | Schritt 5 | In Windows enthalten; nutzt die Online-Spracherkennung von Microsoft (Einstellung „Online-Spracherkennung“ muss erlaubt sein) | kostenlos | Schritt 5 mit getipptem Text oder nur mit `eingang/diktat-wiesental.txt` |
| **Git** | Zwischenstände (Tags) und Zurücksetzen | IT oder Moderation installiert | kostenlos | Keine Checkpoints → Ordner vorab als ZIP-Kopien je Stufe bereithalten |
| **VS Code** | Arbeitsoberfläche | IT oder Moderation installiert | kostenlos | Codex nur im Terminal nutzbar |
