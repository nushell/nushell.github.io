# Plugins

Nu can be extended using plugins. Plugins behave much like Nu's built-in commands, with the added benefit that they can be added separately from Nu itself.

::: warning Important
Plugins communicate with Nushell using the `nu-plugin` protocol. This protocol is versioned, and plugins must use the same `nu-plugin` version provided by Nushell.

When updating Nushell, please make sure to also update any plugins that you have registered.
:::

[[toc]]

## Installing Plugins

### Core Plugins

Nushell ships with a set of officially maintained plugins which includes:

- `polars`: Extremely fast columnar operations using DataFrames via the [Polars Library](https://github.com/pola-rs/polars). See the [DataFrames Chapter](dataframes.html) for more details.
- `formats`: Support for several additional data formats - EML, ICS, INI, plist, and VCF.
- `gstat`: Returns information on the status of a Git repository as Nushell structured data.
- `query`: Support for querying SQL, XML, JSON, HTML (via selector), and WebPage Metadata
- `inc`: Increment a value or version (e.g., semver). This plugin acts as both an end-user plugin as well as a simple developer example of how to create a plugin.

Nushell also ships with several plugins that serve as examples or tools for plugin developers. These include `nu_plugin_example`, `nu_plugin_custom_values`, and `nu_plugin_stress_internals`.

Core plugins are typically distributed with the Nushell release and should already be installed in the same directory as the Nushell executable. If this is the case on your system, core plugins should be using correct `nu-plugin` protocol version. If your package management system installs them separately, please make sure to update the core plugins whenever Nushell itself is updated.

::: tip Installing using Cargo
For example, when installing or upgrading Nushell directly from crates.io using `cargo install nu`, the corresponding core plugins for that version may also be installed or updated using `cargo install nu_plugin_<plugin_name>`.
:::

### Third-party Plugins

To install a third-party plugin on your system, you first need to make sure that the plugin uses the same version of Nu as your system.

```nu
> version
```

Find plugins that have the exact same Nushell version either on crates.io, online Git repositories, or [`awesome-nu`](https://github.com/nushell/awesome-nu/blob/main/plugin_details.md). You can find which version the plugin uses by checking the `Cargo.toml` file.

To install a plugin by name from crates.io, run:

```nu
> cargo install plugin_name
```

When installing from a repository (e.g., GitHub), run the following from inside the cloned repository:

```nu
> cargo install --path .
```

This will create a binary file that can be used to add the plugin.

Keep in mind that when installing using crates.io, the binary might be saved in different locations depending on how your system is configured. The default location is in the users's home directory under `.cargo/bin`.

## Registering Plugins

To add a plugin to the plugin registry file, call the [`plugin add`](/commands/docs/plugin_add.md) command to tell Nu where to find it.

::: tip Note
The plugin file name must start with `nu_plugin_`, Nu uses this filename prefix to identify plugins.
:::

- Linux and macOS:

  ```nu
  > plugin add ./my_plugins/nu_plugin_cool
  ```

- Windows:

  ```nu
  > plugin add .\my_plugins\nu_plugin_cool.exe
  ```

When [`plugin add`](/commands/docs/plugin_add.md) is called, Nu:

- Runs the plugin binary
- Communicates via the [plugin protocol](/contributor-book/plugin_protocol_reference.md) in order to ensure compatibility and to get a list of all of the commands it supports
- This plugin information is then saved to the plugin registry file (`$nu.plugin-path`), which acts as a cache

Once added to the registry, the next time `nu` is started, the plugin will be available in that session.

You can also immediately reload a plugin in the current session by calling `plugin use`. In this case, the name of the plugin (rather than the filename) is used without the `nu_plugin` prefix:

```nu
> plugin use cool
```

It is not necessary to add `plugin use` statements to your config file. All previously added plugins are automatically loaded at startup.

::: tip Note
`plugin use` is a parser keyword, so when evaluating a script, it will be evaluated first. This means that while you can execute `plugin add` and then `plugin use` at the REPL on separate lines, you can't do this in a single script. If you need to run `nu` with a specific plugin or set of plugins without preparing a cache file, you can pass the `--plugins` option to `nu` with a list of plugin executable files:

```nu
> nu --plugins '[./my_plugins/nu_plugin_cool]'
```

:::

### Updating Plugins

When updating a plugin, it is important to run `plugin add` again just as above to load the new signatures from the plugin and allow Nu to rewrite them to the plugin file (`$nu.plugin-path`). You can then `plugin use` to get the updated signatures within the current session.

## Managing Plugins

Installed plugins are displayed using [`plugin list`](/commands/docs/plugin_list.md):

```nu
> plugin list
╭───┬─────────┬────────────┬─────────┬───────────────────────┬───────┬───────────────────────────────╮
│ # │  name   │ is_running │   pid   │       filename        │ shell │           commands            │
├───┼─────────┼────────────┼─────────┼───────────────────────┼───────┼───────────────────────────────┤
│ 0 │ gstat   │ true       │ 1389890 │ .../nu_plugin_gstat   │       │ ╭───┬───────╮                 │
│   │         │            │         │                       │       │ │ 0 │ gstat │                 │
│   │         │            │         │                       │       │ ╰───┴───────╯                 │
│ 1 │ inc     │ false      │         │ .../nu_plugin_inc     │       │ ╭───┬─────╮                   │
│   │         │            │         │                       │       │ │ 0 │ inc │                   │
│   │         │            │         │                       │       │ ╰───┴─────╯                   │
│ 2 │ example │ false      │         │ .../nu_plugin_example │       │ ╭───┬───────────────────────╮ │
│   │         │            │         │                       │       │ │ 0 │ nu-example-1          │ │
│   │         │            │         │                       │       │ │ 1 │ nu-example-2          │ │
│   │         │            │         │                       │       │ │ 2 │ nu-example-3          │ │
│   │         │            │         │                       │       │ │ 3 │ nu-example-config     │ │
│   │         │            │         │                       │       │ │ 4 │ nu-example-disable-gc │ │
│   │         │            │         │                       │       │ ╰───┴───────────────────────╯ │
╰───┴─────────┴────────────┴─────────┴───────────────────────┴───────┴───────────────────────────────╯
```

All of the commands from installed plugins are available in the current scope:

```nu
> scope commands | where type == "plugin"
```

### Plugin Lifecycle

Plugins stay running while they are in use, and are automatically stopped by default after a period of time of inactivity. This behavior is managed by the [plugin garbage collector](#plugin-garbage-collector). To manually stop a plugin, call `plugin stop` with its name:

For example, run the `gstat` command from the corresponding plugin, then check its `is_running` status:

```nu
gstat
# => gstat output
plugin list | where name == gstat | select name is_running
# =>
╭───┬───────┬────────────╮
│ # │ name  │ is_running │
├───┼───────┼────────────┤
│ 0 │ gstat │ true       │
╰───┴───────┴────────────╯
```

Now stop the plugin manually, and we can see that it is no longer running:

```nu
plugin stop gstat
plugin list | where name == gstat | select name is_running
# =>
╭───┬───────┬────────────╮
│ # │ name  │ is_running │
├───┼───────┼────────────┤
│ 0 │ gstat │ false      │
╰───┴───────┴────────────╯
```

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

For information on when a plugin is considered to be active, see [the relevant section in the contributor book](/contributor-book/plugins.html#plugin-garbage-collection).

## Removing Plugins

To remove a plugin, call `plugin rm <plugin_name>`. Note that this is the plugin name, rather than the filename. For example, if you previously added the plugin `~/.cargo/bin/nu_plugin_gstat`, its name would be `gstat`. To remove it:

```nu
plugin rm gstat
```

You can confirm the name of a plugin by running `plugin list`.

Running `plugin rm` removes the plugin from the registry so that it will not be loaded the next time Nushell starts. However, any commands created by the plugin remain in scope until the current Nushell session ends.

## For Plugin Developers

Nu plugins are executables; Nu launches them as needed and communicates with them over [stdin and stdout](https://en.wikipedia.org/wiki/Standard_streams) or [local sockets](https://en.wikipedia.org/wiki/Inter-process_communication). Nu plugins can use either [JSON](https://www.json.org/) or [MessagePack](https://msgpack.org/) as their communication encoding.

### Examples

Nu's main repo contains example plugins that are useful for learning how the plugin protocol works:

- [Rust](https://github.com/nushell/nushell/tree/main/crates/nu_plugin_example)
- [Python](https://github.com/nushell/nushell/blob/main/crates/nu_plugin_python)

### Debugging

The simplest way to debug a plugin is to print to stderr; plugins' standard error streams are redirected through Nu and displayed to the user.

#### Tracing

The Nu plugin protocol message stream may be captured for diagnostic purposes using [trace_nu_plugin](https://crates.io/crates/trace_nu_plugin/).

**WARNING: trace output will accumulate for as long as the plugin is installed with the trace wrapper. Large files are possible. Be sure to remove the plugin with `plugin rm` when finished tracing, and reinstall without the trace wrapper.**

### Developer Help

Nu's plugin documentation is a work in progress. If you're unsure about something, the #plugins channel on [the Nu Discord](https://discord.gg/NtAbbGn) is a great place to ask questions!

### More details

The [plugin chapter in the contributor book](/contributor-book/plugins.md) offers more details on the intricacies of how plugins work from a software developer point of view.
