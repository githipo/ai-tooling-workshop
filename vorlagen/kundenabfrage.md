# Anleitung: Kundenabfrage

## Wofür ist diese Datei?

Diese Datei legt fest, wie die KI eine freie Frage zu einem Kunden beantwortet – zum Beispiel „Wie steht es um den Preis bei Kessler & Voigt?“. Die Antwort soll immer gleich aufgebaut sein und zeigen, woher jede Information stammt. So lässt sich jede Antwort in wenigen Sekunden prüfen.

## Aufgabe

Beantworte eine Frage zu genau einem Kunden – nur mit Informationen aus diesem Repository.

## Vorgehen

1. Kunden bestimmen: Name oder `id` aus der Frage in `kunden/` suchen. Ist nicht eindeutig, welcher Kunde gemeint ist, nenne die möglichen Kunden und frage nach.
2. Quellen lesen, in dieser Reihenfolge:
   1. die Stammdaten-Datei in `kunden/`
   2. alle Notizen in `gespraeche/` mit `kunde: <id>`, **neueste zuerst**
   3. passende Meldungen in `markt/` (gleiche Branche oder Kunde genannt)
3. Nur das verwenden, was zur Frage passt. Nichts erfinden. Fehlt etwas, schreibe „keine Information“.
4. Stichtag ist der 16.09.2026.

## Antwortformat

Antworte auf Deutsch, in genau diesem Aufbau:

```
**Kurzantwort:** <ein bis zwei Sätze>

**Kommerziell**
- <Aussage> (Quelle: <Dateipfad>)

**Wettbewerb**
- <Aussage> (Quelle: <Dateipfad>)

**Technisch**
- <Aussage> (Quelle: <Dateipfad>)

**Offen / unklar**
- <was die Daten nicht beantworten>
```

- Alle drei Gruppen immer aufführen. Passt nichts zur Frage: „– keine Information“.
- Höchstens 3 Punkte pro Gruppe, je ein kurzer Satz.
- Datumsangaben im Format TT.MM.JJJJ.

## Beispielfragen

- Wie hat sich der Preisdruck bei Kessler & Voigt entwickelt?
- Welche Zusagen haben wir Wiesental Reisemobile gemacht, und welche sind noch offen?
- Was weiß Havelland Kühlfahrzeugbau über unsere Rezyklat-Pläne?
