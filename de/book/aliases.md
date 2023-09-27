# Aliase

Aliase in Nushell bieten eine einfache Möglichkeit, um Texte zur ersetzen. Damit ist es möglich, einen Kurznamen für längere Befehle zu definieren - inklusive der Argumente.

Beispielsweise kann ein Alias namens `ll` definiert werden, der den längeren Befehl `ls -l` ersetzt:

```
> alias ll = ls -l
```

Nun kann der Alias aufgerufen werden:

```
> ll
```

Wenn das getan wird, wirkt es, als sei `ls -l` aufgerufen worden. Das bietet auch die Möglichkeit weitere Parameter anzugeben. So kann auch geschrieben werden:

```
> ll -a
```

Das ist äquivalent zu `ls -l -a`. Deutlich kürzer.

## Alle Aliase auflisten

Die verfügbaren Aliase können mit `$nu.scope.aliases` aufgelistet werden.

## Persistenz

Um Aliase dauerhaft zu speichern muss man sie nur in die Datei _config.nu_ einfügen, das Kommando `config nu` öffnet einen Editor zum Einfügen, und dann die Nushell neu starten.

## Shell pipes in Aliases

Achtung: Der Alias `alias uuidgen = uuidgen | tr A-F a-f` (um das verhalten von `uuidgen` auf Mac an Linux anzugleichen) funktioniert nicht.
Die Lösung ist einen parameterlosen Befehl zu definieren, der das Systemprogramm `uuidgen`  mit Hilfe von `^` aufruft.

```
def uuidgen [] { ^uuidgen | tr A-F a-f }
```

Mehr dazu im Kapitel [Eigene Befehle](custom_commands.md).

Oder ein etwas idiomatischeres Beispiel von nushell internen Befehlen

```
def lsg [] { ls | sort-by type name -i | grid -c | str trim }
```

das alle Dateien und Ordner in Zeilen und Spalten darstellt.
