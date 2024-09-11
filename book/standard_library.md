# Standard Library (Preview)

Nushell ships with a standard library of useful commands written in native Nu. By default, the standard library is loaded into memory (but not automatically imported) when Nushell starts.

The standard library currently includes:

- Assertions
- An alternative `help` system with support for completions.
- Additional JSON variant formats
- XML Access
- Logging
- And more

To see a complete list of the commands available in the standard library, run the following:

```nu
use std
scope commands
| where name =~ '^std '
| select name usage extra_usage
| wrap "std-lib"
```

In addition, `stdlib-candidate`, found in the [nu_scripts Repository](https://github.com/nushell/nu_scripts/tree/main/stdlib-candidate/std-rfc), serves as a staging ground for new commands before they are added to the standard library.

::: tip Note
Currently, parsing of the standard library impacts Nushell startup time. New commands are not being added to the library until this is resolved.
:::

To disable the standard library, you can start using:

```nu
nu --no-std-lib
```

You will not be able to import the library using `use std *`, nor use any of its commands, if it is disabled in this way.

::: tip Did You Know?
Because the standard library is simply composed of [custom commands](./custom_commands.html) in [modules](./modules.html) and [submodules](./modules.html#submodules-and-subcommands), you can see the source for each command with the [`view source`](/commands/docs/view_source.md) command. For example, to view the source for the `ellie` command (with syntax highlighting):

```nu
use std *
view source ellie | nu-highlight
:::
```
