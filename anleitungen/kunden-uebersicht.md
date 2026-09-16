# Anleitung: Kundenübersicht

## Wofür ist diese Datei?

Diese Datei legt fest, wie die KI eine Kundenübersicht schreibt: welche Abschnitte es gibt, in welcher Reihenfolge, woher die Informationen kommen und in welchem Format das Ergebnis zurückkommt. Die KI nutzt sie im Vertriebs-Assistenten der App, wenn nach einer Übersicht oder Zusammenfassung zu einem Kunden gefragt wird und „Anleitung verwenden“ eingeschaltet ist. Wer hier etwas ändert – zum Beispiel einen Abschnitt ergänzt –, ändert das Ergebnis in der App, ganz ohne Programmierung.

## Aufgabe

Erstelle für genau einen Kunden eine strukturierte Übersicht. Die Frage nennt den Kunden, z. B. „Fasse Lahntal Caravanwerk zusammen“.

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

Antworte als Text auf Deutsch in diesem Aufbau:

```
# Kundenübersicht: <Kundenname> (Stand <TT.MM.JJJJ>)

## Steckbrief
- <Aussage> (Quelle: <Dateipfad>)

## Beziehung & Ansprechpartner
- …
```

- Alle Abschnitte von oben, in derselben Reihenfolge, Überschriften genau wie oben geschrieben.
- Stützt sich ein Punkt auf mehrere Dateien, trenne sie mit Komma.
- Hat ein Abschnitt keine Information: „- keine Information“.
