# 오버레이

Overlays act as "layers" of definitions (custom commands, aliases, environment variables) that can be activated and deactivated on demand.
They resemble virtual environments found in some languages, such as Python.

_Note: To understand overlays, make sure to check [Modules](modules.md) first as overlays build on top of modules._

## Basics

First, Nushell comes with one default overlay called `zero`.
You can inspect which overlays are active with the [`overlay list`](/commands/docs/overlay_list.md) command.
You should see the default overlay listed there.

To create a new overlay, you first need a module:

```nu
> module spam {
    export def foo [] {
        "foo"
    }

    export alias bar = "bar"

    export-env {
        load-env { BAZ: "baz" }
    }
}
```

We'll use this module throughout the chapter, so whenever you see `overlay use spam`, assume `spam` is referring to this module.

::: tip
The module can be created by any of the three methods described in [Modules](modules.md):

- "inline" modules (used in this example)
- file
- directory
  :::

To create the overlay, call [`overlay use`](/commands/docs/overlay_use.md):

```nu
> overlay use spam

> foo
foo

> bar
bar

> $env.BAZ
baz

> overlay list
───┬──────
 0 │ zero
 1 │ spam
───┴──────
```

It brought the module's definitions into the current scope and evaluated the [`export-env`](/commands/docs/export-env.md) block the same way as [`use`](/commands/docs/use.md) command would (see [Modules](modules.md#environment-variables) chapter).

::: tip
In the following sections, the `>` prompt will be preceded by the name of the last active overlay.
`(spam)> some-command` means the `spam` overlay is the last active overlay when the command was typed.
:::

## Removing an Overlay

If you don't need the overlay definitions anymore, call [`overlay hide`](/commands/docs/overlay_remove.md):

```nu
(spam)> overlay hide spam

(zero)> foo
Error: Can't run executable...

(zero)> overlay list
───┬──────
 0 │ zero
───┴──────
```

The overlays are also scoped.
Any added overlays are removed at the end of the scope:

```nu
(zero)> do { overlay use spam; foo }  # overlay is active only inside the block
foo

(zero)> overlay list
───┬──────
 0 │ zero
───┴──────
```

The last way to remove an overlay is to call [`overlay hide`](/commands/docs/overlay_remove.md) without an argument which will remove the last active overlay.

## Overlays Are Recordable

Any new definition (command, alias, environment variable) is recorded into the last active overlay:

```nu
(zero)> overlay use spam

(spam)> def eggs [] { "eggs" }
```

Now, the `eggs` command belongs to the `spam` overlay.
If we remove the overlay, we can't call it anymore:

```nu
(spam)> overlay hide spam

(zero)> eggs
Error: Can't run executable...
```

But we can bring it back!

```nu
(zero)> overlay use spam

(spam)> eggs
eggs
```

Overlays remember what you add to them and store that information even if you remove them.
This can let you repeatedly swap between different contexts.

::: tip
Sometimes, after adding an overlay, you might not want custom definitions to be added into it.
The solution can be to create a new empty overlay that would be used just for recording the custom changes:

```nu
(zero)> overlay use spam

(spam)> module scratchpad { }

(spam)> overlay use scratchpad

(scratchpad)> def eggs [] { "eggs" }
```

The `eggs` command is added into `scratchpad` while keeping `spam` intact.

To make it less verbose, you can use the [`overlay new`](/commands/docs/overlay_new.md) command:

```nu
(zero)> overlay use spam

(spam)> overlay new scratchpad

(scratchpad)> def eggs [] { "eggs" }
```

:::

## Prefixed Overlays

The [`overlay use`](/commands/docs/overlay_use.md) command would take all commands and aliases from the module and put them directly into the current namespace.
However, you might want to keep them as subcommands behind the module's name.
That's what `--prefix` is for:

```nu
(zero)> module spam {
    export def foo [] { "foo" }
}

(zero)> overlay use --prefix spam

(spam)> spam foo
foo
```

Note that this does not apply for environment variables.

## Rename an Overlay

You can change the name of the added overlay with the `as` keyword:

```nu
(zero)> module spam { export def foo [] { "foo" } }

(zero)> overlay use spam as eggs

(eggs)> foo
foo

(eggs)> overlay hide eggs

(zero)>
```

This can be useful if you have a generic script name, such as virtualenv's `activate.nu` but you want a more descriptive name for your overlay.

## Preserving Definitions

Sometimes, you might want to remove an overlay, but keep all the custom definitions you added without having to redefine them in the next active overlay:

```nu
(zero)> overlay use spam

(spam)> def eggs [] { "eggs" }

(spam)> overlay hide --keep-custom spam

(zero)> eggs
eggs
```

The `--keep-custom` flag does exactly that.

One can also keep a list of environment variables that were defined inside an overlay, but remove the rest, using the `--keep-env` flag:

```nu
(zero)> module spam {
    export def foo [] { "foo" }
    export-env { $env.FOO = "foo" }
}

(zero)> overlay use spam

(spam)> overlay hide spam --keep-env [ FOO ]

(zero)> foo
Error: Can't run executable...

(zero)> $env.FOO
foo
```

## Ordering Overlays

The overlays are arranged as a stack.
If multiple overlays contain the same definition, say `foo`, the one from the last active one would take precedence.
To bring an overlay to the top of the stack, you can call [`overlay use`](/commands/docs/overlay_use.md) again:

```nu
(zero)> def foo [] { "foo-in-zero" }

(zero)> overlay use spam

(spam)> foo
foo

(spam)> overlay use zero

(zero)> foo
foo-in-zero

(zero)> overlay list
───┬──────
 0 │ spam
 1 │ zero
───┴──────
```

Now, the `zero` overlay takes precedence.
