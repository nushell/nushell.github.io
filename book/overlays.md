# Overlays

Overlays act as "layers" of definitions (custom commands, aliases, environment variables) that can be activated and deactivated on demand.
They resemble virtual environments found in some languages, such as Python.

_Note: To understand overlays, make sure to check [Modules](modules.md) first as overlays build on top of modules._

All the work is done by four subcommands of [`overlay`](/commands/docs/overlay.md): `overlay use`, `overlay hide`, `overlay new` and `overlay list`. Running `overlay` by itself only prints its help. Like `use`, `overlay use`, `overlay hide` and `overlay new` are parser keywords, so they act when the code is parsed and can't be part of a pipeline. `overlay list` is an ordinary command that returns a table.

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

For a file or directory, give its path to `overlay use`. The overlay is named after the file without its `.nu` extension, or after the directory. As with [`use`](modules/using_modules.md#module-path), a relative path is looked up from the current directory (or the directory of the file making the call) and then in `$NU_LIB_DIRS` and `$env.NU_LIB_DIRS`. For example, in a new shell, with a file `spam-file.nu` that contains `export def foo [] { "foo from file" }`:

```nu
overlay use ./spam-file.nu
foo
# => foo from file

overlay list
# => ╭───┬───────────┬────────╮
# => │ # │   name    │ active │
# => ├───┼───────────┼────────┤
# => │ 0 │ zero      │ true   │
# => │ 1 │ spam-file │ true   │
# => ╰───┴───────────┴────────╯
```

From then on, the overlay is called `spam-file`, as in `overlay hide spam-file`.

The path can also be a [constant](variables.md#constant-variables). If its value is `null`, `overlay use` does nothing, so a config file can activate an overlay only when, say, a file exists. See the `null` entry under [Module Path](modules/using_modules.md#module-path) for an example with `use`.
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

The default `zero` overlay can't be hidden. `overlay hide zero` fails with `nu::parser::cant_hide_default_overlay`, and so does `overlay hide` without an argument when `zero` is the last active overlay. Naming an overlay that isn't active, or doesn't exist, fails with `nu::parser::active_overlay_not_found`.

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

If an overlay with that name already exists, `overlay new` brings it back with everything it recorded, like `overlay use`. With `--reload` (`-r`), it keeps the recorded definitions but drops the environment variables that exist only in that overlay:

```nu
overlay new scratchpad
$env.SCRATCH = "set in scratchpad"
def eggs [] { "eggs" }
overlay hide scratchpad

overlay new --reload scratchpad
'SCRATCH' in $env
# => false
eggs
# => eggs
```

Without `--reload`, `$env.SCRATCH` would be back as well.

:::

## Reloading an overlay

Calling `overlay use` with the name of an overlay that already exists brings back what the overlay recorded. It doesn't run the module's `export-env` block again, and a command you redefined while the overlay was active keeps your definition. With `--reload` (`-r`), the overlay starts over from its module instead. Nushell adds the module's commands and aliases again, replacing your versions of them, and runs `export-env` again. Commands that you added to the overlay yourself stay:

```nu
module dev {
    export def build [] { "build from dev" }
    export-env { $env.MODE = "debug" }
}
overlay use dev
def build [] { "my build" }; def deploy [] { "deploying" }; $env.MODE = "release"

overlay use dev
[(build) (deploy) $env.MODE]
# => ╭───┬───────────╮
# => │ 0 │ my build  │
# => │ 1 │ deploying │
# => │ 2 │ release   │
# => ╰───┴───────────╯

overlay use --reload dev
[(build) (deploy) $env.MODE]
# => ╭───┬────────────────╮
# => │ 0 │ build from dev │
# => │ 1 │ deploying      │
# => │ 2 │ debug          │
# => ╰───┴────────────────╯
```

Other environment variables that you set in the overlay are kept if the overlay is active when you reload it. If it was hidden and the module has an `export-env` block, they are dropped, and only the variables that `export-env` sets come back. `overlay new --reload` on an overlay that is still active changes nothing you can see.

`--reload` works from the module as Nushell first read it. It doesn't read the module's file again. To pick up changes to a module file, give `overlay use` the file's path again, as in `overlay use ./spam-file.nu`. Each call with a path reads the file again and then works like `--reload`, so the new definitions replace the old ones, and the commands you added to the overlay stay.

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

An overlay keeps the prefix setting it was first added with. Bringing it back with `overlay use` with `--prefix` when it was added without it, or the other way around, fails with `nu::parser::overlay_prefix_mismatch`:

```nu
overlay hide ham
overlay use ham
# => Error: nu::parser::overlay_prefix_mismatch
# =>
# =>   × Overlay prefix mismatch.
# =>    ╭─[repl_entry #5:1:13]
# =>  1 │ overlay use ham
# =>    ·             ─┬─
# =>    ·              ╰── already exists with a prefix
# =>    ╰────
# =>   help: Overlay ham already exists with a prefix. To add it again, do it with
# =>         the --prefix flag.
```

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

An overlay keeps the name it was first added under. Once `bacon` has been added as `breakfast`, bring it back with `overlay use breakfast`. An overlay also can't be added again under another name. After `overlay use spam` has added an overlay named `spam`, `overlay use spam as eggs` fails with `nu::parser::cant_add_overlay_help` ("Cannot add overlay as 'eggs' because it already exists under the name 'spam'"), whether `spam` is active or hidden.

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

The current directory is an environment variable too (`$env.PWD`), so a `cd` while an overlay is the last active one is recorded in that overlay. Hiding the overlay takes you back to the directory you were in when you activated it, and bringing it back with `overlay use` returns you to the directory you left it in. To stay where you are, hide it with `overlay hide <name> --keep-env [PWD]`.

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
