# Plugins

The functionality of Nu can be extended using plugins. The plugins can perform many of the same operations that Nu's built-in commands can, with the added benefit that they can be added separately of Nu itself.

To add a plugin, simply build it, and then call `register` on it. As you do, you'll need to also tell nushell what protocol the plugin uses.

For example:

```
> register ./my_plugins/nu-plugin-inc -e capnp
```

Once registered, this plugin is now available as part of your set of internal commands.

```
> inc --help
```