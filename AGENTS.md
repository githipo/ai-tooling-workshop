# Hinweise für Codex

## Worum es geht

Dies ist ein Übungs-Repository für einen KI-Workshop. Es enthält eine kleine Web-App („Kundencockpit“) und Beispieldaten eines Herstellers von faserverstärkten Kunststoffplatten (GFK), der an Fahrzeug-, Paneel- und Bauunternehmen liefert.

Die Teilnehmenden sind Führungskräfte, keine Programmierer. Sie steuern dich nur über Prompts.

## Ordner

- `kunden/` – eine Markdown-Datei pro Kunde (Stammdaten im Kopfbereich zwischen `---`)
- `gespraeche/` – Gesprächsnotizen, eine Datei pro Kontakt, Dateiname `JJJJ-MM-TT_kundenid_thema.md`
- `markt/` – Markt- und Wettbewerbsmeldungen
- `anleitungen/` – Arbeitsanleitungen für die KI
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

## Arbeitsweise

- Erkläre in einfachem Deutsch, was du tust und warum – ohne Fachjargon. Fachbegriffe kurz erklären.
- Mache kleine, nachvollziehbare Änderungen und sage am Ende, welche Dateien du geändert hast.
- Lösche keine Dateien in `kunden/`, `gespraeche/`, `markt/`, `eingang/` und `fallback/`. Neue Dateien anlegen ist erlaubt.
- Änderungen gehören nach `public/index.html` und `anleitungen/`; neue Notizen nach `gespraeche/`.
- Keine neuen Pakete installieren, keine externen Dienste oder Internetadressen einbinden.
- Die App läuft mit `npm run dev` unter http://localhost:3000. Starte sie nicht selbst (der Befehl läuft dauerhaft weiter), sondern bitte die Nutzer, ihn im Terminal auszuführen. Nach Änderungen an `public/index.html` reicht es, die Seite im Browser neu zu laden.
- Richte dich nach einer Datei in `anleitungen/` nur, wenn der Prompt sie nennt oder du das Antwortformat einer Schnittstelle (siehe unten) brauchst.
- Alle Texte für die Nutzer auf Deutsch.

## Schnittstellen des Servers

Der Server ist fertig und gesperrt (siehe oben). Neue Funktionen der App entstehen in `public/index.html` und nutzen diese Adressen:

| Aufruf | Schickt | Liefert |
|---|---|---|
| `GET /api/kunden` | – | Liste aller Kunden: Felder aus dem Kopfbereich plus `datei` |
| `GET /api/kunden/:id` | – | `{ kunde, gespraeche }` – jeweils Kopfdaten plus `datei` und `inhalt` (ganzer Dateitext); `gespraeche` neueste zuerst |
| `POST /api/agent/uebersicht` | `{ kundeId, modus }`, `modus` ist `"ohne"` oder `"mit"` | KI-Zusammenfassung eines Kunden |
| `POST /api/agent/frage` | `{ kundeId, frage }` | KI-Antwort auf eine freie Frage |
| `POST /api/agent/next-best-action` | `{}` | KI-Empfehlungen für alle Kunden |

Alle `POST /api/agent/...` antworten mit:

- `text` – die Antwort der KI als Text
- `json` – dieselbe Antwort als Daten, falls sie JSON ist, sonst `null`. Das Format steht im Abschnitt „Ausgabeformat“ von `anleitungen/kunden-uebersicht.md` (bei `modus: "mit"`) bzw. `anleitungen/next-best-action.md`.
- `fallback` – `true`, wenn die KI nicht erreichbar war und ein vorbereitetes Beispiel aus `fallback/` kommt; der Grund steht dann in `grund`
- `sekunden` – Dauer des KI-Aufrufs

Bei Fehlern: HTTP-Status ungleich 200 und `{ fehler }` mit einer deutschen Meldung.

Beim Einbau in `public/index.html`:

- KI-Aufrufe dauern 30 Sekunden bis 3 Minuten. Zeige eine Ladeanzeige mit mitlaufenden Sekunden und sperre den Knopf so lange.
- Bei `fallback: true` einen gut sichtbaren Hinweis zeigen („Beispielergebnis – KI nicht erreichbar“) samt `grund`.
- Ist `json` leer, `text` anzeigen.
- Listen und Abschnitte aus `json` vollständig und in der gelieferten Reihenfolge anzeigen, nicht fest einprogrammieren – die Anleitungen können sich ändern.
- Für Aufrufe die vorhandene Funktion `api()` nutzen, alle Texte aus Antworten mit `esc()` absichern.
- Kein Framework, keine externen Bibliotheken.
