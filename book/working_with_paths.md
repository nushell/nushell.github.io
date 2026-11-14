# Working with Paths

The [`path`](/commands/docs/path.md) commands take file paths apart, build new ones, and compare them. This page explains what each subcommand accepts and returns, including the edge cases that the command reference leaves out. `path` by itself only prints the list of subcommands. For changing directories and the file commands, see [Moving Around the System](./moving_around.md).

## Paths are strings

Nushell has no separate path value. A path is a string, and the `path` subcommands take a string or a list of strings. Given a list, they handle each path separately and return a list:

```nu
[/home/me/report.md /home/me/notes.txt] | path basename
# => ╭───┬───────────╮
# => │ 0 │ report.md │
# => │ 1 │ notes.txt │
# => ╰───┴───────────╯
```

Most of them work on the text alone. `path basename`, `path dirname`, `path parse`, `path split`, and `path join` don't check whether the path exists, and they leave `~`, `..`, and `...` as they are:

```nu
"~/projects/../notes.txt" | path dirname
# => ~/projects/..
```

`path relative-to` also compares text, but it expands `~` and shorthands such as `...` first. [`path type`](#checking-what-a-path-is-with-path-type), [`path exists`](/commands/docs/path_exists.md), and [`path expand`](/lang-guide/chapters/types/other_types/path.md#absolute-paths-with-path-expand) are the ones that ask the filesystem. [`path self`](/commands/docs/path_self.md) gives the path of the file it's written in; see [`$env.CURRENT_FILE`](./special_variables.md#env-current-file).

On Windows, both `\` and `/` separate the parts of a path.

Every `path` subcommand can run at parse time, so you can use them in a `const` declaration, as in `const scripts = ($nu.default-config-dir | path join scripts)`. That matters for the paths you give [`source` and `use`](./how_nushell_code_gets_run.md#parse-time-constant-evaluation), which have to be constants.

### Input the commands reject

With nothing piped in, a `path` subcommand fails with "Pipeline empty". A `null` is an error too. You'll usually meet it when a field is missing or empty:

```nu
{file: null} | get file | path basename
# => Error: nu::shell::only_supports_this_input_type
# =>
# =>   × Input type not supported.
# =>    ╭─[repl_entry #1:1:8]
# =>  1 │ {file: null} | get file | path basename
# =>    ·        ──┬─               ──────┬──────
# =>    ·          │                      ╰── only string and list<string> input data is supported
# =>    ·          ╰── input type: nothing
# =>    ╰────
```

If an empty result is fine, put [`default ""`](/commands/docs/default.md) in front, since `path basename` and `path dirname` return an empty string for an empty string. A list has to hold strings only. A number or a `null` anywhere in it is the same error.

## Three ways to write a path

`help path` describes three forms of a path: a string, a record with `parent`, `stem`, and `extension` fields from [`path parse`](#path-parse), and a list of parts from [`path split`](#path-split). It says that every subcommand accepts all three. In Nushell 0.117.0 that isn't true. Only `path join` reads a record or a list of parts, and the other subcommands fail on a record:

```nu
"/home/me/report.md" | path parse | path basename
# => Error: nu::parser::input_type_mismatch
# =>
# =>   × Command does not support record input.
# =>    ╭─[repl_entry #1:1:37]
# =>  1 │ "/home/me/report.md" | path parse | path basename
# =>    ·                                     ──────┬──────
# =>    ·                                           ╰── command doesn't support record input
# =>    ╰────
```

A list of strings means two different things. The other subcommands treat it as several paths, while `path join` treats it as the parts of one path. So the usual pattern is to take a path apart with `path parse` or `path split`, change the record or the list, and put it back together with `path join`.

## Taking paths apart

### `path basename` and `path dirname`

[`path basename`](/commands/docs/path_basename.md) returns the last part of a path, and [`path dirname`](/commands/docs/path_dirname.md) returns everything before it. A trailing `/` isn't a part, so for `/home/me/docs/` the base name is `docs` and the dirname is `/home/me`. A bare name such as `notes.md` has an empty dirname, and `/` has an empty base name and `/` as its dirname.

Because they read only the text, a `..` is just another part. `"a/.." | path dirname` returns `a`, and `path basename` returns an empty string for it. Run [`path expand`](/lang-guide/chapters/types/other_types/path.md#absolute-paths-with-path-expand) first when you need the real parent directory.

`path dirname --num-levels` (`-n`) goes up that many levels instead of one. A count of 0 or less returns the path unchanged. When the path has fewer levels than that, it stops at `/` for an absolute path and returns an empty string for a relative one:

```nu
"/home/me/docs/report.md" | path dirname --num-levels 2
# => /home/me
"docs/img/logo.png" | path dirname --num-levels 5 | to nuon
# => ""
```

`--replace` (`-r`) returns the whole path with the part the command would have returned swapped out. For `path basename`, that's the last part. For `path dirname`, it's the directory part, and with `--num-levels` it's the directory that many levels up, so the levels below it are kept:

```nu
"/home/me/docs/report.md" | path basename --replace summary.md
# => /home/me/docs/summary.md
"/home/me/docs/report.md" | path dirname --replace /srv/www
# => /srv/www/report.md
"/home/me/docs/report.md" | path dirname --num-levels 2 --replace /srv/www
# => /srv/www/docs/report.md
```

The replacement is joined the way `path join` joins, so an absolute value given to `path basename --replace` replaces the whole path. When the path has no base name, as with `/` or `a/..`, `path basename --replace` appends the new name. `path dirname --num-levels 0 --replace` returns the replacement alone.

### `path parse`

[`path parse`](/commands/docs/path_parse.md) turns a path into a record with a `parent`, a `stem` (the file name without its extension), and an `extension` (without the dot). A list of paths gives a table. On Windows, the record also has a `prefix` field in front, holding the drive or share, such as `C:`. It's an empty string for a path without one, and `parent` still includes the prefix.

The extension is whatever follows the last dot:

```nu
"/home/me/archive.tar.gz" | path parse
# => ╭───────────┬─────────────╮
# => │ parent    │ /home/me    │
# => │ stem      │ archive.tar │
# => │ extension │ gz          │
# => ╰───────────┴─────────────╯
```

A name that starts with a dot and has no other dot, such as `.bashrc`, is all stem. A trailing dot gives an empty extension and is dropped from the stem. A trailing `/` is ignored, and a name with no directory part has an empty `parent`:

```nu
[.bashrc notes "draft." /home/me/docs/] | path parse
# => ╭───┬──────────┬─────────┬───────────╮
# => │ # │  parent  │  stem   │ extension │
# => ├───┼──────────┼─────────┼───────────┤
# => │ 0 │          │ .bashrc │           │
# => │ 1 │          │ notes   │           │
# => │ 2 │          │ draft   │           │
# => │ 3 │ /home/me │ docs    │           │
# => ╰───┴──────────┴─────────┴───────────╯
```

`--extension` (`-e`) tells `path parse` what the extension is, which you need for one with a dot in it:

```nu
"/home/me/archive.tar.gz" | path parse --extension tar.gz
# => ╭───────────┬──────────╮
# => │ parent    │ /home/me │
# => │ stem      │ archive  │
# => │ extension │ tar.gz   │
# => ╰───────────┴──────────╯
```

Give the extension without its dot. The name has to end in a dot and that exact text, case included. Otherwise the whole name becomes the stem and `extension` is empty, so `--extension .txt` never matches, and `--extension ''` keeps the whole name as the stem. When the extension appears twice at the end, every copy comes off the stem, and `path join` doesn't give back the original name:

```nu
"backup.txt.txt" | path parse --extension txt | path join
# => backup.txt
```

A trailing dot is lost the same way. `"draft." | path parse | path join` returns `draft`.

### `path split`

[`path split`](/commands/docs/path_split.md) breaks a path into a list of its parts. An absolute Unix path starts with a `/` part. A `.` in the middle and repeated slashes are dropped, but a leading `.` or `..` is kept:

```nu
"/home/me/./docs//report.md" | path split
# => ╭───┬───────────╮
# => │ 0 │ /         │
# => │ 1 │ home      │
# => │ 2 │ me        │
# => │ 3 │ docs      │
# => │ 4 │ report.md │
# => ╰───┴───────────╯
"../docs/report.md" | path split
# => ╭───┬───────────╮
# => │ 0 │ ..        │
# => │ 1 │ docs      │
# => │ 2 │ report.md │
# => ╰───┴───────────╯
```

On Windows, the first part is the drive or share with a `\` added, such as `C:\`, and there's no separate root part. The `\` is added even to a drive-relative path, so `C:notes` splits into `C:\` and `notes`, and joining them gives `C:\notes`.

A list of paths gives a list of lists, which `path join` can't take in one go. Join each one with [`each`](/commands/docs/each.md), as in `$parts | each { path join }`.

## Building paths with `path join`

[`path join`](/commands/docs/path_join.md) accepts every form of a path:

- A string gets each argument appended to it.
- A list of strings is joined into one path. An empty list gives an empty string.
- A record from `path parse` is put back together. Empty fields are skipped, so `{stem: notes, extension: md}` gives `notes.md`.
- A table, meaning a list of records, gives a list of paths, one per row.

With a list, a record, or a table, the arguments are appended after the input is joined. An argument that is an absolute path replaces everything before it, as [Configuration](./configuration.md#path-configuration) shows. `path join` doesn't resolve `..`, so `"/home/me" | path join .. docs` returns `/home/me/../docs`. Pipe the result to `path expand` if you need it resolved.

With the record form, you can change one piece of a path and rebuild the rest as it was:

```nu
"/home/me/report.md" | path parse | update stem { $in + "-old" } | path join
# => /home/me/report-old.md
[/home/me/report.md /srv/www/index.html] | path parse | update extension bak | path join
# => ╭───┬─────────────────────╮
# => │ 0 │ /home/me/report.bak │
# => │ 1 │ /srv/www/index.bak  │
# => ╰───┴─────────────────────╯
```

A record or a row may only have the fields `path parse` produces. Any other field is an error, which is why `ls | path join` fails on the `name` column:

```nu
{parent: /home/me, name: notes.md} | path join
# => Error: nu::shell::unsupported_input
# =>
# =>   × Unsupported input
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ {parent: /home/me, name: notes.md} | path join
# =>    · ─────────────────┬────────────────   ────┬────
# =>    ·                  │                       ╰── Column 'name' is not valid for a structured path. Allowed columns on this platform are: parent, stem, extension
# =>    ·                  ╰── value originates from here
# =>    ╰────
```

On Windows, `prefix` is allowed as well. On other systems it's not, so a record that `path parse` made on Windows fails there.

Because a list of strings is one path to `path join`, piping a list of file names into it doesn't put each name in a directory. Use `each` for that:

```nu
[notes.md todo.md] | path join
# => notes.md/todo.md
[notes.md todo.md] | each {|file| "drafts" | path join $file }
# => ╭───┬─────────────────╮
# => │ 0 │ drafts/notes.md │
# => │ 1 │ drafts/todo.md  │
# => ╰───┴─────────────────╯
```

## Relative paths with `path relative-to`

[`path relative-to`](/commands/docs/path_relative-to.md) returns the input path as seen from the argument path. It expands `~` and shorthands such as `...` on both sides, then compares the text. It never looks at the filesystem. A leading `./` and a trailing `/` make no difference, and a path relative to itself is an empty string.

```nu
"/home/me/proj/src/main.rs" | path relative-to /home/me/proj
# => src/main.rs
```

Without `--walk-up`, the argument has to be a parent of the input. If it isn't, you get an error, with a hint about `--walk-up` when the flag would help:

```nu
"/home/me/proj/src" | path relative-to /home/me/proj/docs
# => Error: nu::shell::error
# =>
# =>   × The argument path is not a parent of the input path.
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ "/home/me/proj/src" | path relative-to /home/me/proj/docs
# =>    · ─────────┬─────────
# =>    ·          ╰── prefix not found
# =>    ╰────
# =>   help: Use --walk-up to allow `..` components in the result.
"/home/me/proj/src" | path relative-to /home/me/proj/docs --walk-up
# => ../src
```

Each `..` that `--walk-up` adds means the parent of the argument path as written. If the argument goes through a symbolic link, the real parent may be a different directory, and the result then points somewhere else.

Both paths have to be absolute, or both relative, and on Windows they have to be on the same drive. `path relative-to` doesn't use the current directory, so a relative input and an absolute argument are an error:

```nu
"src/main.rs" | path relative-to /home/me/proj
# => Error: nu::shell::error
# =>
# =>   × Cannot express the input path relative to the argument path.
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ "src/main.rs" | path relative-to /home/me/proj
# =>    · ──────┬──────
# =>    ·       ╰── the input path and the argument path have different roots
# =>    ╰────
# =>   help: Both paths need to be absolute, or both relative, and on the same
# =>         drive.
```

Make the relative one absolute with `path expand` first. Run from `/home/me/proj`:

```nu
"src/main.rs" | path expand | path relative-to ($env.PWD | path dirname)
# => proj/src/main.rs
```

`--walk-up` has an error of its own. It can't step back over a `..` in the argument that comes after the part both paths share, since that needs the filesystem. `path expand` on the argument removes the `..`:

```nu
"/home/me/proj/src" | path relative-to /home/me/proj/docs/../tests --walk-up
# => Error: nu::shell::error
# =>
# =>   × Cannot walk up from the argument path to the input path.
# =>    ╭─[repl_entry #1:1:40]
# =>  1 │ "/home/me/proj/src" | path relative-to /home/me/proj/docs/../tests --walk-up
# =>    ·                                        ─────────────┬─────────────
# =>    ·                                                     ╰── this path has `..` after the part it shares with the input path
# =>    ╰────
# =>   help: A `..` cannot be walked back without the filesystem. Try `path expand`
# =>         on both paths first.
```

On macOS and Windows, whose filesystems usually ignore case, names are compared without case. On Linux and the other systems, case matters. When `--walk-up` has to add `..`, case always matters, because a wrong guess about the disk would change how many `..` the result needs. So on a Mac:

```nu
"/Users/Me/proj/a.txt" | path relative-to /users/me
# => proj/a.txt
"/Users/Me/proj/a.txt" | path relative-to /users/me/docs --walk-up
# => ../../../Users/Me/proj/a.txt
```

## Checking what a path is with `path type`

[`path type`](/commands/docs/path_type.md) asks the filesystem what a path is and returns `file`, `dir`, or `symlink`. On Linux, macOS, and the BSDs it can also return `block device`, `char device`, `pipe` (a named pipe), or `socket`, and anything it doesn't recognize is `unknown`. It expands `~` and shorthands such as `...`, and resolves a relative path against the current directory.

A path that doesn't exist gives `null`, and so does an empty string. `path type` doesn't follow symbolic links. It reports the link itself, even when the link's target is gone:

```nu
[README.md src readme-link old-link missing.md ""] | wrap path | insert type {|row| $row.path | path type }
# => ╭───┬─────────────┬─────────╮
# => │ # │    path     │  type   │
# => ├───┼─────────────┼─────────┤
# => │ 0 │ README.md   │ file    │
# => │ 1 │ src         │ dir     │
# => │ 2 │ readme-link │ symlink │
# => │ 3 │ old-link    │ symlink │
# => │ 4 │ missing.md  │         │
# => │ 5 │             │         │
# => ╰───┴─────────────┴─────────╯
```

For the type of what a link points to, expand it first. `path expand` resolves links when the target exists:

```nu
"readme-link" | path expand | path type
# => file
```

Failures other than a missing path are errors. A path that goes through a file is one:

```nu
"README.md/x" | path type
# => Error: nu::shell::io::not_a_directory
# =>
# =>   × I/O error
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ "README.md/x" | path type
# =>    · ──────┬──────
# =>    ·       ╰── Not a directory
# =>    ╰────
```

`ls` already has a `type` column. `path type` is for paths you have as strings, such as the output of [`glob`](/commands/docs/glob.md) or a list read from a file.
