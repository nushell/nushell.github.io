# Configuration

## Nushell Configuration with `env.nu` and `config.nu`

Nushell uses a configuration system that loads and runs two Nushell script files at launch time:

- `env.nu` is used to define environment variables. These typically get used in the second config file, config.nu.
- `config.nu` is used to add definitions, aliases, and more to the global namespace. It can use the environment variables defined in `env.nu`, which is why there's two separate files.

You can check where Nushell is reading these config files from by calling `$nu.env-path` and `$nu.config-path`.

```nu
> $nu.env-path
/Users/FirstNameLastName/Library/Application Support/nushell/env.nu
```

_(You can think of the Nushell config loading sequence as executing two [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) lines on startup: `source /path/to/env.nu` and `source /path/to/config.nu`. Therefore, using `env.nu` for environment and `config.nu` for other config is just a convention.)_

When you launch Nushell without these files set up, Nushell will prompt you to download the [`default env.nu`](https://github.com/nushell/nushell/blob/main/crates/nu-utils/src/sample_config/default_env.nu) and [`default config.nu`](https://github.com/nushell/nushell/blob/main/crates/nu-utils/src/sample_config/default_config.nu).

You can browse the default files for default values of environment variables and a list of all configurable settings.

### Configuring `$env.config`

Nushell's main settings are kept in the `config` environment variable as a record. This record can be created using:

```nu
$env.config = {
  ...
}
```

You can also shadow `$env.config` and update it:

```nu
$env.config = ($env.config | upsert <field name> <field value>)
```

By convention, this variable is defined in the `config.nu` file.

### Environment

You can set environment variables for the duration of a Nushell session using the `$env.<var> = <val>` structure inside the `env.nu` file. For example:

```nu
$env.FOO = 'BAR'
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

### Configurations with built-in commands

Starting with release v0.64 of Nushell, we have introduced two new commands([`config nu`](/commands/docs/config_nu.md) and [`config env`](/commands/docs/config_env.md)) which help you quickly edit nu configurations with your preferred text editor/IDE

Nushell follows underneath orders to locate the editor:

1. `$config.buffer_editor`
2. `$env.EDITOR`
3. `$env.VISUAL`

Note: Previous versions of Nushell were launching `notepad` on windows, otherwise `nano` when these variables weren't found. We removed defaulting to `notepad` on Windows since `notepad` is now distributed via the Windows Store and there will be a possibility of not having `notepad` at all.

### Color Config section

You can learn more about setting up colors and theming in the [associated chapter](coloring_and_theming.md).

## Remove Welcome Message

To remove the welcome message, you need to edit your `config.nu` by typing `config nu` in your terminal, then you go to the global configuration `$env.config` and set `show_banner` option to false, like this:

@[code](@snippets/installation/remove_welcome_message.nu)

## Configuring Nu as a login shell

To use Nu as a login shell, you'll need to configure the `$env` variable. This sets up the environment for external programs.

To get an idea of which environment variables are set up by your current login shell, start a new shell session, then run nu in that shell.

You can then configure some `$env.<var> = <val>` that setup the same environment variables in your nu login shell. Use this command to generate some `$env.<var> = <val>` for all the environment variables:

```nu
$env | reject config | transpose key val | each {|r| echo $"$env.($r.key) = '($r.val)'"} | str join (char nl)
```

This will print out `$env.<var> = <val>` lines, one for each environment variable along with its setting. You may not need all of them, for instance the `PS1` variable is bash specific.

Next, on some distros you'll also need to ensure Nu is in the /etc/shells list:

```sh
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

### Configuration with `login.nu`

If Nushell is used as a login shell, you can use a specific configuration file which is only sourced in this case. Therefore a file with name `login.nu` has to be in the standard configuration directory.

The file `login.nu` is sourced after `env.nu` and `config.nu`, so that you can overwrite those configurations if you need.

There is an environment variable `$nu.loginshell-path` containing the path to this file.

### macOS: Keeping `/usr/bin/open` as `open`

Some tools (e.g. Emacs) rely on an [`open`](/commands/docs/open.md) command to open files on Mac.
As Nushell has its own [`open`](/commands/docs/open.md) command which has different semantics and shadows `/usr/bin/open`, these tools will error out when trying to use it.
One way to work around this is to define a custom command for Nushell's [`open`](/commands/docs/open.md) and create an alias for the system's [`open`](/commands/docs/open.md) in your `config.nu` file like this:

```nu
def nuopen [arg, --raw (-r)] { if $raw { open -r $arg } else { open $arg } }
alias open = ^open
```

The `^` symbol _escapes_ the Nushell `open` command, which invokes the operating system's `open` command.
For more about escape and `^` see the [chapter about escapes](escaping.md).

## PATH configuration

In Nushell, [the PATH environment variable](<https://en.wikipedia.org/wiki/PATH_(variable)>) (Path on Windows) is a list of paths. To append a new path to it, you can use `$env.<var> = <val>` and [`append`](/commands/docs/append.html) in `env.nu`:

```nu
$env.PATH = ($env.PATH | split row (char esep) | append '/some/path')
```

This will append `/some/path` to the end of PATH; you can also use [`prepend`](/commands/docs/prepend.html) to add entries to the start of PATH.

Note the `split row (char esep)` step. We need to add it because in `env.nu`, the environment variables inherited from the host process are still strings. The conversion step of environment variables to Nushell values happens after reading the config files (see also the [Environment](environment.html#environment-variable-conversions) section). After that, for example in the Nushell REPL when `PATH`/`Path` is a list , you can use [`append`](/commands/docs/append.md)/[`prepend`](/commands/docs/prepend.md) directly.

To prepend a new path only if not already listed, one can add to `env.nu`:
```nu
# create a new string holding the desired path
$env.my_path = ( [ $env.HOME, "bin" ] | str join (char psep) )
# return $env.PATH if $env.my_path is already listed, return $env.PATH with $env.my_path prepended otherwise
$env.PATH = ( if ( $env.PATH | split row (char esep) | any { |p| $p == $env.my_path } ) { $env.PATH } else { $env.PATH | prepend $env.my_path } )
```

### Homebrew

[Homebrew](https://brew.sh/) is a popular package manager that often requires PATH configuration. To add it to your Nushell PATH:

```nu
# macOS ARM64 (Apple Silicon)
$env.PATH = ($env.PATH | split row (char esep) | prepend '/opt/homebrew/bin')

# Linux
$env.PATH = ($env.PATH | split row (char esep) | prepend '/home/linuxbrew/.linuxbrew/bin')
```
