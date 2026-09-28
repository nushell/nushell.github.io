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

---

### Searching files with an in-memory index

The [`idx`](/commands/docs/idx.md) commands build an index of a directory tree in memory, so repeated searches don't have to walk the disk again. Let's create a small project to search:

```nu
mkdir project/src project/docs
"// TODO: parse args" | save project/src/main.rs
"// TODO: add tests" | save project/src/parser.rs
"TODO: write docs" | save project/docs/notes.md
```

[`idx init`](/commands/docs/idx_init.md) indexes it and returns a record describing the index. `--wait` blocks until the first scan is done. By default the index also watches the directory and stays up to date; pass `--no-watch` for a one-time snapshot.

```nu
idx init project --wait | ignore
```

[`idx find`](/commands/docs/idx_find.md) fuzzy-matches file and directory names:

```nu
idx find parser
# => ╭───┬──────┬───────────────────────┬──────┬───────╮
# => │ # │ kind │     relative_path     │ rank │ score │
# => ├───┼──────┼───────────────────────┼──────┼───────┤
# => │ 0 │ file │ project/src/parser.rs │    1 │    88 │
# => ╰───┴──────┴───────────────────────┴──────┴───────╯
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
