# Konfiguration

## Nushell Konfiguration mittels `config.nu`

Nushell nutzt ein Konfigurationssystem, das ein Nushell-Skript beim Start ausführt. Die Konfigurationsdatei wird für Nushell `config.nu` genannt. Der Pfad zu dieser Konfigurationsdatei kann durch den Aufruf von `echo $nu.config-path` herausgefunden werden. Es handelt sich dabei um eine Datei die abgearbeitet wird und in jedem Schritt Definitionen, Umgebungsvariablen und mehr zum globalen Namespace hinzufügt.

Ein Beispiel für eine Nushell `config.nu` kann [hier](https://github.com/nushell/nushell/blob/main/src/default_config.nu) in unserem Repository gefunden werden.

### `$config` konfigurieren

Die zentralen Konfigurationen von Nushell sind in der globalen `$config` Variable festgehalten. Dieser Eintrag kann wie folgt erstellt werden:

```
let $config = {
  ...
}
```

Es ist auch möglich `$config` zu überschreiben und zu ändern:

```
let $config = ($config | update <field name> <field value>)
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

Mehr Informationen zu Farbeinstellungen und Themes kann im [entsprechenden Kapitel](https://github.com/nushell/nushell/blob/main/docs/How_To_Coloring_and_Theming.md) gefunden werden.

## Nushell als Login-Shell

Um Nushell als Login-Shell zu verwenden, muss die `$env` Variable konfiguriert werden, damit es möglich ist, externe Befehle als Login-Shell auszuführen.

Der komplette Satz an Umgebungsvariablen kann erzeugt werden, wenn Nu in einer anderen Shell, wie beispielsweise Bash, ausgeführt wird. In diese Nu-Sitzung kann ein Befehl wie der folgende verwendet werden, um `$env` zu setzen:

```
> env | each { echo $"let-env ($it.name) = '($it.raw)'" } | str collect (char nl)
```

Das wird `let-env` Zeilen ausgeben - eine für jede Umgebungsvariable - inklusive der nötigen Werte.

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

### macOS: `/usr/bin/open` als `open` behalten

Manche Tools (z.B. Emacs) vertrauen darauf, dass `open` Dateien auf dem Mac öffnet.
Da Nushell einen eigenen `open` Befehl hat, der eine andere Semantik hat und `/usr/bin/open` verbirgt, werden diese Tools einen Fehler werfen, wenn sie verwendet werden.
Eine Möglichkeit, dieses Problem zu umgehen, ist es, einen eigenen Befehl und einen `alias` in `config.nu` zu definieren:

```
def nuopen [arg, --raw (-r)] { if $raw { open -r $arg } else { open $arg } }
alias open = ^open
```

## Konfiguration der Prompt

Die Konfiguration der Prompt wird durch das Setzen der Variable `prompt` durchgeführt.

Um beispielsweise [Starship](https://starship.rs) zu nutzen, muss es heruntergeladen werden und der folgende Befehl eingegeben werden:

```
let-env PROMPT_COMMAND = "starship prompt"
```

Danach muss Nu neugestartet werden.

```
nushell on 📙 main [$] is 📦 v0.44.0 via 🦀 v1.59.0
❯
```

Wenn die Prompt etwas seltsam aussieht:

```
%{%}~%{%}
%{%}❯%{%}
```

sollte unter Umständen die `STARSHIP_SHELL` Umgebungsvariable gesetzt werden:

```
config set prompt "STARSHIP_SHELL=nushell starship prompt"
```

Mehr Dokumentation zu Prompts von Drittanbietern kann [hier](https://github.com/nushell/nushell/blob/main/docs/3rd_Party_Prompts.md) gefunden werden.
