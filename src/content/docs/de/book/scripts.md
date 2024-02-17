---
title: Skripte
---

In Nushell können Skripte geschrieben und ausgeführt werden, welche in der Nushell Sprache geschrieben sind.
Um ein Skript auszuführen, wird es dem Befehl `nu` als Argument übergeben:

```
> nu myscript.nu
```

Dies wird das Skript bis zum Ende in einer neuen Nuinstanz ausführen.
Das Skript kann auch in der _aktuellen_ Instanz ausgeführt werden mit dem [`source`](/commands/docs/source.md) Befehl:

```
> source myscript.nu
```

Hier ein Beispiel einer Skript Datei:

```
# myscript.nu
def greet [name] {
  echo "hello" $name
}

greet "world"
```

Eine Skriptdatei definiert eigene Befehle genauso wie die Main Routine, welche ausgeführt wird nachdem die eigenen Befehle definiert wurden.
Im obigen Beispiel wird `greet` zuerst definiert vom Nushell Interpreter. Dies erlaubt den späteren Aufruf der Definition.
Das Skript hätte auch geschrieben werden können als:

```
greet "world"

def greet [name] {
  echo "hello" $name
}
```

Es gibt keine Bedingung, dass Definitionen vor deren Aufruf definiert werden müssen.
Dies erlaubt es, sie dort zu platzieren, wo sie am sinnvollsten hingehören.

## Wie Skripte ausgewertet werden

In einem Skript werden Definitionen zuerst ausgeführt. Dadurch können Definitionen im Skript aufgerufen werden.

Nachdem die Definitionen ausgeführt wurden, werden von oben nach unten alle Befehlsgruppen nacheinander ausgeführt.

## Script lines

Um besser zu verstehen wie Nushell die Linien im Code versteht, hier ein Beispiel:

```
a
b; c | d
```

Wird das Skript ausgeführt, führt Nushell zuerst den `a` Befehl zuende und zeigt die Resultate.
Als nächstes führt Nushell der Reihe nach `b; c | d` aus analog den Regeln aus ["Groups" section](types_of_data.html#groups).

## Skripte parametrisieren

Skripte können optional einen speziellen "main" Befehl enthalten.
`Main` wird ausgeführt nachdem der restliche Nu Code ausgeführt wurde und wird vor allem benutzt um Argumente an das Skript zu übergeben.
Argumente werden an ein Skript übergeben indem sie nach dem Skriptnamen angefügt werden (`nu <script name> <script args>`).

Zum Beispiel:

```nu
# myscript.nu

def main [x: int] {
  $x + 10
}
```

```
> nu myscript.nu 100
110
```

## Shebangs (`#!`)

Auf Linux und macOS kann optional ein [shebang](<https://en.wikipedia.org/wiki/Shebang_(Unix)>) eingesetzt werden,
um dem OS mitzuteilen, wie die Datei interpretiert werden will.
Hier zum Beispiel in einer Datei mit dem Damen `myscript`:

```
#!/usr/bin/env nu
echo "Hello World!"
```

```
> ./myscript
Hello World!
```
