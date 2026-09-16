# KI-Workshop: Kundencockpit

Heute steuern Sie einen KI-Agenten (**Codex**) nur mit Ihren eigenen Worten. Codex baut damit eine kleine App, die Kundendaten, Gesprächsnotizen und Marktmeldungen zusammenführt. Selbst programmieren müssen Sie nicht.

**Die Kernbotschaft:** Gute Ergebnisse entstehen nicht durch das „beste Modell“, sondern durch **Struktur** – klare Ordner und kurze Textdateien mit dem wichtigen Wissen, an die sich die KI hält.

> Alle Firmen, Personen und Zahlen hier sind **frei erfunden**. Bitte keine echten Kundendaten eingeben.

## So arbeiten Sie heute

- **Codex öffnen:** In VS Code links auf das Codex-Symbol klicken. Für jeden Schritt einen **neuen Chat** beginnen.
- **Prompts:** Zu jedem Schritt steht, *was* Sie von Codex brauchen, plus ein kurzes Beispiel für den Anfang. Formulieren Sie ruhig in eigenen Worten – und fragen Sie nach, wenn Ihnen etwas unklar ist.
- **Keine Angst vor Fehlern:** Die technischen Teile der App sind für Codex gesperrt, und alles lässt sich zurücksetzen.

| Ordner | Inhalt |
|---|---|
| `kunden/` | eine Datei pro Kunde |
| `gespraeche/` | Gesprächsnotizen, eine Datei pro Kontakt |
| `markt/` | Markt- und Wettbewerbsmeldungen |
| `anleitungen/` | **Anleitungen für die KI** – hier steht, *wie* gearbeitet wird. Am Anfang leer, Sie füllen ihn im Workshop. |
| `vorlagen/` | fertige Anleitungen zum Einfügen |
| `eingang/` | ein unbearbeitetes Diktat |
| `AGENTS.md` | Hintergrundwissen für Codex; liest er bei jedem Chat automatisch |

---

## Schritt 0 – Umschauen (10 min)

**Worum geht es?** Bevor Codex etwas verändert, lernen Sie das Projekt kennen – so, wie Sie einen neuen Kollegen fragen würden. Sie sehen: Alles besteht aus wenigen, lesbaren Textdateien. Und Codex kennt das Projekt schon, weil `AGENTS.md` ihm den Hintergrund liefert.

**Was Sie fragen:** wofür das Projekt da ist, was in den Ordnern steckt, was in `AGENTS.md` steht. Stellen Sie Codex dafür auf **„nur lesen“** (je nach Version „Chat“ oder „Read Only“).

**Beispiel für den Anfang:**

```text
Erkläre mir dieses Projekt in einfachen Worten.
```

---

## Schritt 1 – App starten und Assistenten bauen (20 min)

**Worum geht es?** Die App läuft nur auf Ihrem Laptop – `localhost` im Browser heißt „dieser Computer“. Bisher zeigt sie nur Rohdaten. Sie machen daraus Ihr Werkzeug: erst das Aussehen, dann das Wichtigste – ein Eingabefeld, den **Vertriebs-Assistenten**. Die KI dahinter ist im Server schon fertig, es fehlt nur das Feld.

> **INFO:** Der **Vertriebs-Assistent** in der App darf nur lesen – er beantwortet Fragen, speichert aber nichts. Alles, was Dateien anlegt oder ändert (Design, Gesprächsnotizen, Anleitungen), machen Sie im **Codex-Chat** hier in VS Code.

**1. App starten.** Lassen Sie sich von Codex erklären, wie das geht:

```text
Wie starte ich die App?
```

> Falls es hakt: Menü **Terminal → Neues Terminal**, dort `npm run dev` eingeben und Enter drücken. Das Fenster offen lassen. Dann im Browser **http://localhost:3000** öffnen.

Stellen Sie Codex danach auf den Modus, in dem er **Dateien ändern** darf (je nach Version „Agent“). Nach jeder Änderung im Browser **F5** drücken.

**2. Design.** Beschreiben Sie, was Ihnen am Aussehen wichtig ist: Farben, Schrift, wie die Kundendaten übersichtlicher werden.

```text
Mach die App übersichtlicher und freundlicher.
```

**3. Vertriebs-Assistent – der wichtigste Baustein.** Das muss Codex bauen:

- ein **Eingabefeld** mit einem Knopf **„Fragen“**
- die Frage geht an die **fertige Frage-Funktion des Servers** (Codex findet sie in `AGENTS.md`)
- Fragen und Antworten bleiben als **Verlauf untereinander** stehen – das brauchen Sie in Schritt 2 zum Vergleichen

```text
Baue einen Vertriebs-Assistenten: ein Eingabefeld, das die fertige Frage-Funktion des Servers nutzt.
```

Dann eine erste Frage stellen, z. B. „Welche Kunden haben wir?“. Eine Antwort dauert 30 Sekunden bis 2 Minuten. Klappt etwas nicht, beschreiben Sie Codex, was Sie sehen („Beim Klick passiert nichts“).

---

## Schritt 2 – Ohne und mit Anleitung (35 min)

**Worum geht es?** Das ist der Kern des Workshops. Sie stellen dem Assistenten dieselbe Frage zweimal – erst ohne, dann mit einer schriftlichen Anleitung – und vergleichen: Welche Antwort ist vollständiger, einheitlicher und nachprüfbar?

Der Assistent nutzt eine Anleitung, sobald eine passende im Ordner `anleitungen/` liegt. Noch ist der Ordner leer.

**1. Ohne Anleitung fragen** (im Assistenten):

```text
Fasse Lahntal Caravanwerk zusammen.
```

**2. Anleitung einfügen.** Lesen Sie `vorlagen/kunden-uebersicht.md` – das ist Firmenwissen in Textform. Kopieren Sie die Datei dann nach `anleitungen/`: in VS Code per Kopieren und Einfügen oder per Codex („Kopiere die Vorlage kunden-uebersicht nach anleitungen/“).

**3. Dieselbe Frage noch einmal stellen** und vergleichen: Gibt es Quellenangaben? Wäre die Gliederung bei jedem Kunden gleich? Erkennt die KI, wann der letzte Besuch war?

**4. Anleitung ändern.** Ändern Sie die Anleitung, ändert sich die Antwort – ohne dass jemand programmiert. Überlegen Sie, was in der Übersicht fehlt, und lassen Sie Codex es ergänzen, zum Beispiel einen Abschnitt zu Nachhaltigkeit:

```text
Ergänze in der Anleitung kunden-uebersicht einen Abschnitt „Nachhaltigkeit“.
```

Dann dieselbe Frage ein drittes Mal stellen. Im Verlauf stehen jetzt drei Antworten untereinander.

---

☕ **Pause (10 min)**

---

## Schritt 3 – Eigene Fragen (20 min)

**Worum geht es?** Im Alltag haben Sie konkrete Fragen: Was haben wir zugesagt? Wo droht Umsatz verloren zu gehen? Die Vorlage `vorlagen/kundenabfrage.md` sorgt dafür, dass jede Antwort gleich aufgebaut ist und jede Aussage eine Quelle hat – so können Sie sie in Sekunden prüfen.

**Was Sie tun:** `vorlagen/kundenabfrage.md` nach `anleitungen/` kopieren, dann im Assistenten Fragen aus Ihrem Alltag stellen und eine Quelle öffnen, um die Antwort zu prüfen.

**Beispiel für den Anfang** (im Assistenten):

```text
Was haben wir Wiesental Reisemobile zugesagt?
```

Passt Ihnen der Aufbau der Antworten nicht, ändern Sie die Anleitung per Codex – z. B. „Am Ende immer eine Empfehlung für das nächste Gespräch“.

---

## Schritt 4 – Nächste Schritte (35 min)

**Worum geht es?** Die KI soll vorschlagen, um welche Kunden sich der Vertrieb zuerst kümmern sollte. Wie sie priorisiert, steht als einfache Punkteliste in `vorlagen/next-best-action.md`. Diese Logik gehört damit den Fachleuten, nicht der IT: Wer eine Zahl ändert oder eine neue Gesprächsnotiz anlegt, verändert die Empfehlungen.

**1. Anleitung einfügen:** `vorlagen/next-best-action.md` nach `anleitungen/` kopieren.

**2. Reiter bauen.** Das muss Codex bauen:

- einen zweiten Reiter **„Nächste Schritte“** mit einem Knopf **„Aktualisieren“**
- der Knopf holt die **fertigen Empfehlungen des Servers**
- die Liste zeigt je Kunde Priorität, Punkte, Thema, Ansprechpartner, Begründung und Quellen

```text
Baue einen zweiten Reiter „Nächste Schritte“, der die fertigen Empfehlungen des Servers zeigt.
```

„Aktualisieren“ dauert 1 bis 3 Minuten.

**3. An der Logik drehen** – nach jeder Änderung erneut „Aktualisieren“ und die Reihenfolge vergleichen:

- **Gewichtung ändern:** in `anleitungen/next-best-action.md` im Abschnitt „Gewichtung – hier anpassen“, direkt in der Datei oder per Codex („Ein Wettbewerbssignal zählt 40 statt 25 Punkte.“)
- **Neue Gesprächsnotiz anlegen** (im Codex-Chat). Beschreiben Sie das Gespräch so, wie Sie es einem Kollegen erzählen würden:

  ```text
  Lege eine Gesprächsnotiz an: Heute Telefonat mit Tomasz Wójcik von Odra Panele. Die zweite Paneel-Linie ist beschlossen, Start April 2027. Sie brauchen in 10 Tagen ein Angebot für ca. 63.000 m² pro Jahr. Ein anderer Anbieter aus Polen hat bereits ein Angebot abgegeben.
  ```

---

## Schritt 5 – Freies Experimentieren (15 min)

**Worum geht es?** Jetzt bauen Sie Ihr eigenes Stück Firmenwissen. Die Faustregel:

- **Was die KI wissen soll**, gehört in eine kurze Textdatei (Markdown, `.md`) – mit Überschriften, Stichpunkten, Zahlen.
- **Wie die KI arbeiten soll**, gehört in eine Anleitung in `anleitungen/`.
- **Wo was liegt**, gehört in `AGENTS.md` – dann findet die KI es sicher.

**So gehen Sie vor:**

1. Im Codex-Chat eine Datei anlegen lassen (oder selbst schreiben).
2. Codex bitten, den neuen Ordner in `AGENTS.md` einzutragen.
3. Im Assistenten eine passende Frage stellen – und prüfen, ob die Antwort Ihre Datei nutzt.

**Beispiel für den Anfang:**

```text
Lege eine Datei wissen/preise.md mit einer erfundenen Preisliste für unsere drei wichtigsten Produkte an (Preis pro m², Lieferzeit, Mengenrabatt). Trage den Ordner wissen/ in AGENTS.md ein.
```

Danach im Assistenten: „Was wäre unser Angebot für Odra Panele?“

**Ideen:**

- **Wissen:** Produktdatenblätter, Wettbewerber-Steckbriefe, Liefer- und Zahlungsbedingungen, ein Glossar mit Abkürzungen
- **Anleitungen:** Besuchsvorbereitung (Ziel, drei Fragen, offene Punkte), E-Mail-Entwurf an einen Kunden, Wochenbericht für die Geschäftsführung, Checkliste vor einem Angebot
- **Regeln in `AGENTS.md`:** Tonfall („kurz, Sie-Form“), Firmenregeln („Preise nie ohne Freigabe nennen“) – und beobachten, wie sich die Antworten ändern
- **Diktat:** Mit **Windows+H** direkt ins Codex-Eingabefeld sprechen. Oder aus `eingang/diktat-wiesental.txt` eine Gesprächsnotiz machen lassen – und danach „Nächste Schritte“ aktualisieren
- **App:** eine Ampel für überfällige Kunden, ein Filter nach Außendienst-Mitarbeiter, Beispielfragen zum Anklicken im Assistenten
- **Gegenprobe:** eine eigene Datei wieder löschen und dieselbe Frage noch einmal stellen

---

## Abschluss

1. **Struktur schlägt Modell.** Klare Ordner und kurze Textdateien machen Ergebnisse gut, einheitlich und prüfbar.
2. **Anleitungen sind Firmenwissen.** Sie sind lesbar, änderbar und gehören den Fachleuten.
3. **Quellen schaffen Vertrauen.** Jede Aussage lässt sich in Sekunden nachprüfen.

**Zum Weiterdenken:** Welches Wissen steckt bei uns nur in Köpfen und könnte eine Textdatei werden? Wo wäre ein erster kleiner Versuch sinnvoll?

> Datenschutz: Codex schickt Dateiinhalte zur Verarbeitung an OpenAI. Mit echten Kundendaten erst arbeiten, wenn das mit IT und Datenschutz geklärt ist.

---

## Wenn etwas hakt

- **Codex antwortet nicht:** Antwort stoppen, neuen Chat beginnen, Prompt erneut senden.
- **Die App zeigt nichts an:** Im Browser F5 drücken. Ist das Terminal-Fenster mit `npm run dev` noch offen?
- **Gelber Hinweis „Beispielergebnis“:** Die KI war nicht erreichbar, die App zeigt ein vorbereitetes Ergebnis. Das ist kein Fehler von Ihnen.
- **Sonst:** Moderation fragen – jeder Stand lässt sich wiederherstellen.

*Für die Moderation: [MODERATION.md](MODERATION.md)*
