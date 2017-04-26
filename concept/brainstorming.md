# Konzept für die Umsetzung einer "Tasting-App"
## Übersicht
Idee ist es eine App zu entwickeln, mit der man seine persönlichen Tastings Raten (z. B. Whisky, Rum, ...) erfassen und die erfassten Ratings von Freunden / anderen einsehen kann. Dabei wird unterschieden nach:
- Persönliches Rating ("was habe ich geschmeckt")
- Globales Rating ("Zusammenfassung aller erfassten persönlichen Ratings aller Nutzer zu einem Produkt")
## Ausbaustufen
Die nachfolgenden Features lassen sich in unterschiedliche Ausbaustufen clustern. Diese Ausbaustufen unterscheiden sich danach, "wieviel Backend vorhanden sein muss".

1. Reine Single-User-Offline-Funktion
   - Nutzer kann seine persönlichen Tastings erfassen
   - KEINE Online-Anbindung
   - KEIN Zugriff auf andere Ratings (weder Freunde noch globale)
   - Produkte müssen individuell erfasst werden
   - Produktkategorien (Whisky, Rum, ...) sind in App hinterlegt
2. Friend-Mode
   - Zugriff auf Ratings von Freunden möglich
   - Server dient nur zur Weiterleitung der Daten an Freunde
   - KEINE Verwaltung von globalen Ratings
   - Produkte müssen individuell erfasst werden    
   - Produktkategorien (Whisky, Rum, ...) können in App oder auf Server hinterlegt sein
3. Global-Mode
   - VOLLE Online-Unstützung
   - Produkte müssen global definiert werden um Vergleichbarkeit und Suche zu gewährleisten
   - Zugriff auf Ratings von Freunden und auf globale Ratings
   - Produktkategorien (Whisky, Rum, ...) müssen auf Server hinterlegt sein
   
Feature | Single-User-Mode | Friend-Mode | Global-Mode
------- | ---------------- | ----------- | -----------
Ratings - Persönlich / Offline-Erfassung | X | X | X 
Ratings - Persönlich / Teilen mit Freunden | - | X | X 
Ratings - Persönlich / Online Backup | - | ? | X
Ratings - Persönlich & Global (Vergleichbar und durchsuchbar) | - | - | X
Ratings - Zuordnung zu Produkten | - | - | X
Produkte - Individuelle Erfassung | X | X | ?
Produkte - Globale Verwaltung (Suche etc.) | - | - | X
Produktkategorien - Fix in App hinterlegt | X | ? | -
Produktkategorien - Online hinterlegt und updatebar | - | ? | X

## Ratings
Für jede Produktkategorie (z. B. Whisky) wird ein Template für alle Ratings definiert, damit diese vergleichbar sind. Ein Rating-Template kann aus mehreren Sub-Ratings bestehen (z.B. Allgemein / Nase / Geschmack / Abgang) bestehen. Jedes Sub-Rating kann dabei eine Auswahl der folgenden Felder/Eigenschaften enthalten:
- Bewertung in Sternen
  - 1-5 Sterne
- Freitext
  - Beliebiger Text
- Eigenschafts-Spinne 
  - bis zu 8 Eigenschaften
  - je Eigenschaft einen Bezeichner für Min und Max
  - umsetzungsabhängig können diese je Sub-Rating individuell definiert werden oder nur einmalig pro Kategorie definiert werden
- Tags
  - Stichwörter nach denen gesucht werden kann
  - vorzugsweise Auswahl aus Liste

So könnte man beispielsweise eine Whisky-Kategorie wie folgt anlegen (Ist nur ein Beispiel um mal zu zeigen, was so möglich ist. Man kann natürlich auch überall alle Felder/Eigenschaften aufnehmen, dann wird es aber eben immer komplexer und auch aufwändiger das zu befüllen...):
- Overall-Rating
  - Bewertung in Sternen
  - Freitext
  - Eigenschaftsspinne
    - Rauchigkeit: gar nicht <-> intensiv
    - Eiche: mild <-> intensiv
    - Farbe: hell <-> dunkel
    - Aromenvielfalt: gering <-> komplex
- Nase
  - Freitext
  - Tags
- Geschmack
  - Freitext
  - Tags
- Abgang
  - Freitext
  - Tags
