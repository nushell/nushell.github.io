# Konfiguration

## Nushell Konfiguration mittels `config.nu`

Nushell nutzt ein Konfigurationssystem, das ein Nushell-Skript beim Start ausführt. Die Konfigurationsdatei wird für Nushell `config.nu` genannt. Der Pfad zu dieser Konfigurationsdatei kann durch den Aufruf von `echo $nu.config-path` herausgefunden werden. Es handelt sich dabei um eine Datei, die abgearbeitet wird und in jedem Schritt Definitionen, Umgebungsvariablen und mehr zum globalen Namespace hinzufügt.

Ein Beispiel für eine Nushell `config.nu` kann [hier](https://github.com/nushell/nushell/blob/main/crates/nu-utils/src/sample_config/default_config.nu) in unserem Repository gefunden werden.

### `$config` konfigurieren

Die zentralen Konfigurationen von Nushell sind in der globalen `$config` Variable festgehalten. Dieser Eintrag kann wie folgt erstellt werden:

```
$env.config = {
  ...
}
```

Es ist auch möglich `$config` zu überschreiben und zu ändern:

```
$env.config = ($config | update <field name> <field value>)
```

### Umgebung

Die Shell-Umgebung kann durch Aufrufe von `let-env` in der `config.nu`-Datei geändert werden. Es gibt einige wichtige Nushell-spezifischen Einstellungen:

- `LS_COLORS`: Setzt die Farben für Dateitypen in ls
- `PROMPT_COMMAND`: Befehle, die ausgeführt werden, um die Prompt zu erzeugen (Block oder String)
- `PROMPT_COMMAND_RIGHT`: Befehle, die ausgeführt werden, um die Prompt zu erzeugen (Block)
- `PROMPT_INDICATOR = "〉"`: Indikator, der der Prompt folgt (default: ">"-like Unicode symbol)
- `PROMPT_INDICATOR_VI_INSERT = ": "`
- `PROMPT_INDICATOR_VI_NORMAL = "〉 "`
- `PROMPT_MULTILINE_INDICATOR = "::: "`

### Farbkonfiguration

Mehr Informationen zu Farbeinstellungen und Themes kann im [entsprechenden Kapitel](/book/coloring_and_theming.md) gefunden werden.

## Nushell als Login-Shell

Um Nushell als Login-Shell zu verwenden, muss die `$env` Variable konfiguriert werden, damit es möglich ist, externe Befehle als Login-Shell auszuführen.

Der komplette Satz an Umgebungsvariablen kann erzeugt werden, wenn Nu in einer anderen Shell, wie beispielsweise Bash, ausgeführt wird. In diese Nu-Sitzung kann ein Befehl wie der folgende verwendet werden, um `$env` zu setzen:

```
> env | each { echo $"$env.($it.name) = '($it.raw)'" } | str join (char nl)
```

Das gibt Zeilen aus um `$env` in `env.nu` zu setzen - eine für jede Umgebungsvariable - inklusive der nötigen Werte.

Als nächstes, muss auf manchen Distributionen sichergestellt werden, dass Nu in der Liste der Shells in /etc/shells ist:

```
> cat /etc/shells
# /etc/shells: valid login shells
/bin/sh
/bin/dash
/bin/bash
/bin/rbash
/usr/bin/screen
/usr/bin/fish
/home/jonathan/.cargo/bin/nu
```

Damit sollte es möglich sein, Nu als Login-Shell mit `chsh` festzulegen. Nach dem Ausloggen und erneutem Einloggen sollte Nu als Shell grüßen.

### Konfiguration mittels `login.nu`

Wenn Nushell als Login-Shell benutzt wird, kann eine spezifische Konfigurationsdatei angelegt werden, die nur in diesem Fall ausgelesen wird. Hierfür muss eine Datei namens `login.nu` im Standard-Konfigurationsverzeichnis abgelegt sein.

Die Datei `login.nu` wird nach `env.nu` und `config.nu` eingelesen, so dass diese Konfigurationen überschrieben werden können.

Der Pfad zu dieser Konfigurationsdatei steht in `$nu.loginshell-path`.

### macOS: `/usr/bin/open` als `open` behalten

Manche Tools (z.B. Emacs) vertrauen darauf, dass `open` Dateien auf dem Mac öffnet.
Da Nushell einen eigenen `open` Befehl hat, der eine andere Semantik hat und `/usr/bin/open` verbirgt, werden diese Tools einen Fehler werfen, wenn sie verwendet werden.
Eine Möglichkeit, dieses Problem zu umgehen, ist es, einen eigenen Befehl und einen `alias` in `config.nu` zu definieren:

```
def nuopen [arg, --raw (-r)] { if $raw { open -r $arg } else { open $arg } }
alias open = ^open
```

## Konfiguration der Prompt

Die Konfiguration der Prompt wird durch das Setzen der Umgebungsvariable `PROMPT_COMMAND` bzw. `PROMPT_COMMAND_RIGHT` durchgeführt.
Diese akzeptieren entweder einen String oder einen Codeblock der ausgeführt wird.

```
$env.PROMPT_COMMAND = "Hallo Nu"  # Die Hauptprompt auf einen festen String setzen
$env.PROMPT_COMMAND_RIGHT = {pwd} # Den rechte Promptteil mit dem aktuellen Verzeichnis anzeigen
```

Darüber hinaus wird als Markierung ein Promptindikator gesetzt, welcher den aktuellen Modus oder einen Zeilenumbruch anzeigt:

- `PROMPT_INDICATOR = "〉"`: Indikator, der der Prompt folgt (default: ">"-like Unicode symbol)
- `PROMPT_INDICATOR_VI_INSERT = ": "`
- `PROMPT_INDICATOR_VI_NORMAL = "〉 "`
- `PROMPT_MULTILINE_INDICATOR = "::: "`

Mehr Dokumentation zu fertigen Prompts von Drittanbietern kann [hier](3rdpartyprompts.md) gefunden werden.
