# Mit Tabellen arbeiten

Eine der häufigsten Arten mit Daten zu arbeiten geschieht in Nu durch Tabelle. Nu stellt diverse Befehle zur Verfügung,
um mit Tabelle auf einfache Art die Daten zu finden und zu filtern, die benötigt werden.

Um zu starten, wird eine Tabelle benötigt wie diese:

```nu
ls
# => ───┬───────────────┬──────┬─────────┬────────────
# =>  # │ name          │ type │ size    │ modified
# => ───┼───────────────┼──────┼─────────┼────────────
# =>  0 │ files.rs      │ File │  4.6 KB │ 5 days ago
# =>  1 │ lib.rs        │ File │   330 B │ 5 days ago
# =>  2 │ lite_parse.rs │ File │  6.3 KB │ 5 days ago
# =>  3 │ parse.rs      │ File │ 49.8 KB │ 1 day ago
# =>  4 │ path.rs       │ File │  2.1 KB │ 5 days ago
# =>  5 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
# =>  6 │ signature.rs  │ File │  1.2 KB │ 5 days ago
# => ───┴───────────────┴──────┴─────────┴────────────
```

## Daten sortieren

Um eine Tabelle zu sortieren, wird der [`sort-by`](/commands/docs/sort-by.md) Befehl verwendet, dem mitgeteilt wird, nach welcher Spalte sortiert werden soll.
Hier wird sortiert nach der Grösse der Dateien:

```nu
ls | sort-by size
# => ───┬───────────────┬──────┬─────────┬────────────
# =>  # │ name          │ type │ size    │ modified
# => ───┼───────────────┼──────┼─────────┼────────────
# =>  0 │ lib.rs        │ File │   330 B │ 5 days ago
# =>  1 │ signature.rs  │ File │  1.2 KB │ 5 days ago
# =>  2 │ path.rs       │ File │  2.1 KB │ 5 days ago
# =>  3 │ files.rs      │ File │  4.6 KB │ 5 days ago
# =>  4 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
# =>  5 │ lite_parse.rs │ File │  6.3 KB │ 5 days ago
# =>  6 │ parse.rs      │ File │ 49.8 KB │ 1 day ago
# => ───┴───────────────┴──────┴─────────┴────────────
```

Es kann nach allen Spalten sortiert werden, die einen Vergleich erlauben.
Das Beispiel oben hätte auch nach "name", "accessed" oder "modified" sortiert werden können.

## Die benötigten Daten auswählen

Von einer Tabelle können einzelne Spalten und Zeilen ausgewählt werden.
Mit dem [`select`](/commands/docs/select.md) Befehl werden hier einige Spalten gewählt.

```nu
ls | select name size
# => ───┬───────────────┬─────────
# =>  # │ name          │ size
# => ───┼───────────────┼─────────
# =>  0 │ files.rs      │  4.6 KB
# =>  1 │ lib.rs        │   330 B
# =>  2 │ lite_parse.rs │  6.3 KB
# =>  3 │ parse.rs      │ 49.8 KB
# =>  4 │ path.rs       │  2.1 KB
# =>  5 │ shapes.rs     │  4.7 KB
# =>  6 │ signature.rs  │  1.2 KB
# => ───┴───────────────┴─────────
```

Damit wird eine Tabelle kreiert, die sich auf das Wesentliche beschränkt.
Als nächstes sollen nur die 5 kleinsten Dateien aus diesem Verzeichnis enthalten sein:

```nu
ls | sort-by size | first 5
# => ───┬──────────────┬──────┬────────┬────────────
# =>  # │ name         │ type │ size   │ modified
# => ───┼──────────────┼──────┼────────┼────────────
# =>  0 │ lib.rs       │ File │  330 B │ 5 days ago
# =>  1 │ signature.rs │ File │ 1.2 KB │ 5 days ago
# =>  2 │ path.rs      │ File │ 2.1 KB │ 5 days ago
# =>  3 │ files.rs     │ File │ 4.6 KB │ 5 days ago
# =>  4 │ shapes.rs    │ File │ 4.7 KB │ 5 days ago
# => ───┴──────────────┴──────┴────────┴────────────
```

Zuerst wird die Tabelle nach grösse sortiert, um die kleinsten Dateien zuoberst zu erhalten, danach werden mit `first 5` die ersten 5 Zeilen ausgegeben.

Mit `skip` können ebenfalls Zeilen entfernt werden, die unerwünscht sind. Hier die ersten 2 der 5 aus dem obigen Beispiel:

```nu
ls | sort-by size | first 5 | skip 2
# => ───┬───────────┬──────┬────────┬────────────
# =>  # │ name      │ type │ size   │ modified
# => ───┼───────────┼──────┼────────┼────────────
# =>  0 │ path.rs   │ File │ 2.1 KB │ 5 days ago
# =>  1 │ files.rs  │ File │ 4.6 KB │ 5 days ago
# =>  2 │ shapes.rs │ File │ 4.7 KB │ 5 days ago
# => ───┴───────────┴──────┴────────┴────────────
```

So konnten die 3 Zeilen extrahiert werden, die uns interessieren.

In allen Tabellen sind die Zeilen nummeriert. Dies ermöglicht eine einfache Art, die einzelnen Zeilen verwenden zu können.
Im folgenden wird zuerst nach dem Namen sortiert, und dann die 5. Zeile mit dem `select` Befehl über die Zeilennummer ausgewählt:

```nu
ls | sort-by name
# => ───┬───────────────┬──────┬─────────┬────────────
# =>  # │ name          │ type │ size    │ modified
# => ───┼───────────────┼──────┼─────────┼────────────
# =>  0 │ files.rs      │ File │  4.6 KB │ 5 days ago
# =>  1 │ lib.rs        │ File │   330 B │ 5 days ago
# =>  2 │ lite_parse.rs │ File │  6.3 KB │ 5 days ago
# =>  3 │ parse.rs      │ File │ 49.8 KB │ 1 day ago
# =>  4 │ path.rs       │ File │  2.1 KB │ 5 days ago
# =>  5 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
# =>  6 │ signature.rs  │ File │  1.2 KB │ 5 days ago
# => ───┴───────────────┴──────┴─────────┴────────────

ls | sort-by name | select 5
# => ───┬───────────────┬──────┬─────────┬────────────
# =>  # │ name          │ type │ size    │ modified
# => ───┼───────────────┼──────┼─────────┼────────────
# =>  0 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
# => ───┴───────────────┴──────┴─────────┴────────────
```

## Daten aus der Tabelle herausziehen

Bisher wurde die Tabelle auf die benötigten Inhalte getrimmt.
Im nächsten Schritt soll angeschaut werden, wie wir den Inhalt anstelle der Tabelle herausziehen können.
Zum Beispiel wenn eine Liste der Namen aller Dateien erstellt werden soll. Dafür steht der [`get`](/commands/docs/get.md) Befehl bereit:

```nu
ls | get name
# => ───┬───────────────
# =>  0 │ files.rs
# =>  1 │ lib.rs
# =>  2 │ lite_parse.rs
# =>  3 │ parse.rs
# =>  4 │ path.rs
# =>  5 │ shapes.rs
# =>  6 │ signature.rs
# => ───┴───────────────
```

Damit erhalten wir die Werte aller Dateinamen als Liste.

Dies sieht fast so aus, wie der [`select`](/commands/docs/select.md) Befehl weiter oben, deshalb hier die beiden nebeneinander:

```nu
ls | select name
# => ───┬───────────────
# =>  # │ name
# => ───┼───────────────
# =>  0 │ files.rs
# =>  1 │ lib.rs
# =>  2 │ lite_parse.rs
# =>  3 │ parse.rs
# =>  4 │ path.rs
# =>  5 │ shapes.rs
# =>  6 │ signature.rs
# => ───┴───────────────
```

Diese sehen wirklich sehr ähnlich aus! Was also ist der Unterschied:

- [`select`](/commands/docs/select.md) - generiert eine Tabelle, die nur die gewünschten Spalten enhält
- [`get`](/commands/docs/get.md) - gibt den Inhalt der angegebenen Spalte als Liste zurück

Einen Weg, diese zwei auseinander zu halten ist, dass die Spaltennamen fehlen, was bedeutet, es muss sich um eine Liste handeln.
Der [`get`](/commands/docs/get.md) geht noch einen Schritt weiter und verwendet Pfade um auf tiefer liegende Strukturen zugreifen zu können,
wie man sie z.B. in einer .json Datei findet.

## Daten einer Tabelle ändern

Zusätzlich zum Auswählen von Daten in einer Tabelle, kann auch deren Inhalt geändert werden.
Tabellen können kombiniert werden, neue Spalten hinzugefügt, oder Werte verändert werden.
In Nu wird dadurch nicht die Tabelle direkt geändert, sondern jeder Befehl generiert eine neue Tabelle in der Pipeline.

### Tabellen zusammenführen

Mit [`append`](/commands/docs/append.md) können Spalten gleichen Namens zusammengeführt werden:

```nu
let $first = [[a b]; [1 2]]
let $second = [[a b]; [3 4]]
$first | append $second
# => ───┬───┬───
# =>  # │ a │ b
# => ───┼───┼───
# =>  0 │ 1 │ 2
# =>  1 │ 3 │ 4
# => ───┴───┴───
```

### Tabellen mergen

Mit dem [`merge`](/commands/docs/merge.md) Befehl werden zwei oder mehr Tabellen zusammengeführt.

```nu
let $first = [[a b]; [1 2]]
let $second = [[c d]; [3 4]]
$first | merge { $second }
# => ───┬───┬───┬───┬───
# =>  # │ a │ b │ c │ d
# => ───┼───┼───┼───┼───
# =>  0 │ 1 │ 2 │ 3 │ 4
# => ───┴───┴───┴───┴───
```

Wird eine dritte Tabelle generiert:

```nu
let $third = [[e f]; [5 6]]
```

Können nun alle drei Tabellen zusammengeführt werden wie hier:

```nu
$first | merge { $second } | merge { $third }
# => ───┬───┬───┬───┬───┬───┬───
# =>  # │ a │ b │ c │ d │ e │ f
# => ───┼───┼───┼───┼───┼───┼───
# =>  0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6
# => ───┴───┴───┴───┴───┴───┴───
```

Oder mit dem [`reduce`](/commands/docs/reduce.md) Befehl alle dynamisch gemerged:

```nu
[$first $second $third] | reduce {|elt, acc| $acc|merge { $elt }}
# => ───┬───┬───┬───┬───┬───┬───
# =>  # │ a │ b │ c │ d │ e │ f
# => ───┼───┼───┼───┼───┼───┼───
# =>  0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6
# => ───┴───┴───┴───┴───┴───┴───
```

### Eine Spalte hinzufügen

Mit dem [`insert`](/commands/docs/insert.md) Befehl wird eine neue Spalte hinzugefügt.
Wie zum Beispiel:

```nu
open rustfmt.toml
# => ─────────┬──────
# =>  edition │ 2018
# => ─────────┴──────
```

wird eine Spalte namens "next_edition" mit dem Wert 2021 hinzugefügt:

```nu
open rustfmt.toml | insert next_edition 2021
# => ──────────────┬──────
# =>  edition      │ 2018
# =>  next_edition │ 2021
# => ──────────────┴──────
```

Öffnen wir die originale Datei erneut, bleibt der Inhalt der alte:

```nu
open rustfmt.toml
# => ─────────┬──────
# =>  edition │ 2018
# => ─────────┴──────
```

Änderungen in Nu sind funktionale Änderungen, was bedeutet, dass Werte geändert werden, ohne permanente Änderungen zu bewirken.
Es ist deshalb möglich, mehrere Änderungen in der Pipeline vorzunehmen, bevor diese bereit sind um gesichert zu werden.
Zum Sichern können wir, wie in diesem Beispiel, den [`save`](/commands/docs/save.md) Befehl verwenden:

```nu
open rustfmt.toml | insert next_edition 2021 | save rustfmt2.toml
open rustfmt2.toml
# => ──────────────┬──────
# =>  edition      │ 2018
# =>  next_edition │ 2021
# => ──────────────┴──────
```

### Eine Spalte updaten

Ähnlich dem [`insert`](/commands/docs/insert.md) Befehl, kann mit [`update`](/commands/docs/update.md) der Inhalt einer Spalte geändert werden.
Auf die selbe Datei angewendet, sieht das so aus:

```nu
open rustfmt.toml
# => ─────────┬──────
# =>  edition │ 2018
# => ─────────┴──────
```

Und nun das Update auf die nächste Edition, die unterstützt werden soll:

```nu
open rustfmt.toml | update edition 2021
# => ─────────┬──────
# =>  edition │ 2021
# => ─────────┴──────
```

Mit dem [`upsert`](/commands/docs/upsert.md) Befehl wird der Wert enweder eingefügt oder updatet abhängig davon, ob er bereits existriet.

### Spalten verschieben

Mit [`move`](/commands/docs/move.md) werden Spalten in de Tabelle verschoben. Um zum Bespiel die Spalte "name" von "ls" nach der Spalte "size"
erschienen zu lassen, schreibt man:

```nu
ls | move name --after size
# => ╭────┬──────┬─────────┬───────────────────┬──────────────╮
# => │ #  │ type │  size   │       name        │   modified   │
# => ├────┼──────┼─────────┼───────────────────┼──────────────┤
# => │  0 │ dir  │   256 B │ Applications      │ 3 days ago   │
# => │  1 │ dir  │   256 B │ Data              │ 2 weeks ago  │
# => │  2 │ dir  │   448 B │ Desktop           │ 2 hours ago  │
# => │  3 │ dir  │   192 B │ Disks             │ a week ago   │
# => │  4 │ dir  │   416 B │ Documents         │ 4 days ago   │
# => ...
```

### Spalten umbenennen

Um Spalten einen neuen Name zu geben, wird der Befehl [`rename`](/commands/docs/rename.md) verwendet.
Wie zum Beispiel hier nach der Verwendung von `ls`.

```nu
ls | rename filename filetype filesize date
# => ╭────┬───────────────────┬──────────┬──────────┬──────────────╮
# => │ #  │     filename      │ filetype │ filesize │     date     │
# => ├────┼───────────────────┼──────────┼──────────┼──────────────┤
# => │  0 │ Applications      │ dir      │    256 B │ 3 days ago   │
# => │  1 │ Data              │ dir      │    256 B │ 2 weeks ago  │
# => │  2 │ Desktop           │ dir      │    448 B │ 2 hours ago  │
# => │  3 │ Disks             │ dir      │    192 B │ a week ago   │
# => │  4 │ Documents         │ dir      │    416 B │ 4 days ago   │
...
```
