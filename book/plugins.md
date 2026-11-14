# Plugins

Nu can be extended using plugins. Plugins behave much like Nu's built-in commands, with the added benefit that they can be added separately from Nu itself.

::: warning Important
Plugins communicate with Nushell using the `nu-plugin` protocol. This protocol is versioned, and plugins must use the same `nu-plugin` version provided by Nushell.

When updating Nushell, please make sure to also update any plugins that you have registered. [Updating Plugins](#updating-plugins) shows the errors you get from a plugin built for another version.
:::

[[toc]]

## Overview

- In order to use a plugin, it needs to be:

  - Installed
  - Added
  - Imported

There are two types of plugins:

- "Core plugins" are officially maintained and are usually installed with Nushell, in the same directory as the Nushell executable.
- Third-party plugins are also available from many sources.

The `$NU_PLUGIN_DIRS` constant or `$env.NU_PLUGIN_DIRS` environment variable can be used to set the search-path for plugins.

### Core Plugin Quickstart

To begin using the Polars plugin:

1. Most package managers will automatically install the core plugins with Nushell. A notable exception, however, is `cargo`. If you installed
   Nushell using `cargo`, see [Installing Core Plugins](#core-plugins) below.

2. Make sure the plugin search path includes the directory where the plugins are installed. By default, it contains the `plugins` directory in your
   Nushell configuration directory and the directory of the Nushell binary itself, so core plugins installed alongside Nushell are found automatically:

   ```nu
   $NU_PLUGIN_DIRS
   # => ╭───┬────────────────────────────────────╮
   # => │ 0 │ /home/user/.config/nushell/plugins │
   # => │ 1 │ /home/user/.cargo/bin              │
   # => ╰───┴────────────────────────────────────╯
   ```

   If your plugins are installed somewhere else, add that directory in your startup config:

   ```nu
   const NU_PLUGIN_DIRS = [
     ...$NU_PLUGIN_DIRS
     ($nu.home-dir | path join "my-plugins")
   ]
   ```

3. Add the plugin to the plugin registry. This only needs to be done one time. The name is the name of the plugin _file_, including its extension:

   ```nu
   # On Unix/Linux platforms:
   plugin add nu_plugin_polars
   # Or on Windows
   plugin add nu_plugin_polars.exe

   plugin list # Confirm it was added to the registry
   ```

   Alternatively, if the plugin's directory is not in the plugin search path, you can still use an absolute path:

   ```nu
   plugin add ~/.local/share/rust/cargo/bin/nu_plugin_polars
   ```

4. Import the plugin (to begin using it immediately) or restart Nushell. All plugins in the registry are automatically imported when Nushell starts:

   ```nu
   # The name of the plugin, without the leading `nu_plugin` nor any extension
   plugin use polars
   ```

5. Confirm the plugin is working:

   ```nu
   ls | polars into-df | describe
   # => polars_dataframe
   ```

::: details Polars value types
`polars_dataframe` is one of several value types that the Polars plugin defines. Nushell holds these values without knowing what's inside them, and passes them back to the plugin when a command, cell path, or operator needs their contents. `describe` shows these names:

| `describe` name     | Produced by                                                                   |
| ------------------- | ----------------------------------------------------------------------------- |
| `polars_dataframe`  | `polars into-df`, `polars collect`, `polars open --eager`                     |
| `polars_lazyframe`  | `polars into-lazy`, and `polars open` without `--eager` for most file formats |
| `polars_expression` | `polars col`, `polars lit`, `polars otherwise`, and other expression commands |
| `polars_group_by`   | `polars group-by`                                                             |
| `polars_when`       | `polars when`, until `polars otherwise` turns it into an expression           |
| `polars_datatype`   | `polars into-dtype`                                                           |
| `polars_schema`     | `polars into-schema`                                                          |
| `polars_selector`   | the `polars selector` commands, such as `polars selector all`                 |

The [DataFrames chapter](dataframes.md) explains how these types work together.
:::

## Installing Plugins

### Core Plugins

Nushell ships with a set of officially maintained plugins which includes:

- `polars`: Extremely fast columnar operations using DataFrames via the [Polars Library](https://github.com/pola-rs/polars). See the [DataFrames Chapter](dataframes.html) for more details.
- `formats`: Support for several additional data formats - EML, ICS, INI, plist, and VCF.
- `gstat`: Returns information on the status of a Git repository as Nushell structured data.
- `query`: Support for querying XML (via XPath), JSON, HTML (via CSS selectors), and web page metadata
- `inc`: Increment a value or version (e.g., semver). This plugin acts as both an end-user plugin as well as a simple developer example of how to create a plugin.

::: details What `inc` does with each kind of input
[`inc`](/commands/docs/inc.md) takes a single value:

- An integer goes up by 1: `41 | inc` returns `42`.
- Without a flag, a string that holds a whole number goes up by 1 and stays a string, so `"41" | inc` returns `"42"`. Any other string comes back unchanged.
- With `--major` (`-M`), `--minor` (`-m`), or `--patch` (`-p`), a string is read as a [semantic version](https://semver.org) and that part goes up by 1. The parts after it reset to 0, and a pre-release or build suffix is dropped, so `"1.2.3-beta" | inc --minor` returns `"1.3.0"`. A string that isn't a valid version comes back unchanged. If you pass more than one of these flags, `--major` wins over `--minor`, and `--minor` over `--patch`.
- Any other type, including a list, is an error.

The optional `cell_path` argument increments the value at that path and returns the whole input, so `{version: "0.1.2"} | inc version --patch` returns `{version: "0.1.3"}`. To change a column in every row of a table, call `inc` from [`update`](/commands/docs/update.md): `$table | update version { inc --patch }`.
:::

Nushell also ships with several plugins that serve as examples or tools for plugin developers. These include `nu_plugin_example`, `nu_plugin_custom_values`, and `nu_plugin_stress_internals`.

Core plugins are typically distributed with the Nushell release and should already be installed in the same directory as the Nushell executable. If this is the case on your system, core plugins should be using correct `nu-plugin` protocol version. If your package management system installs them separately, please make sure to update the core plugins whenever Nushell itself is updated.

::: tip Installing using Cargo
For example, when installing or upgrading Nushell directly from crates.io using `cargo install nu --locked`, the corresponding core plugins for that version may also be installed or updated using `cargo install nu_plugin_<plugin_name> --locked`.

To install all of the default (non-developer) plugins, from within Nushell run:

```nu
[ nu_plugin_inc
  nu_plugin_polars
  nu_plugin_gstat
  nu_plugin_formats
  nu_plugin_query
] | each { cargo install $in --locked } | ignore
```

:::

### Third-party Plugins

You can find third-party plugins on crates.io, online Git repositories, [`awesome-nu`](https://github.com/nushell/awesome-nu/blob/main/plugin_details.md), and other sources. As with any third-party code you run on your system, please make sure you trust its source.

To install a third-party plugin on your system, you first need to make sure the plugin uses the same version of Nu as your system:

- Confirm your Nushell version with the `version` command
- Confirm the version the plugin requires by checking its `Cargo.toml` file

To install a plugin by name from crates.io, run:

```nu
cargo install nu_plugin_<plugin_name> --locked
```

When installing from a repository (e.g., GitHub), run the following from inside the cloned repository:

```nu
cargo install --path . --locked
```

This will create a binary file that can be used to add the plugin.

::: tip Cargo installation location
By default, binaries installed with `cargo install` are placed in your home directory under `.cargo/bin`.
However, this can change depending on how your system is configured.
:::

## Registering Plugins

To add a plugin to the plugin registry file, call the [`plugin add`](/commands/docs/plugin_add.md) command to tell Nu where to find it.

::: tip Note
The plugin file name must start with `nu_plugin_`, Nu uses this filename prefix to identify plugins.
:::

- Linux and macOS:

  ```nu
  plugin add ./my_plugins/nu_plugin_cool
  ```

- Windows:

  ```nu
  plugin add .\my_plugins\nu_plugin_cool.exe
  ```

When [`plugin add`](/commands/docs/plugin_add.md) is called, Nu:

- Runs the plugin binary
- Communicates via the [plugin protocol](/contributor-book/plugin_protocol_reference.md) in order to ensure compatibility and to get a list of all of the commands it supports
- This plugin information is then saved to the plugin registry file (`$nu.plugin-path`), which acts as a cache

`plugin add` looks for the file in the current directory first, then in each directory of the [plugin search path](#plugin-search-path). It saves the file's full path with symlinks resolved, and names the plugin after the file, without `nu_plugin_` and without the extension: `nu_plugin_cool.exe` becomes `cool`. If a plugin with that name is already in the registry, the new entry replaces it.

Script files are run by an interpreter. Nu picks one from the file's extension, such as `python` for `.py` and `nu` for `.nu` (see the [contributor book](/contributor-book/plugins.md#creating-a-plugin-in-python) for the full list). For any other interpreter, or a different path to it, pass `--shell`:

```nu
plugin add --shell /usr/bin/python3 ./nu_plugin_cool.py
```

`plugin add` writes to the registry file at `$nu.plugin-path`, creating the file and its parent directories if they don't exist. `--plugin-config` writes to another registry file instead. When `nu` runs with `--no-config-file`, there's no default registry, so `plugin add` fails unless you pass `--plugin-config`:

```nu
plugin add nu_plugin_gstat
# => Error: nu::shell::error
# =>
# =>   × Plugin registry file not set
# =>    ╭─[source:1:1]
# =>  1 │ plugin add nu_plugin_gstat
# =>    · ─────┬────
# =>    ·      ╰── pass --plugin-config explicitly here
# =>    ╰────
# =>   help: you may be running `nu` with --no-config-file
```

### Importing Plugins

Once added to the registry, the next time `nu` is started, the plugin will be imported and available in that session.

You can also immediately import (or reload) a plugin in the current session by calling `plugin use`. In this case, the name of the plugin (rather than the filename) is used without the `nu_plugin` prefix:

```nu
plugin use cool
```

[`plugin use`](/commands/docs/plugin_use.md) also accepts the plugin's filename, as a path from the current directory or a full path, but it only loads what the registry file already holds for that plugin. It never runs the plugin to read new signatures, so a plugin you haven't added gives a "Plugin not found" error. If the plugin is running, `plugin use` stops it, so the next call starts the plugin again. Pass `--plugin-config` to read a registry file other than `$nu.plugin-path`.

It is not necessary to add `plugin use` statements to your config file. All previously registered plugins are automatically loaded at startup.

::: tip Note
`plugin use` is a parser keyword, so when evaluating a script, it will be evaluated first. This means that while you can execute `plugin add` and then `plugin use` at the REPL on separate lines, you can't do this in a single script. To run a script with plugins you haven't registered, use `nu --plugins`, described below. (The help text of `plugin use` calls this option `--plugin`, but the flag is `--plugins`.)
:::

### Loading plugins without the registry

The `--plugins` option of `nu` loads plugin executables for one session, without preparing a registry file. Pass a list of files:

```nu
nu --plugins '[./my_plugins/nu_plugin_cool]'
```

The `--plugins` option can also be repeated, once for each plugin:

```nu
nu --plugins ./my_plugins/nu_plugin_cool --plugins ./my_plugins/nu_plugin_other
```

Inside the brackets, separate the paths with spaces or with commas, and put double quotes around a path that contains spaces: `--plugins '["./my plugins/nu_plugin_cool", ./nu_plugin_other]'`. `nu --help` asks for full paths, but a relative path works too, and is resolved against the directory you start `nu` from.

Nu starts each of these plugins at startup to read its signatures, so they show as `running` in `plugin list` until the [garbage collector](#plugin-garbage-collector) stops them. They load even with `--no-config-file`, which skips the registry file, and `nu` never writes them to the registry file.

### Plugin Search Path

Nushell includes two `list` variables that can be used to set a search path for plugins. This only applies when registering plugins with `plugin add`, but it can be a nice shortcut
if you commonly add and remove plugins.

- `const NU_PLUGIN_DIRS`: A constant which takes effect immediately when set. However, as a constant, only certain commands may be used with it. It can be updated, for example, as seen in the [QuickStart above](#core-plugin-quickstart).
- `$env.NU_PLUGIN_DIRS`: An environment variable which is mutable and can accept any command that updates its list. `plugin add` reads it when it runs, so a change applies to the next `plugin add`, even later in the same script.

`plugin add` tries the current directory first, then the directories in `$NU_PLUGIN_DIRS` in order, then those in `$env.NU_PLUGIN_DIRS`, and uses the first match. A relative directory in either list is resolved against the current directory.

`plugin use`, `plugin rm`, and `plugin stop` also accept a filename, but they don't search these directories. They resolve the filename against the current directory only, so outside the plugin's directory, use the plugin's name or its full path.

### Updating Plugins

When updating a plugin, it is important to run `plugin add` again just as above to load the new signatures from the plugin and allow Nu to rewrite them to the plugin file (`$nu.plugin-path`). You can then `plugin use` to get the updated signatures within the current session.

After you update Nushell itself, plugins built for the old version stop working until you update them too. Before 1.0, the minor version has to match, so a plugin built for 0.116 doesn't work with Nushell 0.117. Nu checks the version each time it launches a plugin: during `plugin add`, and the first time a session runs one of the plugin's commands. It doesn't check at startup, because the signatures it loads then come from the registry file. An outdated plugin therefore loads without complaint, and its commands fail when you run them, with an error like:

```text
Plugin failed to load: Plugin `gstat` is compiled for nushell version 0.116.0, which is not compatible with version 0.117.0
```

Install the version of the plugin that matches your Nushell, then `plugin add` it again.

An update can also change the format of the registry file itself. At startup, Nu skips each registry entry it can't read. For each one, it reports "The registered plugin data for `NAME` is invalid" along with the `plugin add` command that fixes it, and then it sums up:

```text
Failed to load 1 plugin entry from /home/user/.config/nushell/plugin.msgpackz
```

with the help text "run `plugin list` and re-add outdated plugins with `plugin add`". `plugin list` shows those entries with the status `invalid`.

### The plugin registry file

The registry file at `$nu.plugin-path` is [MessagePack](https://msgpack.org/) data compressed with Brotli. [`open`](/commands/docs/open.md) decodes it with [`from msgpackz`](/commands/docs/from_msgpackz.md), like any `.msgpackz` file, so you can look inside:

```nu
open $nu.plugin-path | get plugins | columns
# => ╭───┬──────────╮
# => │ 0 │ name     │
# => │ 1 │ filename │
# => │ 2 │ shell    │
# => │ 3 │ metadata │
# => │ 4 │ commands │
# => ╰───┴──────────╯
```

Change it only through `plugin add` and `plugin rm`. Saving the decoded data back with `to msgpackz` doesn't produce a file that Nu can load. If Nu can't decompress or decode the file at startup, it loads no plugins from it and reports "Error while reading plugin registry file", with the help "you might try deleting the file and registering all of your plugins again". The `plugin` commands that read the file fail with "Failed to load plugin file" and similar help. Older versions of Nushell kept registered plugins in a `plugin.nu` file of `register` commands. Nu no longer reads that format, and pointing `nu --plugin-config` at a `.nu` file gives the error ".nu plugin files are no longer supported".

## Managing Plugins

Installed plugins are displayed using [`plugin list`](/commands/docs/plugin_list.md):

```nu
plugin list
# => ╭───┬───────┬─────────┬─────────┬───────┬───────────────────────┬───────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
# => │ # │ name  │ version │ status  │  pid  │       filename        │ shell │           commands                                                                                                   │
# => ├───┼───────┼─────────┼─────────┼───────┼───────────────────────┼───────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
# => │ 0 │ gstat │ 0.116.0 │ loaded  │       │ .../nu_plugin_gstat   │       │ ╭───┬───────┬──────────────────────────────╮                                                                         │
# => │   │       │         │         │       │                       │       │ │ # │ name  │         description          │                                                                         │
# => │   │       │         │         │       │                       │       │ ├───┼───────┼──────────────────────────────┤                                                                         │
# => │   │       │         │         │       │                       │       │ │ 0 │ gstat │ Get the git status of a repo │                                                                         │
# => │   │       │         │         │       │                       │       │ ╰───┴───────┴──────────────────────────────╯                                                                         │
# => │ 1 │ query │ 0.116.0 │ running │ 27312 │ .../nu_plugin_query   │       │ ╭───┬────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────╮ │
# => │   │       │         │         │       │                       │       │ │ # │        name        │                                       description                                       │ │
# => │   │       │         │         │       │                       │       │ ├───┼────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤ │
# => │   │       │         │         │       │                       │       │ │ 0 │ query              │ Show all the query commands                                                             │ │
# => │   │       │         │         │       │                       │       │ │ 1 │ query json         │ execute json query on json file (open --raw <file> | query json 'query string')         │ │
# => │   │       │         │         │       │                       │       │ │ 2 │ query web          │ execute selector query on html/web                                                      │ │
# => │   │       │         │         │       │                       │       │ │ 3 │ query webpage-info │ uses the webpage crate to extract info from html: title, description, language, links,  │ │
# => │   │       │         │         │       │                       │       │ │   │                    │ RSS feeds, Opengraph, Schema.org, and more                                              │ │
# => │   │       │         │         │       │                       │       │ │ 4 │ query xml          │ Execute XPath 1.0 query on XML input                                                    │ │
# => │   │       │         │         │       │                       │       │ ╰───┴────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────╯ │
# => ╰───┴───────┴─────────┴─────────┴───────┴───────────────────────┴───────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

[`plugin list`](/commands/docs/plugin_list.md) merges two sources: the plugins loaded into the current session (the engine), and the entries in the registry file. The `shell` column holds the interpreter given to `plugin add --shell`, and is empty otherwise. For a plugin in both places, `version`, `filename`, `shell`, and `commands` come from the engine. For a plugin only in the registry file, they come from the file. The `status` column compares the two:

| Status     | Meaning                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------- |
| `added`    | In the registry file, but not loaded into this session yet (added with `plugin add`, not used) |
| `loaded`   | In both, with the same details, and not running                                                |
| `running`  | Running now, with its process ID in `pid`. This status wins over all the others                |
| `modified` | In both, but the registry entry has a different filename, shell, or command list               |
| `removed`  | Loaded into this session, but no longer in the registry file (after `plugin rm`)               |
| `invalid`  | The registry entry can't be read, and the plugin needs to be added again                       |

For example, a plugin you've just added stays `added` until you `plugin use` it or start a new session, and one you remove stays listed as `removed` until the session ends:

```nu
plugin add nu_plugin_gstat
plugin list | select name status
# => ╭───┬───────┬────────╮
# => │ # │ name  │ status │
# => ├───┼───────┼────────┤
# => │ 0 │ gstat │ added  │
# => ╰───┴───────┴────────╯
```

```nu
plugin rm gstat
plugin list | select name status
# => ╭───┬───────┬─────────╮
# => │ # │ name  │ status  │
# => ├───┼───────┼─────────┤
# => │ 0 │ gstat │ removed │
# => ╰───┴───────┴─────────╯
```

`plugin list --engine` (`-e`) lists only what's loaded in the session, and `plugin list --registry` (`-r`) lists only the registry file, where every status is `added` or `invalid`. `--plugin-config` reads another registry file. Under `nu --no-config-file`, a plain `plugin list` shows the session's plugins without an error, but `--registry` needs `--plugin-config`.

All of the commands from installed plugins are available in the current scope:

```nu
scope commands | where type == "plugin"
```

[`version`](/commands/docs/version.md) also names the plugins, in its `installed_plugins` column. It is a single string with each plugin's name and version, separated by commas:

```nu
version | get installed_plugins
# => polars 0.117.0, query 0.117.0
```

The column lists the plugins loaded into the current session, running or not. A plugin you have only registered with `plugin add` appears after `plugin use` or a restart, and one you remove with `plugin rm` stays until the session ends. A plugin that didn't report a version is listed by its name alone.

::: details The other fields of `version`
`version` returns one record. Besides `installed_plugins`, it has:

- `version`, `major`, `minor`, `patch`: the Nushell version as a string and as three integers. `pre` and `build` appear only for a version with a pre-release or build-metadata part.
- `branch` and `commit_hash`: the Git branch and commit the binary was built from. `commit_hash`, and `build_pr` for a build made from a pull request, appear only when the build set them.
- `build_os`, `build_target`, `build_time`, `build_rust_channel`: the platform and target triple, when the binary was built, and whether it's a `release` or `debug` build.
- `rust_version`, `rust_channel`, `cargo_version`: the Rust toolchain that built it.
- `allocator`: the memory allocator, `standard` in this version.
- `features`: the Cargo features compiled in, as one comma-separated string. Plugins need the `plugin` feature.
- `experimental_options`: each [experimental option](./configuration.md#experimental-options) and whether it's on, as `name=true` or `name=false`, separated by commas.

`version` can run at parse time, so a constant can hold its result:

```nu
const v = (version)
$v.minor
# => 117
```

:::

### Plugin Lifecycle

Plugins stay running while they are in use, and are automatically stopped by default after a period of time of inactivity. This behavior is managed by the [plugin garbage collector](#plugin-garbage-collector). To manually stop a plugin, call `plugin stop` with its name:

For example, run the `query` command from the corresponding plugin, then check its `status` status:

```nu
http get http://example.com | query web --document --query body | ignore
plugin list | where name == query | select name status
# => ╭───┬───────┬─────────╮
# => │ # │ name  │ status  │
# => ├───┼───────┼─────────┤
# => │ 0 │ query │ running │
# => ╰───┴───────┴─────────╯
```

Now stop the plugin manually, and we can see that it is no longer running:

```nu
plugin stop query
plugin list | where name == query | select name status
# => ╭───┬───────┬────────╮
# => │ # │ name  │ status │
# => ├───┼───────┼────────┤
# => │ 0 │ query │ loaded │
# => ╰───┴───────┴────────╯
```

[`plugin stop`](/commands/docs/plugin_stop.md) also accepts the plugin's filename, as a path from the current directory or a full path. Stopping a plugin that is loaded but not running does nothing. A name that matches no plugin loaded in the session is an error:

```nu
plugin stop cool
# => Error: nu::shell::error
# =>
# =>   × Failed to stop the `cool` plugin
# =>    ╭─[source:1:13]
# =>  1 │ plugin stop cool
# =>    ·             ──┬─
# =>    ·               ╰── couldn't find a plugin with this name
# =>    ╰────
# =>   help: you may need to `plugin add` the plugin first
```

A stopped plugin starts again the next time you run one of its commands.

### Plugin Garbage Collector

As mentioned above, Nu comes with a plugin garbage collector which automatically stops plugins that are not actively in use after a period of time (by default, 10 seconds). This behavior is fully configurable:

```nu
$env.config.plugin_gc = {
    # Settings for plugins not otherwise specified:
    default: {
        enabled: true # set to false to never automatically stop plugins
        stop_after: 10sec # how long to wait after the plugin is inactive before stopping it
    }
    # Settings for specific plugins, by plugin name
    # (i.e. what you see in `plugin list`):
    plugins: {
        gstat: {
            stop_after: 1min
        }
        inc: {
            stop_after: 0sec # stop as soon as possible
        }
        example: {
            enabled: false # never stop automatically
        }
    }
}
```

A record under `plugins` doesn't inherit from `default`. A key it leaves out takes the built-in value (`enabled: true`, `stop_after: 10sec`), not the one in `default`:

```nu
$env.config.plugin_gc = {
    default: { enabled: false, stop_after: 1min }
    plugins: { gstat: { stop_after: 5sec } }
}
$env.config.plugin_gc.plugins.gstat
# => ╭────────────┬──────╮
# => │ enabled    │ true │
# => │ stop_after │ 5sec │
# => ╰────────────┴──────╯
```

`stop_after` must not be negative:

```nu
$env.config.plugin_gc.default.stop_after = -1sec
# => Error: nu::shell::invalid_config
# =>
# =>   × Encountered 1 error(s) when updating config
# =>
# => Error: nu::shell::invalid_value
# =>
# =>   × Invalid value for $env.config.plugin_gc.default.stop_after
# =>    ╭─[source:1:44]
# =>  1 │ $env.config.plugin_gc.default.stop_after = -1sec
# =>    ·                                            ──┬──
# =>    ·                                              ╰── expected a non-negative duration, but got -1sec
# =>    ╰────
```

For information on when a plugin is considered to be active, see [the relevant section in the contributor book](/contributor-book/plugins.html#plugin-garbage-collection).

### Plugin configuration

Some plugins read settings from `$env.config.plugins`, in a key named after the plugin (the name `plugin list` shows). The value can be anything the plugin expects, usually a record:

```nu
$env.config.plugins.motd = { message: "Nushell rocks!" }
```

The value can also be a closure. Nu runs it each time the plugin asks for its settings, with no arguments, in the scope of the command call, and hands the plugin the result. That lets the settings depend on the environment at the time of the call:

```nu
$env.config.plugins.motd = {|| { message: $"Hello from (pwd)" } }
```

If the closure fails, the plugin receives the error as its configuration value, and what happens next is up to the plugin. The core plugins (`polars`, `formats`, `gstat`, `query`, `inc`) don't read `$env.config.plugins`. Among the plugins that ship with Nushell, only the developer example `nu_plugin_example` does, in its `example config` command. A third-party plugin's documentation lists the settings it reads. The experimental built-in `clip` commands also look here, under `clip`, `clipboard`, or `nu_plugin_clipboard`, so that settings written for the third-party `nu_plugin_clipboard` keep working. See [Clipboard](./config_reference.md#clipboard).

## Removing Plugins

To remove a plugin, call `plugin rm <plugin_name>`. For example, if you previously added the plugin `~/.cargo/bin/nu_plugin_gstat`, its name would be `gstat`. To remove it:

```nu
plugin rm gstat
```

You can confirm the name of a plugin by running `plugin list`. [`plugin rm`](/commands/docs/plugin_rm.md) also accepts the filename, as a path from the current directory or a full path, such as `plugin rm ~/.cargo/bin/nu_plugin_gstat`.

Running `plugin rm` removes the plugin from the registry so that it will not be loaded the next time Nushell starts. However, any commands created by the plugin remain in scope until the current Nushell session ends.

If the registry file has no such plugin, `plugin rm` fails:

```nu
plugin rm cool
# => Error: nu::shell::error
# =>
# =>   × Failed to remove the `cool` plugin
# =>    ╭─[source:1:11]
# =>  1 │ plugin rm cool
# =>    ·           ──┬─
# =>    ·             ╰── couldn't find a plugin with this name in the registry file
# =>    ╰────
```

`plugin rm --force` (`-f`) skips that error, which helps in scripts that remove a plugin that may not be there. Like `plugin add`, `plugin rm` takes `--plugin-config` to edit a registry file other than `$nu.plugin-path`.

## For Plugin Developers

Nu plugins are executables; Nu launches them as needed and communicates with them over [stdin and stdout](https://en.wikipedia.org/wiki/Standard_streams) or [local sockets](https://en.wikipedia.org/wiki/Inter-process_communication). Nu plugins can use either [JSON](https://www.json.org/) or [MessagePack](https://msgpack.org/) as their communication encoding.

### Examples

Nu's main repo contains example plugins that are useful for learning how the plugin protocol works:

- [Rust](https://github.com/nushell/nushell/tree/main/crates/nu_plugin_example)
- [Python](https://github.com/nushell/nushell/blob/main/crates/nu_plugin_python)
- [Nu](https://github.com/nushell/nushell/tree/main/crates/nu_plugin_nu_example)
- [JavaScript (Node.js)](https://github.com/nushell/nushell/tree/main/crates/nu_plugin_javascript)

The JavaScript example is a single file, `nu_plugin_node_example.js`, that speaks the JSON encoding of the protocol. Its one command, `node_example`, ignores its arguments and returns a 10-row table. The file hard-codes the Nushell version it works with in the `NUSHELL_VERSION` constant, `'0.103.1'` as shipped. During the handshake, the plugin exits unless that constant equals the version of `nu` exactly, and `nu` itself refuses a plugin that reports an incompatible version. Before you add the plugin, set the constant to your version, the value of `(version).version`. Then register the file with Node.js as the interpreter, giving `--shell` the full path to `node`:

```nu
plugin add --shell (which node | get path.0) ./nu_plugin_node_example.js
plugin use node_example
node_example 2 "3" | first 3
# => ╭───┬─────┬─────┬───────╮
# => │ # │ one │ two │ three │
# => ├───┼─────┼─────┼───────┤
# => │ 0 │   0 │   0 │     0 │
# => │ 1 │   1 │   2 │     3 │
# => │ 2 │   2 │   4 │     6 │
# => ╰───┴─────┴─────┴───────╯
```

The Python example, `nu_plugin_python_example.py`, and the Nu example, `nu_plugin_nu_example.nu`, work the same way. They speak JSON, and each returns a 10-row table like the one above, after printing the call it received to stderr. They also hard-code `NUSHELL_VERSION` and exit during the handshake unless it equals the version of `nu` exactly, which is stricter than Nu's own rule of a matching minor version. When that happens, `plugin add` doesn't report a version mismatch. It fails with "Failed to receive response to plugin call from `nu_example`" (or `python_example`), so set the constant first.

Nu runs a `.py` file with the `python` command in your `PATH`, and a `.nu` file with `nu --stdin`, using the first `nu` in your `PATH`, so neither example needs `--shell`. That `nu` may not be the one you're running. If your Python is only installed as `python3`, pass its path with `--shell`. The Python example's command is `nu-python`, from a plugin named `python_example`. The Nu example's command is `nu_plugin_nu_example`, from a plugin named `nu_example`:

```nu
plugin add ./nu_plugin_nu_example.nu
plugin use nu_example
nu_plugin_nu_example 1 a
```

### Debugging

The simplest way to debug a plugin is to print to stderr; plugins' standard error streams are redirected through Nu and displayed to the user.

#### Tracing

The Nu plugin protocol message stream may be captured for diagnostic purposes using [trace_nu_plugin](https://crates.io/crates/trace_nu_plugin/).

::: warning
Trace output will accumulate for as long as the plugin is installed with the trace wrapper. Large files are possible. Be sure to remove the plugin with `plugin rm` when finished tracing, and reinstall without the trace wrapper.
:::

### Developer Help

Nu's plugin documentation is a work in progress. If you're unsure about something, the #plugins channel on [the Nu Discord](https://discord.gg/NtAbbGn) is a great place to ask questions!

### More details

The [plugin chapter in the contributor book](/contributor-book/plugins.md) offers more details on the intricacies of how plugins work from a software developer point of view.
