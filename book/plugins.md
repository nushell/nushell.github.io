# Plugins

Nu can be extended using plugins. Plugins behave much like Nu's built-in commands, with the added benefit that they can be added separately from Nu itself.

Nu plugins are executables; Nu launches them as needed and communicates with them over [stdin, stdout, and stderr](https://en.wikipedia.org/wiki/Standard_streams). Nu plugins can use either JSON or MSGPACK as their communication encoding.

## Downloading and installing a plugin

::: warning

Please note that plugin installation methods are still under heavy development and that the following workflow will be refined before the release of 1.0. The nupm official package manager should simplify installation in the future when it becomes ready for general use.

:::

To install a plugin on your system, you first need to make sure that the plugin uses the same version of Nu as your system.

```nu
> version
```

Find plugins that have the exact same Nushell version either on crates.io, online git repositories or [`awesome-nu`](https://github.com/nushell/awesome-nu/blob/main/plugin_details.md). You can find which version the plugin uses by checking the Cargo.toml file.

To install a plugin by name from crates.io, run:

```nu
> cargo install plugin_name
```

If you chose to download the git repository instead, run this when inside the cloned repository:

```nu
> cargo install --path .
```

This will create a binary file that can be used to add the plugin.

Keep in mind that when installing using crates.io, the binary can be saved in different locations depending on how your system is set up. A typical location is in the users's home directory under .cargo/bin.

## Adding a plugin

To add a plugin to the plugin cache file, call the [`plugin add`](/commands/docs/plugin_add.md) command to tell Nu where to find it.

Please note that the plugin name needs to start with `nu_plugin_`, Nu uses the name prefix to detect plugins.

Linux+macOS:

```nu
> plugin add ./my_plugins/nu_plugin_cool
```

Windows:

```nu
> plugin add .\my_plugins\nu_plugin_cool.exe
```

When [`plugin add`](/commands/docs/plugin_add.md) is called, Nu runs the plugin binary and communicates via the [plugin protocol](plugin_protocol_reference.md) to get the signatures of all of the commands the plugin supports. It then saves information about the plugin, including the command signatures, to the plugin cache file at `$nu.plugin-path` in a custom brotli-compressed MessagePack format. This caching step saves `nu` from having to run all plugins during startup, which could be very slow.

Once added, the next time `nu` is started, the plugin's commands are available as part of your set of commands:

```nu
> help commands | where command_type == "plugin"
```

### Updating a plugin

When updating a plugin, it is important to run `plugin add` again just as above to load the new signatures from the plugin and allow Nu to rewrite them to the plugin file (`$nu.plugin-path`).

## Managing plugins

To view the list of plugins you have installed:

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

Plugins stay running while they are in use, and are automatically stopped by default after a period of time of inactivity. This behavior is managed by the [plugin garbage collector](#plugin-garbage-collector). To manually stop a plugin:

```nu
> plugin stop gstat
```

If we check `plugin list` again, we can see that it is no longer running:

```nu
> plugin list | where name == gstat | select name is_running
╭───┬───────┬────────────╮
│ # │ name  │ is_running │
├───┼───────┼────────────┤
│ 0 │ gstat │ false      │
╰───┴───────┴────────────╯
```

### Plugin garbage collector

Nu comes with a plugin garbage collector, which automatically stops plugins that are not actively in use after a period of time (by default, 10 seconds). This behavior is fully configurable:

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

For more information on exactly under what circumstances a plugin is considered to be active, see [the relevant section in the contributor book](/contributor-book/plugins.html#plugin-garbage-collection).

## Removing a plugin

To remove a plugin, call `plugin rm` with the name of the plugin you want to remove. For example, if you previously added the plugin `~/.cargo/bin/nu_plugin_gstat`, its name would be `gstat`. To remove it:

```nushell
plugin rm gstat
```

You can check the name of a plugin by running `plugin list`.

## Examples

Nu's main repo contains example plugins that are useful for learning how the plugin protocol works:

- [Rust](https://github.com/nushell/nushell/tree/main/crates/nu_plugin_example)
- [Python](https://github.com/nushell/nushell/blob/main/crates/nu_plugin_python)

## Debugging

The simplest way to debug a plugin is to print to stderr; plugins' standard error streams are redirected through Nu and displayed to the user.

## Help

Nu's plugin documentation is a work in progress. If you're unsure about something, the #plugins channel on [the Nu Discord](https://discord.gg/NtAbbGn) is a great place to ask questions!

## More details

The [plugin chapter in the contributor book](/contributor-book/plugins.md) offers more details on the intricacies of how plugins work from a software developer point of view.
