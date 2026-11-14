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

[Using the core plugins](#using-the-core-plugins) describes the commands each of these plugins adds.

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

The `plugin` subcommands manage plugins. [`plugin`](/commands/docs/plugin.md) on its own only prints its help text, which lists them: `plugin add`, `plugin list`, `plugin rm`, `plugin stop`, and `plugin use`.

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

## Using the core plugins

Each command below links to its reference page, which lists the flags. This section covers what the commands return and the cases those pages don't explain.

### The polars plugin

The `polars` plugin adds the `polars` commands for working with dataframes. The [DataFrames chapter](dataframes.md) covers them, and the "Polars value types" box in the [quickstart](#core-plugin-quickstart) lists the kinds of values they return.

### The formats plugin

The `formats` plugin reads five more file formats: email messages (`.eml`), iCalendar files (`.ics`), INI files (`.ini`), property lists (`.plist`), and vCard contacts (`.vcf`). The only one it writes is the property list. With the plugin loaded, [`open`](/commands/docs/open.md) runs the matching `from` command for each of these extensions, and [`save`](/commands/docs/save.md) runs [`to plist`](/commands/docs/to_plist.md) for a `.plist` file. Saving structured data to one of the other extensions fails, because there's no `to` command for it.

For a file with a different extension, pipe `open --raw` into the command, as in `open --raw message.txt | from eml`. [`from eml`](/commands/docs/from_eml.md), [`from ics`](/commands/docs/from_ics.md), [`from ini`](/commands/docs/from_ini.md), and [`from vcf`](/commands/docs/from_vcf.md) take text and don't convert values, so a port number or a date comes back as a string. Use [`into int`](/commands/docs/into_int.md) or [`into datetime`](/commands/docs/into_datetime.md) on the fields you need. [`from plist`](/commands/docs/from_plist.md) is different, since property lists store typed values.

#### Email messages

`from eml` turns one email message into a record:

```nu
let message = "From: Alice <alice@example.com>
To: Bob <bob@example.com>, carol@example.com
Subject: Lunch
X-Priority: 3

Are we still on for Friday? I can book a table for noon."
$message | from eml
# => ╭────────────┬────────────────────────────────────────────────────╮
# => │ Subject    │ Lunch                                              │
# => │ From       │ {record 2 fields}                                  │
# => │ To         │ [table 2 rows]                                     │
# => │ X-Priority │ 3                                                  │
# => │ Body       │ Are we still on for Friday? I can book a table for │
# => ╰────────────┴────────────────────────────────────────────────────╯
$message | from eml | get To | to nuon
# => [[Name, Address]; [Bob, "bob@example.com"], [null, "carol@example.com"]]
```

The record starts with `Subject`, `From`, and `To`, then has the other headers in the order they appear, then `Body`. The headers that hold addresses (`From`, `To`, `Reply-To`, `Delivered-To`, `X-Original-To`, and `Return-Path`) become a record with `Name` and `Address`, or a list of those records when there are several addresses. `Name` is `null` for a bare address. Every other header, `Cc` included, stays a string, with encoded words such as `=?UTF-8?B?...?=` decoded. A header with an empty value becomes `null`. Header names are case-sensitive, so a `subject:` header is an ordinary header and doesn't fill in `Subject`. When a header appears more than once, as `Received` usually does, the record keeps the last one.

`Body` is the text after the headers, exactly as it is in the file. Quoted-printable text and MIME parts aren't decoded. It's also cut to the first 50 bytes, which is why the body above stops at "for". `--preview-body` (`-b`) sets a different limit in bytes. The cut never splits a character, and a negative limit gives an empty body. To keep the whole body, pass a limit larger than the message, such as `--preview-body 1_000_000`.

Text that doesn't start with a header fails with "Can't convert to structured eml data". A message made only of headers needs a blank line after them. Without one, `from eml` fails the same way, or crashes the plugin with "Failed to receive response to plugin call from `formats`" when the text doesn't end with a newline. The address parser also misreads one kind of list. When a bare address comes before a named one, as in `bob@example.com, Carol <carol@example.com>`, the result is a single address named `bob@example.com, Carol`.

#### Calendars and contacts

`from ics` reads iCalendar data and `from vcf` reads vCard contacts. Both return a list with one record for each `BEGIN:VCALENDAR` or `BEGIN:VCARD` block, and both turn each property line in the block into a record with three fields:

- `name`: the property name, such as `SUMMARY` or `EMAIL`.
- `value`: the value, as a string. Dates such as `20261120T120000` aren't converted.
- `params`: `null`, or a record that maps each parameter to a list of strings.

Before parsing, both commands join each continuation line, one that starts with a space or a tab, to the line before it.

A contact record has a single column, `properties`. A calendar record has `properties` for the calendar itself and a list for each kind of component: `events`, `alarms`, `to-Dos`, `journals`, `free-busys`, and `timezones`. Each component is a record with its own `properties`. Events and to-dos also have an `alarms` list, and time zones have a `transitions` list.

```nu
let calendar = 'BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:Lunch with the team
DTSTART;TZID=America/Chicago:20261120T120000
ATTENDEE;ROLE=CHAIR;CN=Bob:mailto:bob@example.com
END:VEVENT
END:VCALENDAR'
$calendar | from ics | get 0.events.0.properties
# => ╭───┬──────────┬────────────────────────┬───────────────────╮
# => │ # │   name   │         value          │      params       │
# => ├───┼──────────┼────────────────────────┼───────────────────┤
# => │ 0 │ SUMMARY  │ Lunch with the team    │                   │
# => │ 1 │ DTSTART  │ 20261120T120000        │ {record 1 field}  │
# => │ 2 │ ATTENDEE │ mailto:bob@example.com │ {record 2 fields} │
# => ╰───┴──────────┴────────────────────────┴───────────────────╯
$calendar | from ics | get 0.events.0.properties.2.params | to nuon
# => {ROLE: [CHAIR], CN: [Bob]}
```

To get one record per event, with a column for each property, turn each `properties` table around with [`transpose`](/commands/docs/transpose.md):

```nu
$calendar | from ics | get 0.events | each {|event|
    $event.properties | select name value | transpose --header-row --as-record
}
# => ╭───┬─────────────────────┬─────────────────┬────────────────────────╮
# => │ # │       SUMMARY       │     DTSTART     │        ATTENDEE        │
# => ├───┼─────────────────────┼─────────────────┼────────────────────────┤
# => │ 0 │ Lunch with the team │ 20261120T120000 │ mailto:bob@example.com │
# => ╰───┴─────────────────────┴─────────────────┴────────────────────────╯
```

`transpose` keeps only the first of several properties with the same name, and a contact often has more than one `EMAIL` or `TEL`. Collect those with [`where`](/commands/docs/where.md) instead:

```nu
let cards = 'BEGIN:VCARD
FN:Alice Example
EMAIL;TYPE=work:alice@example.com
EMAIL;TYPE=home:alice@home.example
END:VCARD
BEGIN:VCARD
FN:Bob Example
EMAIL:bob@example.com
END:VCARD'
$cards | from vcf | each {|card|
    let props = $card.properties
    {
        name: ($props | where name == FN | get 0.value)
        email: ($props | where name == EMAIL | get value)
    }
} | to nuon
# => [[name, email]; ["Alice Example", ["alice@example.com", "alice@home.example"]], ["Bob Example", ["bob@example.com"]]]
```

`into datetime --format '%Y%m%dT%H%M%S'` turns a date such as `20261120T120000` into a datetime. The result is in your local time zone, whatever `TZID` parameter the property has.

Empty input gives an empty list. Text that isn't iCalendar or vCard data doesn't stop the command. The list holds an error in place of a record, so `'hello' | from ics | length` returns `1`. The error appears when you use that item, for example when the list is displayed:

```nu
'hello' | from ics
# => Error: nu::shell::unsupported_input
# =>
# =>   × Unsupported input
# =>    ╭─[source:1:1]
# =>  1 │ 'hello' | from ics
# =>    · ───┬───   ────┬───
# =>    ·    │          ╰── input cannot be parsed as .ics (property error: Line 1: Missing property name.)
# =>    ·    ╰── value originates from here
# =>    ╰────
```

#### INI files

`from ini` returns a record with an entry for each section, which holds that section's keys and values. Keys above the first section header go in a section named with the empty string, which you can read with `get ''`:

```nu
let config = '; global settings
name = demo

[server]
port = 8080
host = "localhost"'
$config | from ini | to nuon
# => {"": {name: demo}, server: {port: "8080", host: localhost}}
```

A key and its value can be separated by `=` or `:`. Lines that start with `;` or `#` are comments, but a `;` later in a line is part of the value, so `port = 8080 ; the default` gives `"8080 ; the default"`. A section with no keys becomes an empty record.

The flags turn parts of the parsing off or on:

- Quotes around a value are removed. `--no-quote` (`-q`) keeps them.
- Backslash escapes in values, such as `\t` and `\n`, become a tab and a newline. That breaks Windows paths. `C:\temp\new` turns into `C:`, a tab, `emp`, a newline, and `ew`. `--no-escape` (`-e`) keeps backslashes as they are.
- `--indented-multiline-value` (`-m`) reads an indented line as more of the previous value, joined with a newline. Without it, an indented line runs into the next key's name. The lines `text = line one`, `  line two`, and `next = 3` give a key named `"line two\nnext"` with the value `"3"`.
- Leading spaces in key names are trimmed unless you pass `--preserve-key-leading-whitespace` (`-w`). If you also pass `-m`, an indented line is still read as part of the previous value, not as a key.

```nu
'[paths]
temp = C:\temp\new' | from ini --no-escape | get paths.temp
# => C:\temp\new
```

A line with no `=` or `:` is an error:

```nu
"[server]\nport" | from ini
# => Error: nu::shell::unsupported_input
# =>
# =>   × Unsupported input
# =>    ╭─[source:1:1]
# =>  1 │ "[server]\nport" | from ini
# =>    · ────────┬───────   ────┬───
# =>    ·         │              ╰── Could not load ini: 2:5 expecting "[Some('='), Some(':')]" but found EOF.
# =>    ·         ╰── value originates from here
# =>    ╰────
```

A section name that appears twice, or a key that appears twice in one section, fails with "Plugin failed to decode: invalid entry, duplicate keys are not allowed for `Record`".

#### Property lists

`from plist` reads XML, binary, and old-style text (OpenStep) property lists, from a string or from binary data. Any other input, or data that isn't a property list, fails with "Could not load plist". Because binary input works, `open` can read the binary `.plist` files that macOS keeps in `~/Library/Preferences`. `to plist` writes an XML property list as text, or a binary one with `--binary` (`-b`).

| Property list type | Nushell type                         |
| ------------------ | ------------------------------------ |
| `dict`             | record                               |
| `array`            | list                                 |
| `string`           | string                               |
| `integer`          | int (one too large for an int fails) |
| `real`             | float                                |
| `true`, `false`    | bool                                 |
| `date`             | datetime, in UTC                     |
| `data`             | binary                               |
| UID                | float                                |

`to plist` goes the other way. It also takes a filesize, which it writes as an integer number of bytes, and it writes datetimes in UTC. A round trip changes both:

```nu
{name: demo, size: 2kB, saved: 2026-11-14T12:30:00-06:00} | to plist | from plist | to nuon
# => {name: demo, size: 2000, saved: 2026-11-14T18:30:00+00:00}
```

A value with no property list type, such as `null`, a duration, or a range, fails the whole conversion, wherever it is in the input. The error names the value:

```nu
{name: demo, timeout: 5sec} | to plist
# => Error: nu::shell::error
# =>
# =>   × Cannot convert plist
# =>   [Failed to read contents for label `Duration(5s) is not convertible` (offset: 9223372036854775807, length: 0): OutOfBounds]
```

`save settings.plist` writes an XML property list. To write a binary one, use `to plist --binary | save --raw settings.plist`. Without `--raw`, `save` runs `to plist` again on the binary data, and the file ends up as an XML property list holding one `data` element.

### The gstat plugin

[`gstat`](/commands/docs/gstat.md) sums up the status of a Git repository in one record, which is handy in a [prompt](./configuration.md#prompt-configuration). It reads the repository with the libgit2 library, so it doesn't need the `git` command.

With no argument, `gstat` looks at the current directory. You can also pass a directory, or pipe one in as a string. Any directory inside a repository works, as it does with `git`. A path that doesn't exist or isn't a directory is an error ("path does not exist" or "path is not a directory").

```nu
gstat
# => ╭─────────────────────┬───────────────────╮
# => │ idx_added_staged    │ 1                 │
# => │ idx_modified_staged │ 0                 │
# => │ idx_deleted_staged  │ 0                 │
# => │ idx_renamed         │ 0                 │
# => │ idx_type_changed    │ 0                 │
# => │ wt_untracked        │ 1                 │
# => │ wt_modified         │ 1                 │
# => │ wt_deleted          │ 0                 │
# => │ wt_type_changed     │ 0                 │
# => │ wt_renamed          │ 0                 │
# => │ ignored             │ 1                 │
# => │ conflicts           │ 0                 │
# => │ ahead               │ 1                 │
# => │ behind              │ 0                 │
# => │ stashes             │ 0                 │
# => │ repo_name           │ repo              │
# => │ tag                 │ v0.1.0-2-g4450033 │
# => │ branch              │ main              │
# => │ remote              │ origin/main       │
# => │ state               │ clean             │
# => ╰─────────────────────┴───────────────────╯
```

| Column                                                                                             | Meaning                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `idx_added_staged`, `idx_modified_staged`, `idx_deleted_staged`, `idx_renamed`, `idx_type_changed` | Files with staged changes of each kind                                                                                                                                                                                                                                            |
| `wt_untracked`, `wt_modified`, `wt_deleted`, `wt_type_changed`, `wt_renamed`                       | Unstaged changes in the working tree. A deleted file paired with a similar untracked file counts once, in `wt_renamed`, and not in `wt_deleted` or `wt_untracked`. A renamed file that was also edited counts in `wt_modified` too                                                |
| `ignored`                                                                                          | Ignored files. An ignored directory counts once                                                                                                                                                                                                                                   |
| `conflicts`                                                                                        | Files with unresolved merge conflicts                                                                                                                                                                                                                                             |
| `ahead`, `behind`                                                                                  | Commits ahead of and behind the upstream branch, or `0` when there's no upstream                                                                                                                                                                                                  |
| `stashes`                                                                                          | Stash entries in the repository, whichever branch they were made on                                                                                                                                                                                                               |
| `repo_name`                                                                                        | The name of the working directory, or of the repository directory in a bare repository                                                                                                                                                                                            |
| `tag`                                                                                              | The nearest tag, the way `git describe --tags` shows it: the tag alone when `HEAD` is tagged, otherwise the tag, the number of commits since it, and `g` with the short commit hash, as in `v0.1.0-2-g4450033` above. `no_tag` when no tag is reachable                           |
| `branch`                                                                                           | The current branch. With a detached `HEAD`, the first 8 hex digits of the commit. In a repository with no commits yet, the branch that `HEAD` names                                                                                                                               |
| `remote`                                                                                           | The upstream branch, such as `origin/main`, or an empty string when there's none                                                                                                                                                                                                  |
| `state`                                                                                            | The operation in progress: `clean`, `merge`, `revert`, `revertsequence`, `cherrypick`, `cherrypicksequence`, `bisect`, `rebase`, `rebaseinteractive`, `rebasemerge`, `applymailbox`, or `applymailboxorrebase`. A `git rebase` stopped at a conflict shows as `rebaseinteractive` |

Outside a repository, every count is `-1`, and the text columns are `no_repository`, `no_tag`, `no_branch`, `no_remote`, and `no_state`. In a bare repository, or when libgit2 can't read the index, the status counts are `-1` and the other columns are filled in.

To find the tag, `gstat` walks back through the history from `HEAD` to the nearest tagged commit. In a large repository with no recent tag, that takes time on every call. `--no-tag` skips the search and reports `no_tag`.

This right prompt shows the branch and the numbers of staged, modified, and untracked files, and nothing outside a repository:

```nu
$env.PROMPT_COMMAND_RIGHT = {||
    let status = gstat --no-tag
    if $status.repo_name == "no_repository" {
        ""
    } else {
        $"($status.branch) +($status.idx_added_staged) ~($status.wt_modified) ?($status.wt_untracked)"
    }
}
```

In the repository above, it shows `main +1 ~1 ?1`. The [garbage collector](#plugin-garbage-collector) stops `gstat` after 10 seconds without a call, so the prompt often has to start it again. `$env.config.plugin_gc.plugins.gstat = { enabled: false }` keeps it running. If `gstat` is still slow in a large repository, see [Slow Prompt Segments](./configuration.md#slow-prompt-segments).

### The query plugin

The `query` plugin adds [`query json`](/commands/docs/query_json.md), [`query xml`](/commands/docs/query_xml.md), [`query web`](/commands/docs/query_web.md) for HTML, and [`query webpage-info`](/commands/docs/query_webpage-info.md). [`query`](/commands/docs/query.md) on its own returns its help text as a string, with a list of all the `query` subcommands. The list includes [`query db`](/commands/docs/query_db.md), which is built into Nushell and isn't part of the plugin.

All four commands take text. Read a file with `open --raw`, because a plain `open` parses a `.json` or `.xml` file into structured data, and structured input is an error:

```nu
{name: demo} | query json name
# => Error: nu::shell::error
# =>
# =>   × Problem with input data
# =>
# => Error: nu::shell::cant_convert
# =>
# =>   × Can't convert to string.
# =>    ╭─[source:1:1]
# =>  1 │ {name: demo} | query json name
# =>    · ──────┬─────
# =>    ·       ╰── can't convert record<name: string> to string
# =>    ╰────
```

The other commands report the same mistake as "Requires text input" (`query web`) or "Input type not supported" (`query xml` and `query webpage-info`). A page fetched with [`http get`](/commands/docs/http_get.md) is already text.

#### Querying JSON

`query json` runs a [GJSON](https://github.com/tidwall/gjson.rs) path against JSON text. For a plain lookup, `from json | get` does the same job. GJSON paths add `#` for the length of an array or for all of its elements, `#(...)` for the first element that matches a condition, `#(...)#` for all of them, `*` and `?` wildcards in keys, and modifiers such as `@reverse` after a `|`:

```nu
let json = '{"authors": [
    {"name": "Ann", "commits": 120, "active": true},
    {"name": "Bob", "commits": 45, "active": false},
    {"name": "Cy", "commits": 7.5, "active": true}
]}'
$json | query json 'authors.#(active==true)#.name'
# => ╭───┬─────╮
# => │ 0 │ Ann │
# => │ 1 │ Cy  │
# => ╰───┴─────╯
$json | query json 'authors.#(commits>100).name'
# => Ann
$json | query json 'authors.#.commits' | to nuon
# => [120, 45, 7.5]
```

The result comes back as Nushell data. Objects become records and arrays become lists. A number becomes a float if it's written with a decimal point, and an int otherwise. A path that matches nothing returns `null`, not an error. The `@pretty` and `@ugly` modifiers are the exception. With either one in the path, the result is JSON text, formatted or compacted:

```nu
$json | query json 'authors.0|@ugly'
# => {"name":"Ann","commits":120,"active":true}
```

Text that isn't JSON fails with "Invalid JSON". An object with the same key twice fails with "Plugin failed to decode: invalid entry, duplicate keys are not allowed for `Record`".

#### Querying XML

`query xml` runs an XPath 1.0 expression against XML text. An expression that computes a value returns it directly: a string, a bool, or a number, which is always a float. An expression that selects nodes returns a table with a row for each node, in document order.

XPath 1.0 has no default namespace. In a document that declares one with `xmlns="..."`, such as an Atom feed, a plain `//entry` matches nothing. Bind a prefix to the namespace with `--namespaces` (`-n`), a record that maps each prefix to a namespace URI string, and use the prefix in the expression. The `xml` prefix is always bound.

```nu
let feed = '<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
    <entry><title>First post</title><link href="https://example.com/1"/></entry>
    <entry><title>Second post</title><link href="https://example.com/2"/></entry>
</feed>'
$feed | query xml '//entry/title' | to nuon
# => []
$feed | query xml '//a:entry/a:title' --namespaces {a: "http://www.w3.org/2005/Atom"}
# => ╭───┬──────────────╮
# => │ # │ string_value │
# => ├───┼──────────────┤
# => │ 0 │ First post   │
# => │ 1 │ Second post  │
# => ╰───┴──────────────╯
$feed | query xml 'count(//a:entry)' --namespaces {a: "http://www.w3.org/2005/Atom"}
# => 2.0
$feed | query xml 'string(/*/@xml:lang)'
# => en
```

A prefix that isn't bound crashes the plugin with "Failed to receive response to plugin call from `query`".

By default each row has only `string_value`, the node's text. `--output-type` adds `type`, which is `element`, `attribute`, `text`, `comment`, `processing_instruction`, `root`, or `namespace`. `--output-names` adds `local_name`, `namespace`, and `prefixed_name`, which are `null` for a node without a name, such as text. Once you pass any of the `--output-*` switches, only the columns you ask for appear. Add `--output-string-value` to keep the text, which this example leaves out:

```nu
$feed | query xml '//a:entry[1]/* | //a:entry[1]/a:link/@href' --namespaces {a: "http://www.w3.org/2005/Atom"} --output-type --output-names
# => ╭───┬───────────┬────────────┬─────────────────────────────┬───────────────╮
# => │ # │   type    │ local_name │          namespace          │ prefixed_name │
# => ├───┼───────────┼────────────┼─────────────────────────────┼───────────────┤
# => │ 0 │ element   │ title      │ http://www.w3.org/2005/Atom │ title         │
# => │ 1 │ element   │ link       │ http://www.w3.org/2005/Atom │ link          │
# => │ 2 │ attribute │ href       │                             │ href          │
# => ╰───┴───────────┴────────────┴─────────────────────────────┴───────────────╯
```

XML that doesn't parse fails with "Invalid XML document", and an XPath expression that doesn't parse fails with "invalid xpath query". To work with the whole document as Nushell data instead, use [`from xml`](/commands/docs/from_xml.md).

#### Scraping HTML

`query web` picks elements out of HTML text with a CSS selector, given with `--query` (`-q`). The HTML usually comes from `http get`. Here it's a string:

```nu
let page = '<h1>Release <em>notes</em></h1>
<ul>
    <li><a href="/v2.html" title="Latest">Version 2</a></li>
    <li><a href="/v1.html">Version 1</a></li>
</ul>
<table>
    <tr><th>Version</th><th>Date</th><th>Notes</th></tr>
    <tr><td>2.0</td><td>2026-11-01</td><td>New parser</td></tr>
    <tr><td>1.0</td><td>2026-06-15</td></tr>
</table>'
$page | query web --query h1 | to nuon
# => [["Release ", notes]]
$page | query web --query h1 | each { str join }
# => ╭───┬───────────────╮
# => │ 0 │ Release notes │
# => ╰───┴───────────────╯
$page | query web --query 'li a' --attribute href | to nuon
# => ["/v2.html", "/v1.html"]
$page | query web --query 'li a' --attribute [href title]
# => ╭───┬──────────┬────────╮
# => │ # │   href   │ title  │
# => ├───┼──────────┼────────┤
# => │ 0 │ /v2.html │ Latest │
# => │ 1 │ /v1.html │        │
# => ╰───┴──────────┴────────╯
```

Each match gives a list of the pieces of text inside it, so a heading with an `em` element in it comes back as two strings, and [`str join`](/commands/docs/str_join.md) puts them back together. `--as-html` (`-m`) returns each match's HTML instead. `--attribute` (`-a`) returns the value of one attribute, or an empty string for an element that doesn't have it. Given a list of names, `--attribute` returns a table with a column for each. An empty string or an empty list counts as no `--attribute` at all, and any other kind of value gives an empty string for each match. `--attribute` takes precedence over `--as-html`, and `--as-table` takes precedence over both. Without `--query` or `--as-table`, the selector is empty, which is an error:

```nu
'<p>hi</p>' | query web
# => Error: nu::shell::error
# =>
# =>   × CSS query parse error
# =>    ╭─[source:1:15]
# =>  1 │ '<p>hi</p>' | query web
# =>    ·               ────┬────
# =>    ·                   ╰─┤ Unexpected error occurred. Please report this to the developer
# =>    ·                     │ EmptySelector
# =>    ╰────
# =>   help: cannot parse query as a valid CSS selector
```

`query web` parses its input as an HTML fragment, which drops the `head` and `body` tags but keeps what's inside them. A selector that names one of them, such as `body > p`, matches nothing unless you add `--document` (`-d`) to parse the input as a full document:

```nu
'<html><body><p>hi</p></body></html>' | query web --query 'body > p' | to nuon
# => []
'<html><body><p>hi</p></body></html>' | query web --document --query 'body > p' | to nuon
# => [[hi]]
```

`--as-table` (`-t`) turns an HTML `table` element into a Nushell table. Give it the names of the columns you want, and it finds the tables whose first row has `th` cells with those names, with or without `--document`:

```nu
$page | query web --as-table [Version Notes]
# => ╭───┬─────────┬─────────────────────────╮
# => │ # │ Version │          Notes          │
# => ├───┼─────────┼─────────────────────────┤
# => │ 0 │ 2.0     │ New parser              │
# => │ 1 │ 1.0     │ Missing column: 'Notes' │
# => ╰───┴─────────┴─────────────────────────╯
$page | query web --as-table [Price]
# => ╭───────┬─────────────────────────────────────────────────────╮
# => │ Price │ error: no data found (column name may be incorrect) │
# => ╰───────┴─────────────────────────────────────────────────────╯
```

The names are case-sensitive and must match the header text exactly, but you can ask for any of the columns, in any order. Cells come back as strings with their markup removed, and a row with too few cells gets `Missing column: 'NAME'`. A table with a header row and no data rows comes back as one row of filler values, not as an empty table. When more than one table matches, the result is a list of tables. When none does, the result is a record like the one above, not an error. A name that contains a header's text without being equal to it, such as `Full Name` for a `Name` column, crashes the plugin.

`--as-table []` returns every table on the page: the table itself when there's only one, and a list of tables when there are more. The columns of each come in no fixed order. A table with no `th` cells in its first row gets columns named `column0`, `column1`, and so on, and a table with its headers down the first column doesn't come out right.

`--inspect` (`-i`) helps you find the header names. With `--as-table`, it prints to stderr the names you passed, the first 2047 bytes of the HTML, the header row of every table on the page, and the tables that matched. On input shorter than 2047 bytes, it crashes the plugin. With `--query`, `--inspect` ignores the selector and returns the text of the whole page.

#### Page metadata

`query webpage-info` collects a page's metadata into a record:

```nu
let page = '<html lang="en">
<head>
    <title>Release notes</title>
    <meta name="description" content="What changed in each release">
    <meta property="og:title" content="Release notes">
    <link rel="alternate" type="application/rss+xml" href="/feed.xml">
</head>
<body><p>See <a href="/v2.html">version 2</a>.</p></body>
</html>'
$page | query webpage-info | reject text_content
# => ╭─────────────┬──────────────────────────────╮
# => │ title       │ Release notes                │
# => │ description │ What changed in each release │
# => │ url         │                              │
# => │ feed        │ /feed.xml                    │
# => │ language    │ en                           │
# => │ meta        │ {record 2 fields}            │
# => │ opengraph   │ {record 5 fields}            │
# => │ schema_org  │ [list 0 items]               │
# => │ links       │ [table 1 row]                │
# => ╰─────────────┴──────────────────────────────╯
$page | query webpage-info | get opengraph | to nuon
# => {og_type: website, properties: {title: "Release notes"}, images: [], videos: [], audios: []}
```

- `title` and `description` come from the `title` element and the `meta` tag named `description` in `head`, and `language` from the `lang` attribute of `html` or `body`. Each is `null` when the page doesn't set it.
- `url` is the page's canonical link, from `link rel="canonical"`, or `null`. When it's set, the URLs in `links` are made absolute against it. Otherwise they stay as written, because the command sees only the HTML, not where it came from.
- `feed` is the last RSS, Atom, or other feed linked with `rel="alternate"`.
- `text_content` is the text of the page body, whitespace included.
- `meta` maps the `property`, `name`, or `http-equiv` of each `meta` tag in `head` to its `content`, and has a `charset` entry when the page declares one.
- `opengraph` holds the `og:` properties. `og_type` is `website` when the page doesn't set `og:type`. `properties` has the other properties without their `og:` prefix, and `images`, `videos`, and `audios` are lists of records with a `url` and `properties`.
- `schema_org` has a record with `schema_type` and `value` for each JSON-LD block, a `script` element of type `application/ld+json`.
- `links` is a table with the `url` and `text` of each link.

### The inc plugin

[`inc`](/commands/docs/inc.md) takes a single value:

- An integer goes up by 1: `41 | inc` returns `42`.
- Without a flag, a string that holds a whole number goes up by 1 and stays a string, so `"41" | inc` returns `"42"`. Any other string comes back unchanged.
- With `--major` (`-M`), `--minor` (`-m`), or `--patch` (`-p`), a string is read as a [semantic version](https://semver.org) and that part goes up by 1. The parts after it reset to 0, and a pre-release or build suffix is dropped, so `"1.2.3-beta" | inc --minor` returns `"1.3.0"`. A string that isn't a valid version comes back unchanged. If you pass more than one of these flags, `--major` wins over `--minor`, and `--minor` over `--patch`.
- Any other type, including a list, is an error.

The optional `cell_path` argument increments the value at that path and returns the whole input, so `{version: "0.1.2"} | inc version --patch` returns `{version: "0.1.3"}`. To change a column in every row of a table, call `inc` from [`update`](/commands/docs/update.md): `$table | update version { inc --patch }`.

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
