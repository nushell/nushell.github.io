# Mathematik

Manchmal müssen lediglich ein paar Zahlen addiert werden, um eine Aufgabe zu erledigen. Nushell bietet dazu einen Satz an grundlegenden mathematischen Funktionen an. Mathematische Ausdrücke sind überall dort verfügbar, wo ein Befehl aufgerufen werden kann.

## Addieren, Subtrahieren, Multiplizieren, Dividieren

```
> 1 + 3
4
```

In Nushell, können die Operationen Addition, Subtraktion, Multiplikation und Division mit den dafür üblichen Symbolen `+`, `-`, `*` und `/` aufgerufen werden. Die Reihenfolge der Operatoren wird dabei berücksichtigt. Ein Beispiel: `1 + 2 * 3` wird behandelt als `1 + (2 * 3)`. Was zum nächsten Konzept führt: Klammern.

## Klammern

Klammern können verwendet werden, um mathematische Ausdrücke zu gruppieren. Das erlaubt es `(1 + 2) * 3` zu verwenden, um beispielsweise die Addition vor der Multiplikation auszuführen.

## `in` und `not-in`

Um herauszufinden, ob ein Wert in einem Datensatz ist oder nicht, können die Operatoren `in` und `not-in` verwendet werden.

```
> 1 in [1 2 3]
true
```

```
> 1 not-in [1 2 3]
false
```

## =~ und !~

Um zu überprüfen, ob ein String innerhalb eines anderen Strings zu finden ist oder nicht, können die Operatoren `=~` und `!~` verwendet werden.

```
> "foobar" =~ "foo"
true
```

```
> "foobar" !~ "baz"
true
```

## Vergleiche

Die folgenden Vergleichsoperatoren sind ebenfalls verfügbar:

* `<` - kleiner als
* `<=` - kleiner gleich
* `>` - größer als
* `>=` - größer gleich
* `==` - gleich
* `!=` - ungleich

## Verknüpfungsoperatoren

Nushell unterstützt auch die Operatoren `&&` ("und") und `||` ("oder") um zwei Operationen die Bool-Werte zurückgeben zu verbinden. Zum Beispiel: `ls | where name in ["one" "two" "three"] && size > 10kb`

## Reihenfolge von Operationen

Mathematische Operationen werden in der folgenden Reihenfolge ausgewertet (von der höchsten Priorität zur niedrigsten Priorität):

* Klammern (`()`)
* Multiplikation (`*`), Division (`/`) und Potenz (`**`)
* Addition (`+`) und Subtraktion (`-`)

```
> 3 * (1 + 2)
9
```
