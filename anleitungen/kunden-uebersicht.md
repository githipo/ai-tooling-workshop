# Anleitung: Kundenübersicht

## Wofür ist diese Datei?

Diese Datei legt fest, wie die KI eine Kundenübersicht schreibt: welche Abschnitte es gibt, in welcher Reihenfolge, woher die Informationen kommen und in welchem Format das Ergebnis zurückkommt. Die App nutzt diese Datei beim Knopf „Zusammenfassung mit Anleitung“. Wer hier etwas ändert – zum Beispiel einen Abschnitt ergänzt –, ändert das Ergebnis in der App, ganz ohne Programmierung.

## Aufgabe

Erstelle für genau einen Kunden eine strukturierte Übersicht.

## Quellen – in dieser Reihenfolge

1. `kunden/` – die Stammdaten-Datei des Kunden (Feld `id` im Kopfbereich).
2. `gespraeche/` – alle Notizen mit `kunde: <id>` im Kopfbereich, **neueste zuerst**.
3. `markt/` – nur Meldungen, deren `branchen` zur Branche des Kunden passen oder die den Kunden nennen.

## Regeln

- Jede Aussage bekommt ihre Quelle: den Dateipfad, z. B. `gespraeche/2026-07-02_k01_farbabweichung.md`.
- Nichts erfinden, nichts schätzen. Fehlt eine Information, schreibe „keine Information“.
- Widersprechen sich Quellen, gilt die neueste Gesprächsnotiz. Den Widerspruch unter „Offene Punkte & Risiken“ nennen.
- Stichtag ist das Datum aus der Anfrage. Fehlt es, nimm das heutige Datum.
- Kurz und sachlich: Stichpunkte, höchstens 5 Punkte pro Abschnitt, Zahlen mit Einheit.
- Sprache: Deutsch.

## Abschnitte – genau diese, in dieser Reihenfolge

1. **Steckbrief** – Kundenklasse; Betreuungsziel (Kontakt alle X Tage, Besuch alle Y Tage); letzter Kontakt (Datum, Art, Ansprechpartner); Tage seit letztem Kontakt; Tage überfällig (= Tage seit letztem Kontakt minus Kontaktintervall, mindestens 0); letzter Besuch vor Ort.
2. **Beziehung & Ansprechpartner** – wer ist wofür zuständig, wie ist die Stimmung, wer betreut bei uns.
3. **Kommerziell** – Mengen und Forecast, Preise, Verträge, Zahlungsbedingungen, offene Rechnungen.
4. **Technisch** – aktuelle Anwendungen, Reklamationen, Muster und Freigaben.
5. **Wettbewerb** – Wettbewerbsangebote und Preisvergleiche aus Gesprächen, passende Marktmeldungen.
6. **Offene Punkte & Risiken** – Zusagen von uns mit Termin (überschrittene Termine zuerst), ungelöste Probleme, Widersprüche.
7. **Chancen** – neue Anwendungen, Mehrmengen, Projekte.

## Ausgabeformat

Antworte **ausschließlich mit JSON** – kein Text davor oder danach, kein Codeblock. Aufbau:

```json
{
  "kunde": "k01",
  "name": "Lahntal Caravanwerk GmbH",
  "stichtag": "2026-09-16",
  "abschnitte": [
    {
      "titel": "Steckbrief",
      "punkte": [
        { "text": "Kundenklasse A – Kontakt alle 14 Tage, Besuch alle 60 Tage", "quelle": "kunden/k01-lahntal-caravanwerk.md" }
      ]
    }
  ]
}
```

- `abschnitte` enthält alle Abschnitte von oben, in derselben Reihenfolge, `titel` genau wie oben geschrieben.
- Jeder Punkt hat `text` und `quelle`. Stützt sich ein Punkt auf mehrere Dateien, trenne sie mit Komma.
- Hat ein Abschnitt keine Information: ein Punkt mit `"text": "keine Information"` und `"quelle": ""`.

## Darstellung in der App

Falls du gebeten wirst, eine Kundenübersicht in `public/index.html` anzuzeigen:

- Oben ein Kasten „Steckbrief“ direkt aus `/api/kunden/:id`: Kundenklasse, Betreuungsziel, letzter Kontakt (neueste Gesprächsnotiz), Tage überfällig. Überfällige Tage rot hervorheben.
- Darunter die Abschnitte 2 bis 7 als Karten in genau dieser Reihenfolge. Sie werden mit dem Ergebnis von `POST /api/agent/uebersicht` (`modus: "mit"`) gefüllt; bis dahin steht in jeder Karte „noch nicht erstellt“.
- Die Quelle steht klein und grau unter jedem Punkt. „keine Information“ ebenfalls grau.
- Nur `public/index.html` ändern.
