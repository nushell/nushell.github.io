# Moving around the system

A defining characteristic of a shell is the ability to navigate and interact with the filesystem. Nushell is, of course, no exception. Here are some common commands you might use when interacting with the filesystem:

## Viewing directory contents

@[code](@snippets/moving_around/ls_example.sh)

As seen in other chapters, the [`ls`](/commands/docs/ls.md) command returns the contents of a directory. Nushell's `ls` will return the contents as a [table](types_of_data.html#tables).

The [`ls`](/commands/docs/ls.md) command also takes an optional argument to change what you'd like to view. For example, we can list the files that end in ".md"

@[code](@snippets/moving_around/ls_shallow_glob_example.sh)

## Glob patterns (wildcards)

The asterisk (`*`) in the above optional argument `*.md` is sometimes called a wildcard or a glob. It lets us match anything. You can read this glob `*.md` as _"match any filename, so long as it ends with '.md'."_

The most general glob is `*`, which will match all paths. More often, you'll see this pattern used as part of another pattern, for example `*.bak` and `temp*`.

Nushell also supports a double `*` which will traverse paths that are nested inside of other directories. For example, `ls **/*` will list all the non-hidden paths nested under the current directory.

```nu
 ls **/*.md
╭───┬───────────────────────────────┬──────┬──────────┬──────────────╮
│ # │             name              │ type │   size   │   modified   │
├───┼───────────────────────────────┼──────┼──────────┼──────────────┤
│ 0 │ CODE_OF_CONDUCT.md            │ file │  3.4 KiB │ 5 months ago │
│ 1 │ CONTRIBUTING.md               │ file │ 11.0 KiB │ a month ago  │
│ 2 │ README.md                     │ file │ 12.0 KiB │ a month ago  │
│ 3 │ SECURITY.md                   │ file │  2.6 KiB │ 5 hours ago  │
│ 4 │ benches/README.md             │ file │    249 B │ 2 months ago │
│ 5 │ crates/README.md              │ file │    795 B │ 5 months ago │
│ 6 │ crates/nu-cli/README.md       │ file │    388 B │ 5 hours ago  │
│ 7 │ crates/nu-cmd-base/README.md  │ file │    262 B │ 5 hours ago  │
│ 8 │ crates/nu-cmd-extra/README.md │ file │    669 B │ 2 months ago │
│ 9 │ crates/nu-cmd-lang/README.md  │ file │  1.5 KiB │ a month ago  │
╰───┴───────────────────────────────┴──────┴──────────┴──────────────╯
```

Here, we're looking for any file that ends with ".md". The double-asterisks further specify _"in any directory starting from here."_

Nushell's globbing syntax not only supports `*`, but also matching [single characters with `?` and character groups with `[...]`](https://docs.rs/nu-glob/latest/nu_glob/struct.Pattern.html).

Escaping the `*`, `?`, and `[]` patterns works by enclosing them in a single-quoted, double-quoted, or
[raw string](working_with_strings.md#raw-strings). For example, to show the contents of a directory named
`[slug]`, use `ls "[slug]"` or `ls '[slug]'`.

However, _backtick_ quoted strings do not escape globs. For example:

```nu
# Removes all files in the current directory that contain
# "myfile" as part of the filename
> rm *myfile*

# Quoted asterisk - Removes only a single file with the
# name *myfile* (including the asterisks)
> rm "*"

# Backtick-quoted - Removes all files in the current directory
# that contain "myfile" as part of the filename
> rm `*myfile*`
```

::: tip
Nushell also includes a dedicated [`glob` command](https://www.nushell.sh/commands/docs/glob.html) with support for more complex globbing scenarios.
:::

### Converting strings to globs

The quoting techniques above are useful when constructing glob-literals, but you may need to construct globs programmatically. There are several techniques available for this purpose:

1. `into glob`

   The [`into glob` command](/commands/docs/into_glob.html) can be used to convert a string (and other types) into a glob. For instance:

   ```nu
   # Find files whose name includes the current month in the form YYYY-mm
   let current_month = (date now | format date '%Y-%m')
   let glob_pattern = ($"*($current_month)*" | into glob)
   ls $glob_pattern
   ```

2. The spread operator combined with the [`glob` command](/commands/docs/glob.html):

   The [`glob` command](/commands/docs/glob.html) (note: not the same as `into glob`) produces a [`list`](types_of_data.html#lists) of filenames that match the glob pattern. This list can be expanded and passed to filesystem commands using the [spread operator](operators.html#spread-operator):

   ```nu
   # Find files whose name includes the current month in the form YYYY-mm
   let current_month = (date now | format date '%Y-%m')
   ls ...(glob $"*($current_month)*")
   ```

3. Force `glob` type via annotation:

   ```nu
   # Find files whose name includes the current month in the form YYYY-mm
   let current_month = (date now | format date '%Y-%m')
   let glob_pattern: glob = ($"*($current_month)*")
   ls $glob_pattern
   ```

## Changing the current directory

@[code](@snippets/book/moving_around/cd_example.nu)

To change from the current directory to a new one, use the [`cd`](/commands/docs/cd.md) command.

Changing the current working directory can also be done if [`cd`](/commands/docs/cd.md) is omitted and a path by itself is given:

@[code](@snippets/book/moving_around/cd_without_command_example.nu)

Just as in other shells, you can use either the name of the directory, or if you want to go up a directory you can use the `..` shortcut.

You can also add additional dots to go up additional directory levels:

@[code](@snippets/book/moving_around/multiple_cd_levels.nu)

::: tip
Multi-dot shortcuts are available to both internal Nushell [filesystem commands](//commands/categories/filesystem.html) as well as to external commands. For example, running `^stat ....` on a Linux/Unix system will show that the path is expanded to `../../../..`
:::

You can combine relative directory levels with directory names as well:

@[code](@snippets/book/moving_around/relative_cd_levels.nu)

::: tip IMPORTANT TIP
Changing the directory with [`cd`](/commands/docs/cd.md) changes the `PWD` environment variable. This means that a change of a directory is kept to the current scope (e.g. block or closure). Once you exit the block, you'll return to the previous directory. You can learn more about this in the [Environment](./environment.md) chapter.
:::

## Filesystem commands

Nu also provides some basic [filesystem commands](/commands/categories/filesystem.html) that work cross-platform such as:

- [`mv`](/commands/docs/mv.md) to rename or move a file or directory to a new location
- [`cp`](/commands/docs/cp.md) to copy an item to a new location
- [`rm`](/commands/docs/rm.md) to remove items from the filesystem
- [`mkdir`](/commands/docs/mkdir.md) to create a new directory

::: tip NOTE
Under Bash and many other shells, most filesystem commands (other than `cd`) are actually separate binaries in the system. For instance, on a Linux system, `cp` is the `/usr/bin/cp` binary. In Nushell, these commands are built-in. This has several advantages:

- They work consistently on platforms where a binary version may not be available (e.g., Windows). This allows the creation of cross-platform scripts, modules, and custom commands.
- They are more tightly integrated with Nushell, allowing them to understand Nushell types and other constructs
- As mentioned in the [Quick Tour](quick_tour.html), they are documented in the Nushell help system. Running `help <command>` or `<command> --help` will display the Nushell documentation for the command.

While the use of the Nushell built-in versions is typically recommended, it is possible to access the Linux binaries. See [Escaping to system](escaping.html#escaping-to-the-system) for details.
