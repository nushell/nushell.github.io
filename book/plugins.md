# Plugins

The functionality of Nu can be extended using plugins. The plugins can perform many of the same operations that Nu's built-in commands can, with the added benefit that they can be added separately of Nu itself.

To add a plugin, simply build it and put the binary in your PATH. Nu plugins begin with the filename `nu_plugin_` so that Nu can find them among other binaries in your PATH. 

**Note:** in the future, plugins may have a specific place they need to be put into in order for Nu to find them.

When Nu starts up, it scans your system and loads the plugins it finds.

The protocol that Nu plugins use is subject to change while Nu is under heavy development. The best place to learn more about the protocol and how to create your own plugins is by reading the source for the [plugins in the Nu repository](https://github.com/nushell/nushell/tree/main/crates). You can also refer to the [plugins chapter of the contributor book](https://www.nushell.sh/contributor-book/plugins.html)
