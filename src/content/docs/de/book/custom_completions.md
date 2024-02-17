---
title: Eigene Vervollständigungen
---

Eigene Vervollständigungen kombinieren zwei Merkmale von Nushell:
Eigene Befehle und Vervollständigungen. Mit ihnen können Befehle erzeugt werden,
die Vervollständigungen für Positions- sowie Markierungs-Argumente enthalten.
Die eigenen Vervollständigungen funktionieren für eigene Befehle und [bekannt gemachte externe Befehle (via `extern`)](externs.md).

Eigene Vervollständigungen bestehen aus zwei Teilen:
Dem Befehl, der die Vervollständigung bereitstellt, und die Verknüpfung mit dem Argument des Befehls, der die Vervollständigung bekommt, mit Hilfe von `@`.

## Beispiel eigene Vervollständigung

Hier ein Beispiel:

```
> def tiere [] { ["katze", "hund", "aal" ] }
> def my-command [tier: string@tiere] { print $tier }
>| my-command
katze                 hund                 aal
```

In der ersten Zeile wird ein eigener Befehl erstellt, der eine Liste von drei verschiedenen Tieren zurückgibt.
Dies sind die Werte, die in der Vervollständigung verwendent werden. Ist dieser Befehl erstellt, kann er für weitere Vervollständigungen von Befehlen und [`extern`](/commands/docs/extern.md) verwendet werden.

In der zweiten Zeile, wird `string@tiere` verwendet.
Dies sagt Nushell zwei Dinge:
Die Form des Arguments um den Typ überprüfen zu können, sowie die Vervollständigung, falls der Benutzer diese an der Stelle verwenden möchte.

Auf der dritten Zeile wird der Name des zu vevollständigenden Befehls `my-command` eingegeben gefolgt von der `<tab>` Taste. Dies führt die Vervollständigung aus. Eigene Vervollständigungen funktionieren identisch zu anderen Vervollständigungen. Wird `a` gefolgt von der `<tab>` Taste gedrückt, wird automatisch "aal" ausgegeben.

## Module und eigene Vervollständigung

Es empfiehlt sich die eigenen Vervollständigungen von der öffentlichen API zu trennen. Dafür bieten sich Module an.

Hier das Beispiel von oben in einem Modul:

```
module commands {
    def tiere [] {
        ["katze", "hund", "aal" ]
    }

    export def my-command [tier: string@tiere] {
        print $tier
    }
}
```

In diesem Modul wird nur der Befehl `my-command`, aber nicht die Vervollständigung `tiere` exportiert. Dies erlaubt es den Befehl auszuführen, sowie die Vervollständigung zu verwenden, ohne auf die eigene Vervollständigung Zugriff zu haben.
Dies hält die API sauberer und bietet dennoch alle Funktionen an.

Dies ist möglich, weil die Vervollständigungen mit dem Marker `@` zusammen mit dem Befehl eingeschlossen werden.

## Kontextsensitive eigene Vervollständigungen

Es ist möglich den Kontext einer Vervollständigung mit zu geben. Dies ist nützlich, wenn vorangehende Argumente in die Vervollständigung mit einbezogen werden müssen.

Bezogen auf das obige Beispiel sieht dies so aus:

```
module commands {
    def tiere [] {
        ["katze", "hund", "aal" ]
    }

    def tier-name [context: string] {
        {
            katze: ["Missy", "Phoebe"]
            hund: ["Lulu", "Enzo"]
            aal: ["Eww", "Slippy"]
        } | get -i ($context | split words | last)
    }

    export def my-command [
        tier: string@tiere
        name: string@tier-name
    ] {
        print $"Als ($tier) heisse ich ($name)."
    }
}
```

Der Befehl `tier-name` gibt die entsprechende Liste der Namen zurück. Dies funktioniert, weil der Wert der `$context` Variablen, dem Text entspricht, der bis zu dem Zeitpunkt eingegeben wurde.

```
>| my-command
katze                 hund                 aal
>| my-command hund
Lulu                Enzo
>my-command hund enzo
Als hund heisse ich Enzo
```

Auf der zweiten Zeile wird, sobald die `<tab>` Taste gedrückt wurde, das Argument `"my-command hund"` dem `tier-namen` Kontext übergeben.

## Eigene Vervollständigungen und [`extern`](/commands/docs/extern.md)

Sehr mächtig ist die Kombination von eigenen Vervollständigungen mit [externen Befehlen](externs.md). Diese funktionieren gleich wie die Vervollständigungen zu eigenen Befehlen:
Erstellen der Vervollständigung und anbinden an ein Positions- oder Markierungs-Argument des `extern` mit dem `@` Zeichen.

In der Default Konfiguration finden sich ebenfalls Vervollständigungen:

```
export extern "git push" [
    remote?: string@"nu-complete git remotes",  # the name of the remote
    refspec?: string@"nu-complete git branches" # the branch / refspec
    ...
]
```

Die Vervollständigung erfüllt hier die gleiche Rolle wie in den Beispielen zuvor. Es werden zwei verschiedene Vervollständigungen verwendet, abhängig von der Position, die bisher eingegeben wurde.

## Eigene Beschreibungen

Alternativ zu einer Liste von Strings, kann eine Vervollständigung auch einen Record aus einem `value` und einer `description` zurückgeben.

```
def my_commits [] {
    [
        { value: "5c2464", description: "Add .gitignore" },
        { value: "f3a377", description: "Initial commit" }
    ]
}
```

> **Notiz**
>
> Mit dem folgenden Schnippsel:
>
> ```nu
> def my-command [commit: string@my_commits] {
>     print $commit
> }
> ```
>
> aufgepasst, auch wenn die Vervollständigung folgendes zeigt
>
> ```nu
> >_ my-command <TAB>
> 5c2464  Add .gitignore
> f3a377  Initial commit
> ```
>
> nur die Werte, hier "5c2464" und "f3a377", werden in Befehls Argumenten verwendet!

## Extere Vervollständigungen

Externe Vervollständigungen können ebenfalls integriert werden, anstatt derer von Nushell.

Dafür muss dem Feld `external_completer` in `config.nu` eine [closure](/book/types_of_data.md#closures)) übergeben werden, welche ausgewertet wird, wenn keine Nushell Vervollständigungen gefunden werden.

```nu
> $env.config.completions.external = {
>     enable: true
>     max_results: 100
>     completer: $completer
> }
```

Die Closure kann konfiguriert werden, einen externen Vervollständiger wie [carapace](https://github.com/rsteube/carapace-bin) zu verwenden.

Wenn die Closure einen nicht lesbaren Wert (z.B. einen leeren String) zurückgibt, fällt Nushell auf die Datei Vervollständigung zurück.

Ein externer Vervollständiger ist eine Funktion, die den aktuellen Befehl als String Liste entgegennimmt, und eine Liste von Records mit `value` und `description` zurückgibt. Wie bei eigenen Nushell Vervollständigungen.

> **Notiz**
> Diese Closure nimmt den aktuellen Befehl als Liste entgegen. Zum Beispiel, wird `my-command --arg1 <tab>` als Vervollständigung `[my-command --arg1 " "]` erhalten.

Dieses Beispiel wird die externe Vervollständigung für carapace erstellen:

```nu
let carapace_completer = {|spans|
    carapace $spans.0 nushell $spans | from json
}
```

[Mehr Beispiele für eigene Vervollständigungen können im Kochbuch gefunden werden](../cookbook/external_completers.md).
