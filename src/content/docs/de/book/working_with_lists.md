---
title: Mit Listen arbeiten
---

## Listen erstellen

Eine Liste ist eine geordnete Sammlung von Werten.
Erstellt wird eine `list` mit eckigen Klammern, in denen die Werte durch Leerzeichen und/oder Kommas getrennt werden,
zur besseren Lesbarkeit.
Zum Beispiel, `[foo bar baz]` oder `[foo, bar, baz]`,

## Listen updaten

Mit den zwei Befehlen `update` und `insert` können Listen in einer Pipeline verändert werden,
zum Beispiel fügt folgende Zeile den Wert `10` in der Mitte, also an Stelle 2 ein.

```nu
> [1, 2, 3, 4] | insert 2 10
# [1, 2, 10, 3, 4]
```

Mit dem Befehl `update` ersetzen wir hingegen das 2. Element mit dem Wert `10`.

```nu
> [1, 2, 3, 4] | update 1 10
# [1, 10, 3, 4]
```

Zusätzlich zu `insert` und `update` stehen die Befehle `prepend` und `append` zu Verfügung.
Diese fügen Werte am Anfang einer Liste oder am Ende ein.

Zum Beispiel:

```nu
let colors = [yellow green]
let colors = ($colors | prepend red)
let colors = ($colors | append purple)
echo $colors # [red yellow green purple]
```

## Durch Listen iterieren

Um durch eine Liste zu iterieren, wird der [`each`](/commands/docs/each.md) Befehl vewendet, dem ein [block](types_of_data.html#blocks)
mit Nu-Code folgt, der auf jedes Element der Liste angewendet wird. Der Block Parameter (z.B. `|it|` in `{ |it| echo $it }`)
entspricht normalerweise dem Element der Liste, was jedoch mit dem `--numbered` (`-n`) Flag geändert werden kann in die zwei
Parameter `index` und `item`. zum Beispiel:

```nu
let names = [Mark Tami Amanda Jeremy]
$names | each { |it| $"Hello, ($it)!" }
# Outputs "Hello, Mark!" and three more similar lines.

$names | enumerate | each { |it| $"($it.index + 1) - ($it.item)" }
# Outputs "1 - Mark", "2 - Tami", etc.
```

Der [`where`](/commands/docs/where.md) Befehl kann verwendet werden um einen Filter auf eine Liste anzuwenden.
Das folgende Beispiel gibt alle Farben zurück, deren Namen auf "e" enden.

```nu
let colors = [red orange yellow green blue purple]
echo $colors | where ($it | str ends-with 'e')
```

In diesem Beispiel werden nur Werte behalten, die höher als `7` sind.

```nu
# The block passed to where must evaluate to a boolean.
# This outputs the list [orange blue purple].

let scores = [7 10 8 6 7]
echo $scores | where $it > 7 # [10 8]
```

Der [`reduce`](/commands/docs/reduce.md) Befehl berechnet einen einfachen Wert aus einer Liste.
Der darauffolgende Block enthält 2 Parameter: Das momentane Element (üblicherweise `it` genannt)
und einen Sammler (Akkumulator) (üblicherweise `acc`). Um einen initialen Wert für den Akkumulator zu setzen,
wird das `--fold` (`-f`) Flag gesetzt. Um den Iterator `it` zu ändern nach `index` und `item`, wird wiederum
das `--numbered` (`-n`) Flag verwendet.
Zum Beispiel:

```nu
let scores = [3 8 4]
echo "total =" ($scores | reduce { |it, acc| $acc + $it }) # 15

echo "total =" ($scores | math sum) # easier approach, same result

echo "product =" ($scores | reduce --fold 1 { |it, acc| $acc * $it }) # 96

echo $scores | reduce -n { |it, acc| $acc.item + $it.index * $it.item } # 3 + 1*8 + 2*4 = 19
```

## Auf Listen zugreifen

Um auf ein Element einer Liste zuzugreifen, wird `$name.index` verwendet, wobei in der `$name` Variablen eine Liste enthalten sein muss.
Zum Beispiel kann in folgender Liste das 2. Element mit `$names.1` verwendet werden.

```nu
let names = [Mark Tami Amanda Jeremy]
$names.1 # gives Tami
```

Wenn der Index in einer Variablen wie `$index` enthalten ist, kann dieser mit dem `get` Befehl extrahiert werden.

```nu
let names = [Mark Tami Amanda Jeremy]
let index = 1
$names | get $index # gives Tami
```

Der [`length`](/commands/docs/length.md) Befehl gibt die Anzahl Elemente in der Liste zurück.
Zum Beispiel, `[red green blue] | length` ergibt `3`.

Der [`is-empty`](/commands/docs/is-empty.md) Befehl ermittelt, ob ein String, eine Liste oder eine Tabelle leer ist.
Mit einer Liste wird er so verwendet:

```nu
let colors = [red green blue]
$colors | is-empty # false

let colors = []
$colors | is-empty # true
```

Der `in` und `not-in` Operator wird verwendet, um zu testen, ob ein Wert in einer Liste vorhanden ist oder nicht.
Zum Beispiel:

```nu
let colors = [red green blue]
'blue' in $colors # true
'yellow' in $colors # false
'gold' not-in $colors # true
```

Der [`any`](/commands/docs/any.md) Befehl ermittelt, ob irgend ein Element der Liste einer Bedingung entspricht.
Zum Beispiel:

```nu
# Do any color names end with "e"?
$colors | any {|it| $it | str ends-with "e" } # true

# Is the length of any color name less than 3?
$colors | any {|it| ($it | str length) < 3 } # false

# Are any scores greater than 7?
$scores | any {|it| $it > 7 } # true

# Are any scores odd?
$scores | any {|it| $it mod 2 == 1 } # true
```

Der [`all`](/commands/docs/all.md) Befehl wiederum ermittelt, ob jedes Element der Liste einer Bedingung entspricht.
Zum Beispiel:

```nu
# Do all color names end with "e"?
$colors | all {|it| $it | str ends-with "e" } # false

# Is the length of all color names greater than or equal to 3?
$colors | all {|it| ($it | str length) >= 3 } # true

# Are all scores greater than 7?
$scores | all {|it| $it > 7 } # false

# Are all scores even?
$scores | all {|it| $it mod 2 == 0 } # false
```

## Eine Liste konvertieren

Der [`flatten`](/commands/docs/flatten.md) Befehl generiert aus einer bestehenden Liste eine neue Liste,
indem eine verschachtelte Liste in die Top-Level Liste integriert werden.
Dies kann mehrere Male aufgerufen werden, um verschachtelte Listen jeglicher Tiefe zu integrieren.
Zum Beispiel:

```nu
echo [1 [2 3] 4 [5 6]] | flatten # [1 2 3 4 5 6]

echo [[1 2] [3 [4 5 [6 7 8]]]] | flatten | flatten | flatten # [1 2 3 4 5 6 7 8]
```

Der [`wrap`](/commands/docs/wrap.md) Befehl konvertiert eine Liste in eine Tabelle.
Jedes Listen-Element wird in eine eigene Zeile mit einer einzigen Spalte überführt.

```nu
let zones = [UTC CET Europe/Moscow Asia/Yekaterinburg]

# Show world clock for selected time zones
$zones | wrap 'Zone' | upsert Time {|it| (date now | date to-timezone $it.Zone | format date '%Y.%m.%d %H:%M')}
```
