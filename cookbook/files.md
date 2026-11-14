---
title: Files
---

# Files

### Editing a file and then saving the changes

Here we are making edits to `Cargo.toml`. We increase the patch version of the crate using `inc` and then save it back to the file.
Use `help inc` to get more information.

Read the file's initial contents

```nu
open Cargo.toml | get package.version
# => 0.116.0
```

Make the edit to the version number and save it. The command doesn't print anything.

```nu
open Cargo.toml | upsert package.version { |p| $p | get package.version | inc --patch } | save -f Cargo.toml
```

Note: `inc` is available through the plugin `nu_plugin_inc`.

Because the data came from `open`, `save` updates only the changed value and keeps the rest of the TOML file as it was, including comments and formatting.

View the changes we made to the file.

```nu
open Cargo.toml | get package.version
# => 0.116.1
```

---

### Parsing a file in a non-standard format

Suppose you have a file named `bands.txt` with the following format.

```text
band:album:year
Fugazi:Steady Diet of Nothing:1991
Fugazi:The Argument:2001
Fugazi:7 Songs:1988
Fugazi:Repeater:1990
Fugazi:In On The Kill Taker:1993
```

You can parse it into a table.

```nu
open bands.txt | lines | split column ":" Band Album Year | skip 1 | sort-by Year
# => ╭───┬────────┬────────────────────────┬──────╮
# => │ # │  Band  │         Album          │ Year │
# => ├───┼────────┼────────────────────────┼──────┤
# => │ 0 │ Fugazi │ 7 Songs                │ 1988 │
# => │ 1 │ Fugazi │ Repeater               │ 1990 │
# => │ 2 │ Fugazi │ Steady Diet of Nothing │ 1991 │
# => │ 3 │ Fugazi │ In On The Kill Taker   │ 1993 │
# => │ 4 │ Fugazi │ The Argument           │ 2001 │
# => ╰───┴────────┴────────────────────────┴──────╯
```

You can alternatively do this using `parse`.

```nu
open bands.txt | lines | parse "{Band}:{Album}:{Year}" | skip 1 | sort-by Year
```

Or, you can utilize the `headers` command to use the first row as a header row. The only difference would be the headers would match the case of the text file. So, in this case, the headers would be lowercase.

```nu
open bands.txt | lines | split column ":" | headers | sort-by year
```

`headers` works on any table. It reads the column names from the values in the first row and then drops that row. An empty header cell gets the name `column` plus its position, counting from 0. The column names come from the first row only, so a cell that a later row has beyond them is dropped:

```nu
"name,,size\nfoo,x,1\nbar,y,2,extra" | lines | split column "," | headers
# => ╭───┬──────┬─────────┬──────╮
# => │ # │ name │ column1 │ size │
# => ├───┼──────┼─────────┼──────┤
# => │ 0 │ foo  │ x       │ 1    │
# => │ 1 │ bar  │ y       │ 2    │
# => ╰───┴──────┴─────────┴──────╯
```

Header cells have to be strings, numbers, booleans, or empty. A list or record in the first row is a type mismatch error, and an empty table fails with "Found empty list".

---

### Word occurrence count with Ripgrep

Suppose you would like to check the number of lines the string "Value" appears per file in the nushell project, then sort those files by largest line count and show the top 10.

```nu
rg -c Value | lines | split column ":" file line_count | into int line_count | sort-by line_count | reverse | first 10
# => ╭───┬─────────────────────────────────────────────────────────────────────────┬────────────╮
# => │ # │                                  file                                   │ line_count │
# => ├───┼─────────────────────────────────────────────────────────────────────────┼────────────┤
# => │ 0 │ crates/nu-protocol/src/value/mod.rs                                     │       1427 │
# => │ 1 │ crates/nu-command/src/sort_utils.rs                                     │        273 │
# => │ 2 │ crates/nu_plugin_polars/src/dataframe/values/nu_dataframe/conversion.rs │        246 │
# => │ 3 │ crates/nu-json/src/value.rs                                             │        206 │
# => │ 4 │ crates/nu-cmd-lang/src/core_commands/describe.rs                        │        198 │
# => │ 5 │ crates/nu-dap/src/variables.rs                                          │        160 │
# => │ 6 │ crates/nu-engine/src/scope.rs                                           │        159 │
# => │ 7 │ crates/nu-command/src/formats/to/md.rs                                  │        157 │
# => │ 8 │ crates/nu-protocol/src/value/from_value.rs                              │        145 │
# => │ 9 │ crates/nu-cli/src/reedline_config.rs                                    │        134 │
# => ╰───┴─────────────────────────────────────────────────────────────────────────┴────────────╯
```

---

### Including hidden files when using `*`

A `*` glob does not match hidden files (names starting with `.`) in [`cp`](/commands/docs/cp.md), [`mv`](/commands/docs/mv.md), [`rm`](/commands/docs/rm.md) and [`du`](/commands/docs/du.md). Add `--all` (`-a`) to include them:

```nu
mkdir build
touch build/app.o build/main.o build/.cache
ls --all build | get name
# => ╭───┬──────────────╮
# => │ 0 │ build/.cache │
# => │ 1 │ build/app.o  │
# => │ 2 │ build/main.o │
# => ╰───┴──────────────╯
rm build/*
ls --all build | get name
# => ╭───┬──────────────╮
# => │ 0 │ build/.cache │
# => ╰───┴──────────────╯
rm --all build/*
ls --all build | length
# => 0
```

---

### Reports from `mkdir`, `mv` and `rm`

With `--verbose` (`-v`), `mkdir`, `mv` and `rm` return a table describing what they did instead of printing messages, so the result can be filtered like any other data. For example, `mkdir -v` reports which directories it actually created:

```nu
mkdir logs/a
mkdir -v logs/a logs/c | update path { path basename }
# => ╭───┬──────┬─────────┬───────╮
# => │ # │ path │ created │ error │
# => ├───┼──────┼─────────┼───────┤
# => │ 0 │ a    │ false   │       │
# => │ 1 │ c    │ true    │       │
# => ╰───┴──────┴─────────┴───────╯
```

A path that can't be created doesn't stop `mkdir -v`. It gets `created: false` and the reason in the `error` column, and the other paths are still created. Here `notes.txt` is a file, so nothing can be created inside it:

```nu
"" | save notes.txt
mkdir -v cache notes.txt/sub | update path { path relative-to $env.PWD }
# => ╭───┬───────────────┬─────────┬────────────────────────────────────────────────╮
# => │ # │     path      │ created │                     error                      │
# => ├───┼───────────────┼─────────┼────────────────────────────────────────────────┤
# => │ 0 │ cache         │ true    │                                                │
# => │ 1 │ notes.txt/sub │ false   │ cannot create directory                        │
# => │   │               │         │ '/home/me/project/notes.txt/sub': Not a        │
# => │   │               │         │ directory                                      │
# => ╰───┴───────────────┴─────────┴────────────────────────────────────────────────╯
```

Without `-v`, `mkdir` raises the error after it has tried every path.

`mv -v` returns one row per source, with `source`, `destination` and `message` columns. The paths are absolute, and `message` reads like `renamed /home/me/project/a.log -> /home/me/project/archive/a.log`:

```nu
touch a.log b.log
mkdir archive
mv -v *.log archive | update source { path basename } | update destination { path relative-to $env.PWD } | reject message
# => ╭───┬────────┬───────────────╮
# => │ # │ source │  destination  │
# => ├───┼────────┼───────────────┤
# => │ 0 │ a.log  │ archive/a.log │
# => │ 1 │ b.log  │ archive/b.log │
# => ╰───┴────────┴───────────────╯
```

`rm -v` has `path`, `deleted` and `error` columns, and like `mkdir -v`, it puts failures in `error` instead of raising them.

::: warning
In Nushell 0.117.0, the text of these messages can go wrong in a longer session. Once one of `cp`, `mkdir`, `mktemp`, `mv`, and `touch` has run, the messages of the others come out as internal keys, such as `mkdir-error-cannot-create-directory` in the `error` column or `mv-verbose-renamed` in the `message` column. The `created` column and the paths are still right, and `rm` isn't affected.
:::

---

### Running a command when files change

[`watch`](/commands/docs/watch.md) watches a file or a directory and returns a stream with one record for each change. The stream doesn't end by itself. Loop over it with `for` or `each` to act on each change, or take a few events with `first`. Ctrl+C stops it.

```nu
for change in (watch docs --glob "**/*.md") { ^mdbook build }
```

Each record has three columns. `operation` is `Create`, `Write`, `Rename`, or `Remove`, and `path` is the absolute path of the file. `new_path` is only set for a rename: when the system reports both names, `path` holds the old one and `new_path` the new one, and when it reports only one of them, the other column is `null`. Changes to a file's metadata alone, such as its permissions or the times `touch` sets, aren't reported. Here a `.rs` file was saved under `project/src` while another shell waited on `watch`:

```nu
watch project --glob "**/*.rs" | first 1 | update path { path relative-to $env.PWD }
# => ╭───┬───────────┬─────────────────────┬──────────╮
# => │ # │ operation │        path         │ new_path │
# => ├───┼───────────┼─────────────────────┼──────────┤
# => │ 0 │ Create    │ project/src/util.rs │          │
# => ╰───┴───────────┴─────────────────────┴──────────╯
```

The `operation` comes from the operating system's file notifications, and on macOS it's often vague. There, saving over an existing file can come through as `Create`, and so can a rename, as a `Create` of the new name. A script that has to run on macOS should treat every event as "something changed at this path".

- `--glob` (`-g`) keeps only the events whose path matches a glob. The glob is relative to the watched path, not to the current directory. `*` matches across directories here, so `--glob "*.rs"` on `.` also reports `src/main.rs`. A pattern that isn't a valid glob is a type mismatch error.
- `--recursive false` (`-r false`) watches only the entries directly inside a directory. The flag takes a boolean, and it's ignored when you watch a single file.
- `--debounce` (`-d`) sets how long `watch` collects changes before it reports them, 100ms by default. A longer time merges the events of an editor that writes a file in several steps, and delays every event by that much.

A path that doesn't exist fails with "Failed to create watcher".

Older scripts pass `watch` a closure to run for each change, as in `watch . {|operation, path, new_path| ... }`. That form is deprecated since Nushell 0.113.0. It still works, with a deprecation warning the first time. It prints "Now watching files at ..." to stderr when it starts, which `--quiet` (`-q`) hides, and prints whatever the closure returns. `--verbose` (`-v`) prints the full glob path when you give `--glob`, and in the closure form it also prints whether each event matched the glob.

[`idx watch`](#searching-files-with-an-in-memory-index) streams changes too, from the in-memory index described next. It reports only the files the index tracks, so files ignored by Git stay quiet. Use `watch` for a path you don't want to index.

---

### Searching files with an in-memory index

The [`idx`](/commands/docs/idx.md) commands build an index of a directory tree in memory, so repeated searches don't have to walk the disk again. Each Nushell process has one index. Running `idx init` again replaces it, and [`idx drop`](/commands/docs/idx_drop.md) throws it away to free the memory. Let's create a small project to search:

```nu
mkdir project/src project/docs
"// TODO: parse args\nfn main() {\n    run();\n}" | save project/src/main.rs
"// TODO: add tests\n// FIXME: handle errors" | save project/src/parser.rs
"TODO: write docs" | save project/docs/notes.md
```

[`idx init`](/commands/docs/idx_init.md) indexes it and returns a record describing the index. `--wait` blocks until the first scan is done:

```nu
idx init project --wait | select watch scanning files dirs
# => ╭──────────┬───────╮
# => │ watch    │ true  │
# => │ scanning │ false │
# => │ files    │ 3     │
# => │ dirs     │ 2     │
# => ╰──────────┴───────╯
```

The record also has the `base_path` that was indexed, the `scan_duration`, and how much memory the index uses (`arena_size_total` and the parts it adds up). Without `--wait`, `idx init` returns while the scan is still running, with `scanning` set to `true`. [`idx status`](/commands/docs/idx_status.md) returns the same record at any time, so check it to see when the scan is done.

`idx status` never fails. Before the first `idx init`, it returns `initialized: false`, an empty `base_path`, and zeros, so a script can test `(idx status).initialized`. The other `idx` commands fail with "idx is not initialized" until you run `idx init`. `idx drop` doesn't fail either. It returns a record with `dropped`, which is `false` when there was no index, and `status`, the record `idx status` gives from then on.

By default the index also watches the directory and stays up to date. Pass `--no-watch` for a one-time snapshot; that also turns off [`idx watch`](/commands/docs/idx_watch.md), which [streams the changes](#streaming-changes-from-the-index) the watcher sees. `--follow-symlinks` (`-f`) makes the scan follow symbolic links. Inside a Git repository, the index leaves out the files Git ignores; outside one, it leaves out hidden files. The index also keeps a summary of each file's contents so that `idx search` can skip files that can't match. `--no-content-indexing` turns that off to save memory, and every search then reads every file.

[`idx files`](/commands/docs/idx_files.md) and [`idx dirs`](/commands/docs/idx_dirs.md) list what's in the index, or only the entries that fuzzy-match a query you pass. Their paths are relative to the indexed directory:

```nu
idx files | select relative_path ext size
# => ╭───┬───────────────┬─────┬──────╮
# => │ # │ relative_path │ ext │ size │
# => ├───┼───────────────┼─────┼──────┤
# => │ 0 │ docs/notes.md │ md  │ 16 B │
# => │ 1 │ src/main.rs   │ rs  │ 44 B │
# => │ 2 │ src/parser.rs │ rs  │ 42 B │
# => ╰───┴───────────────┴─────┴──────╯
```

A file row also has `full_path`, `file_name`, `directory` (the relative directory, ending in `/`), and `modified`. A directory row has only `relative_path` and `full_path`, and both end in `/`:

```nu
idx files main | select relative_path file_name directory
# => ╭───┬───────────────┬───────────┬───────────╮
# => │ # │ relative_path │ file_name │ directory │
# => ├───┼───────────────┼───────────┼───────────┤
# => │ 0 │ src/main.rs   │ main.rs   │ src/      │
# => ╰───┴───────────────┴───────────┴───────────╯
```

With a query, the rows come best match first, but there's no `score` column and no limit. The match is loose, so a short query can bring back names that lack some of its letters: `idx files rs` lists all three files here, `docs/notes.md` included. `idx find` gives scores and a limit, and it searches files and directories together.

[`idx find`](/commands/docs/idx_find.md) fuzzy-matches file and directory names:

```nu
idx find parser
# => ╭───┬──────┬───────────────────────┬──────┬───────╮
# => │ # │ kind │     relative_path     │ rank │ score │
# => ├───┼──────┼───────────────────────┼──────┼───────┤
# => │ 0 │ file │ project/src/parser.rs │    1 │    88 │
# => ╰───┴──────┴───────────────────────┴──────┴───────╯
```

Here the paths are relative to the current directory. `score` says how well the name matched, and the rows are sorted by it, best first; `rank` is the row's position in that order, starting at 1. In a Git repository, files changed by recent commits get a higher score. `--files` (`-f`) or `--dirs` (`-d`) limits the search to one kind of entry (you can't pass both), and `--limit` (`-l`) caps the number of rows, which is 100 by default.

`--verbose` (`-v`) shows how the score came about. When you search both kinds, a `score_details` record holds the `base_score` for the fuzzy match itself, a `filename_bonus` when the match falls in the file name rather than the directory part, a `special_filename_bonus` for entry-point files such as `mod.rs` or `index.js`, and a `frecency_boost`, which stays 0 because Nushell doesn't record which files you open. With `--files`, you get a `match_type` column instead, and with `--dirs`, an `exact_match` column:

```nu
idx find main --files --verbose
# => ╭───┬──────┬─────────────────────┬──────┬───────┬────────────────╮
# => │ # │ kind │    relative_path    │ rank │ score │   match_type   │
# => ├───┼──────┼─────────────────────┼──────┼───────┼────────────────┤
# => │ 0 │ file │ project/src/main.rs │    1 │    60 │ fuzzy_filename │
# => ╰───┴──────┴─────────────────────┴──────┴───────┴────────────────╯
```

[`idx search`](/commands/docs/idx_search.md) searches the contents of the indexed files:

```nu
idx search TODO | select relative_path line_number line
# => ╭───┬───────────────────────┬─────────────┬─────────────────────╮
# => │ # │     relative_path     │ line_number │        line         │
# => ├───┼───────────────────────┼─────────────┼─────────────────────┤
# => │ 0 │ project/docs/notes.md │           1 │ TODO: write docs    │
# => │ 1 │ project/src/main.rs   │           1 │ // TODO: parse args │
# => │ 2 │ project/src/parser.rs │           1 │ // TODO: add tests  │
# => ╰───┴───────────────────────┴─────────────┴─────────────────────╯
```

Each row also has a `column` (where the first match starts in the line, counting from 0), a `byte_offset` (where the line starts in the file), and `matches`, a table with the `start` and `end` byte offset of each match.

The pattern is plain text by default, so characters such as `*`, `?`, and `[` match themselves. `--regex` (`-r`) reads the patterns as regular expressions, and `--fuzzy` (`-f`) matches lines approximately; you can't use both. `--limit` (`-l`) caps the number of matching lines, 50 by default. `--context` (`-c`) adds a `with_context` column holding the matching line and its neighbors. An int sets the same number of lines before and after, and a range such as `-2..5` sets them separately:

```nu
idx search --context 1 run | select relative_path with_context
# => ╭───┬─────────────────────┬─────────────────────╮
# => │ # │    relative_path    │    with_context     │
# => ├───┼─────────────────────┼─────────────────────┤
# => │ 0 │ project/src/main.rs │ ╭───┬─────────────╮ │
# => │   │                     │ │ 0 │ fn main() { │ │
# => │   │                     │ │ 1 │     run();  │ │
# => │   │                     │ │ 2 │ }           │ │
# => │   │                     │ ╰───┴─────────────╯ │
# => ╰───┴─────────────────────┴─────────────────────╯
```

`idx search TODO FIXME` finds lines that match either pattern. A word that looks like a file filter limits which files are searched instead of being searched for: `*.rs` (an extension), `src/` (a directory), a glob with a `/` or with braces (`src/**/*.rs`, `*.{md,txt}`), or any of these after a `!` to exclude those files. The filter can be its own argument or part of the same string:

```nu
idx search "TODO *.md" | select relative_path line
# => ╭───┬───────────────────────┬──────────────────╮
# => │ # │     relative_path     │       line       │
# => ├───┼───────────────────────┼──────────────────┤
# => │ 0 │ project/docs/notes.md │ TODO: write docs │
# => ╰───┴───────────────────────┴──────────────────╯
```

::: warning
In Nushell 0.117.0, a search for more than one text pattern, such as `idx search TODO FIXME`, can miss matching lines while content indexing is on. If you rely on that kind of search, build the index with `idx init --no-content-indexing`.
:::

#### Streaming changes from the index

`idx watch` returns a stream of the changes the index's watcher sees, one record each, with a `kind` and the absolute `path`. `kind` is `created`, `modified`, `removed`, or `renamed`, or `rescan` when the watcher lost track of individual changes under a path and scanned it again. A renamed file is reported under its new path only. Files the index leaves out, such as those Git ignores, don't produce events.

Like [`watch`](#running-a-command-when-files-change), the stream waits for changes until you press Ctrl+C. `--max-events` (`-n`) ends it after that many events, and `--timeout` (`-t`) after that much time, even when nothing happened. A negative `--max-events` is an error. Here two changes were made in another shell, a new file and a rename:

```nu
idx watch --max-events 2 | update path { path relative-to $env.PWD }
# => ╭───┬─────────┬──────────────────────╮
# => │ # │  kind   │         path         │
# => ├───┼─────────┼──────────────────────┤
# => │ 0 │ created │ project/src/lib.rs   │
# => │ 1 │ renamed │ project/docs/todo.md │
# => ╰───┴─────────┴──────────────────────╯
```

An argument limits the events to a glob, a file, or a directory, relative to the indexed directory rather than the current one, as in `idx watch "src/**"`. A pattern outside the indexed directory, such as `../other`, fails with "idx operation failed". `--ignore` (`-i`) takes a list of globs or path prefixes to leave out, so `idx watch --ignore [src]` reports changes everywhere except under `src`.

After `idx init --no-watch`, `idx watch` fails with "idx watching is disabled". If the watcher hasn't started within 30 seconds, it fails with "idx watcher not ready"; `idx init --wait` waits for the watcher as well as the scan, so the first `idx watch` after it starts right away.
