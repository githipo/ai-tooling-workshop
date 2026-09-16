# Anleitung: Nächste Schritte (Next Best Action)

## Wofür ist diese Datei?

Diese Datei legt fest, wie die KI entscheidet, um welche Kunden sich der Vertrieb als Nächstes kümmern sollte. Die Gewichtung unten ist eine einfache Punkteliste: Wer die Zahlen ändert, ändert die Reihenfolge der Empfehlungen in der App (Reiter „Nächste Schritte“ → „Aktualisieren“).

## Aufgabe

Bewerte **jeden** Kunden in `kunden/` mit Punkten und schlage für jeden Kunden genau einen nächsten Schritt vor.

## Quellen

1. `kunden/` – Kundenklasse und Betreuungsziel (`kontakt_alle_tage`).
2. `gespraeche/` – alle Notizen, neueste zuerst. Der letzte Kontakt ist die neueste Notiz des Kunden.
3. `markt/` – Meldungen, deren `branchen` zur Branche des Kunden passen oder die den Kunden nennen.

Stichtag ist der 16.09.2026.

## Gewichtung – hier anpassen

Zähle für jeden Kunden die Punkte zusammen:

- Kundenklasse A: **30** Punkte
- Kundenklasse B: **20** Punkte
- Kundenklasse C: **10** Punkte
- Kundenklasse D: **5** Punkte
- Kontakt überfällig: **5** Punkte je angefangene 10 Tage über dem Kontaktintervall, höchstens **30** Punkte
- Offene Reklamation oder offenes Qualitätsproblem: **25** Punkte
- Wettbewerbssignal in den letzten 90 Tagen (Angebot, Muster oder Preisvergleich eines Wettbewerbers): **40** Punkte
- Passende Marktmeldung (Chance oder Risiko): **10** Punkte
- Offene Zusage von uns (Angebot, Muster, Bericht, Rückmeldung), deren Termin überschritten ist oder in den nächsten 14 Tagen liegt: **15** Punkte

Jedes Kriterium zählt pro Kunde höchstens einmal.

## Priorität

- **hoch**: 60 Punkte oder mehr
- **mittel**: 35 bis 59 Punkte
- **niedrig**: unter 35 Punkte

## Regeln

- Der vorgeschlagene Schritt ist konkret: wer (Ansprechpartner beim Kunden), was (Thema), warum.
- Die Begründung nennt die Kriterien mit ihren Punkten, z. B. „Klasse A (30) + Kontakt 43 Tage überfällig (25) + …“.
- Jede Empfehlung nennt ihre Quelldateien.
- Nichts erfinden. Sortierung: höchste Punktzahl zuerst.

## Ausgabeformat

Antworte **ausschließlich mit JSON** – kein Text davor oder danach, kein Codeblock. Eine Liste mit einem Eintrag pro Kunde:

```json
[
  {
    "kunde": "Lahntal Caravanwerk GmbH",
    "ansprechpartner": "Jana Reuter (Leitung Einkauf)",
    "thema": "8D-Report pünktlich liefern und Seitenwand-Angebot vorbereiten",
    "prioritaet": "hoch",
    "punkte": 105,
    "begruendung": "Klasse A (30) + offene Reklamation (25) + …",
    "quellen": ["kunden/k01-lahntal-caravanwerk.md", "gespraeche/2026-09-08_k01_nachfassen-8d.md"]
  }
]
```

`prioritaet` ist genau eines von: `hoch`, `mittel`, `niedrig`.
