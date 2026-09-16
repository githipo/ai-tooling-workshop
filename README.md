# KI-Workshop: Kundencockpit

Heute steuern Sie einen KI-Agenten (**Codex**) nur mit Ihren eigenen Worten. Codex baut damit eine kleine App, die Kundendaten, Gesprächsnotizen und Marktmeldungen zusammenführt. Selbst programmieren müssen Sie nicht.

**Die Kernbotschaft:** Gute Ergebnisse entstehen nicht durch das „beste Modell“, sondern durch **Struktur** – klare Ordner und schriftliche Anleitungen, an die sich die KI hält.

> Alle Firmen, Personen und Zahlen hier sind **frei erfunden**. Bitte keine echten Kundendaten eingeben.

## So arbeiten Sie heute

- **Codex öffnen:** In VS Code links auf das Codex-Symbol klicken. Für jeden Schritt einen **neuen Chat** beginnen.
- **Prompts:** Zu jedem Schritt gibt es ein Beispiel für den Anfang. Kopieren Sie es oder schreiben Sie in eigenen Worten – und fragen Sie nach, wenn Ihnen etwas unklar ist. Codex erklärt gern.
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

## Schritt 0 – Umschauen (15 min)

**Worum geht es?** Bevor Codex etwas verändert, lernen Sie das Projekt kennen – so, wie Sie einen neuen Kollegen fragen würden. Sie sehen: Alles besteht aus wenigen, lesbaren Textdateien. Und Codex kennt das Projekt schon, weil `AGENTS.md` ihm den Hintergrund liefert.

Tipp: Stellen Sie Codex für diesen Schritt auf **„nur lesen“** (je nach Version „Chat“ oder „Read Only“). Dann kann er nichts ändern.

**Beispiel für den Anfang:**

```text
Erkläre mir dieses Projekt in einfachen Worten. Wofür ist es da, und was steckt in den Ordnern?
```

**Ideen zum Weiterfragen:** Was kann die App schon – und was könnte sie, zeigt es aber noch nicht? Was steht in `AGENTS.md`? Welche Kunden sind A-Kunden?

---

## Schritt 1 – App starten und Assistenten bauen (20 min)

**Worum geht es?** Die App läuft nur auf Ihrem Laptop. Die Adresse `localhost` im Browser bedeutet „dieser Computer“. Bisher zeigt die App nur Rohdaten. Sie lassen Codex ein Eingabefeld einbauen: den **Vertriebs-Assistenten**. Dort stellt der Vertrieb später seine Fragen.

Der Unterschied: **Codex** (hier in VS Code) baut die App und darf Dateien ändern. Der **Assistent** in der App beantwortet Fragen und darf nur lesen. Die KI dahinter ist schon fertig, es fehlt nur das Eingabefeld.

**Beispiel für den Anfang:**

```text
Wie starte ich die App und öffne sie im Browser? Erkläre es mir Schritt für Schritt.
```

Stellen Sie Codex danach auf den Modus, in dem er **Dateien ändern** darf (je nach Version „Agent“), und lassen Sie den Assistenten bauen!

Versuchen Sie zu Beginn, mit Codex das Design nutzerfreundlicher zu gestalten. Prompten Sie z.B. 

```text
Mach das Interface benutzerfreundlicher. Verwende warme Farben für die Buttons und formattiere die Datenauflistung mit visuellen Elementen, sodass die Kundendaten leichter zu lesen sind.
```

Als nächstes wollen wir ein Chat Interface auf der Seite bauen. Damit das funktioniert, haben wir zu Beginn den lokalen Server mit Codex zusammen gestartet. Dieses Chat Interface soll sich zu server.js verbinden, der Codex im Hintergrund aufruft. 

```text
Baue in der App einen „Vertriebs-Assistenten“: ein Eingabefeld mit Knopf „Fragen“. Er nutzt die fertige Frage-Funktion des Servers. Fragen und Antworten bleiben untereinander stehen.
```

Nach jeder Änderung im Browser **F5** drücken. Dann eine erste Frage stellen, z. B. „Welche Kunden haben wir?“. Eine Antwort dauert 30 Sekunden bis 2 Minuten. Klappt etwas nicht, beschreiben Sie Codex einfach, was Sie sehen („Beim Klick passiert nichts“).

> Falls es hakt: Menü **Terminal → Neues Terminal**, dort `npm run dev` eingeben und Enter drücken. Das Fenster offen lassen. Dann im Browser **http://localhost:3000** öffnen.

---

## Schritt 2 – Ohne und mit Anleitung (35 min)

**Worum geht es?** Das ist der Kern des Workshops. Sie stellen dem Assistenten dieselbe Frage zweimal – erst ohne, dann mit einer schriftlichen Anleitung. Dann vergleichen Sie: Welche Antwort ist vollständiger, einheitlicher und nachprüfbar?

Der Assistent nutzt eine Anleitung, sobald eine passende im Ordner `anleitungen/` liegt. Noch ist der Ordner leer – er arbeitet also ohne.

**1. Ohne Anleitung fragen:**

```text
Fasse Lahntal Caravanwerk zusammen.
```

**2. Anleitung einfügen.** Öffnen Sie `vorlagen/kunden-uebersicht.md` und lesen Sie sie: Das ist Firmenwissen in Textform. Dann kopieren Sie die Datei nach `anleitungen/` – in VS Code per Kopieren und Einfügen oder per Codex:

```text
Kopiere vorlagen/kunden-uebersicht.md nach anleitungen/.
```

**3. Dieselbe Frage noch einmal stellen** und die beiden Antworten vergleichen. Gibt es Quellenangaben? Wäre die Gliederung bei jedem Kunden gleich? Erkennt die KI, wann der letzte Besuch war?

**Danach: die Anleitung ändern.** Ändern Sie die Anleitung, ändert sich die Antwort – ohne dass jemand programmiert. Zum Beispiel per Codex:

```text
Ergänze in anleitungen/kunden-uebersicht.md einen Abschnitt „Nachhaltigkeit“ (Rezyklatanteil, CO2-Daten, EPD-Anfragen) nach „Wettbewerb“.
```

Dann dieselbe Frage ein drittes Mal stellen. Im Verlauf sehen Sie jetzt drei Antworten untereinander.

---

☕ **Pause (10 min)**

---

## Schritt 3 – Eigene Fragen (25 min)

**Worum geht es?** Im Alltag haben Sie konkrete Fragen: Was haben wir zugesagt? Wo droht Umsatz verloren zu gehen? Dafür gibt es die Anleitung `vorlagen/kundenabfrage.md`: Mit ihr ist jede Antwort gleich aufgebaut und jede Aussage hat eine Quelle. So können Sie der Antwort vertrauen, weil Sie sie in Sekunden prüfen können.

Kopieren Sie zuerst `vorlagen/kundenabfrage.md` nach `anleitungen/`. **Beispiel für den Anfang** (im Assistenten):

```text
Welche Zusagen haben wir Wiesental Reisemobile gemacht, und welche sind noch offen?
```

**Ideen:** Eigene Fragen stellen und eine Quelle öffnen, um sie zu prüfen. Die Anleitung per Codex erweitern („Am Ende immer eine Empfehlung für das nächste Gespräch“).

---

## Schritt 4 – Nächste Schritte (40 min)

**Worum geht es?** Die KI soll vorschlagen, um welche Kunden sich der Vertrieb zuerst kümmern sollte. Wie sie priorisiert, steht als einfache Punkteliste in `vorlagen/next-best-action.md`. Diese Logik gehört damit den Fachleuten, nicht der IT: Wer eine Zahl ändert oder eine neue Gesprächsnotiz anlegt, verändert die Empfehlungen.

Kopieren Sie zuerst `vorlagen/next-best-action.md` nach `anleitungen/`. **Beispiel für den Anfang:**

```text
Baue oben in der App einen zweiten Reiter „Nächste Schritte“ mit einem Knopf „Aktualisieren“. Er nutzt die fertigen Empfehlungen des Servers und zeigt sie als Liste mit Priorität, Punkten, Kunde, Thema, Ansprechpartner, Begründung und Quellen.
```

„Aktualisieren“ dauert 1 bis 3 Minuten.

**Danach selbst an der Logik drehen**, zum Beispiel:

- Gewichtung ändern – in `anleitungen/next-best-action.md` im Abschnitt „Gewichtung – hier anpassen“ direkt in der Datei oder per Prompt („Ein Wettbewerbssignal zählt 40 statt 25 Punkte.“)
- Eine neue Gesprächsnotiz anlegen lassen:

  ```text
  Lege eine neue Gesprächsnotiz an: Heute Telefonat mit Tomasz Wójcik von Odra Panele. Die zweite Paneel-Linie ist beschlossen, Start April 2027. Sie brauchen in 10 Tagen ein Angebot für ca. 63.000 m² pro Jahr. Ein anderer Anbieter aus Polen hat bereits ein Angebot abgegeben.
  ```

Nach jeder Änderung erneut „Aktualisieren“: Wie verändert sich die Reihenfolge?

---

## Schritt 5 (optional) – Diktat

**Worum geht es?** Notizen entstehen oft unterwegs und gesprochen. Die KI macht daraus eine saubere, einheitliche Gesprächsnotiz, die sofort in die Empfehlungen einfließt. Diktieren können Sie mit **Windows+H** direkt ins Codex-Eingabefeld. Ein Beispiel für ein unbearbeitetes Diktat liegt in `eingang/diktat-wiesental.txt`.

**Beispiel für den Anfang:**

```text
Mach aus eingang/diktat-wiesental.txt eine Gesprächsnotiz im gleichen Aufbau wie die anderen (Wiesental Reisemobile, heute, Besuch bei Thomas Brückner). Erfinde nichts dazu.
```

---

## Abschluss

1. **Struktur schlägt Modell.** Klare Ordner und Anleitungen machen Ergebnisse gut, einheitlich und prüfbar.
2. **Anleitungen sind Firmenwissen.** Sie sind lesbar, änderbar und gehören den Fachleuten.
3. **Quellen schaffen Vertrauen.** Jede Aussage lässt sich in Sekunden nachprüfen.

**Zum Weiterdenken:** Welches Wissen steckt bei uns nur in Köpfen und könnte eine Anleitung werden? Wo wäre ein erster kleiner Versuch sinnvoll?

> Datenschutz: Codex schickt Dateiinhalte zur Verarbeitung an OpenAI. Mit echten Kundendaten erst arbeiten, wenn das mit IT und Datenschutz geklärt ist.

---

## Wenn etwas hakt

- **Codex antwortet nicht:** Antwort stoppen, neuen Chat beginnen, Prompt erneut senden.
- **Die App zeigt nichts an:** Im Browser F5 drücken. Ist das Terminal-Fenster mit `npm run dev` noch offen?
- **Gelber Hinweis „Beispielergebnis“:** Die KI war nicht erreichbar, die App zeigt ein vorbereitetes Ergebnis. Das ist kein Fehler von Ihnen.
- **Sonst:** Moderation fragen – jeder Stand lässt sich wiederherstellen.

*Für die Moderation: [MODERATION.md](MODERATION.md)*
