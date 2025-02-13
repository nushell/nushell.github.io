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

| Command     | Description                                                                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dirs`      | Lists the directories on the stack                                                                                                                                  |
| `dirs add`  | Adds one or more directories to the list. The first directory listed becomes the new active directory. Similar to the `pushd` command in some other shells.         |
| `dirs drop` | Drops the current directory from the list. The previous directory in the list becomes the new active directory. Similar to the `popd` command in some other shells. |
| `dirs goto` | Jumps to directory by using its index in the list                                                                                                                   |
| `dirs next` | Makes the next directory on the list the active directory. If the current active directory is the last in the list, then cycle to the start of the list.            |
| `dirs prev` | Makes the previous directory on the list the active directory. If the current active directory is the first in the list, then cycle to the end of the list.         |

When we start using `dirs`, there is only one directory in the list, the active one. You can, as always, change this directory using the `cd` command.

```nu
cd ~
use std/dirs
dirs
# => ╭───┬────────┬─────────────────────────────────╮
# => │ # │ active │              path               │
# => ├───┼────────┼─────────────────────────────────┤
# => │ 0 │ true   │ /home/myuser                    │
# => ╰───┴────────┴─────────────────────────────────╯

cd ~/src/repo/nushell
dirs
# => ╭───┬────────┬─────────────────────────────────╮
# => │ # │ active │              path               │
# => ├───┼────────┼─────────────────────────────────┤
# => │ 0 │ true   │ /home/myuser/repo/nushell       │
# => ╰───┴────────┴─────────────────────────────────╯
```

Notice that `cd` only changes the Active directory.

To _add_ the current directory to the list, change to a new active directory using the `dirs add` command:

```nu
dirs add ../reedline
dirs
# => ╭───┬────────┬──────────────────────────────────╮
# => │ # │ active │               path               │
# => ├───┼────────┼──────────────────────────────────┤
# => │ 0 │ false  │ /home/myuser/src/repo/nushell    │
# => │ 1 │ true   │ /home/myuser/src/repo/reedline   │
# => ╰───┴────────┴──────────────────────────────────╯
```

Let's go ahead and add a few more commonly used directories to the list:

```nu
dirs add ../nu_scripts
dirs add ~
dirs
# => ╭───┬────────┬────────────────────────────────────╮
# => │ # │ active │                path                │
# => ├───┼────────┼────────────────────────────────────┤
# => │ 0 │ false  │ /home/myuser/src/repo/nushell      │
# => │ 1 │ false  │ /home/myuser/src/repo/reedline     │
# => │ 2 │ false  │ /home/myuser/src/repo/nu_scripts   │
# => │ 3 │ true   │ /home/myuser                       │
# => ╰───┴────────┴────────────────────────────────────╯
```

We can now switch between them easily using `dirs next`, `dirs prev` or `dirs goto`:

```nu
dirs next
# Active was 3, is now 0
pwd
# => /home/myuser/src/repo/nushell
dirs goto 2
# => /home/myuser/src/repo/nu_scripts
```

When you have finished your work in a directory, you can drop it from the list using:

```nu
dirs drop
dirs
# => ╭───┬────────┬──────────────────────────────────╮
# => │ # │ active │               path               │
# => ├───┼────────┼──────────────────────────────────┤
# => │ 0 │ false  │ /home/myuser/src/repo/nushell    │
# => │ 1 │ true   │ /home/myuser/src/repo/reedline   │
# => │ 2 │ false  │ /home/myuser                     │
# => ╰───┴────────┴──────────────────────────────────╯
```

When we drop `nu_scripts` from the list, the previous directory (`reedline`) becomes active.

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
