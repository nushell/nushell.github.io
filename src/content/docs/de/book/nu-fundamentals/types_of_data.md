---
title: Datentypen
---

Traditionellerweise haben Unix Shell Befehle immer über Text Zeichenketten kommuniziert. Eine Befehlsausgabe erfolgte als Text an den Standard Output (oft als `stout` bezeichnet),
der nächste Befehl hat wiederum von Standard Input gelesen (oder `stdin`), was den beiden Befehlen die Kommunikation ermöglicht hat.

Es wurde also Text basiert kommuniziert.

In Nu wird dies ebenfalls zelebriert sowie um weitere Arten von Daten erweitert. Momentan sind die zwei Arten von Datentypen: einfache und strukturierte.

Wie viele Programmiersprachen, verwendet Nu verschiedene einfache und strukturierte Datentypen. Einfache Datentypen beinhalten Ganzzahlen (integers),
Fliesskommanzahlen (floats), Texte (strings), Wahrheitswerte (booleans), den Datumstyp (dates) und Pfade (paths).
Sowie einen speziellen Datentypen für Dateigrössen.

## Ganzzahlen (integers)

Ganzzahlen ohne Bruchwert, z.B. 1, 5 oder 100.
Integers (or round) numbers. Examples include 1, 5, and 100.

## Dezimalzahlen (decimals or floats)

Dezimalzahlen sind Zahlen mit einem Bruchanteil. Beispiele sind 1.5, 2.0 und 15.333.

## Text (strings)

Eine Zeichenfolge die einen Text repräsentiert. Es gibt mehrere Möglichkeiten einen Text in Nushell dar zu stellen:

**Doppelte Anführungszeichen**

```nu
"Mein Text"
```

Doppelte Anführungszeichen werden am häufigsten verwendet und finden sich überall.

**Einfache Anführungszeichen**

```nu
'Mein Text'
```

Einfache Anführungszeichen ergeben ebenfalls einen Text zurück. Der Unterschied ist, dass sie es erlauben, doppelte Anführungszeichen innerhalb des Textes zu verwenden:
`'Er sagte "lasst uns anstossen?"'`

**Text Erweiterung** (interpolation)
Nushell unterstützt Text Erweiterung, was es erlaubt, Unterausdrücke innerhalb eines Textes zu verwenden. Diese werden mit `$` ausgedrückt:

```nu
> echo $"6 x 7 = (6 * 7)"
6 x 7 = 42
```

```nu
> ls | each { |it| echo $"($it.name) is ($it.size)" }
───┬─────────────────────
 0 │ genawait is 4.1 KB
 1 │ learncpp is 4.1 KB
 2 │ nuscripts is 4.1 KB
───┴─────────────────────
```

**blosse Texte**

```nu
> echo hello
```

Eine spezielle Eigenschaft von Nushell ist, dass ein Text mit nur einem Wort auch ganz ohne Anführungszeichen erstellt werden kann.

Der Text oben ist das selbe als wäre geschrieben:

```nu
> echo "hello"
```

Siehe auch [Handling Strings](https://www.nushell.sh/book/loading_data.html#handling-strings).

## Zeilen

Zeilen sind Texte inklusive Betriebsystem abghängigen Zeilenenden. Das Zeilenende wird entsprechend dem OS angehängt.

## Spalten Pfade

Spalten Pfade sind Pfade in einer Tabelle, die zu einer spezifischen Untertabelle, einer Spalte, Zeile oder Zelle führen.

Zumb Beispiel: `foo.0.bar` in `open data.toml | get foo.0.bar`

## Glob Muster (wildcards)

In Nushell können bei Dateioperationen glob Muster oder Wildcards verwendet werden. Dies erlaubt es einen Befehl ein zu geben, der auf mehrere Dateipfade passt.

Das üblichste Musterzeichen ist der `*`, welches auf alle Pfade passt. Meisten wird es kombiniert zum Bespiel `*.bak` oder `temp*`.

Nushell unterstützt auch doppelte `*` um tiefer geschachtelte Pfade zu durchlaufen.
Zum Beispiel `ls **/*` wird alle nicht versteckten Pfade des aktuellen sowie darunterliegende Verzeichnisse auflisten.

Zusätzlich zum `*` gibt es das `?` Muster, als Platzhalter für genau ein Zeichen. Zum Beispiel wird das Wort "port" gefunden mit `p???`.

## Wahrheitswert (Booleans)

Booleans kennen nur den Zustand Wahr oder Falsch. Meistens werden diese nicht direkt geschrieben, sondern sind das resultat eines Vergleichs.

Die zwei möglichen Werte sind `true` und `false`

## Datumswerte (dates)

Datums- und Zeitwert gehören beide als date-Typ zusammen. Datumswerte die das System kennt, sind Zeitzonen abhängig und standardmässig in der UTC Zeitzone.

Basierend auf RFC 3339 gibt es drei Datumsformate:

- A date:
  - `2022-02-02`
- A date and time (in GMT):
  - `2022-02-02T14:30:00`
- A date and time with timezone:
  - `2022-02-02T14:30:00+05:00`

## Zeitdauer (Duration)

Zeitdauern repräsentieren einen gewissen Zeitabschnitt. Eine Sekunde, 5 Wochen oder ein Jahr sind alles Zeitdauern.

Z.B.) `1wk` ist eine Zeitdauer von einer Woche.

Dieser Tabelle zeigt alle momentan unterstüzten Zeitdauern:

| Duration | Length          |
| -------- | --------------- |
| `1ns`    | one nanosecond  |
| `1us`    | one microsecond |
| `1ms`    | one millisecond |
| `1sec`   | one second      |
| `1min`   | one minute      |
| `1hr`    | one hour        |
| `1day`   | one day         |
| `1wk`    | one week        |

## Bereiche (ranges)

Ein Bereich ist ein Weg eine Sequenz von Werten von Start bis Ende darzustellen. Bereiche haben die Form 'start' + '..' + 'end'
Zum Beispiel bedeutet `1..3` die Zahlen 1, 2 und 3.

## Inklusive und nicht inklusive Bereiche

Bereiche sind standardmässig inklusive, was bedeutet, dass der Endwert mit im Bereich inbegriffen ist.
Der Bereich `1..3` beinhaltet die Zahl 3 ebenso als letzten Wert des Bereichs.

Manchmal ist vielleicht ein nicht inklusiver Bereich gewünscht, der den letzten Wert nicht im Output enthält.
Dafür kann die Form `..<` anstatt `..` verwendet werden. Zum Beispiel `1..<5` beinhaltet die Zahlen 1, 2, 3 und 4.

## Bereiche mit offenem Ende

Bereiche können auch offene Enden ausweisen. Dazu wird einfach der Start oder das Ende weggelassen.

Soll von der Zahl 3 an gezählt werden, ohne aber ein specifisches Ende erreichen zu wollen, so kann der Bereich `3..` angegeben werden.
Es ist zu beachten, dass wenn auf der rechten Seite ein offener Bereich verwendet wird, dann wird Nushell so lange zählen wie möglich,
was eine sehr lange Zeit sein kann. Oftmals macht ein solcher Bereich deshalb Sinn bei Befehlen wir `first`,
um die Anzahl Elemente die angezeigt werden sollen konkret anzugeben.

Es ist umgekehrt auch möglich, den Start eines Bereiches offen zu lassen. In dem Falle zählt Nushell von `0` an bis zum Ende Wert.
Der Bereich `..2` entspricht also den Zahlen 0, 1 und 2.

## Dateipfade

Dateipfade sind ein Plattform unabhängiger Weg einen Pfad anzugeben im entsprechenden OS. Beispiele sind /usr/bin und C:\Users\file.txt.

## Dateigrössen

Dateigrössen werden in einem speziellen integer Ganzzahltyp gespeichert, bytes genannt. Beispiele sind `100b`, `15kb` und `100mb`.

Die vollständige Liste von Dateigrössen Einheiten sind:

- `b`: bytes
- `kb`: kilobytes (aka 1000 bytes)
- `mb`: megabytes
- `gb`: gigabytes
- `tb`: terabytes
- `pb`: petabytes
- `kib`: kibibytes (aka 1024 bytes)
- `mib`: mebibytes
- `gib`: gibibytes
- `tib`: tebibytes
- `pib`: pebibytes

## Binärdaten

Binärdaten wie der Inhalt einer Bilddatei entspricht einer Gruppe von rohen (raw) bytes.

Binär kann explizit wörtlich geschrieben werden in einer der Formen `0x[...]`, `0b[...]`, or `0o[...]`:

```nu
> 0x[1F FF]  # Hexadecimal
> 0b[1 1010] # Binary
> 0o[377]    # Octal
```

Nicht vollständige bytes werden links mit Nullen aufgefüllt (left-padded)

## Strukturierte Daten

Strukturierte Daten werden aus einfachen Daten gebildet. Zum Beispiel kann anstatt einer Ganzzahl,
mehrere Ganzzahlen in einem Wert als strukturierter Datentyp repräsentiert werden.
Hier ist eine Liste aller bisher unterstützen dtrukturierten Datentypen:
records, lists und tables.

## Wertepaare (records)

Wertepaare werden auch als key-value pairs bezeichnet, ähnlich wie sie von JSON Objekten bekannt sind. Da diese manchmal viele Felder haben können,
werden Wertepaar von oben unten anstatt links-rechts dargestellt:

```nu
> echo {name: sam, rank: 10}
╭──────┬─────╮
│ name │ sam │
│ rank │ 10  │
╰──────┴─────╯
```

Über Wertepaare kann iteriert werden wenn sie zuerst in eine Tabelle transponiert werden:

```nu
> echo {name: sam, rank: 10} | transpose key value
╭───┬──────┬───────╮
│ # │ key  │ value │
├───┼──────┼───────┤
│ 0 │ name │  sam  │
│ 1 │ rank │   10  │
╰───┴──────┴───────╯
```

## Listen (lists)

Listen können mehr als einen Wert beinhalten. Dies können einfache Werte sein. Sie können auch Zeilen beinhalten und bilden zusammen mit Wertepaaren,
was man eine Tabelle (table) nennt.

Beispiel: Eine Liste von Texten

```nu
> echo [sam fred george]
───┬────────
 0 │ sam
 1 │ fred
 2 │ george
───┴────────
```

## Tabellen (tables)

Die Tabelle ist eine zentrale Datenstruktur in Nushell. Viele der eingebauten Befehle geben als Resultat eine Tabelle aus.
Eine Tabelle besteht immer aus Zeilen und Spalten.

Eine Tabelle wird ähnlich erstellt wie eine Liste. Weil diese auch Spalten und nicht nur Werte enthält, geben wir die Spalten zuerst an:

```nu
> echo [[column1, column2]; [Value1, Value2]]
───┬─────────┬─────────
 # │ column1 │ column2
───┼─────────┼─────────
 0 │ Value1  │ Value2
───┴─────────┴─────────
```

Eine Tabelle mit mehreren Zeilen sieht dann so aus:

```nu
> echo [[column1, column2]; [Value1, Value2] [Value3, Value4]]
───┬─────────┬─────────
 # │ column1 │ column2
───┼─────────┼─────────
 0 │ Value1  │ Value2
 1 │ Value3  │ Value4
───┴─────────┴─────────
```

Oder aus einer Liste von Wertepaaren:

```nu
> echo [{name: sam, rank: 10}, {name: bob, rank: 7}]
╭───┬──────┬──────╮
│ # │ name │ rank │
├───┼──────┼──────┤
│ 0 │ sam  │   10 │
│ 1 │ bob  │    7 │
╰───┴──────┴──────╯
```

## Blöcke (blocks)

Unter einem Block versteht man einen Block aus Code. Wie im Befehl `each { |it| echo $it }` ist der Block der Teil in den geschweiften Klammern, also { |it| echo $it }`. Block Parameter werden zwischen zwei Pipe-Symbolen eingegeben (z.B. ` |it| `)

Blöcke sind ein praktischer Weg Code einzugeben, der auf jeder Zeile der Daten ausgeführt wird. Es ist üblich `$it` als Parameter in [`each`](/commands/docs/each.md)
zu benutzen, aber nicht zwingend. `each { |x| echo $x }`funktioniert gleich wie `each { |it| echo $it }`.

## Gruppen (groups)

In diesem Beispiel:

```nu
foo {
  line1
  line2; line3 | line4
}
```

gibt es zwei Gruppen, die ausgeführt werden. Eine Gruppe ist eine durch Strichpunkt getrennte Liste von Pipelines,
wovon die letzte ausgegeben wird.

- `line1` ist eine Gruppe für sich, und wird deshalb ausgeführt und auf den Bildschirm ausgegeben.
- `line2` ist eine Pipeline innerhalb der zweiten Gruppe. Sie wird ausgeführt, das Ergebnis aber nicht ausgegeben.
- `line3` | `line4` ist die zweite Pipeline in der zweiten Gruppe. Sie wird ausgeführt und ausgegeben.
