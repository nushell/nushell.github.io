# Mit Text arbeiten

Texte können ganz verschiedene Formen von Daten annehmen.
Es können Dateinamen, Verzeichniss-Pfade, Spaltennamen und vieles mehr sein.
Texte kommen so oft vor, dass Nushell diverse Wege bereitstellt um mit
ihnen zu arbeiten. Der Anwendungsfall entscheidet, welches am besten passt.

## Texte in einfachen Anführungszeichen

Der einfachste Text in Nushell ist der in einfachen Anführungszeichen.
Er wird mit dem `'` Zeichen umgeben. Hier der Text als Hallo Welt.

```nu
'Hallo Welt'
# => Hallo Welt
```

Text in einfachen Anführungszeichen belassen den Text wie er ist,
womit sie ideal sind, um diverse Formen von Text zu enthalten.

## Texte in doppelten Anführungszeichen

Für komplexere Formen, werden in Nushell Texte in doppelte
Anführungszeichen gesetzt. Diese werden mit dem `'` Zeichen umgeben.
Sie unterstützen die Verwendung von Escape-Zeichen mit der Verwendung
eines `\`.

Zum Beispiel kann das Hallo Welt von vorhin geschrieben werden als,
Hallo gefolgt von einen `\n` um eine neue Linie zu erzeugen, dann Welt.
Das ganze in doppelten Anführungszeichen.

```nu
"Hallo\nWelt"
# => Hallo
# => Welt
```

Escape Zeichen werden verwendet um Zeichen einzugeben, die ansonsten
schwer zu tippen wären.

Nushell unterstützt aktuell folgende Escape Zeichen:

- `\"` - Doppeltes Anführungszeichen
- `\'` - Einfaches Anführungszeichen
- `\\` - Gegenstrich
- `\/` - Vorwärtsstrich
- `\b` - Rücktaste
- `\f` - Vorschub
- `\r` - Zeilenumschalt
- `\n` - Neue Zeile (line feed)
- `\t` - Tabulator
- `\u{X...}` - Ein Unicode Zeichen, wobei der Platzhalter `X...` für ein bis sechs hexadezimale Ziffern steht (0-9, A-F)

## Text Interpolation

Anwendungsfälle von komplexeren Text-Operationen benötigen eine neue Form von Text:
Text Interpolation. Ein Weg um Texte zusammenzustellen, die sowohl aus rohem Text,
als auch aus dem Ergebnis von laufenden Ausdrücken bestehen. Text Interpolation kombiniert
diese Texte zusammen zu einem neuen Text-Ergebnis.

Die Text Interpolation wird mit `$" "` und `$" "` gebildet.

Soll zum Beispiel eine Person per Namen gegrüsst werden, deren Namen in einer Variablen steht,
dann sieht das so aus:

```nu
let name = "Alice"
$"greetings, ($name)"
# => greetings, Alice
```

Ein Ausdruck in `()` wird zuerst fertig ausgeführt. Das Ergebnis wird zur Bildung
des finalen Textes verwendet.

Text Interpolationen funktionieren mit einfachen Anführungszeichen, `$' '`,
sowie mit doppelten Anführungszeichen `$" "`. Analog unterstützen doppelte Anführungszeichen
auch bei der Text Interpolation Escape Zeichen, was einfache Anführungszeichen nicht tun.

Seit Version 0.61 unterstützt Nushell Escape Zeichen für Klammern.
So können die Zeichen `(` und `)` in einem Text verwendet werden, ohne dass Nushell
auswerten will, was sich dazwischen befindet.

```nu
$"2 + 2 is (2 + 2) \(you guessed it!)"
# => 2 + 2 is 4 (you guessed it!)
```

## Texte aufsplitten

Der [`split row`](/commands/docs/split_row.md) Befehl erstellt eine Liste aus einem Text,
getrennt durch das angegebene Trennzeichen.
Zum Beispiel `let colors = ("red,green,blue" | split row ",")`
erstellt die Liste `[red green blue]`.

Der [`split column`](/commands/docs/split_column.md) Befehl erstellt eine Tabelle aus einem Text,
getrennt durch ein angegebenes Trennzeichen.
Zum Beispiel `let colors = ("red,green,blue" | split column ",")`
erstellt eine Tabelle mit den Elementen als Spalte.

Schliesslich trennt der [`split chars`](/commands/docs/split_chars.md) Befehl
einen Text in seine Zeichen auf.

## Der `str` Befehl

Viele Text Befehle sind Sub-Befehle des `str` Befehls.
Mit `help str` wirden alle Sub-Befehle ausgegeben.

Zum Beispiel kann geprüft werden, ob sich ein Zeichen in einem Text befindet mit `str contains`:

```nu
"Hallo Welt" | str contains "W"
# => true
```

### Texte schneiden

Die Seiten eines Textes werden mit dem [`str trim`](/commands/docs/str_trim.md) Befehl
geschnitten. Standardmässig schneidet der [`str trim`](/commands/docs/str_trim.md) Befehl
Leerraum von beiden Seiten des Textes. Zum Beispiel:

```nu
'       My   string   ' | str trim
# => My   string
```

Mit den Optionen `--right` und `--left` kann die Seite angegeben werden,
auf der geschnitten werden soll.

Um ein spezifisches Zeichen weg zu schneiden, wird `--char <Character>` verwendet.
Hier ein Beispiel mit dieser Option:

```nu
'=== Nu shell ===' | str trim -r -c '='
# => === Nu shell
```

### Subtexte

Subtexte sind Stücke von Texten. Sie haben einen Start- und einen Endpunkt.
Hier ein Beispiel eines Substrings:

```nu
'Hallo Welt!' | str index-of 'o'
# => 4
'Hallo Welt!' | str index-of 'l'
# => 8
'Hallo Welt!' | str substring 4..8
# => o We
```

### Texte ausrichten (padding)

Verwende [`fill`](/commands/docs/fill.md):

```nu
'1234' | fill -a right -c '0' -w 10
# => 0000001234
'1234' | fill -a left -c '0' -w 10 | str length
# => 10
```

### Texte umkehren

Dies kann mit dem [`str reverse`](/commands/docs/str_reverse.md) Befehl ganz einfach erreicht werden.

```nu
'Nushell' | str reverse
# => llehsuN
['Nushell' 'is' 'cool'] | str reverse
# => ╭───┬─────────╮
# => │ 0 │ llehsuN │
# => │ 1 │ si      │
# => │ 2 │ looc    │
# => ╰───┴─────────╯
```

## Texte parsen

Mit dem [`parse`](/commands/docs/parse.md) Befehl können Texte in Spalten geparst werden.
Zum Beispiel:

```nu
'Nushell is the best' | parse '{shell} is {type}'
# => ╭───┬─────────┬──────────╮
# => │ # │  shell  │   type   │
# => ├───┼─────────┼──────────┤
# => │ 0 │ Nushell │ the best │
# => ╰───┴─────────┴──────────╯
'Bash is kinda cringe' | parse --regex '(?P<shell>\w+) is (?P<type>[\w\s]+)'
# => ╭───┬───────┬──────────────╮
# => │ # │ shell │     type     │
# => ├───┼───────┼──────────────┤
# => │ 0 │ Bash  │ kinda cringe │
# => ╰───┴───────┴──────────────╯
```

## Texte konvertieren

Es gibt verschiedenste Wege Texte in und von anderen Typen zu konvertieren.

### In einen Text

1. Mit [`into string`](/commands/docs/into_string.md). e.g. `123 | into string`
2. Mit Text Interpolation. e.g. `$'(123)'`

### Von einem Text

1. Mit [`into <type>`](/commands/docs/into.md). e.g. `'123' | into int`

## Texte einfärben

Texte können eingefärbt werden mit dem [`ansi`](/commands/docs/ansi.md) Befehl
Zum Beispiel:

```nu
> $'(ansi purple_bold)This text is a bold purple!(ansi reset)'
```

`ansi purple_bold` färbt den Text purpur.
`ansi reset` stellt die Farbe wieder auf stadard.
(Tipp: Ein Zurückstellen der Farben mit `ansi reset` sollte nach jeder Farbänderung stehen)
