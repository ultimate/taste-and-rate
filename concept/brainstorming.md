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
