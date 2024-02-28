---
title: Im System navigieren
---

Traditionelle Shells erlauben es im Dateisystem zu navigieren und Befehle auszuführen. So auch Nu. Hier die gängigsten Befehle, die beim Interagieren mit dem System am häufigsten benutzt werden.

## Verzeichnisinhalt ansehen

```nu
ls
```

Wie im anderen Kapitel bereits gezeigt wurde, ist [`ls`](/commands/docs/ls.md) der Befehl um den Inhalt eines Pfades anzuzeigen. Der Output wird als Tabelle dargestellt.

Der [`ls`](/commands/docs/ls.md) Befehl nimmt auch ein optionales Argument entgegen, um die Ansicht zu verändern. Zum Beispiel um nur ".md" Dateien an zu zeigen.

```nu
> ls *.md
───┬────────────────────┬──────┬─────────┬────────────
 # │ name               │ type │ size    │ modified
───┼────────────────────┼──────┼─────────┼────────────
 0 │ CODE_OF_CONDUCT.md │ File │  3.4 KB │ 5 days ago
 1 │ CONTRIBUTING.md    │ File │   886 B │ 5 days ago
 2 │ README.md          │ File │ 15.0 KB │ 5 days ago
 3 │ TODO.md            │ File │  1.6 KB │ 5 days ago
───┴────────────────────┴──────┴─────────┴────────────
```

Der Asterisk (\*) im obigen Beispiel "\*.md" wird auch als Wildcard oder glob bezeichnet. Es kann für jedes Zeichen stehen. Man kann "\*.md" auch als "entspricht jeder Datei, die mit '.md' aufhört" lesen.

Nu verwendet auch moderne globs, mit welchen man auch tiefer liegende Verzeichnisse erreichen kann.

```nu
ls **/*.md
───┬───────────────────────────────────────────┬──────┬─────────┬───────────
# │ name                                      │ type │ size    │ modified
───┼───────────────────────────────────────────┼──────┼─────────┼───────────
0 │ CODE_OF_CONDUCT.md                        │ File │  3.4 KB │ 5 days ago
1 │ CONTRIBUTING.md                           │ File │   886 B │ 5 days ago
2 │ README.md                                 │ File │ 15.0 KB │ 5 days ago
3 │ TODO.md                                   │ File │  1.6 KB │ 5 days ago
4 │ crates/nu-source/README.md                │ File │  1.7 KB │ 5 days ago
5 │ docker/packaging/README.md                │ File │  1.5 KB │ 5 days ago
6 │ docs/commands/README.md                   │ File │   929 B │ 5 days ago
7 │ docs/commands/alias.md                    │ File │  1.7 KB │ 5 days ago
8 │ docs/commands/append.md                   │ File │  1.4 KB │ 5 days ago
```

Hier werden alle ".md" Dateien ausgegeben, die "in jedem tiefer liegenden Verzeichnis" von hier aus liegen.

## Wechseln des aktuellen Verzeichnisses

```nu
cd new_directory
```

Um vom aktuellen Verzeichnis in ein neues zu gelangen, wird der [`cd`](/commands/docs/cd.md) Befehl verwendet. Wie in jeder anderen Shell, kann entweder der Name des Verzeichnisses angeben, oder mit `..` ein Verzeichnis hochgesprungen werden.

Es kann jedoch auch das Verzeichnis gewechselt werden ohne [`cd`](/commands/docs/cd.md) angeben zu müssen, indem einfach der neue Pfad angegeben wird:

```nu
./new_directory
```

**Hinweis** wenn mit [`cd`](/commands/docs/cd.md) das Verzeichnis gewechselt wird, ändert sich die `PWD` Umgebungsvariable. Das heisst der Wechsel bleibt für den aktuellen Block bestehen. Beim Verlassen des Blocks, wird wieder ins vorherige Verzeichnis gewechselt.
Mehr zu dieser Funktionsweise findet sich im Kapitel [environment chapter](./environment.md).

## Dateisystem Befehle

Nu stellt auch einige Dateisystem Basis-Befehle zur Verfügung, die auf allen Platformen laufen.

Ein Objekt von einem Ort an einen anderen verschieben mit [`mv`](/commands/docs/mv.md):

```nu
mv item location
```

Ein Objekt kopieren von einem an den nächsten Ort:

```nu
cp item location
```

Ein Objekt löschen:

```nu
rm item
```

Diese drei Befehle können auch von der glob Fähigkeit profitieren, wie beim [`ls`](/commands/docs/ls.md).

Zu guter Letzt wird ein neues Verzeichnis angelegt mit dem [`mkdir`](/commands/docs/mkdir.md) Befehl:

```nu
mkdir new_directory
```
