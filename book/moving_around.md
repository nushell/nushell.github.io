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
# => ╭───┬────────────────────┬──────┬─────────┬──────────────╮
# => │ # │        name        │ type │  size   │   modified   │
# => ├───┼────────────────────┼──────┼─────────┼──────────────┤
# => │ 0 │ CODE_OF_CONDUCT.md │ file │  3.4 kB │ 9 months ago │
# => │ 1 │ CONTRIBUTING.md    │ file │ 11.2 kB │ 5 months ago │
# => │ 2 │ README.md          │ file │ 12.2 kB │ 6 days ago   │
# => │ 3 │ SECURITY.md        │ file │  2.6 kB │ 2 months ago │
# => ╰───┴────────────────────┴──────┴─────────┴──────────────╯
```

You can pass several patterns at once, such as `ls *.md docs`. A pattern that matches nothing is a "No matches found" error, while an empty directory gives an empty list. A directory name lists what's inside that directory, and each `name` keeps the directory part (`docs/intro.md`). `--short-names` (`-s`) drops it, `--full-paths` (`-f`) turns every name into an absolute path, and `--directory` (`-D`) lists the directory itself instead of its contents:

```nu
ls --short-names docs
# => ╭───┬───────────┬─────────┬──────┬───────────────╮
# => │ # │   name    │  type   │ size │   modified    │
# => ├───┼───────────┼─────────┼──────┼───────────────┤
# => │ 0 │ img       │ dir     │ 96 B │ 6 minutes ago │
# => │ 1 │ intro.md  │ file    │  5 B │ 6 minutes ago │
# => │ 2 │ latest.md │ symlink │  8 B │ 6 minutes ago │
# => ╰───┴───────────┴─────────┴──────┴───────────────╯
ls --directory docs
# => ╭───┬──────┬──────┬───────┬───────────────╮
# => │ # │ name │ type │ size  │   modified    │
# => ├───┼──────┼──────┼───────┼───────────────┤
# => │ 0 │ docs │ dir  │ 192 B │ 6 minutes ago │
# => ╰───┴──────┴──────┴───────┴───────────────╯
```

The `size` of a directory is the size of the directory entry itself, which says little about what's in it. `ls --du` (`-d`) replaces it with the total size of everything inside, the same number that [`du`](#checking-disk-usage) reports as `apparent`. It has to walk the whole tree, so it's slow on big directories.

`ls --mime-type` (`-m`) puts a MIME type such as `text/markdown` in the `type` column of each file. The type is guessed from the file name; `ls` never reads the file. `ls --threads` (`-t`) reads directories on several threads, which can be faster for large listings, but the rows come back in a different order on each run, so add [`sort-by`](/commands/docs/sort-by.md) when the order matters.

`ls --long` (`-l`) adds more columns. On every platform you get `target` (where a symlink points), `readonly`, `created`, and `accessed`. Linux, macOS, and the BSDs also have `mode` (the permission bits), `num_links` (the number of hard links), `inode`, `user`, and `group`. Windows has none of those five. `user` and `group` fall back to the numeric id when the name can't be looked up, and `created` is empty on filesystems that don't record a creation time.

```nu
ls --long docs | select name type target readonly mode num_links
# => ╭───┬────────────────┬─────────┬──────────┬──────────┬───────────┬───────────╮
# => │ # │      name      │  type   │  target  │ readonly │   mode    │ num_links │
# => ├───┼────────────────┼─────────┼──────────┼──────────┼───────────┼───────────┤
# => │ 0 │ docs/img       │ dir     │          │ false    │ rwxr-xr-x │         3 │
# => │ 1 │ docs/intro.md  │ file    │          │ false    │ rw-r--r-- │         1 │
# => │ 2 │ docs/latest.md │ symlink │ intro.md │ false    │ rwxr-xr-x │         1 │
# => ╰───┴────────────────┴─────────┴──────────┴──────────┴───────────┴───────────╯
```

## Glob Patterns (wildcards)

The asterisk (`*`) in the above optional argument `*.md` is sometimes called a wildcard or a glob. It lets us match anything. You can read this glob `*.md` as _"match any filename, so long as it ends with '.md'."_

The most general glob is `*`, which will match all paths. More often, you'll see this pattern used as part of another pattern, for example `*.bak` and `temp*`.

Nushell also supports a double `*` which will traverse paths that are nested inside of other directories. For example, `ls **/*` will list all the non-hidden paths nested under the current directory.

```nu
ls **/*.md
# => ╭───┬───────────────────────────────┬──────┬─────────┬──────────────╮
# => │ # │             name              │ type │  size   │   modified   │
# => ├───┼───────────────────────────────┼──────┼─────────┼──────────────┤
# => │ 0 │ CODE_OF_CONDUCT.md            │ file │  3.4 kB │ 9 months ago │
# => │ 1 │ CONTRIBUTING.md               │ file │ 11.2 kB │ 5 months ago │
# => │ 2 │ README.md                     │ file │ 12.2 kB │ 6 days ago   │
# => │ 3 │ SECURITY.md                   │ file │  2.6 kB │ 2 months ago │
# => │ 4 │ benches/README.md             │ file │   249 B │ 2 months ago │
# => │ 5 │ crates/README.md              │ file │   795 B │ 5 months ago │
# => │ 6 │ crates/nu-cli/README.md       │ file │   388 B │ 5 hours ago  │
# => │ 7 │ crates/nu-cmd-base/README.md  │ file │   262 B │ 5 hours ago  │
# => │ 8 │ crates/nu-cmd-extra/README.md │ file │   669 B │ 2 months ago │
# => │ 9 │ crates/nu-cmd-lang/README.md  │ file │  1.5 kB │ a month ago  │
# => ╰───┴───────────────────────────────┴──────┴─────────┴──────────────╯
```

Here, we're looking for any file that ends with ".md". The double-asterisks further specify _"in any directory starting from here."_

Nushell's globbing syntax not only supports `*`, but also matching [single characters with `?` and character groups with `[...]`](https://docs.rs/nu-glob/latest/nu_glob/struct.Pattern.html).

That syntax is the one `ls`, `cp`, `mv`, `rm`, `du`, and the other file commands use. The [`glob` command](/commands/docs/glob.md) reads its patterns with a different library, [wax](https://docs.rs/wax/latest/wax/), which adds `{a,b}` alternatives and has its own rules. For example, `glob **/*.rs --exclude [target]` still lists the files under `target`, because an exclude pattern has to match the paths inside the directory: write `--exclude [target/**]`. See [Pattern syntax of the `glob` command](/lang-guide/chapters/types/basic_types/glob.md#pattern-syntax-of-the-glob-command) for the differences.

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

The same rules decide whether Nushell expands a glob in an argument to an [external command](running_externals.md). `^echo *.txt` passes the names of the matching files, while `^echo "*.txt"` passes the text `*.txt`. One thing differs. When a pattern matches nothing, `ls` and the other file commands report an error, but an external command gets the pattern unchanged, as in Bash. See [glob expansion for external commands](/lang-guide/chapters/types/basic_types/glob.md#additional-language-notes) for how variables and interpolated strings behave.

```nu
^echo *.txt
# => a.txt b.txt
^echo "*.txt"
# => *.txt
^echo *.zip
# => *.zip
```

::: tip
When a glob is passed to [`ls`](/commands/docs/ls.md), [`cp`](/commands/docs/cp.md), [`mv`](/commands/docs/mv.md), [`rm`](/commands/docs/rm.md), or [`du`](/commands/docs/du.md), it doesn't match hidden files (names that start with a `.`). To include them, pass `--all` (`-a`). For example, `rm *myfile*` leaves a file named `.myfile.bak` alone, but `rm --all *myfile*` removes it too.

On Windows, `ls` goes by the file's hidden attribute instead of the leading `.`. It shows a file like `.gitignore` and leaves out files marked hidden, unless you pass `--all`.
:::

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

   An interpolated string written directly as the argument doesn't need `into glob`. Nushell expands it as a glob, so `ls $"*($current_month)*"` finds the same files. The conversion is needed when the pattern is stored in a variable first, as above, or comes from another command.

   This only works when the interpolated string has at least one `( )` part. `ls $"*.txt"` has nothing to interpolate, so it is a plain string, and `ls` looks for a file literally named `*.txt`. A [bare word with `( )`](working_with_strings.md#interpolation-in-bare-words) expands as well: `ls *($current_month)*` finds the same files as the examples above.

   `into glob` also converts a whole list of strings. Spread the result into a command that takes several patterns. Without `into glob`, each item stays a string and `ls` looks for a file literally named `*.md`:

   ```nu
   let patterns = ["*.md" "img/*"]
   ls ...($patterns | into glob) | get name
   # => ╭───┬──────────────╮
   # => │ 0 │ intro.md     │
   # => │ 1 │ latest.md    │
   # => │ 2 │ img/logo.png │
   # => ╰───┴──────────────╯
   ```

   For a record or a table, name the columns to convert, as in `$rules | into glob pattern`. Only those columns become globs and the rest are left alone. Without a column name, `into glob` fails with a `can't convert record<...> to glob` error.

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
  mkdir modules/my/new_module  # No error
  ```

  If you want an error when the directory already exists, use `mkdir --fail-if-exists`.

  ::: tip
  A common mistake when coming to Nushell is to attempt to use `mkdir -p <directory>` as in the native Linux/Unix version. However, this will generate an `Unknown Flag` error on Nushell.

  Just repeat the command without the `-p` to achieve the same effect.
  :::

You can create several directories with one `mkdir`. If one of them fails, for example because part of its path is an existing file, `mkdir` still creates the rest and then raises the error. When more than one path fails, you see the error for the last one. With `--verbose` (`-v`), `mkdir` raises nothing and returns a table with a row for each path instead. A path that failed has `created` set to `false` and the reason in its `error` column. See [the Files cookbook](/cookbook/files.md#reports-from-mkdir-mv-and-rm) for an example.

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
# Go up two levels (parent's parent)
cd ...
# Go up three levels (parent of parent's parent)
cd ....
# Etc.
```

As with a directory name, you can also leave out `cd` and enter just the dots (such as `..` or `...`) on their own at the prompt.

::: tip
Multi-dot shortcuts are available to both internal Nushell [filesystem commands](/commands/categories/filesystem.html) as well as to external commands. For example, running `^stat ....` on a Linux/Unix system will show that the path is expanded to `../../..`

External commands also get `~` expanded. An unquoted argument that is `~` or starts with `~/` becomes a path in your home directory, as it would in Bash. Single or double quotes keep the `~` as typed. A backtick-quoted argument is expanded like an unquoted one. Only a leading `~` counts, so `--out=~/x` is passed unchanged, and so is a `~` that comes from a variable:

```nu
^echo ~/notes.txt "~/notes.txt" `~/notes.txt` --out=~/x
# => /Users/me/notes.txt ~/notes.txt /Users/me/notes.txt --out=~/x
```

:::

You can combine relative directory levels with directory names as well:

```nu
cd ../sibling
```

`cd` with no argument takes you to your home directory, and `cd -` takes you back to the directory you were in before. Every `cd` saves the directory it leaves in `$env.OLDPWD`, so `cd -` is the same as `cd $env.OLDPWD`. Running `cd -` again returns you to where you started. If `$env.OLDPWD` isn't set, `cd -` stays where it is.

When you `cd` through a symbolic link, Nushell keeps the path the way you typed it. `$env.PWD` contains the link's name, and `..` goes back to the directory that holds the link. `cd --physical` (`-P`) resolves symbolic links before it applies `..`, so it moves to the real parent instead:

```nu
# current is a symbolic link to releases/v2
cd current
$env.PWD | path basename
# => current
cd ..
$env.PWD | path basename
# => site
cd current
cd --physical ..
$env.PWD | path basename
# => releases
```

`cd --physical current` resolves the link itself too, so `$env.PWD` ends in `releases/v2` instead of `current`.

On Windows, `cd d:` switches to drive D:. If you're already on D:, nothing changes. Otherwise you land in the directory that Windows remembers as current for D:, which Nushell inherits from the program that started it, or at the root of D: if there is none. A drive-relative path such as `cd d:projects` starts from that same directory.

If the path doesn't exist, `cd` fails with a "Directory not found" error. A path to a file fails with "Not a directory", and a directory you aren't allowed to enter fails with "Permission denied". In each case you stay where you were.

::: tip IMPORTANT TIP
Changing the directory with [`cd`](/commands/docs/cd.md) changes the `PWD` environment variable. This means that a change of directory inside a closure (e.g. `do { cd somewhere }`) or a custom command is kept to that scope. Once the closure ends, you'll return to the previous directory. The blocks of keywords like `if` and `for` are not closures, so a `cd` inside them stays in effect. You can learn more about this in the [Environment](./environment.md) chapter.
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
:::

### Copying files

[`cp`](/commands/docs/cp.md) copies one or more sources to a destination. With more than one source, the destination has to be an existing directory, and the copies go inside it under their own names. A destination that ends in `/` also has to be a directory.

```nu
cp a.txt b.txt backup
cp *.log archive/
```

`cp` won't copy a directory unless you pass `--recursive` (`-r`). If the destination directory already exists, the source goes inside it, so `cp -r src dest` creates `dest/src`. Otherwise `dest` becomes the copy.

Without `-r`, `cp` follows a symbolic link and copies the file it points to. In a recursive copy, links are copied as links. `--no-dereference` (`-P`) copies a link as a link in both cases.

`cp` overwrites existing files without asking. `--no-clobber` (`-n`) skips files that already exist, `--update` (`-u`) skips them unless the source is newer, and `--interactive` (`-i`) asks before each overwrite. `--force` (`-f`) handles a destination file that can't be opened for writing, such as a read-only file, by removing it and copying again. It does nothing together with `-n`, and it isn't implemented on Windows.

The copy keeps the source's permission bits (its mode). `--preserve` replaces that with a list of the attributes to keep: `mode`, `ownership` (not on Windows), `timestamps`, `context` (the SELinux security context), `links` (or `link`), and `xattr`. An empty list keeps none of them, so `cp --preserve [] a.txt b.txt` gives `b.txt` the default permissions for a new file.

```nu
cp --preserve [mode timestamps] report.pdf archive/
```

`--verbose` (`-v`) prints a line such as `'/home/me/a.txt' -> '/home/me/backup/a.txt'` for each file. `--debug` prints the same line plus how the file was copied, for example whether the filesystem could clone it. Unlike `mkdir`, `mv`, and `rm`, `cp --verbose` prints text instead of returning a table. `--progress` (`-p`) shows a progress bar, which is useful for large files.

::: warning
When one file can't be copied, for example because the destination is read-only, `cp` prints a message but doesn't raise an error, so `try` doesn't catch it. A source that doesn't exist does raise an error.
:::

### Moving and renaming files

[`mv`](/commands/docs/mv.md) renames a file or directory, or moves it into an existing directory. Directories move without any extra flag. As with `cp`, several sources need a directory as the destination:

```nu
mv draft.md final.md
mv *.log archive
```

`mv` overwrites an existing destination without asking. `--no-clobber` (`-n`), `--update` (`-u`), and `--interactive` (`-i`) work the way they do for `cp`. `--force` (`-f`) is accepted, but since overwriting is already the default, it changes nothing. `--progress` (`-p`) shows a progress bar.

`mv --verbose` (`-v`) returns a table with `source`, `destination`, and `message` columns, one row per source, with absolute paths. The table lists what you asked to move. With `--no-clobber` or `--update`, a file that was skipped still gets a row.

### Removing files

[`rm`](/commands/docs/rm.md) removes files, symbolic links, and empty directories. A directory that has anything in it needs `--recursive` (`-r`); without it, `rm` fails with "Cannot remove ... try --recursive". `rm` removes a symbolic link itself and leaves its target alone. A trailing `/` on a link to a directory (`rm mylink/`) is an error that tells you to drop the `/`.

`rm` reports a missing file as an error; `--force` (`-f`) ignores missing files. `--interactive` (`-i`) asks before each file, and `--interactive-once` (`-I`) asks once for the whole batch. You can't remove your home directory without one of those two flags.

`rm` keeps going after an error. It removes everything it can, then raises the first error and prints the others. With `--verbose` (`-v`), it raises nothing and returns a table with `path`, `deleted`, and `error` columns, one row per path. The rows aren't in a fixed order.

::: warning
`rm` refuses to remove the current directory, or a directory that contains it, when you name it as `.` or as an absolute path. The error is "Cannot remove any parent directory". It doesn't recognize a relative path to a parent, though, so `rm -r ..` deletes the parent directory and the current directory with it.
:::

By default, `rm` deletes files permanently. If you'd rather have it move them to the system trash (the Recycle Bin on Windows), set `rm.always_trash` in your config:

```nu
$env.config.rm.always_trash = true
```

`--trash` (`-t`) and `--permanent` (`-p`) override the setting for a single call. If a file can't be moved to the trash, the error suggests `--permanent`. Trash support is part of the default build, but it's missing from Nushell builds without the `trash-support` feature, and it's never available on Android or iOS. Without it, `rm --trash` fails, and so does every `rm` while `rm.always_trash` is `true`.

### Checking disk usage

[`du`](/commands/docs/du.md) reports how much space files and directories take up. With no argument, it reports on every entry in the current directory, hidden ones included. A glob such as `du *` skips hidden names unless you add `--all`. Each row has a `path` (always absolute) and two sizes:

- `apparent` adds up the file sizes, the number most tools show as a file's size.
- `physical` is the space on disk. It's usually larger, because the filesystem hands out space in whole blocks, but it can be smaller for sparse or compressed files.

```nu
du site | update path { path basename }
# => ╭───┬──────┬──────────┬──────────╮
# => │ # │ path │ apparent │ physical │
# => ├───┼──────┼──────────┼──────────┤
# => │ 0 │ site │  73.3 kB │  77.8 kB │
# => ╰───┴──────┴──────────┴──────────╯
```

A file with several hard links is counted once. A symbolic link counts as the link itself; `--deref` (`-r`) counts the file it points to instead.

`--max-depth` (`-d`) sets how many levels of subdirectories `du` walks. In GNU `du`, `--max-depth` only shortens the report. In Nushell, anything below the limit is also left out of the totals. In this example, most of the data is a 50 kB image in `site/assets/img`, and `--max-depth 1` stops before that directory:

```nu
du site --max-depth 1 | update path { path basename }
# => ╭───┬──────┬──────────┬──────────╮
# => │ # │ path │ apparent │ physical │
# => ├───┼──────┼──────────┼──────────┤
# => │ 0 │ site │  23.2 kB │  24.5 kB │
# => ╰───┴──────┴──────────┴──────────╯
```

`--exclude` (`-x`) skips files whose path matches a glob, such as `du --exclude *.log`, and `--min-size` (`-m`) skips files smaller than a number of bytes. Both change the totals. `--long` (`-l`) adds `directories` and `files` columns. Each holds a table of the subdirectories or files directly inside, with the same columns, so you can work your way down the tree with [`get`](/commands/docs/get.md).
