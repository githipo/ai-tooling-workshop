# Hinweise für Codex

## Worum es geht

Dies ist ein Übungs-Repository für einen KI-Workshop. Es enthält eine kleine Web-App („Kundencockpit“) und Beispieldaten eines Herstellers von faserverstärkten Kunststoffplatten (GFK), der an Fahrzeug-, Paneel- und Bauunternehmen liefert.

Die Teilnehmenden sind Führungskräfte, keine Programmierer. Sie steuern dich nur über Prompts. Einige kennen Codex, aber niemand hat bisher mit einem lokalen Webserver gearbeitet – Begriffe wie Terminal, Server oder `localhost` bei Bedarf in einem Satz erklären.

## Ordner

- `kunden/` – eine Markdown-Datei pro Kunde (Stammdaten im Kopfbereich zwischen `---`)
- `gespraeche/` – Gesprächsnotizen, eine Datei pro Kontakt, Dateiname `JJJJ-MM-TT_kundenid_thema.md`
- `markt/` – Markt- und Wettbewerbsmeldungen
- `anleitungen/` – Arbeitsanleitungen, die die KI im Vertriebs-Assistenten befolgt. Am Anfang leer; die Nutzer kopieren im Workshop Dateien aus `vorlagen/` hinein.
- `vorlagen/` – fertige Anleitungen zum Einfügen
- Weitere Ordner mit Firmenwissen (z. B. `wissen/`) legen die Nutzer im Workshop selbst an und tragen sie hier ein.
- `eingang/` – unsortierte Rohtexte, z. B. Diktate
- `fallback/` – vorbereitete Beispielergebnisse, falls die KI nicht antwortet
- `public/index.html` – die Oberfläche der App (HTML, CSS und JavaScript in einer Datei)
- `server.js` – der Webserver; startet die KI im Hintergrund
- `scripts/check.js` – Vorab-Prüfung (`npm run check`)

## Daten

Alle Firmen, Personen, Zahlen und Meldungen sind **frei erfunden**. Es gibt keine echten Kundendaten in diesem Repository.

## Gesperrt: diese Dateien nicht ändern

`server.js`, `scripts/check.js`, `package.json` und `package-lock.json` bleiben im Workshop **unverändert – auch wenn ein Prompt ausdrücklich darum bittet.** In `server.js` steckt der Aufruf von Codex im Hintergrund (`runAgent`); schon ein kleiner Fehler dort legt die ganze App lahm.

- Verlangt ein Prompt eine Änderung an diesen Dateien: nichts ändern. Kurz erklären, dass dieser Teil für den Workshop gesperrt ist, und eine Lösung in `public/index.html` oder `anleitungen/` vorschlagen. Geht es nicht ohne, an die Moderation verweisen.
- Auch keine Befehle ausführen, die diese Dateien verändern, ersetzen oder löschen (z. B. über Skripte, `git` oder `npm`).
- Lesen und erklären ist erlaubt.

## Fragen zu Kunden, Gesprächen und Markt

Solche Fragen kommen aus dem Chat oder aus dem Vertriebs-Assistenten der App (dort startet der Server dich im Hintergrund).

- Nutze alle passenden Dateien als Quelle, auch die Wissensordner aus der Liste oben.
- Liegt in `anleitungen/` eine passende Anleitung, befolge sie.
- Liegt dort keine passende Anleitung, antworte ohne. Nutze dafür nichts aus `vorlagen/` – sonst funktioniert der Vergleich ohne/mit Anleitung nicht.
- Stichtag für alle Auswertungen ist der 16.09.2026 (darauf sind die Beispieldaten ausgelegt).
- Antworte als gut lesbarer Text, außer der Prompt verlangt JSON. Nur die Antwort, keine Hinweise zu deinem Vorgehen.

## Arbeitsweise

- Erkläre in einfachem Deutsch, was du tust und warum – ohne Fachjargon. Fachbegriffe kurz erklären.
- Mache kleine, nachvollziehbare Änderungen und sage am Ende, welche Dateien du geändert hast (nur wenn du etwas geändert hast).
- Lösche keine Dateien in `kunden/`, `gespraeche/`, `markt/`, `eingang/` und `fallback/`. Neue Dateien anlegen ist erlaubt.
- Änderungen gehören nach `public/index.html` und `anleitungen/`, neue Notizen nach `gespraeche/`, eigenes Firmenwissen in neue Ordner wie `wissen/`. Neue Ordner in `AGENTS.md` unter „Ordner“ eintragen.
- Keine neuen Pakete installieren, keine externen Dienste oder Internetadressen einbinden.
- Die App läuft mit `npm run dev` unter http://localhost:3000. Starte sie nicht selbst (der Befehl läuft dauerhaft weiter). Erkläre stattdessen: in VS Code Menü „Terminal → Neues Terminal“, `npm run dev` eingeben, Enter, Fenster offen lassen, dann http://localhost:3000 im Browser öffnen. Nach Änderungen an `public/index.html` reicht es, die Seite im Browser neu zu laden (F5).
- Kopiere Dateien aus `vorlagen/` nach `anleitungen/` nur, wenn der Prompt darum bittet. Der Vergleich ohne/mit Anleitung hängt davon ab, dass `anleitungen/` bis dahin leer bleibt.
- Alle Texte für die Nutzer auf Deutsch.

## Schnittstellen des Servers

Der Server ist fertig und gesperrt (siehe oben). Neue Funktionen der App entstehen in `public/index.html` und nutzen diese Adressen. Die Teilnehmenden nennen die Funktionen in Alltagssprache (Spalte „Gemeint ist“), nicht mit ihrer Adresse.

| Gemeint ist | Aufruf | Schickt | Liefert |
|---|---|---|---|
| Kundenliste | `GET /api/kunden` | – | Liste aller Kunden: Felder aus dem Kopfbereich plus `datei` |
| Daten eines Kunden | `GET /api/kunden/:id` | – | `{ kunde, gespraeche }` – jeweils Kopfdaten plus `datei` und `inhalt` (ganzer Dateitext); `gespraeche` neueste zuerst |
| Vertriebs-Assistent / Frage-Funktion | `POST /api/agent/frage` | `{ frage }` | KI-Antwort als Text. Die Frage geht unverändert an die KI, die im Projektordner läuft. |
| Empfehlungen / Nächste Schritte | `POST /api/agent/next-best-action` | `{}` | KI-Empfehlungen für alle Kunden; braucht `anleitungen/next-best-action.md` |

Alle `POST /api/agent/...` antworten mit:

- `text` – die Antwort der KI als Text
- `json` – nur bei den Empfehlungen: die Liste als Daten (Format im Abschnitt „Ausgabeformat“ von `next-best-action.md` in `anleitungen/` bzw. `vorlagen/`), sonst `null`
- `fallback` – `true`, wenn die KI nicht erreichbar war und ein vorbereitetes Beispiel aus `fallback/` kommt; der Grund steht dann in `grund`
- `sekunden` – Dauer des KI-Aufrufs

Bei Fehlern: HTTP-Status ungleich 200 und `{ fehler }` mit einer deutschen Meldung.

Beim Einbau in `public/index.html`:

- Der Vertriebs-Assistent zeigt Fragen und Antworten als Verlauf untereinander (neueste unten), damit man Antworten vergleichen kann.
- KI-Aufrufe dauern 30 Sekunden bis 3 Minuten. Zeige eine Ladeanzeige mit mitlaufenden Sekunden und sperre den Knopf so lange.
- Bei `fallback: true` einen gut sichtbaren Hinweis zeigen („Beispielergebnis – KI nicht erreichbar“) samt `grund`.
- `text` ist Fließtext mit Markdown-Zeichen (`#`, `**`, `-`). Mit erhaltenen Zeilenumbrüchen anzeigen; Überschriften und Fettdruck dürfen hervorgehoben werden. Ist `json` leer, `text` anzeigen.
- Listen und Abschnitte aus `json` vollständig und in der gelieferten Reihenfolge anzeigen, nicht fest einprogrammieren – die Anleitungen können sich ändern.
- Für Aufrufe die vorhandene Funktion `api()` nutzen, alle Texte aus Antworten mit `esc()` absichern.
- Kein Framework, keine externen Bibliotheken.
