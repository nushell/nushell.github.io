# Configuration

## Nushell Configuration with `env.nu` and `config.nu`

Nushell uses a configuration system that loads and runs two Nushell script files at launch time:

- `env.nu` is used to define environment variables or write files before `config.nu` starts. For example [`$env.NU_LIB_DIRS`](/book/modules.md#dumping-files-into-directory) controls where Nu finds imports. Third party scripts, like prompts or [mise](https://mise.jdx.dev/getting-started.html#nushell), must already be saved to disk before `config.nu` can read them.
- `config.nu` is used to add definitions, aliases, and more to the global namespace. It can also use the environment variables and constants defined in `env.nu`. If you can't decide which file to add stuff, prefer `config.nu`.

Check where Nushell is reading these config files from by calling `$nu.env-path` and `$nu.config-path`.

```nu
> $nu.env-path
/Users/FirstNameLastName/Library/Application Support/nushell/env.nu
```

_(You can think of the Nushell config loading sequence as executing two [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) lines on startup: `source /path/to/env.nu` and `source /path/to/config.nu`. Therefore, using `env.nu` for environment and `config.nu` for other config is just a convention.)_

When you launch Nushell without these files set up, Nushell will prompt you to download the [`default env.nu`](https://github.com/nushell/nushell/blob/main/crates/nu-utils/src/sample_config/default_env.nu) and [`default config.nu`](https://github.com/nushell/nushell/blob/main/crates/nu-utils/src/sample_config/default_config.nu).

::: tip
The default config files aren't required. If you prefer to start with an empty `env.nu` and `config.nu` then Nu applies identical defaults in internal Rust code. You can still browse the default files for default values of environment variables and a list of all configurable settings using the [`config`](#configurations-with-built-in-commands) commands:

```nu
> config env --default | nu-highlight | lines
> config nu --default | nu-highlight | lines
```
:::

Control which directory Nushell reads config files from with the `XDG_CONFIG_HOME` environment variable. When you set it to
an absolute path, Nushell will read config files from `$"($env.XDG_CONFIG_HOME)/nushell"`.

::: warning
`XDG_CONFIG_HOME` must be set **before** starting Nushell. Do not set it in `env.nu`.
:::

Here's an example for reading config files from `~/.config/nushell` rather than the default directory for Windows, which is `C:\Users\username\AppData\Roaming\nushell`.

```nu
> $env.XDG_CONFIG_HOME = "C:\Users\username\.config"
> nu
> $nu.default-config-dir
C:\Users\username\.config\nushell
```

::: warning
[`XDG_CONFIG_HOME`](https://xdgbasedirectoryspecification.com) is not a Nushell-specific environment variable and should not be set to the directory that contains Nushell config files.
It should be the directory *above* the `nushell` directory. If you set it to `/Users/username/dotfiles/nushell`, Nushell will look for
config files in `/Users/username/dotfiles/nushell/nushell` instead. In this case, you would want to set it to `/Users/username/dotfiles`.
:::

## Configuring `$env.config`

Nushell's main settings are kept in the `config` environment variable as a record. This record can be created using:

```nu
$env.config = {
  ...
}
```
Note that setting any key overwrites its previous value. Likewise it's an error to reference any missing key. If `$env.config` already exists you can update or gracefully insert a [`cell-path`](/lang-guide/lang-guide.md#cellpath) at any depth using [`upsert`](/commands/docs/upsert.md):

```nu
$env.config = ($env.config | upsert <field name> <field value>)
```

By convention, this variable is defined in the `config.nu` file.

::: tip
Try downloading the [`set-env`](https://github.com/nushell/nu_scripts/blob/main/stdlib-candidate/std-rfc/set-env.nu) command in order to _merge_ nested `$env` values at any depth:

```nu
set-env config.<field name> <field value>
```

You can optionally `--append` list settings such as [hooks](/book/hooks.md).
:::

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

The ([`config nu`](/commands/docs/config_nu.md) and [`config env`](/commands/docs/config_env.md)) commands open their respective configurations for quick editing in your preferred text editor or IDE. Nu determines your editor from the following environment variables in order:

1. `$env.config.buffer_editor`
2. `$env.EDITOR`
3. `$env.VISUAL`

### Color Config section

You can learn more about setting up colors and theming in the [associated chapter](coloring_and_theming.md).

### Remove Welcome Message

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

The file `login.nu` is sourced after `env.nu` and `config.nu`, so that you can overwrite those configurations if you need. There is an environment variable `$nu.loginshell-path` containing the path to this file.

What about customizing iteractive shells, similar to `.zshrc`? By default `config.nu` is only loaded in interactive shells, not scripts.

### macOS: Keeping `/usr/bin/open` as `open`

Some tools (e.g. Emacs) rely on an [`open`](/commands/docs/open.md) command to open files on Mac.
As Nushell has its own [`open`](/commands/docs/open.md) command which has different semantics and shadows `/usr/bin/open`, these tools will error out when trying to use it.
One way to work around this is to define a custom command for Nushell's [`open`](/commands/docs/open.md) and create an alias for the system's [`open`](/commands/docs/open.md) in your `config.nu` file like this:

```nu
alias nu-open = open
alias open = ^open
```

The `^` symbol _escapes_ the Nushell `open` command, which invokes the operating system's `open` command.
For more about escape and `^` see the [chapter about escapes](escaping.md).

## PATH configuration

In Nushell, [the PATH environment variable](<https://en.wikipedia.org/wiki/PATH_(variable)>) (Path on Windows) is a list of paths. To append a new path to it, you can use `$env.<var> = <val>` and [`append`](/commands/docs/append.md) in `env.nu`:

```nu
$env.PATH = ($env.PATH | split row (char esep) | append '/some/path')
```

This will append `/some/path` to the end of PATH; you can also use [`prepend`](/commands/docs/prepend.md) to add entries to the start of PATH.

Note the `split row (char esep)` step. We need to add it because in `env.nu`, the environment variables inherited from the host process are still strings. The conversion step of environment variables to Nushell values happens after reading the config files (see also the [Environment](environment.md#environment-variable-conversions) section). After that, for example in the Nushell REPL when `PATH`/`Path` is a list , you can use [`append`](/commands/docs/append.md)/[`prepend`](/commands/docs/prepend.md) directly.

To add multiple paths only if not already listed, one can add to `env.nu`:

```nu
$env.PATH = $env.PATH | split row (char esep)
  | append /usr/local/bin
  | append ($env.CARGO_HOME | path join bin)
  | append ($env.HOME | path join .local bin)
  | uniq # filter so the paths are unique
```

This will add `/usr/local/bin`, the `bin` directory of CARGO_HOME, the `.local/bin` of HOME to PATH. It will also remove duplicates from PATH.

::: tip
There's a convenience command for updating your system path but you must first open the [`std`](/book/standard_library.md) [module](/book/cheat_sheet.md#modules) (in preview):

```nu
use std *
path add /usr/local/bin ($env.CARGO_HOME | path join bin) # etc.
```

You can optionally `--append` paths to be checked last like the ones below.
:::

### Homebrew

[Homebrew](https://brew.sh/) is a popular package manager that often requires PATH configuration. To add it to your Nushell PATH:

```nu
# macOS ARM64 (Apple Silicon)
$env.PATH = ($env.PATH | split row (char esep) | prepend '/opt/homebrew/bin')

# Linux
$env.PATH = ($env.PATH | split row (char esep) | prepend '/home/linuxbrew/.linuxbrew/bin')
```

### Pyenv
[Pyenv](https://github.com/pyenv/pyenv) is a popular Python version manager. To add it to your Nushell PATH:

#### MacOS or Linux
```nu
# MacOS or Linux
$env.PATH = ($env.PATH | split row (char esep) | prepend $"(pyenv root)/shims")
```

#### Windows
Windows users need to install [pyenv-win](https://github.com/pyenv-win/pyenv-win)
and execute the `Get-Command pyenv` command in PowerShell to get the path of `pyenv.ps1` after the installation.

The result usually looks like: `C:\Users\<your-username>\.pyenv\pyenv-win\bin\pyenv.ps1`

Then add the path of pyenv to your Nushell PATH:
```nu
# Windows
$env.Path = ($env.Path | split row (char esep) | prepend $"~/.pyenv/pyenv-win/bin/pyenv.ps1")
```
