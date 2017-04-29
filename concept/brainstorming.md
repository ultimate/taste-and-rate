<h1>Konzept für die Umsetzung einer "Tasting-App"</h1>

Inhaltsverzeichnis
==================

* [Übersicht](#idee)
* [Ausbaustufen](#ausbaustufen)
* [Funktionsbeschreibung](#funktionsbeschreibung)
  * [Nutzerfunktionen](#nutzerfunktionen)
* [Umsetzungsideen](#umsetzungsideen)
  * [Ratings](#ratings)
  * [Tags](#tags)
  
Idee
====

Idee ist es eine App zu entwickeln, mit der man seine persönlichen Tastings Raten (z. B. Whisky, Rum, ...) erfassen und die erfassten Ratings von Freunden / anderen einsehen kann. Dabei wird unterschieden nach:
- Persönliches Rating ("was habe ich geschmeckt")
- Globales Rating ("Zusammenfassung aller erfassten persönlichen Ratings aller Nutzer zu einem Produkt")

Ausbaustufen
============

Die nachfolgenden Features lassen sich in unterschiedliche Ausbaustufen clustern. Diese Ausbaustufen unterscheiden sich danach, "wieviel Backend vorhanden sein muss".

1. **Reine Single-User-Offline-Funktion**
   - Nutzer kann seine persönlichen Tastings erfassen
   - KEINE Online-Anbindung
   - KEIN Zugriff auf andere Ratings (weder Freunde noch globale)
   - Produkte müssen individuell erfasst werden
   - Produktkategorien (Whisky, Rum, ...) sind in App hinterlegt
2. **Friend-Mode**
   - Zugriff auf Ratings von Freunden möglich
   - Server dient nur zur Weiterleitung der Daten an Freunde
   - KEINE Verwaltung von globalen Ratings
   - Produkte müssen individuell erfasst werden    
   - Produktkategorien (Whisky, Rum, ...) können in App oder auf Server hinterlegt sein
3. **Global-Mode**
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

Funktionsbeschreibung
=====================

Nutzerfunktionen
----------------

- **Ausbaustufe 1**
  - **Rating erfassen (offline)**<br>Der Nutzer kann zu einem beliebigen Produkt (Freitext) sein Rating abgeben (z. B. mit verschiedenen Skalen, Freitext, Tags, etc.). Dabei kann man auch Zeit und ggf. auch Ort angeben, wann/wo das Tasting stattfand.
  - **Rating ändern (offline)**<br>Vorhandene Ratings muss man ändern können. Dabei sollten die Tasting-Zeitpunkte erhalten bleiben. Man fügt also einen weiteren Zeitpunkt/Ort zum Rating hinzu, es wird aber kein komplett neues Rating erfasst, sondern das alte bei Bedarf geändert.
  - **Tasting anlegen/verwalten**<br>Gruppe über mehrere Ratings anlegen, denen die Ratings zugeordnet werden können. Zuordnung müsste am Besten mit Reihenfolge erfolgen
  - **Ratings/Tastings durchsuchen**<br>Verschiedene Ansichten (z. B. Listenansicht nach Produkt, nach Datum, oder als Kalenderansicht) in denen alle (eigenen) Ratings/Tastings sichtbar sind
  - **Produktkategorien (offline)**<br>Werden über App-Updates verteilt. Dem Nutzer steht eine einfache Art von Verwaltung zur Verfügung (z. B. sortieren/priorisieren, einblenden/ausblenden oder Favoriten)
  - **Sprache**<br>Alle nicht-Freitext-Eigenschaften sollten so weit wie möglich mehrsprachig sein, damit von Anfang an einer Vergleichbarkeit und Suche nichts im Weg steht (z. B. feste Tag-Listen, etc.). Die Sprach-Informationen sind in-App hinterlegt
- **Ausbaustufe 2**
  - **Nutzerkonto anlegen**<br>Registrierung mit Nutzername, E-Mail-Adresse & Passwort (mehr brauchen wir eigentlich nicht)
  - **Einstellungen: Nutzerkonto**<br>In den Einstellungen kann man sein Nutzerkonto angeben, die App loggt einen dann bei Bedarf automatisch ein
  - **Ratings/Tastings hochladen**<br>Ratings/Tastings werden optional hochgeladen. Dabei findet eine Zuordnung zum Nutzerkonto statt, mehr aber auch nicht (keine Produktzuordnung)
  - **Freunde**<br>Man kann andere Nutzer zu seinen Freunden hinzufügen (erfordert gegenseitige Bestätigung)
  - **Ratings von Freunden einsehen**<br>Man hat Zugriff auf die Ratings von Freunden. Hier kann man sich unterschiedliche Rechtemechanismen überlegen (Kombinationen möglich):
    - Jedes Rating muss einzeln freigegeben werden (gilt dann für alle Freunde)
    - Nur Freigabe von Ratings, aber ohne Zeit/Ort/Tastings
    - Zeit/Ort/Tasting kann (für ausgewählte?) Freunde optional mit freigegeben werden
    - ...
  - **Produktkategorien (online)**<br>Können über In-App-Aktualisierung verteilt werden. D.h. Nutzer kann zu der Liste seiner Kategorien im Online-Modus weitere Kategorien hinzufügen. Die eigene Priorisierung wird dem Nutzerkonto zugeordnet und gespeichert.
- **Ausbaustufe 3**  
  - **Rating erfassen/ändern (online)**<br>Zusätzlich zum Freitext-Produkt kann man Produkte aus einer Liste (Produkt-Datenbank) auswählen
  - **Rating hochladen (online)**<br>Falls noch nicht geschehen, muss das Rating nun einem konkreten Produkt (aus der Produkt-Datenbank) zugeordnet werden. Dann kann das Rating dazu hochgeladen werden und in das globale Rating einfließen.
  - **Globale Ratings**<br>Alle hochgeladenen Ratings sind zwangsläufig einem Produkt zugeordnet. Dadurch können für die Produkte globale Durchschnittsratings erstellt werden. Diese können durchsucht werden. Ratings von Freunden werden in globalen Ratings hervorgehoben. Durch die Produktzuordnung kann man zu eigenen (hochgeladenen) Ratings auch weitere Ratings anzeigen lassen...
  - **Bookmarking**<br>Globale Ratings für Produkte können gebookmarkt werden, damit man sie leichter wieder findet.
  - **Inhaltliche Erweiterungen**<br>Nutzer können inhaltliche Änderungen in-App vorschlagen. Einige Änderungen können dabei in-App online verteilt werden, andere erfordern ggf. App-Updates: 
    - neue Produkte
    - neue Produktkategorien
    - Erweiterungen von Produktkategorien um neue Bewertungskriterien
    - Erweiterungen von Tag-Listen, etc.
    - neue Features
    - Bugs
    - neue Übersetzungen
    - ...
  - **Sprache (online)**<br>Auch die Sprachdateien können über in-App-Online-Dienste verteilt werden, z. B. immer dann, wenn auch inhaltliche Änderungen verteilt werden.
- **Ausbaustufenunabhängig**
  - **Umgebungskarte**<br>... mit Feinkostläden, Restaurants, Bars, die Produkte aus den Produktkategorien anbieten.
  - **Eventkalender**<br>Veranstalter, Läden, etc. können für Tastings bei sich Werben.

Umsetzungsideen
===============

Alles was nachfolgend beschrieben wird, geht schon ziemlich konkret in Richtung Umsetzung und hat meist auch einen Hintergedanken, warum so und nicht anders. Ich versuche das so gut es geht zu beschreiben, damit es nachvollziehbar ist.

Ansonsten sind die Ideen hier wild durcheinander, wie sie mir gerade eingefallen sind. Sie hängen teilweise aber zusammen und sind u. U. auch voneinander abhängig...

Ratings
-------

Für jede Produktkategorie (z. B. Whisky) wird ein Template für alle Ratings definiert, damit diese vergleichbar sind. Ein Rating-Template kann aus mehreren Sub-Ratings bestehen (z.B. Allgemein / Nase / Geschmack / Abgang) bestehen. Jedes Sub-Rating kann dabei eine Auswahl der folgenden Felder/Eigenschaften enthalten:
- Bewertung in Sternen
  - 1-5 Sterne
- Freitext
  - Beliebiger Text
- Eigenschafts-Spinne 
  - bis zu X Eigenschaften (X ist umsetzungsabhängig festgelegt, z. B. 8)
  - je Eigenschaft einen Bezeichner für Min und Max
  - bewertung auf Skala von 1-5 (oder mehr?)
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

Idee ist, dass man auf diese Weise nicht zu komplexe Datenstrukturen erhält. Es gibt dann eine Datenstruktur für Sub-Rating-Einträge. Je Rating wird dann pro Sub-Rating ein "Sub-Rating-Eintrag" gespeichert, in welchem jeweils nur die definierten Felder befüllt sind (der Rest wir dem Nutzer gar nicht erst zum Befüllen angezeigt und bleibt entsprechend leer).

Tags
====

