# Konfiguration von Drittanbieter-Prompts

## nerdfonts

nerdfonts sind nicht zwangsweise notwendig, machen aber die Darstellung viel besser.

[Webseite](https://www.nerdfonts.com)

[Repository](https://github.com/ryanoasis/nerd-fonts)

## oh-my-posh

[Webseite](https://ohmyposh.dev/)

[Repository](https://github.com/JanDeDobbeleer/oh-my-posh)

Wenn oh-my-posh verwendet werden soll, kann dies in wenigen Schritten für Nushell erreicht werden. Die Integration in Nushell funktioniert sehr gut. Die folgenden Schritte werden dazu benötigt:

1. oh-my-posh installieren und die Farbschemata herunterladen entsprechend dieser [Anleitung](https://ohmyposh.dev/docs/linux#installation)
2. Herunterladen und installieren einer [nerd font](https://github.com/ryanoasis/nerd-fonts).
3. PROMPT_COMMAND in `~/.config/nushell/config.nu` setzen und `M365Princess.omp.json` beliebig ändern entsprechend der [Demo](https://ohmyposh.dev/docs/themes).

```shell
> let-env PROMPT_COMMAND = { oh-my-posh --config ~/.poshthemes/M365Princess.omp.json }
```

## Starship

[Webseite](https://starship.rs/)

[Repository](https://github.com/starship/starship)

1. Den obigen Links folgen und starship installieren.
2. nerdfonts entsprechend persönlicher Präferenzen installieren.
3. Die `STARSHIP_SHELL` Umgebungsvariable auf `nu` setzen, indem der folgende Befehl ausgeführt wird: `let-env STARSHIP_SHELL = "nu"`
4. Wenn die standardmäßige Uhr mit Zeit und Datum auf der rechten Seite dargestellt werden soll, sollte der folgende Befehl ausgeführt werden: `hide PROMPT_COMMAND_RIGHT`
5. Wenn der standardmäßige Indikator verwendet werden soll, kann der folgende Befehl ausgeführt werden: `let-env PROMPT_INDICATOR = " "`
6. starship kann als Prompt auf der linken Seite mit dem folgenden Befehl festgelegt werden: `let-env PROMPT_COMMAND = { starship prompt --cmd-duration $env.CMD_DURATION_MS --status $env.LAST_EXIT_CODE | str trim }`. Ein Hinweis: Unter Umständen muss `str trim` in der Nushell-Prompt nicht verwendet werden, wenn starship's standardmäßig aktive Einstellung für neue Zeilen in der `starship.toml` mittels `add_newline = false` deaktiviert wurde. Es gibt Berichte, dass dies teilweise nicht gut im Zusammenspiel mit Nushell-Prompts funktioniert. Wir arbeiten noch daran!
7. Da Nushell Prompts auf der rechten Seite unterstützt, kann auch mit starship's Möglichkeit einer solchen Prompt experimentiert werden. Die rechte Prompt in Nushell zu setzen funktioniert identisch, wie das Setzen der Linken. Es muss lediglich `PROMPT_COMMAND_RIGHT` gesetzt werden. 

## Purs

[Repository](https://github.com/xcambar/purs)
