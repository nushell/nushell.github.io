# Variablen und Unterausdrücke

Es gibt zwei Arten von auszuwertenden Ausdrücken in Nushell: Variablen und Unterausdrücke. Diese werden durch das Dollar Symbol (`$`) eingeleitet. Das gibt den Hinweis, dass Nushell an dieser Stelle einen Ausdruck auswerten muss, um einen Wert zu erhalten, der für die Ausführung eines gesamten Befehls benötigt wird. Beide Formen des Ausdrucks haben eine einfache Variante und eine 'Pfad'-Variante, wenn mit komplexeren Daten gearbeitet wird.

## Variablen

Die einfachere Variante der auszuwertenden Ausdrücke ist die Variable. Während der Auswertung, wird die Variable durch ihren Wert ersetzt.

Wenn eine Variable erzeugt wurde, kann der Inhalt dieser Variable ausgegeben werden, indem `$` vor dem Variablennamen verwendet wird:

```
let my_value = 4
echo $my_value
# => 4
```

## Pfade von Variablen

Ein Pfad einer Variable funktioniert ähnlich wie ein strukturierter Datentyp. Es kann mittels Referenzen auf den Inhalt der Variable beziehungsweise die Spalten in der Variable zugegriffen werden, um final bei einem bestimmten Wert zu landen. Wenn beispielsweise anstatt der `4` im obigen Beispiel, der Variablen eine Tabelle zugewiesen wurde:

```
let my_value = [[name]; [testuser]]
```

Hier kann ein Pfad der Variable `$my_value` verwendet werden, um den Wert der Spalte `name` in nur einem Schritt zu bekommen:

```
echo $my_value.name
# => testuser
```

## Unterausdrücke

Unterausdrücke können jederzeit ausgewertet und die Ergebnisse verwendet werden, indem der Ausdruck in Klammern `()` gepackt wird. Hinweis: In älteren Versionen von Nushell (älter als 0.32) wurde `$()` benutzt.

Die Klammern enthalten eine Pipeline, die bis zum Ende durchlaufen wird und deren Ergebnis dann verwendet wird. Hier einige Beispiele: `(ls)` würde den `ls` Befehl ausführen und die entsprechende Tabelle zurückgeben und `(git branch --show-current)` führt den externen Befehl `git` aus und gibt einen String mit dem Namen des aktuellen Branch zurück. Diese Klammern können auch verwendet werden, um mathematische Ausdrücke, wie `(2 + 3)`, auszuwerten.

Unterausdrücke können auch ganze Pipelines statt nur einzelner Befehle enthalten. Um eine Liste von Dateien mit einer Größe größer als 10 Kilobytes zu bekommen, kann die folgende Pipeline verwendet und einer Variable zugewiesen werden:

```
let names_of_big_files = (ls | where size > 10kb)
echo $names_of_big_files
# => ───┬────────────┬──────┬──────────┬──────────────
# =>  # │    name    │ type │   size   │   modified
# => ───┼────────────┼──────┼──────────┼──────────────
# =>  0 │ Cargo.lock │ File │ 155.3 KB │ 17 hours ago
# =>  1 │ README.md  │ File │  15.9 KB │ 17 hours ago
# => ───┴────────────┴──────┴──────────┴──────────────
```

## Unterausdrücke und Pfade

Unterausdrücke unterstützen auch Pfade. Um beispielsweise eine Liste der Dateinamen im aktuellen Ordner zu bekommen, kann diese Pipeline verwendet werden:

```
ls | get name
```

Dasselbe Ergebnis kann auch in nur einem Schritt erreicht werden, indem ein Unterausdruck mit Pfad verwendet wird:

```
echo (ls).name
```

Welcher Stil gewählt wird, hängt vom Anwendungsfall und den persönlichen Vorlieben ab.

## Short-hand Unterausdrücke

Nushell erlaubt den Zugriff auf Spalten in Tabellen in Unterausdrücken durch einfache Short-Hands. Wenn beispielsweise nur Zeilen in `ls` angezeigt werden sollen, in der die Größe der Datei größer als 10 Kilobytes ist, kann der folgende Befehl verwendet werden:

```
ls | where size > 10kb
```

`where size > 10kb` ist ein Befehl mit zwei Teilen: Dem Befehlsnamen `where` und dem short-hand Ausdruck `size > 10kb`. Hier wird auch klar, warum das Ganze short-hand heißt: `size` ist hier die gekürzte Version von `$it.size`. Das Ganze könnte auch mit einer der folgenden ausführlicheren Varianten erreicht werden:

```
ls | where $it.size > 10kb
ls | where ($it.size > 10kb)
ls | where {|$it| $it.size > 10kb }
```

Damit diese short-hand Syntax funktioniert, muss der Name der Spalte auf der linken Seite der Operation sein (wie bei `size` in `size > 10kb`).
