# Operatoren

Nushell unterstützt folgende Operatoren für gängige Mathematik, Logik und Text Operationen:

| Operator      | Beschreibung                                            |
| ------------- | ------------------------------------------------------- |
| `+`           | addieren                                                |
| `-`           | subtrahieren                                            |
| `*`           | multiplizieren                                          |
| `/`           | dividieren                                              |
| `//`          | Abrundungs Division                                     |
| `mod`         | Modulo                                                  |
| `**`          | potenzieren                                             |
| `==`          | gleich                                                  |
| `!=`          | ungleich                                                |
| `<`           | kleiner als                                             |
| `<=`          | kleiner gleich                                          |
| `>`           | grösser als                                             |
| `>=`          | grösser gleich                                          |
| `=~`          | regex Vergleich / Text enthält                          |
| `!~`          | inverser regex Vergleich / Text enthält *nicht*         |
| `in`          | Wert in Liste enthalten                                 |
| `not-in`      | Wert nicht in Liste enthalten                           |
| `not`         | Logisches Nein                                          |
| `and`         | und zweier bool Ausdrücke (short-circuits)              |
| `or`          | oder zweier bool Ausdrücke (short-circuits)             |
| `xor`         | exclusives oder zweier bool Ausdrücke                   |
| `bit-or`      | bitweises oder                                          |
| `bit-xor`     | bitweises xor                                           |
| `bit-and`     | bitweises und                                           |
| `bit-shl`     | bitweises shift links                                   |
| `bit-shr`     | bitweises shift rechts                                  |
| `starts-with` | Text startet mit                                        |
| `ends-with`   | Text endet mit                                          |
| `++`          | an Listen anfügen                                       |


Klammern können verwendet werden, um mathematische Ausdrücke zu gruppieren. Das erlaubt es `(1 + 2) * 3` zu verwenden, um beispielsweise die Addition vor der Multiplikation auszuführen.

## Reihenfolge von Operationen

Mathematische Operationen werden in der folgenden Reihenfolge ausgewertet (von der höchsten Priorität zur niedrigsten Priorität):

- Klammern (`()`)
- Potenzieren (`**`)
- Multiplizieren (`*`), Dividieren (`/`), Abrundungs Division (`//`), und Modulo (`mod`)
- Addieren (`+`) and Subtrahieren (`-`)
- Bit Shiften (`bit-shl`, `bit-shr`)
- Vergleich Operations (`==`, `!=`, `<`, `>`, `<=`, `>=`), Mitglieds Tests (`in`, `not-in`, `starts-with`, `ends-with`), regex Übereinstimmungen (`=~`, `!~`), und Listen anfügen (`++`)
- Bitweises und (`bit-and`)
- Bitweises xor (`bit-xor`)
- Bitweises oder (`bit-or`)
- Logisches und (`&&`, `and`)
- Logisches xor (`xor`)
- Logisches oder (`||`, `or`)
- Zuweisungs Operationen

```
3 * (1 + 2)
# => 9
```

## Typen

Nicht alle Operationen ergeben für alle Datentypen Sinn.
Wenn eine Operation auf einen nicht kompatiblen Datentyp angewendet werden soll, wird ein Fehler ausgegeben, der erklären soll, was falsch gelaufen ist:
```
"spam" - 1
# => Error: nu::parser::unsupported_operation (link)
# => 
# =>   × Types mismatched for operation.
# =>    ╭─[entry #49:1:1]
# =>  1 │ "spam" - 1
# =>    · ───┬── ┬ ┬
# =>    ·    │   │ ╰── int
# =>    ·    │   ╰── doesn't support these values.
# =>    ·    ╰── string
# =>    ╰────
# =>   help: Change string or int to be the right types and try again.
```

Die Regeln fühlen sich oft strickt an. Auf der anderen Seite sollten sich jedoch weniger unerwünschte Nebeneffekte einschleichen.

## Reguläre Ausdrücke / Text enthält Operator

Die `=~` und `!~` Operator bieten eine praktische Möglichkeit [Reguläre Ausdrücke](https://cheatography.com/davechild/cheat-sheets/regular-expressions/) auszuwerten.
Fundierte Kenntnisse in Regluären Ausdrücke werdne dafür nicht benötigt - es ist damit recht einfach herauszufinden, ob ein Text in einem anderen enthalten ist.

- `text =~ muster` gibt **true** zurück, wenn `text` ein Teil von `muster` ist, und ansonsten **false**.
- `text !~ muster` gibt **false** zurück, wenn `text` ein Teil von `muster` ist, und ansonsten **true**.

Zum Beispiel:

```nu
foobarbaz =~ bar # gibt true zurück
foobarbaz !~ bar # gibt false zurück
ls | where name =~ ^nu # Gibt alle Dateien zurück, deren Namen mit "nu" beginnen.
```

Beide Operatoren benutzen [die Rust Regex-Crate Funktion `is_match()`](https://docs.rs/regex/latest/regex/struct.Regex.html#method.is_match).

## Gross- Kleinschreibung

Operatoren beachten grundsätzlich die Gross- Kleinschreibung bei Textoperationen. Es gibt einige Möglichkeiten dies zu ändern:

1. Beim regulären Ausdruck Operator, kann die `(?i)` Modifikation angewendet werden:

```nu
"FOO" =~ "foo" # gibt false zurück
"FOO" =~ "(?i)foo" # gibt true zurück
```

2. Verwenden des `--ignore-case` Parameters für den [`str contains`](/commands/docs/str_contains.md) Befehl:

```nu
"FOO" | str contains --ignore-case "foo"
```

3. Konvertieren von allen Zeichen in einem Text zu Kleinbuchstaben mittels [`str downcase`](/commands/docs/str_downcase.md) vor einem Vergleich:

```nu
("FOO" | str downcase) == ("Foo" | str downcase)
```
