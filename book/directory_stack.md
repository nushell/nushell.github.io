# Directory Stack

Like some other shells, Nushell provides a Directory Stack feature for easily switching between multiple directories. In Nushell, this feature is part of the [Standard Library](./standard_library.md) and can be accessed in several ways.

::: note
In Nushell, the "stack" is represented as a `list`, but the overall functionality is similar to that of other shells.
:::

[[toc]]

## `dirs` Module and Commands

To use the `dirs` command and its subcommands, first import the module using:

```nu
use std/dirs
```

::: tip
To make the feature available whenever you start Nushell, add the above command to your [startup configuration](./configuration.md).
:::

This makes several new commands available:

| Command     | Description                                                                                                                                                                                               |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dirs`      | Lists the directories on the stack                                                                                                                                                                        |
| `dirs add`  | Adds one or more directories to the list, right after the active one. The first directory listed becomes the new active directory. Similar to the `pushd` command in some other shells.                   |
| `dirs drop` | Drops the current directory from the list. The previous directory in the list becomes the new active directory. Similar to the `popd` command in some other shells.                                       |
| `dirs goto` | Jumps to directory by using its index in the list. Without an index, lists the stack like `dirs`.                                                                                                         |
| `dirs next` | Makes the next directory on the list the active directory, or moves `N` entries forward with `dirs next N`. If the current active directory is the last in the list, then cycle to the start of the list. |
| `dirs prev` | Makes the previous directory on the list the active directory, or moves `N` entries back with `dirs prev N`. If the current active directory is the first in the list, then cycle to the end of the list. |

When we start using `dirs`, there is only one directory in the list, the active one. You can, as always, change this directory using the `cd` command.

```nu
cd ~
use std/dirs
dirs
# => ╭───┬────────┬──────────────╮
# => │ # │ active │     path     │
# => ├───┼────────┼──────────────┤
# => │ 0 │ true   │ /home/myuser │
# => ╰───┴────────┴──────────────╯

cd ~/src/repo/nushell
dirs
# => ╭───┬────────┬───────────────────────────────╮
# => │ # │ active │             path              │
# => ├───┼────────┼───────────────────────────────┤
# => │ 0 │ true   │ /home/myuser/src/repo/nushell │
# => ╰───┴────────┴───────────────────────────────╯
```

Notice that `cd` only changes the Active directory.

To _add_ the current directory to the list, change to a new active directory using the `dirs add` command:

```nu
dirs add ../reedline
dirs
# => ╭───┬────────┬────────────────────────────────╮
# => │ # │ active │              path              │
# => ├───┼────────┼────────────────────────────────┤
# => │ 0 │ false  │ /home/myuser/src/repo/nushell  │
# => │ 1 │ true   │ /home/myuser/src/repo/reedline │
# => ╰───┴────────┴────────────────────────────────╯
```

Let's go ahead and add a few more commonly used directories to the list:

```nu
dirs add ../nu_scripts
dirs add ~
dirs
# => ╭───┬────────┬──────────────────────────────────╮
# => │ # │ active │               path               │
# => ├───┼────────┼──────────────────────────────────┤
# => │ 0 │ false  │ /home/myuser/src/repo/nushell    │
# => │ 1 │ false  │ /home/myuser/src/repo/reedline   │
# => │ 2 │ false  │ /home/myuser/src/repo/nu_scripts │
# => │ 3 │ true   │ /home/myuser                     │
# => ╰───┴────────┴──────────────────────────────────╯
```

We can now switch between them easily using `dirs next`, `dirs prev` or `dirs goto`:

```nu
dirs next
# Active was 3, is now 0
pwd
# => /home/myuser/src/repo/nushell
dirs goto 2
pwd
# => /home/myuser/src/repo/nu_scripts
```

When you have finished your work in a directory, you can drop it from the list using:

```nu
dirs drop
dirs
# => ╭───┬────────┬────────────────────────────────╮
# => │ # │ active │              path              │
# => ├───┼────────┼────────────────────────────────┤
# => │ 0 │ false  │ /home/myuser/src/repo/nushell  │
# => │ 1 │ true   │ /home/myuser/src/repo/reedline │
# => │ 2 │ false  │ /home/myuser                   │
# => ╰───┴────────┴────────────────────────────────╯
```

When we drop `nu_scripts` from the list, the previous directory (`reedline`) becomes active. Dropping the first entry makes the last one active, and when only one directory is left, `dirs drop` does nothing.

### Where new entries go

`dirs add` doesn't append to the end of the list. It inserts the new directories right after the active one, so they come next in the `dirs next` order:

```nu
cd /usr
dirs add /usr/bin /usr/lib
dirs goto 0
dirs add /usr/share
dirs
# => ╭───┬────────┬────────────╮
# => │ # │ active │    path    │
# => ├───┼────────┼────────────┤
# => │ 0 │ false  │ /usr       │
# => │ 1 │ true   │ /usr/share │
# => │ 2 │ false  │ /usr/bin   │
# => │ 3 │ false  │ /usr/lib   │
# => ╰───┴────────┴────────────╯
```

`dirs add` expands each path, so relative paths and `~` are stored as absolute paths. Each one must be an existing directory. If any of them is a file or doesn't exist, `dirs add` stops with a `not a directory` error and adds none of them:

```nu
dirs add /usr/local nowhere
# => Error: nu::shell::error
# =>
# =>   × not a directory
# =>    ╭─[repl_entry #1:1:21]
# =>  1 │ dirs add /usr/local nowhere
# =>    ·                     ───┬───
# =>    ·                        ╰── not a directory
# =>    ╰────
```

With no paths at all, `dirs add` adds nothing and moves to the next entry, like `dirs next`.

### Moving more than one entry

`dirs next` and `dirs prev` take an optional number of entries to move, which defaults to `1`. They wrap around the ends of the list as often as needed, so in the four-entry stack above, `dirs next 2` and `dirs prev 2` both go from `/usr/share` to `/usr/lib`:

```nu
dirs next 2
pwd
# => /usr/lib
```

`dirs goto` takes an index from the `#` column instead. An index outside the list is an error:

```nu
dirs goto 5
# => Error: nu::shell::error
# =>
# =>   × invalid_dirs_index
# =>    ╭─[repl_entry #1:1:11]
# =>  1 │ dirs goto 5
# =>    ·           ┬
# =>    ·           ╰── `idx` should be between 0 and 3
# =>    ╰────
```

`dirs goto` without an index doesn't move. It returns the same table as `dirs`.

## Where the stack is stored

The stack lives in two environment variables. `$env.DIRS_LIST` holds the directories, and
`$env.DIRS_POSITION` holds the index of the active one. `use std/dirs` creates them when they
don't exist yet, with the current directory as the only entry and `0` as the position:

```nu
cd /usr
use std/dirs
dirs add /usr/bin /usr/lib
$env.DIRS_LIST
# => ╭───┬──────────╮
# => │ 0 │ /usr     │
# => │ 1 │ /usr/bin │
# => │ 2 │ /usr/lib │
# => ╰───┴──────────╯
$env.DIRS_POSITION
# => 1
```

The stored path of the active directory can be out of date. `cd` doesn't know about the stack,
so it changes `$env.PWD` and leaves `DIRS_LIST` alone. `dirs` shows `$env.PWD` for the active
entry instead of the stored path, and `dirs add`, `dirs next`, `dirs prev` and `dirs goto` write
`$env.PWD` into the active slot before they move:

```nu
cd /usr/share
$env.DIRS_LIST
# => ╭───┬──────────╮
# => │ 0 │ /usr     │
# => │ 1 │ /usr/bin │
# => │ 2 │ /usr/lib │
# => ╰───┴──────────╯
dirs
# => ╭───┬────────┬────────────╮
# => │ # │ active │    path    │
# => ├───┼────────┼────────────┤
# => │ 0 │ false  │ /usr       │
# => │ 1 │ true   │ /usr/share │
# => │ 2 │ false  │ /usr/lib   │
# => ╰───┴────────┴────────────╯
dirs next
$env.DIRS_LIST
# => ╭───┬────────────╮
# => │ 0 │ /usr       │
# => │ 1 │ /usr/share │
# => │ 2 │ /usr/lib   │
# => ╰───┴────────────╯
```

So read the stack with `dirs` rather than straight from `$env.DIRS_LIST`.

Because the stack lives in environment variables, it carries over to any Nushell started from this
one, such as a nested `nu` or a restart with `exec nu`. Other programs see `DIRS_LIST` as a single
string, with the directories joined by the path separator (`:`, or `;` on Windows), and
`DIRS_POSITION` as the index written out as a string. `use std/dirs` adds an
[`ENV_CONVERSIONS`](./configuration.md#env-conversions) entry for each variable, so in the new
shell it turns them back into a list and an integer, and the stack is where you left it:

```nu
nu -c '$env.DIRS_LIST'
# => /usr:/usr/share:/usr/lib
nu -c 'use std/dirs; dirs'
# => ╭───┬────────┬────────────╮
# => │ # │ active │    path    │
# => ├───┼────────┼────────────┤
# => │ 0 │ false  │ /usr       │
# => │ 1 │ false  │ /usr/share │
# => │ 2 │ true   │ /usr/lib   │
# => ╰───┴────────┴────────────╯
```

An `export-env` block in `std/dirs` creates both variables, and that block doesn't run when your
own module imports `std/dirs` with a top-level `use`. See
[Using `std/dirs` in Modules](./standard_library.md#using-std-dirs-in-modules).

## `shells` Aliases

Some users may prefer to think of this feature as multiple "shells within shells", where each has its own directory.

The Standard Library provides a set of aliases that can be used in place of the `dirs` commands above.

Import them using:

```nu
use std/dirs shells-aliases *
```

The built-in aliases are:

| Alias    | Description                                              |
| -------- | -------------------------------------------------------- |
| `shells` | in place of `dirs` to list current "shells"/directories. |
| `enter`  | in place of `dirs add` to enter a new "shell"/dir.       |
| `dexit`  | in place of `dirs drop` to exit a "shell"/dir.           |
| `g`      | as an alias for `dirs goto`.                             |
| `n`      | for `dirs next`                                          |
| `p`      | for `dirs prev`                                          |

Of course, you can also define your own aliases if desired.
