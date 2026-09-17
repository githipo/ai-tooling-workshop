# Anleitung: Nächste Schritte (Next Best Action)

Bewerte jeden Kunden in `kunden/` mit Punkten und schlage je Kunde genau einen konkreten nächsten Schritt vor. Quellen: `kunden/`, `gespraeche/`, `markt/`. Der letzte Kontakt ist die neueste Gesprächsnotiz des Kunden.

## Gewichtung – hier anpassen

- Kundenklasse A: **30** Punkte, B: **20**, C: **10**, D: **5**
- Kontakt überfällig: **5** Punkte je angefangene 10 Tage über dem Kontaktintervall (`kontakt_alle_tage`), höchstens **30**
- Offene Reklamation: **25** Punkte
- Wettbewerbssignal in den letzten 90 Tagen (Angebot, Muster oder Preisvergleich eines Wettbewerbers): **25** Punkte
- Offene Zusage von uns, deren Termin überschritten ist oder in den nächsten 14 Tagen liegt: **15** Punkte

Priorität: **hoch** ab 50 Punkten, **mittel** ab 35, sonst **niedrig**.

## Ausgabeformat

Antworte ausschließlich mit JSON – kein Text davor oder danach. Eine Liste mit einem Eintrag pro Kunde, höchste Punktzahl zuerst:

```json
[
  {
    "kunde": "Lahntal Caravanwerk GmbH",
    "ansprechpartner": "Jana Reuter (Leitung Einkauf)",
    "thema": "8D-Report pünktlich liefern",
    "prioritaet": "hoch",
    "punkte": 95,
    "begruendung": "Klasse A (30) + offene Reklamation (25) + …",
    "quellen": ["kunden/k01-lahntal-caravanwerk.md", "gespraeche/2026-09-08_k01_nachfassen-8d.md"]
  }
]
```
