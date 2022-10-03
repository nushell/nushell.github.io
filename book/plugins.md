# Plugins

Nu can be extended using plugins. Plugins behave much like Nu's built-in commands, with the added benefit that they can be added separately from Nu itself.

Nu plugins are executables; Nu launches them as needed and communicates with them over [stdin, stdout, and stderr](https://en.wikipedia.org/wiki/Standard_streams). Nu plugins can use either JSON or MSGPACK as their communication encoding.

## Adding a plugin

To add a plugin, call the [`register`](commands/register.md) command to tell Nu where to find it. As you do, you'll need to also tell Nushell what encoding the plugin uses.

Please note that the plugin name needs to start with `nu_plugin_`, Nu uses the name prefix to detect plugins.

Linux+macOS:

```
> register ./my_plugins/nu_plugin_cool
```

Windows:
nu_plugin_python_example.py

```
> register .\my_plugins\nu_plugin_cool.exe
```

When [`register`](commands/register.md) is called:

1. Nu launches the plugin, and wait for plugin tell Nu which communication encoding it should use
2. Nu sends it a "Signature" message over stdin
3. The plugin responds via stdout with a message containing its signature (name, description, arguments, flags, and more)
4. Nu saves the plugin signature in the file at `$nu.plugin-path`, so registration is persisted across multiple launches

Once registered, the plugin is available as part of your set of commands:

```
> help commands | where is_plugin == true
```

## Examples

Nu's main repo contains example plugins that are useful for learning how the plugin protocol works:

- [Rust](https://github.com/nushell/nushell/tree/main/crates/nu_plugin_example)
- [Python](https://github.com/nushell/nushell/blob/main/crates/nu_plugin_python)

## Debugging

The simplest way to debug a plugin is to print to stderr; plugins' standard error streams are redirected through Nu and displayed to the user.

## Help

Nu's plugin documentation is a work in progress. If you're unsure about something, the #plugins channel on [the Nu Discord](https://discord.gg/NtAbbGn) is a great place to ask questions!
