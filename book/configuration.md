# Configuration

## Nushell Configuration with `env.nu` and `config.nu`

Nushell uses a configuration system that loads+runs two Nushell script files at launch time:
First, `env.nu`, then `config.nu`.
Paths to these files can be found by calling `echo $nu.env-path` and `echo $nu.config-path`.
`env.nu` is meant to define the environment variables which are then available within `config.nu`.
`config.nu` can be used to add definitions, aliases, and more to the global namespace.

_(You can think of the Nushell config loading sequence as executing two [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) lines on startup: `source /path/to/env.nu` and `source /path/to/config.nu`. Therefore, using `env.nu` for environment and `config.nu` for other config is just a convention.)_

When you launch Nushell without these files set up, Nushell will prompt you to download the [`default env.nu`](https://github.com/nushell/nushell/blob/main/docs/sample_config/default_env.nu) and [`default config.nu`](https://github.com/nushell/nushell/blob/main/docs/sample_config/default_config.nu).
You can browse the default files for default values of environment variables and a list of all configurable settings.

### Configuring `$env.config`

Nushell's main settings are kept in the `config` environment variable as a record. This record can be created using:

```
let-env $config = {
  ...
}
```

You can also shadow `$env.config` and update it:

```
let-env $config = ($env.config | upsert <field name> <field value>)
```

By convention, this variable is defined in the `config.nu` file.

### Environment

You can set environment variables for the duration of a Nushell session using [`let-env`](commands/let-env.html) calls inside the `env.nu` file. For example:

```
let-env FOO = 'BAR'
```

_(Although $env.config is an environment variable, it is still defined by convention inside config.nu.)_

These are some important variables to look at for Nushell-specific settings:

- `LS_COLORS`: Sets up colors per file type in ls
- `PROMPT_COMMAND`: Code to execute for setting up the prompt (block or string)
- `PROMPT_COMMAND_RIGHT`: Code to execute for setting up the right prompt (block)
- `PROMPT_INDICATOR = "〉"`: The indicator printed after the prompt (by default ">"-like Unicode symbol)
- `PROMPT_INDICATOR_VI_INSERT = ": "`
- `PROMPT_INDICATOR_VI_NORMAL = "〉 "`
- `PROMPT_MULTILINE_INDICATOR = "::: "`

### Color Config section

You can learn more about setting up colors and theming in the [associated chapter](coloring_and_theming.md).

## Configuring Nu as a login shell

To use Nu as a login shell, you'll need to configure the `$env` variable. With this, you'll have enough support to run external commands as a login shell.

You can build the full set of environment variables by running Nu inside of another shell, like Bash. Once you're in Nu, you can run a command like this:

```
> env | each { |it| echo $"let-env ($it.name) = '($it.raw)'" } | str collect (char nl)
```

This will print out [`let-env`](commands/let-env.html) lines, one for each environment variable along with its setting.

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
As Nushell has its own [`open`](commands/open.md) command which has different semantics and shadows `/usr/bin/open`, these tools will error out when trying to use it.
One way to work around this is to define a custom command for Nushell's `open` and create an alias for the system's `open` in your `config.nu` file like this:

```
def nuopen [arg, --raw (-r)] { if $raw { open -r $arg } else { open $arg } }
alias open = ^open
```

## PATH configuration

To append a path to [the PATH variable](<https://en.wikipedia.org/wiki/PATH_(variable)>), you can use [`let-env`](commands/let-env.html) and [`append`](commands/append.html) in `env.nu`:

```
let-env PATH = ($env.PATH | append '/some/path')
```

This will append `/some/path` to the end of PATH; you can also use [`prepend`](commands/prepend.html) to add entries to the start of PATH.
