# Hooks

Hooks ermöglichen es, einen Code-Snippet in vordefinierten Situationen auszuführen.
Sie sind nur im interaktiven Modus verfügbar [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop), sie funktionieren nicht, wenn eine Nushell mit einem Skript `(nu script.nu`) oder dem Befehl `(nu -c "print foo`") Argument ausgefüht wird.

Derzeit unterstützen wir diese Arten von Hooks:

- `pre_prompt` : Ausgelöst bevor die Eingabeaufforderung gezeichnet wird
- `pre_execution` : Ausgelöst vor dem Ausführen der Zeileneingabe
- `env_change`: Ausgelöst, wenn sich eine Umgebungsvariable ändert
- `display_output` : Ein Block, an den die Ausgabe weitergeleitet wird (experimental.)
- `command_not_found` : Ausgelöst, wenn ein Befehl nicht gefunden wird.

Der Nushell Ausführungszyklus macht es klarer.
Die Schritte zur Auswertung einer Zeile im REPL-Modus sind wie folgt:

1. Prüfe auf `pre_prompt` Hooks und führe diese aus.
1. Prüfe auf `env_change` Hooks und führe diese aus.
1. Stelle die Eingabeaufforderung dar und warte auf eine Benutzer-Eingabe.
1. Nachdem der Benutzer etwas eingegeben und "Enter" gedrückt hat: Prüfe auf `pre_execution` Hooks und führe diese aus.
1. Parse und werte die Benutzer Eingabe aus.
1. Wurde ein Befehl nicht gefunden: Prüfe auf `command_not_found` Hooks. Wenn dieser Text zurückgibt, zeige ihn.
1. Wenn `display_output` definiert ist, verwende diesen um die Ausgabe zu erstellen.
1. Beginne wieder mit 1.

## Grundsätzliches zu Hooks

Um Hooks zu aktivieren, werden sie in der [config](configuration.md) definiert:

```nu
$env.config = {
    # ...other config...

    hooks: {
        pre_prompt: { print "pre prompt hook" }
        pre_execution: { print "pre exec hook" }
        env_change: {
            PWD: {|before, after| print $"changing directory from ($before) to ($after)" }
        }
    }
}
```

Bewegen wir uns mit obiger Konfiguration im Dateisystem, wird beim Ändern eines Verzeichnisses die `PWD` Umgebungsvariable verändert.
Die Änderung löst den Hook aus und tauscht die entsprechenden Werte in `before` und `after` aus.

Anstatt nur einen einzigen Hook pro Trigger zu definieren, ist es möglich, eine *Liste von Hooks* zu definieren, die nacheinander durchlaufen werden:

```nu
$env.config = {
    ...other config...

    hooks: {
        pre_prompt: [
            { print "pre prompt hook" }
            { print "pre prompt hook2" }
        ]
        pre_execution: [
            { print "pre exec hook" }
            { print "pre exec hook2" }
        ]
        env_change: {
            PWD: [
                {|before, after| print $"changing directory from ($before) to ($after)" }
                {|before, after| print $"changing directory from ($before) to ($after) 2" }
            ]
        }
    }
}
```

Auch könnte es praktischer sein, die bestehende Konfiguration mit neuen Hooks zu aktualisieren,
anstatt die gesamte Konfiguration von Grund auf neu zu definieren:

```nu
$env.config = ($env.config | upsert hooks {
    pre_prompt: ...
    pre_execution: ...
    env_change: {
        PWD: ...
    }
})
```

## Changing Environment

Eine Besonderheit der Hooks ist, dass sie die Umgebung bewahren.
Umgebungsvariablen im Hook **Block** werden in ähnlicher Weise wie [`def --env`](environment.md#defining-environment-from-custom-commands) erhalten.
Folgendes Beispiel zeigt dies:

```nu
$env.config = ($env.config | upsert hooks {
    pre_prompt: { $env.SPAM = "eggs" }
})

$env.SPAM
# => eggs
```

Die Hookblöcke folgen ansonsten den allgemeinen Scoping-Regeln, d.h. Befehle, Aliase, etc., die innerhalb des Blocks definiert sind,
werden verworfen, sobald der Block endet.

## Conditional Hooks

Nun wäre es verlockend eine Umgebung zu aktivieren wenn in ein Verzeichnis eingestiegen wird:

```nu
$env.config = ($env.config | upsert hooks {
    env_change: {
        PWD: [
            {|before, after|
                if $after == /some/path/to/directory {
                    load-env { SPAM: eggs }
                }
            }
        ]
    }
})
```

Dies wird jedoch nicht funktionieren, weil die Umgebung nur innerhalb des Blocks [`if`](/commands/docs/if.md) aktiv ist.
In diesem Fall könnte es als `load-env` neu geschrieben werden (`load-env (if $after == ... { ... } else { {} })`),
aber dieses Muster ist ziemlich häufig und später werden wir sehen, dass nicht alle Fälle so geschrieben werden können.

Um das obige Problem zu lösen, führen wir eine neue Möglichkeit ein, einen Hook zu definieren -- **einen record**:

```nu
$env.config = ($env.config | upsert hooks {
    env_change: {
        PWD: [
            {
                condition: {|before, after| $after == /some/path/to/directory }
                code: {|before, after| load-env { SPAM: eggs } }
            }
        ]
    }
})
```
Wird der Hook getriggert, wird der `condition` Block ausgewertet.
Wenn dieser `true` zurückgibt, wird der `code` Block ausgewertet.
Wenn er `false`zurückgibt, passiert nichts.
Gibt er etwas anderes zurück, wird ein Fehler generiert.
Das `condition` Feld kann auch weggelassen werden, womit der Hook immer ausgewertet wird.

Die `pre_prompt` und `pre_execution` Hook Typen unterstützen die Conditional Hooks, jedoch nicht die `before` und `after` Parameter.

## Hooks als Strings

Bisher wurde ein Hook als Block definiert, der nur die Umgebung bewahrt, aber nichts anderes.
Um Befehle oder Aliase definieren zu können, ist es möglich, das Codefeld **als string** zu definieren.
Dies funktioniert, als ob der String in den REPL eingeben und Enter gedrückt wird.
So kann der Hook aus dem vorherigen Abschnitt auch geschrieben werden als:

```nu
$env.config = ($env.config | upsert hooks {
    pre_prompt: '$env.SPAM = "eggs"'
})

$env.SPAM
eggs
```

Dieses Feature kann z.B. verwendet werden, um abhängig vom aktuellen Verzeichnis Definitionen einzubringen:

```nu
$env.config = ($env.config | upsert hooks {
    env_change: {
        PWD: [
            {
                condition: {|_, after| $after == /some/path/to/directory }
                code: 'def foo [] { print "foo" }'
            }
            {
                condition: {|before, _| $before == /some/path/to/directory }
                code: 'hide foo'
            }
        ]
    }
})
```

Wird ein Hook als String definiert, werden die `$before` und `$after` Variablen auf die vorherigen und aktuellen Umgebungsvariablen gesetzt,
analog dem vorherigen Beispiel:

```nu
$env.config = ($env.config | upsert hooks {
    env_change: {
        PWD: {
            code: 'print $"changing directory from ($before) to ($after)"'
        }
    }
}
```

## Beispiele

### Einen einzelnen Hook zur bestehenden Konfiguration hinzufügen

Beispiel eines PWD env Wechsel Hooks:

```nu
$env.config = ($env.config | upsert hooks.env_change.PWD {|config|
    let val = ($config | get -i hooks.env_change.PWD)

    if $val == $nothing {
        $val | append {|before, after| print $"changing directory from ($before) to ($after)" }
    } else {
        [
            {|before, after| print $"changing directory from ($before) to ($after)" }
        ]
    }
})
```

### Automatisch eine Umgebung aktivieren, wenn ein Verzeichnis betreten wird

Dieses Beispiel sucht nach einem `test-env.nu` in einem Verzeichnis

```nu
$env.config = ($env.config | upsert hooks.env_change.PWD {
    [
        {
            condition: {|_, after|
                ($after == '/path/to/target/dir'
                    and ($after | path join test-env.nu | path exists))
            }
            code: "overlay use test-env.nu"
        }
        {
            condition: {|before, after|
                ('/path/to/target/dir' not-in $after
                    and '/path/to/target/dir' in $before
                    and 'test-env' in (overlay list))
            }
            code: "overlay hide test-env --keep-env [ PWD ]"
        }
    ]
})
```
### Filtern oder Umlenken des Befehl-Outputs

Der `display_output` Hook kann verwendet werden, um die Ausgabe von Befehlen umzuleiten.
Ein Block sollte so definiert werden, dass er mit allen Werttypen funktioniert.
Die Ausgabe externer Befehle wird nicht durch `display_output` gefiltert.

Dieser Hook kann die Ausgabe in einem separaten Fenster anzeigen,
vielleicht als HTML-Text. Hier ist die Grundidee, wie dies erreicht wird:

```nu
$env.config = ($env.config | upsert hooks {
    display_output: { to html --partial --no-color | save --raw /tmp/nu-output.html }
})
```

Das Ergebnis wird in der Datei:///tmp/nu-output.html ersichtlich in einem Webbrowser.
Natürlich ist dies nicht sehr praktisch, es sei denn, der Browser wird automatisch neu geladen, wenn sich die Datei ändert.
Anstelle des Befehls [`save`](/commands/docs/save.md) würde normalerweise der HTML-Ausgang an ein gewünschtes Fenster gesendet.

### `command_not_found` Hook in _Arch Linux_

Der folgende Hook verwendet den `pkgfile` Befehl, um in _Arch Linux_ herauzufinden, zu welchem Packet ein Befehl gehört.

```nu
$env.config = {
    ...other config...

    hooks: {
        ...other hooks...

        command_not_found: {
            |cmd_name| (
                try {
                    let pkgs = (pkgfile --binaries --verbose $cmd_name)
                    if ($pkgs | is-empty) {
                        return null
                    }
                    (
                        $"(ansi $env.config.color_config.shape_external)($cmd_name)(ansi reset) " +
                        $"may be found in the following packages:\n($pkgs)"
                    )
                }
            )
        }
    }
}
```
