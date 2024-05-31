# Überlagerungen


Überlagerungen operieren als "Schichten" von Definitionen (Eigene Befehle, Aliase, Umgebungsvariablen),
welche aktiviert und deaktiviert werden können.
Sie gleichen den virtuellen Umgebungen wie man sie von Sprachen wie Python kennt.

_Note: Zum Verständnis von Überlagerungen emphielt es sich [Modules (EN)](/book/modules.md) zuerst zu lesen, da es auf ihnen aufbaut._

## Basis

Nushell kommt zuerst mit einer Standard-Überlagerung die sich `zero` nennt.
Welche Überlagerungen aktiv sind, kann mit dem Befehl [`overlay list`](/commands/docs/overlay_list.md) ermittelt werden.
Am Anfang sollte dort der die Standard-Überlagerung gelistet sein.

Um eine neue Überlagerung zu kreieren, wird zuerst ein Modul benötigt:

```
> module spam {
    export def foo [] {
        "foo"
    }

    export alias bar = "bar"

    export-env {
        load-env { BAZ: "baz" }
    }
}
```

Dieses Modul wird im ganzen Kapitel verwendet, also wenn immer `overlay use spam` steht, dann ist mit `spam` dieses Modul gemeint.

Um die Überlagerung zu generieren, wird [`overlay use`](/commands/docs/overlay_use.md) aufgerufen:

```
> overlay use spam

> foo
foo

> bar
bar

> $env.BAZ
baz

> overlay list
───┬──────
 0 │ zero
 1 │ spam
───┴──────
```

Dies hat die Definition des Moduls in den aktuellen Gültigkeitsbereich gebracht und den [`export-env`](/commands/docs/export-env.md) Block ausgewertet.
Genau so wie dies auch der [`use`](/commands/docs/use.md) Befehl tut. (see [Modules (EN)](/book/modules.md#environment-variables) chapter)

::: tip
Im folgenden Abschnitt wird der `>` prompt mit dem Namen des zuletzt aktivierten Überlagerung vorangestellt.
`(spam)> some-command` bedeutet, die `spam` Überlagerung ist die zuletzt aktive Überlagerung wenn der Befehl eingegeben wurde.
:::

## Eine Überlagerung entfernen

Wenn die Überlagerung nicht mehr benötigt wird, entfernt sie der Befehl [`overlay hide`](/commands/docs/overlay_hide.md):

```
(spam)> overlay hide spam

(zero)> foo
Error: Can't run executable...

(zero)> overlay list
───┬──────
 0 │ zero
───┴──────
```

Überlagerungen haben ebenfalls einen Gültigkeitsbereich.
Jede hinzugefügte Überlagerung wird entfernt, wenn der Gütligkeitsbereich endet:

```
(zero)> do { overlay use spam; foo }  # Überlagerung ist aktiv innerhalb des Blocks
foo

(zero)> overlay list
───┬──────
 0 │ zero
───┴──────
```

Wird der Befehl [`overlay hide`](/commands/docs/overlay_hide.md) ohne Argument aufgerufen, so wird die zuletzt aktivierte Überlagerung entfernt.

## Überlagerungen sind aufgezeichnet

Eine neue Definition (Befehl, Alias, Umgebungsvariable) wird in der zuletzt aktivierten Überlagerung aufgezeichnet:

```
(zero)> overlay use spam

(spam)> def eggs [] { "eggs" }
```

Der `eggs` Befehl gehört zur `spam` Überlagerung.
Wird diese entfernt, ist auch der Befehl nicht mehr aufrufbar:

```
(spam)> overlay hide spam

(zero)> eggs
Error: Can't run executable...
```

Er ist jedoch nicht verloren!

```
(zero)> overlay use spam

(spam)> eggs
eggs
```

Überlagerungen speichern die Informationen, die ihnen übergeben werden, auch wenn die Überlagerung entfernt wird.
So kann mehrfach zwischen verschiedenen Kontexten gewechselt werden.

::: tip
Es gibt Momente, in denen Definitionen nicht zu einer Überlagerung hinzugefügt werden sollen.
Die Lösung dafür ist, eine leere Überlagerung zu erstellen und die Definitionen temporär nur dort zu speichern:

```
(zero)> overlay use spam

(spam)> module scratchpad { }

(spam)> overlay use scratchpad

(scratchpad)> def eggs [] { "eggs" }
```

Der `eggs` Befehl wird zu `scratchpad` hinzugefügt, während `spam` intakt bleibt.

Um dies weniger wortreich zu machen, reicht der Befehl [`overlay new`](/commands/docs/overlay_new.md):

```
(zero)> overlay use spam

(spam)> overlay new scratchpad

(scratchpad)> def eggs [] { "eggs" }
```

:::

## Vorangestellte Überlagerungen

Der [`overlay use`](/commands/docs/overlay_use.md) Befehl übernimmt alle Befehle und Aliase des Moduls und fügt sie seinem Namensbereich hinzu.
Sie können jedoch auch als Unterbefehl hinter dem Modulnamen stehen.
Dafür ist das `--prefix` Argument da:

```
(zero)> module spam {
    export def foo [] { "foo" }
}

(zero)> overlay use --prefix spam

(spam)> spam foo
foo
```

Dies gilt jedoch nicht für Umgebungsvariablen.

## Eine Überlagerung umbenennen

Der Name einer Überlagerung kann mit `as` geändert werden:

```
(zero)> module spam { export def foo [] { "foo" } }

(zero)> overlay use spam as eggs

(eggs)> foo
foo

(eggs)> overlay hide eggs

(zero)>
```

Dies kann sinnvoll sein, wenn ein generischer Skript Name einer virtuellen Umgebung wie `activate.nu` verwendet wird,
um dieser einen Namen zu geben, der sie besser beschreibt.

## Definitionen behalten

Manchmal ist es nicht gewünscht, dass Definitionen, die in einer Überlagerungen gemacht wurden, verloren gehen, wenn diese entfernt wird:

```
(zero)> overlay use spam

(spam)> def eggs [] { "eggs" }

(spam)> overlay hide --keep-custom spam

(zero)> eggs
eggs
```

Das `--keep-custom` Argument macht genau das.

Es ist auch möglich, eine Liste von Umgebungsvariablen, welche in der Überlagerung definiert wurden, zu behalten, und den Rest zu entfernen.
Dafür wird das `--keep-env` Argument verwendet:

```
(zero)> module spam {
    export def foo [] { "foo" }
    export-env { $env.FOO = "foo" }
}

(zero)> overlay use spam

(spam)> overlay hide spam --keep-env [ FOO ]

(zero)> foo
Error: Can't run executable...

(zero)> $env.FOO
foo
```

## Überlagerungen ordnen

Überlagerungen sind wie ein Stapel organisiert.
Wenn mehrere Überlagerungen die gleiche Definition enthalten, z.B. `foo`, dann wird die der zuletzt aktivierten verwendet.
Um eine Überlagerung im Stapel nach oben zu bringen, wird einfach der Befehl [`overlay use`](/commands/docs/overlay_use.md) nochmals aufgerufen:

```
(zero)> def foo [] { "foo-in-zero" }

(zero)> overlay use spam

(spam)> foo
foo

(spam)> overlay use zero

(zero)> foo
foo-in-zero

(zero)> overlay list
───┬──────
 0 │ spam
 1 │ zero
───┴──────
```

Nun hat die `zero` Überlagerung wieder Vorrang.
