# Im System navigieren

Traditionelle Shells erlauben es im Dateisystem zu navigieren und Befehle auszuführen. So auch Nu. Hier die gängigsten Befehle, die beim Interagieren mit dem System am häufigsten benutzt werden.

## Verzeichnisinhalt ansehen

@[code](@snippets/moving_around/ls_example.sh)

Wie im anderen Kapitel bereits gezeigt wurde, ist [`ls`](commands/ls.ms) der Befehl um den Inhalt eines Pfades anzuzeigen. Der Output wird als Tabelle dargestellt.

Der [`ls`](commands/ls.md) Befehl nimmt auch ein optionales Argument entgegen, um die Ansicht zu verändern. Zum Beispiel um nur ".md" Dateien an zu zeigen.

@[code](@snippets/moving_around/ls_shallow_glob_example.sh)

Der Asterisk (\*) im obigen Beispiel "\*.md" wird auch als Wildcard oder glob bezeichnet. Es kann für jedes Zeichen stehen. Man kann "\*.md" auch als "entspricht jeder Datei, die mit '.md' aufhört" lesen.

Nu verwendet auch moderne globs, mit welchen man auch tiefer liegende Verzeichnisse erreichen kann.

@[code](@snippets/moving_around/ls_deep_glob_example.sh)

Hier werden alle ".md" Dateien ausgegeben, die "in jedem tiefer liegenden Verzeichnis" von hier aus liegen.

## Wechseln des aktuellen Verzeichnisses

@[code](@snippets/moving_around/cd_example.sh)

Um vom aktuellen Verzeichnis in ein neues zu gelangen, wird der `cd` Befehl verwendet. Wie in jeder anderen Shell, kann entweder der Name des Verzeichnisses angeben, oder mit `..` ein Verzeichnis hochgesprungen werden.

Es kann jedoch auch das Verzeichnis gewechselt werden ohne `cd` angeben zu müssen, indem einfach der neue Pfad angegeben wird:

@[code](@snippets/moving_around/cd_without_command_example.sh)

**Hinweis** wenn mit `cd` das Verzeichnis gewechselt wird, ändert sich die `PWD` Umgebungsvariable. Das heisst der Wechsel bleibt für den aktuellen Block bestehen. Beim Verlassen des Blocks, wird wieder ins vorherige Verzeichnis gewechselt.
Mehr zu dieser Funktionsweise findet sich im Kapitel [environment chapter](./environment.md).

## Dateisystem Befehle

Nu stellt auch einige Dateisystem Basis-Befehle zur Verfügung, die auf allen Platformen laufen.

Ein Objekt von einem Ort an einen anderen verschieben mit `mv`:

@[code](@snippets/moving_around/mv_example.sh)

Ein Objekt kopieren von einem an den nächsten Ort:

@[code](@snippets/moving_around/cp_example.sh)

Ein Objekt löschen:

@[code](@snippets/moving_around/rm_example.sh)

Diese drei Befehle können auch von der glob Fähigkeit profitieren, wie beim [`ls`](commands/ls.md).

Zu guter Letzt wird ein neues Verzeichnis angelegt mit dem `mkdir` Befehl:

@[code](@snippets/moving_around/mkdir_example.sh)
