---
title: Configuration
description: Configuring Nu's behaviour and usage
---

Nu has a small, but growing, number of internal variables you can set to change how it looks and how it operates.  Below is a list of the current variables, their types, and a description of how they're used

| Variable        | Type           | Description  |
| ------------- | ------------- | ----- |
| completion_mode | "list" or "circular" | the style of autocompletion to use |
| ctrlc_exit | boolean | whether or not to exit Nu after multiple ctrl-c presses |
| disable_table_indexes | boolean | removes the table index column |
| edit_mode | "vi" or "emacs" | changes line editing to "vi" or "emacs" mode |
| env | row | the environment variables to pass to external commands |
| header_align | "center", "right", or other | aligns table headers center-, right-, or left-aligned |
| key_timeout | integer | the timeout used to switch between edit modes |
| nonzero_exit_errors | boolean | whether to print errors for non-zero exit codes for externals |
| path | list of strings | PATH to use to find binaries |
| startup | list of strings | commands, like `alias`es, to run when nushell starts |
| table_mode | "light" or other | enable lightweight or normal tables |
| no_auto_pivot | boolean | whether or not to automatically pivot single-row results |

## Usage

### Setting variables

To set one of these variables, you can use `config --set`. For example:

```
> config --set [edit_mode "vi"]
```

### Setting a variable from the pipeline

There's an additional way to set a variable, and that is to use the contents of the pipeline as the value you want to use for the variable. For this, use the `--set_into` flag:

```
> echo "bar" | config --set_into foo
```

This is helpful when working with the `env` and `path` variables.

### Listing all variables

Running the `config` command without any arguments will show a table of the current configuration settings:

```
> config
─────────────────┬──────────────────
 completion_mode │ circular 
 env             │ [row 51 columns] 
 path            │ [table 9 rows] 
 startup         │ [table 1 rows] 
─────────────────┴──────────────────
```

Note: if you haven't set any configuration variables, yet, this may be empty.

### Getting a variable

Using the `--get` flag, you can retrieve the value for a given variable:

```
> config --get edit_mode
```

### Removing a variable

To remove a variable from the configuration, use the `--remove` flag:

```
> config --remove edit_mode
```

### Clearing the whole configuration

If you want to clear the whole configuration and start fresh, you can use the `--clear` flag. Of course, be careful with this as once you run it, the configuration file is also cleared.

```
> config --clear
```

### Finding where the configuration is stored

The configuration file is loaded from a default location. To find what this location is on your system, you can ask for it using the `--path` flag:

```
> config --path
/home/jonathant/.config/nu/config.toml
```

### Loading the config from a file

You may wish to load the configuration from a different file than the default. To do so, use the `--load` parameter:

```
> config --load myconfiguration.toml
```

## Configuring Nu as a login shell

To use Nu as a login shell, you'll need to configure the `path` and `env` configuration variables. With these, you'll have enough support to run external commands as a login shell.

Before switching, run Nu inside of another shell, like Bash. Then, take the environment and PATH from that shell with the following commands:

```
> config --set [path $nu.path]
> config --set [env $nu.env]
```

Versions before 0.7.2 used:
```
> config --set [path $nu:path]
> config --set [env $nu:env]
```

The `$nu.path` and `$nu.env` values are set to the current PATH and environment variables, respectively. Once you set these into the configuration, they'll be available later when using Nu as a login shell.

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

## Prompt configuration

Currently, prompt configuration is handled by installing Nu with the [starship](https://github.com/starship/starship) feature. The starship prompt can then be used via the `use_starship` config setting.

To enable the starship prompt, enter the following command (in 0.16.1 and later):

```
config set use_starship $true
```

To disable the starship prompt, enter the following command (in 0.16.1 and later):

```
config set use_starship $false
```

```
nushell on 📙 master [$] is 📦 v0.16.1 via 🦀 v1.45.0-nightly
❯
```

Starship is a fun, colorful, and surprisingly powerful prompt. To configure it, follow the steps in their [configuration manual](https://starship.rs/config/).
