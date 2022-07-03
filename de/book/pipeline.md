# Pipelines

Eine der grundlegenden Funktionen in Nu ist die Pipeline. Ein Konzept, welches seine Wurzeln tief in der Unix Philosophie hat.
So wie Nu die Arbeit mit Texten als dem Basis Datentyp in Unix erweitert, erweitert sie auch die Idee der Pipeline, um mehr als nur Text zu verarbeiten.

## Grundlagen

Eine Pipeline besteht aus drei Teilen: Dem Input, dem Filter und dem Output.

```
> open "Cargo.toml" | inc package.version --minor | save "Cargo_new.toml"
```

Der erste Befehl, `open "Cargo.toml"`, ist der Input (manchmal auch als "source" oder "producer" bezeichnet).
Dieser kreiert oder ladet Daten und speist sie in die Pipeline ein. Von hier aus hat Nu etwas zum damit arbeiten.
Befehle wie [`ls`](/book/commands/ls.md) sind ebenfalls Inputs, da sie Daten aus dem Dateisystem ziehen und in die Pipeline einspeisen.

Der zweite Befehl, `inc package.version --minor`, ist ein Filter. Filter verarbeiten die Daten auf eine bestimmte Weise.
Vielleicht ändern sie Teile (wie der [`inc`](/book/commands/inc.md) im Beispiel), oder sie führen eine andere Operation aus wie Loggen.

Der letzte Befehl, `save "Cargo_new.toml"`, ist ein Output (manchmal auch "sink" genannt). Ein Output nimmt die Daten aus der Pipeline entgegen und führt 
eine abschliessende Operation daran aus. Im Beispiel wird der Inhalt der Pipeline als letzten Schritt in eine Datei gespeichert.
Andere Arten von Output geben die Daten aus der Pipeline zum Beispiel auf der Kommandozeile aus.

Die `$in` Variable sammelt die Daten in der Pipeline in einen Wert, um den ganzen Strom als Parameter verwenden zu können:

```nushell
> echo 1 2 3 | $in.1 * $in.2
6
```

## Mehrzeilen Pipelines

Wenn eine Pipeline etwas lange wird für eine Zeile, kann sie mit `(` und `)` zu Unterausdrücken unterteilt werden:

```nushell
(
    "01/22/2021" |
    parse "{month}/{day}/{year}" |
    get year
)
```

Siehe auch [Subexpressions](https://www.nushell.sh/book/variables_and_subexpressions.html#subexpressions)

## Mit externen Befehlen arbeiten

Nu Befehle kommunizieren miteinander über die Nu Datentypen (see [types of data](types_of_data.md)), was aber ist mit Befehlen ausserhalb Nu?
Hier einige Beispiele im Umgang mit externen Befehlen:

`interner_befehl| externer_befehl`

Die Daten fliessen vom internen zum externen Befehl und werden dawischen zu Texten konvertiert,
so dass der externe Befehl diese von `stdin` lesen kann.

`externer_befehl | interner_befehl`

Daten die von einem externen Befehl in Nu ankommen, werden als Bytes verarbeitet, die Nushell automatisch in UTF-8 konvertieren versucht.
Wenn dies gelingt, wird ein Textstrom an den internen Befehl gesendet. Wenn nicht, wird ein Strom von binären Daten weitergeleitet.

Befehle wie [`lines`](commands/lines.md) helfen dabei, mit externen Daten zu arbeiten, da er diskrete Zeilen der Daten zurückgibt.

`externer_befehl_1 | externer_befehl_2`

Wird zwischen zwei externen Befehlen eine Pipeline aufgebaut, so verhaltet sich Nushell gleich wie es z.B. Bash tun würde.
Der `stdout` des externen_befehl_1 wiird mit dem `stdin` des externen_befehl_2 verbunden. Dies lässt die Daten natürlich zwischen den Befehlen fliessen.

## Hinter den Kulissen

Warum gibt dann der [`ls`](commands/ls.md) Befehl eine Tabelle zurück, wenn er doch ein Input ist und kein Output?
Nu fügt diesen Output automatisch hinzu, indem sie den Befehl [`table`](commands/table.md) verwendet.
Der [`table`](commands/table.md) Befehl wird an jede Pipeline angefügt, die keinen eigenen Output besitzen.
Dies erlaubt es den Output in dieser Form zu sehen. Tatsächlich ist der Befehl:

```
> ls
```

und die Pipeline,

```
> ls | table
```

ein und dasselbe.
