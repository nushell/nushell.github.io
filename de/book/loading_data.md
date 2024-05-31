# Laden von Daten

Im letzten Kapitel wurden Befehle wie [`ls`](/commands/docs/ls.md), [`ps`](/commands/docs/ps.md),
[`date`](/commands/docs/date.md), and [`sys`](/commands/docs/sys.md) vorgestellt um Informationen
über Dateien, Prozesse, Zeiten und die Systemumgebung selber zu laden.
Jeder Befehl ergibt eine Tabelle aus, mit der gearbeitet werden kann.
Es gibt jedoch noch andere Möglichkeiten Tabellen aus Daten zu erhalten.

## Dateien öffnen

Einer der mächtigsten Befehle in Nu um mir Daten zu arbeite ist der [`open`](/commands/docs/open.md) Befehl.
Er ist ein Multi-Werkzeug, welcher mit verschiedensten Datenformaten umgehen kann.
Hier zum Beispiel was passiert, wenn eine json Datei geöffnet wird:

@[code](@snippets/loading_data/vscode.sh)

Ähnlich wie beim [`ls`](/commands/docs/ls.md) Befehl, bekommen wir mehr als nur Text
(oder einen Stream von bytes) zurück, wenn wir einen Dateityp öffnen, den Nu versteht.
Hier wurde ein "package.json" von einem JavaScript Projekt geöffnet. Nu erkennt den json text
und parst die Daten in eine Tabelle.

Soll nur die Version aus dem Projekt angezeigt werden, kann mit dem [`get`](/commands/docs/get.md)
direkt diese Information herausgelesen werden.

```
> open editors/vscode/package.json | get version
1.0.0
```

Nu unterstützt aktuell die folgenden Formate um Daten direkt als Tabelle zu öffnen:

- csv
- eml
- ics
- ini
- json
- nuon
- ods
- ssv
- toml
- tsv
- url
- vcf
- xlsx / xls
- xml
- yaml / yml

Was aber passiert, wenn eine Text Datei geladen wird, die keinem der angegebenen Formate entspricht?

```
> open README.md
```

Die Datei wird wie gewohnt als Text ausgegeben.

Im Hintergrund sieht Nu eine reine Text Datei als einen grossen String.
Wie man mit einem String umgeht und die benötigten Daten herauszieht, steht im nächsten Kapitel.

## Mit Strings umgehen

Ein wichtiger Teil der Arbeit mit Nu ist es, mit externen Daten um zu gehen, die Nu nicht versteht.
Oft werden diese Daten als String repräsentiert.

Zum Beispiel wie in dieser Datei:

```
> open people.txt
Octavia | Butler | Writer
Bob | Ross | Painter
Antonio | Vivaldi | Composer
```

Jeder Datenpunkt ist durch ein pipe ('|') Symbol getrennt. Und jede Person steht auf einer
eigenen Zeile. Nu kennt standardmässig kein Dateiformat, welches pipe-getrennt ist,
weshalb diese Datei von Hand geparst werden muss.

Zuerst wird die Datei so geladen, dass jede Zeile für sich verarbeitet werden kann:

```
> open people.txt | lines
───┬──────────────────────────────
 0 │ Octavia | Butler | Writer
 1 │ Bob | Ross | Painter
 2 │ Antonio | Vivaldi | Composer
───┴──────────────────────────────
```

Dadurch wird bereits wieder eine Liste ausgegeben. Im nächsten Schritt sollen die Zeilen
in etwas brauchbares aufgeteilt werden.
Dafür verwenden wir den [`split`](/commands/docs/split.md) Befehl. Wie der Name schon verräht,
kann damit ein String durch ein Trennzeichen aufgesplittet oder aufgetrennt werden.
Mit dem `column` Unterbefehl wird der Inhalt über mehrere Spalten aufgeteilt.
Als Parameter reicht das Trennzeichen, der Rest ist automatisch:

```
> open people.txt | lines | split column "|"
───┬──────────┬───────────┬───────────
 # │ column1  │ column2   │ column3
───┼──────────┼───────────┼───────────
 0 │ Octavia  │  Butler   │  Writer
 1 │ Bob      │  Ross     │  Painter
 2 │ Antonio  │  Vivaldi  │  Composer
───┴──────────┴───────────┴───────────
```

Das sieht _fast_ korrekt aus.Es sieht so aus, als ob sich noch eine zusätzliche Lücke eingeschlichen hat.
Mit dem [`trim`](/commands/docs/str_trim.md) Befehl wird dieser beseitigt:

```
> open people.txt | lines | split column "|" | str trim
───┬─────────┬─────────┬──────────
 # │ column1 │ column2 │ column3
───┼─────────┼─────────┼──────────
 0 │ Octavia │ Butler  │ Writer
 1 │ Bob     │ Ross    │ Painter
 2 │ Antonio │ Vivaldi │ Composer
───┴─────────┴─────────┴──────────
```

Nicht schlecht. Der [`split`](/commands/docs/split.md) Befehl gibt nicht nur brauchbare Daten zurück,
sondern bezeichnet auch noch standardmässig die Spaltennamen:

```
> open people.txt | lines | split column "|" | str trim | get column1
───┬─────────
 0 │ Octavia
 1 │ Bob
 2 │ Antonio
───┴─────────
```

Die Spalten können jedoch auch benannt werden:

```
> open people.txt | lines | split column "|" first_name last_name job | str trim
───┬────────────┬───────────┬──────────
 # │ first_name │ last_name │ job
───┼────────────┼───────────┼──────────
 0 │ Octavia    │ Butler    │ Writer
 1 │ Bob        │ Ross      │ Painter
 2 │ Antonio    │ Vivaldi   │ Composer
───┴────────────┴───────────┴──────────
```

Jetzt da die Daten in einer Tabelle sind, können alle Befehle, die wir davor schon auf Tabellen
angewendet haben wiederverwenden:

```
> open people.txt | lines | split column "|" first_name last_name job | str trim | sort-by first_name
───┬────────────┬───────────┬──────────
 # │ first_name │ last_name │ job
───┼────────────┼───────────┼──────────
 0 │ Antonio    │ Vivaldi   │ Composer
 1 │ Bob        │ Ross      │ Painter
 2 │ Octavia    │ Butler    │ Writer
───┴────────────┴───────────┴──────────
```

Weitere Befehle, mit denen Texte aus Strings bearbeitet werden können sind:

- `str`
- [`lines`](/commands/docs/lines.md)
- ~~`size`~~

Es gibt ausserdem einige Hilfsbefehle, die verwendet werden können um mit Daten umzugehen,
die Nu eigentlich verstehen sollte. Zum Beispiel wenn eine Rust lock Datei geöffnet wird:

```
> open Cargo.lock
# This file is automatically @generated by Cargo.
# It is not intended for manual editing.
[[package]]
name = "adhoc_derive"
version = "0.1.2"
```

Eine "Cargo.lock" Datei ist eigentlich eine .toml Datei, aber die Dateiendung ist nicht .toml.
Das ist ok, denn mit dem `from` und seinem Unterbefehl `toml` können wir dies explizit angeben:

@[code](@snippets/loading_data/cargo-toml.sh)

Der `from` Befehl kann für jedes strukturierte Datenformat, welches Nu versteht, verwendet werden,
indem das Format als entsprechender Unterbefehl verwendet wird.

## Öffnen im raw Modus

Auch wenn es hilfreich ist, beim Öffnen einer Datei direkt eine Tabelle zu erhalten,
ist dies nicht immer gewünscht. Um den darunter liegenden Text zu erhalten, kann dem
[`open`](/commands/docs/open.md) Befehl das Flag `--raw` mitgegeben werden:

```
> open Cargo.toml --raw
[package]                                                                                        name = "nu"
version = "0.1.3"
authors = ["Yehuda Katz <wycats@gmail.com>", "Sophia Turner <547158+sophiajt@users.noreply.github.com>"]
description = "A shell for the GitHub era"
license = "MIT"
```

## URLs abrufen

Zusätzlich zum Laden von Dateien vom Dateisystem, können auch URLs mit dem [`http get`](/commands/docs/http_get.md)
Befehl geladen werden. Dies wird den Inhalt der URL aus dem Netz abrufen und zurückgeben:

@[code](@snippets/loading_data/rust-lang-feed.sh)
