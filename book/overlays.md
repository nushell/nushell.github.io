# Overlays

Overlays act as "layers" of definitions (custom commands, aliases, environment variables) that can be activated and deactivated on demand.
They resemble virtual environments found in some languages, such as Python.

_Note: To understand overlays, make sure to check [Modules](modules.md) first as overlays build on top of modules._

## Basics

First, Nushell comes with one default overlay called `zero`.
You can inspect which overlays are active with the [`overlay list`](commands/overlay_list.md) command.
You should see the default overlay listed there.

To create a new overlay, you first need a module:

```
> module spam {
    export def foo [] {
        "foo"
    }

    export alias bar = "bar"

    export env BAZ {
        "baz"
    }
}
```

We'll use this module throughout the chapter: Whenever you see `overlay add spam`, assume `spam` is referring to this module.

To create the overlay, call [`overlay add`](commands/overlay_add.md):

```
> overlay add spam

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

In the following sections, the `>` prompt will be preceded by the name of the last active overlay.
`(spam)> some-command` means the `spam` overlay is the last active overlay when the command was typed.

## Removing an Overlay

If you don't need the overlay definitions anymore, call [`overlay remove`](commands/overlay_remove.md):

```
(spam)> overlay remove spam

(zero)> foo
Error: Can't run executable...

(zero)> overlay list
───┬──────
 0 │ zero
───┴──────
```

The overlays are also scoped.
Any added overlays are removed at the end of the scope:

```
(zero)> do { overlay add spam; foo }
foo

(zero)> overlay list
───┬──────
 0 │ zero
───┴──────
```

Furthermore, [`overlay remove`](commands/overlay_remove.md) without an argument will remove the last active ovelay.

## Overlays are Recordable

Any new definition (command, alias, environment variable) is recorded into the last active overlay:

```
(zero)> overlay add spam

(spam)> def eggs [] { "eggs" }
```

Now, the `eggs` command belongs to the `spam` overlay.
If we remove the overlay, we can't call it anymore:

```
(spam)> overlay remove spam

(zero)> eggs
Error: Can't run executable...
```

But we can bring it back!

```
(zero)> overlay add spam

(spam)> eggs
eggs
```

Overlays remember what you add to them and store that information even if you remove them.
This can let you repeatedly swap between different contexts.

## Preserving Definitions

Sometimes, you might want to remove an overlay, but keep all the custom definitions you added without having to redefine them in the next active overlay:

```
(zero)> overlay add spam

(spam)> def eggs [] { "eggs" }

(spam)> overlay remove --keep spam

(zero)> eggs
eggs
```

The `--keep` flag does exactly that.

## Ordering Overlays

The overlays are arranged as a stack.
If multiple overlays contain the same definition, say `foo`, the one from the last active one would take a precedence.
To bring some overlay to the top of the stack, you can call `overlay add` again:

```
(zero)> def foo [] { "foo-in-zero" }

(zero)> overlay add spam

(spam)> foo
foo

(spam)> overlay add zero

(zero)> foo
foo-in-zero

(zero)> overlay list
───┬──────
 0 │ spam
 1 │ zero
───┴──────
```

Now, the `zero` overlay takes a precedence.
