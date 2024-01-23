# Metadaten

Bei der Verwendung von Nu ist es Ihnen vielleicht schon einmal passiert, dass Sie das Gefühl hatten, dass hinter den Kulissen noch etwas anderes vor sich geht. Nehmen wir zum Beispiel an, Sie versuchen, eine Datei zu öffnen, die Nu unterstützt, und vergessen es dann und versuchen erneut, sie zu konvertieren:

```nu
> open Cargo.toml | from toml
error: Expected a string from pipeline
- shell:1:18
1 | open Cargo.toml | from toml
  |                   ^^^^^^^^^ requires string input
- shell:1:5
1 | open Cargo.toml | from toml
  |      ---------- object originates from here
```

Die Fehlermeldung sagt uns nicht nur, dass das, was wir [`from toml`](/commands/docs/from_toml.md) angegeben haben, keine Zeichenkette war, sondern auch, woher der Wert ursprünglich kam. Woher sollte es das wissen?

Werte, die in Nu durch eine Pipeline fließen, sind oft mit einer Reihe von zusätzlichen Informationen oder Metadaten versehen. Diese sind als Tags bekannt, ähnlich wie die Tags an einem Artikel in einem Geschäft. Diese Tags haben keinen Einfluss auf die Daten, aber sie bieten Nu eine Möglichkeit, die Arbeit mit diesen Daten zu verbessern.

Führen wir den Befehl [`open`](/commands/docs/open.md) noch einmal aus, aber dieses Mal schauen wir uns die Tags an, die er zurückgibt:

```nu
> metadata (open Cargo.toml)
╭──────┬───────────────────╮
│ span │ {record 2 fields} │
╰──────┴───────────────────╯
```

Derzeit verfolgen wir nur die Spanne, aus der die Werte stammen. Schauen wir uns das einmal genauer an:

```nu
> metadata (open Cargo.toml) | get span
╭───────┬────────╮
│ start │ 212970 │
│ end   │ 212987 │
╰───────┴────────╯
```

Die Bereiche "start" und "end" geben an, wo die Unterstreichung in der Zeile sein wird. Wenn Sie über 5 und dann bis 15 zählen, werden Sie sehen, dass die Zeile mit dem Dateinamen "Cargo.toml" übereinstimmt. So wusste der Fehler, den wir vorhin gesehen haben, was unterstrichen werden sollte.
