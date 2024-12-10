# Moving Around the System

A defining characteristic of a shell is the ability to navigate and interact with the filesystem. Nushell is, of course, no exception. Here are some common commands you might use when interacting with the filesystem:

## Viewing Directory Contents

```nu
ls
```

As seen in the Quick Tour, the [`ls`](/commands/docs/ls.md) command returns the contents of a directory. Nushell's `ls` will return the contents as a [table](types_of_data.html#tables).

The [`ls`](/commands/docs/ls.md) command also takes an optional argument to change what you'd like to view. For example, we can list the files that end in ".md"

```nu
ls *.md
# => ╭───┬────────────────────┬──────┬──────────┬──────────────╮
# => │ # │        name        │ type │   size   │   modified   │
# => ├───┼────────────────────┼──────┼──────────┼──────────────┤
# => │ 0 │ CODE_OF_CONDUCT.md │ file │  3.4 KiB │ 9 months ago │
# => │ 1 │ CONTRIBUTING.md    │ file │ 11.0 KiB │ 5 months ago │
# => │ 2 │ README.md          │ file │ 12.0 KiB │ 6 days ago   │
# => │ 3 │ SECURITY.md        │ file │  2.6 KiB │ 2 months ago │
# => ╰───┴────────────────────┴──────┴──────────┴──────────────╯
```

## Glob Patterns (wildcards)

The asterisk (`*`) in the above optional argument `*.md` is sometimes called a wildcard or a glob. It lets us match anything. You can read this glob `*.md` as _"match any filename, so long as it ends with '.md'."_

The most general glob is `*`, which will match all paths. More often, you'll see this pattern used as part of another pattern, for example `*.bak` and `temp*`.

Nushell also supports a double `*` which will traverse paths that are nested inside of other directories. For example, `ls **/*` will list all the non-hidden paths nested under the current directory.

```nu
ls **/*.md
# => ╭───┬───────────────────────────────┬──────┬──────────┬──────────────╮
# => │ # │             name              │ type │   size   │   modified   │
# => ├───┼───────────────────────────────┼──────┼──────────┼──────────────┤
# => │ 0 │ CODE_OF_CONDUCT.md            │ file │  3.4 KiB │ 5 months ago │
# => │ 1 │ CONTRIBUTING.md               │ file │ 11.0 KiB │ a month ago  │
# => │ 2 │ README.md                     │ file │ 12.0 KiB │ a month ago  │
# => │ 3 │ SECURITY.md                   │ file │  2.6 KiB │ 5 hours ago  │
# => │ 4 │ benches/README.md             │ file │    249 B │ 2 months ago │
# => │ 5 │ crates/README.md              │ file │    795 B │ 5 months ago │
# => │ 6 │ crates/nu-cli/README.md       │ file │    388 B │ 5 hours ago  │
# => │ 7 │ crates/nu-cmd-base/README.md  │ file │    262 B │ 5 hours ago  │
# => │ 8 │ crates/nu-cmd-extra/README.md │ file │    669 B │ 2 months ago │
# => │ 9 │ crates/nu-cmd-lang/README.md  │ file │  1.5 KiB │ a month ago  │
# => ╰───┴───────────────────────────────┴──────┴──────────┴──────────────╯
```

Here, we're looking for any file that ends with ".md". The double-asterisks further specify _"in any directory starting from here."_

Nushell's globbing syntax not only supports `*`, but also matching [single characters with `?` and character groups with `[...]`](https://docs.rs/nu-glob/latest/nu_glob/struct.Pattern.html).

Escaping the `*`, `?`, and `[]` patterns works by enclosing them in a single-quoted, double-quoted, or
[raw string](working_with_strings.md#raw-strings). For example, to show the contents of a directory named
`[slug]`, use `ls "[slug]"` or `ls '[slug]'`.

However, _backtick_ quoted strings do not escape globs. For example, compare the following scenarios:

1. Unquoted: Glob pattern

   An unquoted [bare word string](working_with_strings.html#bare-word-strings) with glob characters is interpreted as a glob pattern, so the following will remove all files in the current directory that contain
   `myfile` as any part of the filename:

   ```nu
   rm *myfile*
   ```

2. Quoted: String literal with asterisks

   When quoting with single or double quotes, or using a [raw string](working_with_strings.html#raw-strings), a _string_ with the literal, escaped asterisks (or other glob characters) is passed to the command. The result is not a glob. The following command will only remove a file literally named `*myfile*` (including the asterisks). Other files with `myfile` in the name are not affected:

   ```nu
   rm "*myfile*"
   ```

3. Backtick-quoted: Glob pattern

   Asterisks (and other glob patterns) within a [backtick-quoted string](working_with_strings.html#backtick-quoted-strings) are interpreted as a glob pattern. Notice that this is the same behavior as that of the bare-word string example in #1 above.

   The following, as with that first example, removes all files in the current directory that contain `myfile` as part of the filename

   ```nu
   rm `*myfile*`
   ```

::: tip
Nushell also includes a dedicated [`glob` command](https://www.nushell.sh/commands/docs/glob.html) with support for more complex globbing scenarios.
:::

### Converting Strings to Globs

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

## Creating a Directory

As with most other shells, the [`mkdir` command](/commands/docs/mkdir.md) is used to create new directories. One subtle difference is that Nushell's internal `mkdir` command operates like the Unix/Linux `mkdir -p` by default, in that it:

- Will create multiple directory levels automatically. For example:

  ```nu
  mkdir modules/my/new_module
  ```

  This will create all three directories even if none of them currently exists. On Linux/Unix, this requires `mkdir -p`.

- Will not error if the directory already exists. For example:

  ```nu
  mkdir modules/my/new_module
  mkdir modules/my/new_module
  # => No error
  ```

  ::: tip
  A common mistake when coming to Nushell is to attempt to use `mkdir -p <directory>` as in the native Linux/Unix version. However, this will generate an `Unknown Flag` error on Nushell.

  Just repeat the command without the `-p` to achieve the same effect.
  :::

## Changing the Current Directory

```nu
cd cookbook
```

To change from the current directory to a new one, use the [`cd`](/commands/docs/cd.md) command.

Changing the current working directory can also be done if [`cd`](/commands/docs/cd.md) is omitted and a path by itself is given:

```nu
cookbook/
```

Just as in other shells, you can use either the name of the directory, or if you want to go up a directory you can use the `..` shortcut.

You can also add additional dots to go up additional directory levels:

```nu
# Change to the parent directory
cd ..
# or
..
Go up two levels (parent's parent)
cd ...
# or
...
# Go up three levels (parent of parent's parent)
cd ....
# Etc.
```

::: tip
Multi-dot shortcuts are available to both internal Nushell [filesystem commands](//commands/categories/filesystem.html) as well as to external commands. For example, running `^stat ....` on a Linux/Unix system will show that the path is expanded to `../../../..`
:::

You can combine relative directory levels with directory names as well:

```nu
cd ../sibling
```

::: tip IMPORTANT TIP
Changing the directory with [`cd`](/commands/docs/cd.md) changes the `PWD` environment variable. This means that a change of a directory is kept to the current scope (e.g. block or closure). Once you exit the block, you'll return to the previous directory. You can learn more about this in the [Environment](./environment.md) chapter.
:::

## Filesystem Commands

Nu also provides some basic [filesystem commands](/commands/categories/filesystem.html) that work cross-platform such as:

- [`mv`](/commands/docs/mv.md) to rename or move a file or directory to a new location
- [`cp`](/commands/docs/cp.md) to copy an item to a new location
- [`rm`](/commands/docs/rm.md) to remove items from the filesystem

::: tip NOTE
Under Bash and many other shells, most filesystem commands (other than `cd`) are actually separate binaries in the system. For instance, on a Linux system, `cp` is the `/usr/bin/cp` binary. In Nushell, these commands are built-in. This has several advantages:

- They work consistently on platforms where a binary version may not be available (e.g. Windows). This allows the creation of cross-platform scripts, modules, and custom commands.
- They are more tightly integrated with Nushell, allowing them to understand Nushell types and other constructs
- As mentioned in the [Quick Tour](quick_tour.html), they are documented in the Nushell help system. Running `help <command>` or `<command> --help` will display the Nushell documentation for the command.

While the use of the Nushell built-in versions is typically recommended, it is possible to access the Linux binaries. See [Running System Commands](./running_externals.md) for details.
