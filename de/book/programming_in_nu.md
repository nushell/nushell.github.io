# Programmieren in Nu

Dieses Kapitel geht mehr ins Detail, wie mit Nushell programmiert werden kann.
Jedes grössere Sprach-Merkmal hat sein eigenes Kapitel.

Wie die meisten Programmiersprachen, können in Nushell Funktionen definiert werden.
Nushell verwendet dafür [Eigene Befehle](custom_commands.md).

Von anderen Shells sind [Aliase](aliases.md) vermutlich ein Begriff.
In Nushell sind Aliase nicht nur ein Shell Merkmal, sondern Teil der Programmiersprache.

Gebräuchliche Tätigkeiten wie Additionen oder Regex Suchen, können mit [operators](operators.md) durchgeführt werden.
Nicht alle Operationen funktionieren für alle Datentypen.
Nushell unterstützt dabei mit hilfreichen Fehlermeldungen.

Zwischenergebnisse können in [Variablen](variables_and_subexpressions.md) gespeichert sowie als [Unterausdrücke](variables_and_subexpressions.html#subexpressions) jederzeit ausgewertet werden.

Die letzten drei Kapitel zielen darauf den Code zu organisieren:

[Skripte](scripts.md) sind die einfachste Form der Organisation: Einfach den Code in eine Datei speichern und mit `source` einbinden.
Allerdins können Skripte auf als eigenständige Programme inklusive Befehls Signatur dank dem "speziellen" `main` Befehl verwendet werden.

Mit [Modulen (EN)](/book/modules.md) kann, wie in vielen anderen Programmiersprachen, der Code aus mehreren kleineren Stücken zusammengefügt werden.
In Modulen kann eine öffentliche Schnittstelle definiert und von nicht öffentlichen Befehlen getrennt werden. Eigene Befehle, Aliase und Umgebungsvariablen können von Modulen importiert werden.

[Überlagerung](overlays.md) bauen auf Modulen auf.
Mit dem Verwenden einer Überlagerung, werden Modul Definitionen in eigenen austauschbaren "Ebenen" übereinander gestapelt.
Dies erlaubt Eigenschaften wie, Aktivieren von virtuellen Umgebungen oder Überschreiben von standard Befehlen mit eigenen Varianten.

Der Hilfetext eines eingebauten Befehls zeigt die [Signatur](command_signature.md).
Er zeigt auf, wie Befehle im allgemeinen verwendet werden können.

Die Standardbibliothek beinhaltet ebenso ein [Test Framework (EN)](/book/testing.md), um zu testen, dass der Code auch wirklich perfekt funktioniert.
