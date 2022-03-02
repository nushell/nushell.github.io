# Vergleich zu Bash

Hinweis: Diese Tabelle geht von Nu 0.14.1 oder neuer aus.

| Bash                                 | Nu                                                    | Funktion                                                                                                   |
| ------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `ls`                                 | `ls`                                                  | Auflisten der Dateien des aktuellen Pfads                                                               |
| `ls <dir>`                           | `ls <dir>`                                            | Auflisten der Dateien am angegebenen Pfad                                                                 |
| `ls pattern*`                        | `ls pattern*`                                         | Auflisten von Dateien, die zum gegebenen Schema/Pattern folgen                                                                 |
| `ls -la`                             | `ls --long --all` or `ls -la`                         | Auflisten aller Dateien (inklusive versteckte) mit allen verfügbaren Informationen                                      |
| `ls -d */`                           | `ls | where type == Dir`                             | Auflisten von Ordnern                                                                                       |
| `find . -name *.rs`                  | `ls **/*.rs`                                          | Rekursive aller Dateien, die zum gegebenen Schema/Pattern passen                                                  |
| `cd <directory>`                     | `cd <directory>`                                      | Wechseln an den angegebenen Pfad                                                                          |
| `cd`                                 | `cd`                                                  | Wechseln in den HOME-Ordner                                                                           |
| `cd -`                               | `cd -`                                                | Wechseln an den vorherigen Pfad                                                                       |
| `mkdir <path>`                       | `mkdir <path>`                                        | Erzeugen des angegebenen Pfads                                                                                |
| `mkdir -p <path>`                    | `mkdir <path>`                                        | Erzeugen des angegebenen Pfads und Elter-Ordner wenn nötig                                                  |
| `touch test.txt`                     | `touch test.txt`                                      | Erstellen einer Datei                                                                                         |
| `> <path>`                           | `| save --raw <path>`                                | Speichern eines String in eine Datei                                                                                |
| `>> <path>`                          | `<not yet possible>`                                  | Anhängen eines Strings an eine Datei                                                                               |
| `cat <path>`                         | `open --raw <path>`                                   | Anzeigen des Inhalts der angegebenen Datei                                                               |
|                                      | `open <path>`                                         | Einlesen einer Datei in Form von strukturierten Daten                                                                         |
| `mv <source> <dest>`                 | `mv <source> <dest>`                                  | Bewegen einer Datei an einen neuen Ort                                                                              |
| `cp <source> <dest>`                 | `cp <source> <dest>`                                  | Kopieren einer Datei an einen Ort                                                                           |
| `cp -r <source> <dest>`              | `cp -r <source> <dest>`                               | Kopieren eines Ordnern an einen neuen Ort (rekursiv)                                                        |
| `rm <path>`                          | `rm <path>`                                           | Entfernen der angegebenen Datei                                                                              |
|                                      | `rm -t <path>`                                        | Angegebene Datei in den Papierkorb des Systems werfen                                                              |
| `rm -rf <path>`                      | `rm -r <path>`                                        | Entfernen des angegebenen Pfads rekursiv                                                                    |
| `chmod`                              | `<not yet possible>`                                  | Ändern von Dateiattributen                                                                            |
| `date -d <date>`                     | `"<date>" | into datetime -f <format>`               | Datum ausgeben ([Dokumentation des Formats](https://docs.rs/chrono/0.4.15/chrono/format/strftime/index.html)) |
| `sed`                                | `str find-replace`                                    | Suchen und ersetzen eines Pattern in einem String                                                                |
| `grep <pattern>`                     | `where $it =~ <substring>` or `find <substring>`      | Filtern von Strings die den Substring beinhalten                                                            |
| `man <command>`                      | `help <command>`                                      | Hilfe zu einem Befehl ansehen                                                                     |
|                                      | `help commands`                                       | Alle verfügbaren Befehle anzeigen                                                                           |
|                                      | `help --find <string>`                                | Nach einem String in allen verfügbaren Befehlen suchen                                                           |
| `command1 && command2`               | `command1; command2`                                  | Ausführen eines Befehls und wenn erfolgreich wird ein weitere Befehl ausgeführt                                                     |
| `stat $(which git)`                  | `stat (which git).path`                               | Ausgabe eines Befehls als Eingabe für einen anderen Befehl verwenden                                                   |
| `echo $PATH`                         | `echo $env.PATH`                                      | Aktuelle PATH-Variable anzeigen                                                                               |
| `<update ~/.bashrc>`                 | `vim $nu.config-path`                                 | PATH permanent ändern                                                                               |
| `export PATH = $PATH:/usr/other/bin` | `let-env PATH = ($env.PATH | append /usr/other/bin)` | PATH temporär ändern                                                                              |
| `export`                             | `echo $env`                                           | Anzeigen der aktuellen Umgebungsvariablen                                                                |
| `<update ~/.bashrc>`                 | `vim $nu.config-path`                                 | Umgebungsvariablen permanent ändern/updaten                                                 |
| `FOO=BAR ./bin`                      | `FOO=BAR ./bin`                                       | Umgebungsvariablen temporär ändern/updaten                                                              |
| `export FOO=BAR`                     | `let-env FOO = BAR`                                   | Umgebungsvariable für aktuelle Sitzung setzen                                                     |
| `echo $FOO`                          | `echo $env.FOO`                                       | Umgebungsvariablen nutzen                                                                           |
| `unset FOO`                          | `hide FOO`                                            | Umgebungsvariable für aktuelle Sitzung verbergen                                                        |
| `alias s="git status -sb"`           | `alias s = git status -sb`                            | Alias temporär definieren                                                                           |
| `<update ~/.bashrc>`                 | `vim $nu.config-path`                                 | Alias permanent hinzufügen und ändern (für neue Shells)                                                        |
| `bash -c <commands>`                 | `nu -c <commands>`                                    | Ausführen einer Pipeline an Befehlen (benötigt 0.9.1 oder neuer)                                                   |
| `bash <script file>`                 | `nu <script file>`                                    | Ausführen einer Skriptdatei (benötigt 0.9.1 oder neuer)                                                            |
| `\`                                  | `(` followed by `)`                                   | Fortsetzen von Zeilen                                                                |
