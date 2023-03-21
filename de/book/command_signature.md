# Befehls Signatur

Nu Befehle enthalten einen Signatur Abschnitt. Zum Beispiel wie hier in [`str distance`](/commands/docs/str_distance.md):

```
Signatures(Cell paths are supported):
  <string> | str distance <string> -> <int>
```

Der erste Typenname vor dem `|` beschreibt den Typ der Eingangs-Pipeline. Nach dem Befehlsnamen folgt der benötigte Arguments Typ. Der Output-Typ ist in diesem Falle `int` und wird nach dem `->` ausgegeben.
`(Cell paths are supported)` zeigt an, dass Zell Pfade angegeben werden können für `str distance`. So kann in einer verschachtelten Struktur oder Tabelle einem Zell Pfad eine Operation hinzugefügt und wie hier der Spaltenname ersetzt werden: `ls | str distance 'nushell' 'name'`

Hier ein weiteres Beispiel, [`str join`](/commands/docs/str_join.md):

```
Signatures:
  list<string> | str join <string?> -> <string>
```

Hier bedeutet die Signatur von [`str join`](/commands/docs/str_join.md), dass eine Liste von Texten als Eingang erwartet wird. Der Befehl nimmt ausserdem optionale `string` Typ Argumente entgegen. Schliesslich wird ein `string` als Output generiert.

Einige Befehle akzeptieren oder benötigen keine Daten in einer Pipeline, weshalb ihr Input-Typ `<nothing>` sein wird.
Dies gilt auch, wenn der Output Typ `null` zurückgiebt (e.g. [`rm`](/commands/docs/rm.md)).
