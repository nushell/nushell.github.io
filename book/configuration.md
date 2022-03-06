# Configuration

## Nushell Configuration with `config.nu`

Nushell uses a configuration system that loads+runs a Nushell script file at launch time. That configuration file is called the `config.nu` file, and the path to it can be found by calling `echo $nu.config-path`. `config.nu` can add definitions, environment variables, and more to the global namespace.

An example `config.nu` file can be found in our repo [here](https://github.com/nushell/nushell/blob/main/src/default_config.nu).

### Configuring `$config`

Nushell's main settings are kept in the global `$config` variable as a record. This record can be created using:

```
let $config = {
  ...
}
```

You can also shadow `$config` and update it:

```
let $config = ($config | update <field name> <field value>)
```

### Environment

You can set environment variables using `let-env` calls inside the `config.nu` file. These are some important variables to look at for Nushell-specific settings:

- `LS_COLORS`: Sets up colors per file type in ls
- `PROMPT_COMMAND`: Code to execute for setting up the prompt (block or string)
- `PROMPT_COMMAND_RIGHT`: Code to execute for setting up the right prompt (block)
- `PROMPT_INDICATOR = "〉"`: The indicator printed after the prompt (by default ">"-like Unicode symbol)
- `PROMPT_INDICATOR_VI_INSERT = ": "`
- `PROMPT_INDICATOR_VI_NORMAL = "〉 "`
- `PROMPT_MULTILINE_INDICATOR = "::: "`

### Color Config section

You can learn more about setting up colors and theming in the [associated chapter](https://github.com/nushell/nushell/blob/main/docs/How_To_Coloring_and_Theming.md).

## Configuring Nu as a login shell

To use Nu as a login shell, you'll need to configure the `$env` variable. With this, you'll have enough support to run external commands as a login shell.

You can build the full set of environment variables by running Nu inside of another shell, like Bash. Once you're in Nu, you can run a command like this:

```
> env | each { echo $"let-env ($it.name) = '($it.raw)'" } | str collect (char nl)
```

This will print out `let-env` lines, one for each environment variable along with its setting.

Next, on some distros you'll also need to ensure Nu is in the /etc/shells list:

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

With this, you should be able to `chsh` and set Nu to be your login shell. After a logout, on your next login you should be greeted with a shiny Nu prompt.

### macOS: Keeping `/usr/bin/open` as `open`

Some tools (e.g. Emacs) rely on an `open` command to open files on Mac.
As Nushell has its own `open` command which has different semantics and shadows `/usr/bin/open`, these tools will error out when trying to use it.
One way to work around this is to define `alias`es in your `config.nu` file like this:

```
alias nuopen = open
alias open = ^open
```

## Prompt configuration

Prompt configuration is handled by setting the value of `prompt`.

For example, to use [Starship](https://starship.rs), download it and enter the following command:

```
let-env PROMPT_COMMAND = "starship prompt"
```

Now restart Nu.

```
nushell on 📙 main is 📦 v0.43.0 via 🦀 v1.59.0
❯
```

If your prompt looks a bit garbled like this:

```
%{%}~%{%}
%{%}❯%{%}
```

you may want to configure `STARSHIP_SHELL` environment variable when setting the prompt.

```
config set prompt "STARSHIP_SHELL=nushell starship prompt"
```

See more documentation on 3rd party prompts [here](https://github.com/nushell/nushell/blob/main/docs/3rd_Party_Prompts.md).
