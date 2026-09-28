# Overlays

Overlays act as "layers" of definitions (custom commands, aliases, environment variables) that can be activated and deactivated on demand.
They resemble virtual environments found in some languages, such as Python.

_Note: To understand overlays, make sure to check [Modules](modules.md) first as overlays build on top of modules._

## Basics

First, Nushell comes with one default overlay called `zero`.
You can list the overlays, and see which of them are active, with the [`overlay list`](/commands/docs/overlay_list.md) command.
You should see the default overlay listed there:

```nu
overlay list
# => ╭───┬──────┬────────╮
# => │ # │ name │ active │
# => ├───┼──────┼────────┤
# => │ 0 │ zero │ true   │
# => ╰───┴──────┴────────╯
```

To create a new overlay, you first need a module:

```nu
module spam {
    export def foo [] {
        "foo"
    }

    export alias bar = echo "bar"

    export-env {
        load-env { BAZ: "baz" }
    }
}
```

We'll use this module throughout the chapter, so whenever you see `overlay use spam`, assume `spam` is referring to this module.

::: tip
The module can be created by any of the three methods described in [Creating Modules](modules/creating_modules.md):

- "inline" modules (used in this example)
- file
- directory
:::

To create the overlay, call [`overlay use`](/commands/docs/overlay_use.md):

```nu
overlay use spam

foo
# => foo

bar
# => bar

$env.BAZ
# => baz

overlay list
# => ╭───┬──────┬────────╮
# => │ # │ name │ active │
# => ├───┼──────┼────────┤
# => │ 0 │ zero │ true   │
# => │ 1 │ spam │ true   │
# => ╰───┴──────┴────────╯
```

It brought the module's definitions into the current scope and evaluated the [`export-env`](/commands/docs/export-env.md) block the same way as [`use`](/commands/docs/use.md) command would (see [Creating Modules](modules/creating_modules.md#environment-variables) chapter).

::: tip
Many of the following sections refer to the _last active_ overlay. [`overlay list`](/commands/docs/overlay_list.md) shows hidden overlays first, followed by the active overlays in the order they were activated, so its last row is always the last active overlay.
:::

## Removing an Overlay

If you don't need the overlay definitions anymore, call [`overlay hide`](/commands/docs/overlay_hide.md):

```nu
overlay hide spam
foo
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[repl_entry #7:2:1]
# =>  1 │ overlay hide spam
# =>  2 │ foo
# =>    · ─┬─
# =>    ·  ╰── Command `foo` not found
# =>    ╰────
# =>   help: A command with that name exists in module `spam`. Try importing it with `use`

overlay list
# => ╭───┬──────┬────────╮
# => │ # │ name │ active │
# => ├───┼──────┼────────┤
# => │ 0 │ spam │ false  │
# => │ 1 │ zero │ true   │
# => ╰───┴──────┴────────╯
```

The hidden overlay is still listed, but it is no longer active.

The overlays are also scoped.
Any added overlays are removed at the end of the scope.
For example, with another module, `ham`:

```nu
module ham {
    export def greet [] { "hello from ham" }
}

do { overlay use ham; greet }  # overlay is active only inside the block
# => hello from ham

overlay list
# => ╭───┬──────┬────────╮
# => │ # │ name │ active │
# => ├───┼──────┼────────┤
# => │ 0 │ spam │ false  │
# => │ 1 │ zero │ true   │
# => ╰───┴──────┴────────╯
```

The last way to remove an overlay is to call [`overlay hide`](/commands/docs/overlay_hide.md) without an argument which will remove the last active overlay.

## Overlays Are Recordable

Any new definition (command, alias, environment variable) is recorded into the last active overlay:

```nu
overlay use spam

def eggs [] { "eggs" }
```

Now, the `eggs` command belongs to the `spam` overlay.
If we remove the overlay, we can't call it anymore:

```nu
overlay hide spam
eggs
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[repl_entry #11:2:1]
# =>  1 │ overlay hide spam
# =>  2 │ eggs
# =>    · ──┬─
# =>    ·   ╰── Command `eggs` not found
# =>    ╰────
# =>   help: `eggs` is neither a Nushell built-in or a known external command
```

But we can bring it back!

```nu
overlay use spam
```

```nu
eggs
# => eggs
```

Overlays remember what you add to them and store that information even if you remove them.
This can let you repeatedly swap between different contexts.

::: tip
Sometimes, after adding an overlay, you might not want custom definitions to be added into it.
The solution can be to create a new empty overlay that would be used just for recording the custom changes:

```nu
overlay use spam

module scratchpad { }

overlay use scratchpad

def eggs [] { "eggs" }
```

The `eggs` command is added into `scratchpad` while keeping `spam` intact.

To make it less verbose, you can use the [`overlay new`](/commands/docs/overlay_new.md) command:

```nu
overlay use spam

overlay new scratchpad

def eggs [] { "eggs" }
```

:::

## Prefixed Overlays

The [`overlay use`](/commands/docs/overlay_use.md) command would take all commands and aliases from the module and put them directly into the current namespace.
However, you might want to keep them as subcommands behind the module's name.
That's what `--prefix` is for:

```nu
module ham {
    export def greet [] { "hello from ham" }
}

overlay use --prefix ham

ham greet
# => hello from ham
```

Note that this does not apply for environment variables.

## Rename an Overlay

You can change the name of the added overlay with the `as` keyword:

```nu
module bacon { export def cook [] { "cooking bacon" } }

overlay use bacon as breakfast

cook
# => cooking bacon

overlay list | last | get name
# => breakfast

overlay hide breakfast
```

This can be useful if you have a generic script name, such as virtualenv's `activate.nu` but you want a more descriptive name for your overlay.

## Preserving Definitions

Sometimes, you might want to remove an overlay, but keep all the custom definitions you added without having to redefine them in the next active overlay:

```nu
overlay use spam

def eggs [] { "eggs" }

overlay hide --keep-custom spam

eggs
# => eggs
```

The `--keep-custom` flag does exactly that.

One can also keep a list of environment variables that were defined inside an overlay, but remove the rest, using the `--keep-env` flag:

```nu
module spam {
    export def foo [] { "foo" }
    export-env { $env.FOO = "foo" }
}

overlay use spam

overlay hide spam --keep-env [ FOO ]
foo
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>     ╭─[repl_entry #20:10:1]
# =>   9 │ overlay hide spam --keep-env [ FOO ]
# =>  10 │ foo
# =>     · ─┬─
# =>     ·  ╰── Command `foo` not found
# =>     ╰────
# =>   help: A command with that name exists in module `spam`. Try importing it with `use`

$env.FOO
# => foo
```

## Ordering Overlays

The overlays are arranged as a stack.
If multiple overlays contain the same definition, say `foo`, the one from the last active one would take precedence.
To bring an overlay to the top of the stack, you can call [`overlay use`](/commands/docs/overlay_use.md) again.

For example, bring the `zero` overlay to the top and define a `foo` command in it:

```nu
overlay use zero
def foo [] { "foo-in-zero" }
```

Then activate `spam`, which also has a `foo` command:

```nu
overlay use spam
```

The `foo` from `spam` takes precedence:

```nu
foo
# => foo
```

Now bring `zero` to the top again:

```nu
overlay use zero
```

```nu
foo
# => foo-in-zero

overlay list | last 2
# => ╭───┬──────┬────────╮
# => │ # │ name │ active │
# => ├───┼──────┼────────┤
# => │ 0 │ spam │ true   │
# => │ 1 │ zero │ true   │
# => ╰───┴──────┴────────╯
```

Now, the `zero` overlay takes precedence.
