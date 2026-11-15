# `std-rfc`

`std-rfc` is a second library of modules that ships inside Nushell, next to the [standard library](../standard_library.md). Its commands are candidates for `std`. They live here first so that people can use them and report problems before the core team decides whether to promote them. You import its modules the same way as `std` modules, with `use std-rfc/<module>`.

[[toc]]

## Stability

A command in `std-rfc` can change or disappear between releases, so expect to revisit scripts that use one when you upgrade. After a trial period, which differs from one candidate to the next, the core team promotes a candidate to `std`, asks for changes and evaluates it again, or removes it.

`clip` went the first way. It moved from `std-rfc/clip` to `std/clip` in Nushell 0.106.0. The `std-rfc/clip` commands kept working, with a deprecation warning, until 0.111.0 removed them. When a module you use is promoted, change its `use` line from `std-rfc/...` to `std/...`.

This page describes the commands in Nushell 0.117.0. If a candidate works well for you, or you run into a problem with one, say so in an issue or pull request on the [Nushell repository](https://github.com/nushell/nushell). The core team weighs that feedback when it decides what to promote.

`nu --no-std-lib` turns off `std-rfc` along with `std`. With that flag, `use std-rfc/str` fails with "Module not found".

## Importing

For each module, one import form gives the commands the names that this page and their `help` examples use:

| Module        | Import with                 | Commands                                                                                                 | In Nushell since |
| ------------- | --------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------- |
| `conversions` | `use std-rfc/conversions *` | `into list`, `columns-into-table`, `record-into-columns`, `table-into-columns`, `name-values`            | 0.103.0          |
| `date`        | `use std-rfc/date *`        | `date floor`, `date ceil`                                                                                | 0.115.0          |
| `iter`        | `use std-rfc/iter *`        | `recurse`, `only`, `prod`                                                                                | 0.105.0          |
| `kv`          | `use std-rfc/kv *`          | `kv set`, `kv get`, `kv list`, `kv drop`, `kv universal-variable-hook`                                   | 0.103.0          |
| `path`        | `use std-rfc/path`          | `path with-extension`, `path with-stem`, `path with-parent`                                              | 0.103.0          |
| `pb`          | `use std-rfc/pb`            | `pb set`, `pb set-idx`, `pb indeterminate`, `pb pause`, `pb error`, `pb clear`                           | 0.113.0          |
| `random`      | `use std-rfc/random`        | `random choice`                                                                                          | 0.107.0          |
| `str`         | `use std-rfc/str`           | `str dedent`, `str unindent`, `str align`, `str lcp`                                                     | 0.103.0          |
| `tables`      | `use std-rfc/tables *`      | `aggregate`, `select slices`, `reject slices`, `select column-slices`, `reject column-slices`            | 0.103.0          |
| `url`         | `use std-rfc/url`           | `url with-host`, `url with-port`, `url with-path`, `url with-fragment`, `url with-params`, `url replace` | 0.113.0          |
| `xml`         | `use std-rfc/xml`           | `xml xaccess`                                                                                            | 0.112.0          |

The other form changes the names. Without the `*`, `use std-rfc/iter` gives `iter recurse`, `iter only` and `iter prod`, and `use std-rfc/date` gives `date date floor`. With a `*`, `use std-rfc/url *` gives a bare `with-host` and `replace`. See [Using Modules](../modules/using_modules.md) for how the two forms work.

`use std-rfc *` loads every module except `date`. Most commands get the names in the table, but the `path` commands lose their prefix (`with-extension`, not `path with-extension`) and the `iter` commands gain one (`iter recurse`). In a Nushell built without the `sqlite` feature, it skips `kv` as well. Like `use std *`, it loads more than most scripts need.

Two glob imports replace commands you may rely on. `use std-rfc/pb *` defines its own `clear`, so [`clear`](/commands/docs/clear.md) stops clearing the screen and resets the progress bar instead. `use std-rfc/xml *` and `use std/xml *` both define `xaccess`, and the one imported last wins.

Once a module is imported, `help <command>` shows a command's parameters and examples.

## `std-rfc/conversions`

```nu
use std-rfc/conversions *
```

### `into list`

`into list` turns its input into a list. A range expands into its values, and a list or table passes through unchanged, streams included. A record becomes a table with a `key` and a `value` column, one row per field. Any other value becomes a list with one item:

```nu
1..3 | into list
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => ╰───┴───╯
{name: nu, version: 117} | into list
# => ╭───┬─────────┬───────╮
# => │ # │   key   │ value │
# => ├───┼─────────┼───────┤
# => │ 0 │ name    │ nu    │
# => │ 1 │ version │   117 │
# => ╰───┴─────────┴───────╯
"hello" | into list | to nuon
# => [hello]
```

`null | into list` is `[null]`, not an empty list. Use `into list` to turn a range into the list that [`random choice`](#std-rfc-random) and [`prod`](#prod) need.

### `table-into-columns`, `record-into-columns` and `columns-into-table`

These three commands treat a table as a list of one-column tables. `table-into-columns` splits a table into one single-column table per column, in column order. `record-into-columns` does the same for a record of lists, turning each field into a column named after its key. `columns-into-table` goes the other way and merges a list of tables into one, row by row, with [`merge`](/commands/docs/merge.md).

```nu
{a: [1 2 3], b: [4 5 6]} | record-into-columns | columns-into-table
# => ╭───┬───┬───╮
# => │ # │ a │ b │
# => ├───┼───┼───┤
# => │ 0 │ 1 │ 4 │
# => │ 1 │ 2 │ 5 │
# => │ 2 │ 3 │ 6 │
# => ╰───┴───┴───╯
```

Splitting a table and merging it again lets you handle its columns as a list. This reverses the column order:

```nu
[[name size]; [a.txt 10] [b.txt 20]] | table-into-columns | reverse | columns-into-table
# => ╭───┬──────┬───────╮
# => │ # │ size │ name  │
# => ├───┼──────┼───────┤
# => │ 0 │   10 │ a.txt │
# => │ 1 │   20 │ b.txt │
# => ╰───┴──────┴───────╯
```

Columns of different lengths don't fill a table. The rows past the end of a short column have no field for it:

```nu
{a: [1 2 3], b: [4]} | record-into-columns | columns-into-table | to nuon
# => [{a: 1, b: 4}, {a: 2}, {a: 3}]
```

When two columns have the same name, the later one wins. `[] | columns-into-table` fails with "Expected input" instead of returning an empty table.

### `name-values`

`name-values` builds a record from a list or a range. Its arguments are the keys, matched to the values in order:

```nu
"nushell 0.117.0 linux" | split row " " | name-values name version os
# => ╭─────────┬─────────╮
# => │ name    │ nushell │
# => │ version │ 0.117.0 │
# => │ os      │ linux   │
# => ╰─────────┴─────────╯
```

With fewer names than values, each remaining value's key is its position, as a string. Names past the last value are ignored.

```nu
[1 2 3] | name-values a b | to nuon
# => {a: 1, b: 2, "2": 3}
```

## `std-rfc/date`

```nu
use std-rfc/date *
```

`use std-rfc *` doesn't include this module, so import it on its own. Without the `*`, the commands are named `date date floor` and `date date ceil`.

`date floor` rounds a datetime down to a multiple of a duration, and `date ceil` rounds it up to the next multiple:

```nu
2026-07-15T12:11:10-04:00 | date floor 1hr | to nuon
# => 2026-07-15T12:00:00-04:00
2026-07-15T12:11:10-04:00 | date ceil 15min | to nuon
# => 2026-07-15T12:15:00-04:00
```

Rounding happens in the UTC offset that the datetime carries, and the result keeps that offset. So `1day` rounds to midnight in that offset, not in your local time zone:

```nu
2026-07-15T12:11:10+05:30 | date floor 1day | to nuon
# => 2026-07-15T00:00:00+05:30
```

The multiples count from midnight on 1 January 1970 in that offset. A period that divides a day evenly, such as `15min` or `6hr`, lines up with the clock, and other periods don't. A week starts on Thursday, because 1 January 1970 was a Thursday:

```nu
2026-07-15T12:11:10-04:00 | date floor 1wk | format date "%F %A"
# => 2026-07-09 Thursday
```

`date ceil` adds one period to the result of `date floor`. A datetime that already sits on a boundary moves up a full period:

```nu
2026-07-15T12:00:00-04:00 | date ceil 1hr | to nuon
# => 2026-07-15T13:00:00-04:00
```

The period must be greater than zero. `0sec` or a negative duration fails with `nu::shell::needs_positive_value`. Put a negative literal in parentheses, as in `(-1hr)`, or the parser reads it as a flag. Months and years aren't durations in Nushell, so these commands can't round to them.

The input must be a single datetime. Round a list with [`each`](/commands/docs/each.md), and convert strings with [`into datetime`](/commands/docs/into_datetime.md) first:

```nu
[2026-07-15T12:11:10-04:00 2026-07-15T14:49:00-04:00] | each { date floor 1hr } | to nuon
# => [2026-07-15T12:00:00-04:00, 2026-07-15T14:00:00-04:00]
```

## `std-rfc/iter`

```nu
use std-rfc/iter *
```

Without the `*`, the commands are `iter recurse`, `iter only` and `iter prod`, next to the `iter` commands from `std/iter`.

### `recurse`

`recurse` walks a nested value and streams every value inside it, together with the cell path that reaches it, like `..` in jq. Each row has a `path` column, holding a cell path, and an `item` column. The first row is the input itself, at path `$.`:

```nu
{name: nu, tags: [shell rust]} | recurse
# => ╭───┬──────────┬───────────────────╮
# => │ # │   path   │       item        │
# => ├───┼──────────┼───────────────────┤
# => │ 0 │ $.       │ {record 2 fields} │
# => │ 1 │ $.name   │ nu                │
# => │ 2 │ $.tags   │ [list 2 items]    │
# => │ 3 │ $.tags.0 │ shell             │
# => │ 4 │ $.tags.1 │ rust              │
# => ╰───┴──────────┴───────────────────╯
```

By default, `recurse` goes breadth-first. It emits all of a value's children before any grandchild. `--depth-first` finishes each branch before it starts the next, which is the order jq uses.

Without an argument, a record's fields and a list's items are the children, and any other value has none. An argument changes how `recurse` finds children:

- A cell path makes `recurse` follow only that path, evaluated against each value in turn. When the path leads to a list, each item of the list is a child. When it leads nowhere, or to `null`, the value has no children. You can give several cell paths, as in `recurse a b`.
- A closure receives the value, as `$in` and as its parameter, and returns the children. It can return a list of children, a table with an `item` column, or a table with `item` and `path` columns. Each child's `path` extends its parent's path, and a child without one gets the segment `<closure>`. When the closure fails, the value has no children. A closure can't be combined with cell paths.

A cell path walks a tree:

```nu
let tree = {name: "/", children: [
    {name: "/bin", children: [{name: "/bin/ls", children: []}]}
    {name: "/home", children: [{name: "/home/me", children: []}]}
]}
$tree | recurse children | get item.name | to nuon
# => [/, /bin, /home, /bin/ls, /home/me]
$tree | recurse children --depth-first | get item.name | to nuon
# => [/, /bin, /bin/ls, /home, /home/me]
```

A record at the end of the path is a single child, so a cell path can also follow a chain of records:

```nu
{v: 1, next: {v: 2, next: {v: 3}}} | recurse next | update item { get v }
# => ╭───┬─────────────┬──────╮
# => │ # │    path     │ item │
# => ├───┼─────────────┼──────┤
# => │ 0 │ $.          │    1 │
# => │ 1 │ $.next      │    2 │
# => │ 2 │ $.next.next │    3 │
# => ╰───┴─────────────┴──────╯
```

A closure can produce children that never run out. Because `recurse` streams its rows, a command such as [`take while`](/commands/docs/take_while.md) can stop it:

```nu
2 | recurse { {path: square, item: ($in * $in)} } | take while { $in.item < 100 }
# => ╭───┬─────────────────┬──────╮
# => │ # │      path       │ item │
# => ├───┼─────────────────┼──────┤
# => │ 0 │ $.              │    2 │
# => │ 1 │ $.square        │    4 │
# => │ 2 │ $.square.square │   16 │
# => ╰───┴─────────────────┴──────╯
```

### `only`

`only` returns the one item of a list or table, and fails when there are none or more than one. Use it after [`where`](/commands/docs/where.md) when exactly one row should match. [`first`](/commands/docs/first.md) would quietly take one of several.

```nu
[[name id]; [nu 1] [rs 2]] | where id == 2 | only name
# => rs
```

The optional cell path argument is read from that one item, so `only name` is like `get 0.name` with the count checked first.

Empty input fails with "expected non-empty table/list". With `--optional`, `only` returns `null` for it instead. Input with two or more items fails with "expected only one element in table/list", with or without `--optional`.

`--optional` doesn't cover the cell path, so a missing column still fails. Make the cell path optional for that:

```nu
[{name: nu}] | only id? | to nuon
# => null
```

`only` collects a stream before it counts, so it never returns on an endless stream. The input must be a list or a table. A record or a single value is a type error.

### `prod`

`prod` takes a record whose values are lists and returns their cartesian product, a table with one column per key and one row per combination. The first key changes slowest:

```nu
prod {size: [small large], color: [red blue]}
# => ╭───┬───────┬───────╮
# => │ # │ size  │ color │
# => ├───┼───────┼───────┤
# => │ 0 │ small │ red   │
# => │ 1 │ small │ blue  │
# => │ 2 │ large │ red   │
# => │ 3 │ large │ blue  │
# => ╰───┴───────┴───────╯
```

A list piped into `prod` becomes an extra first column named `in`:

```nu
[1 2] | prod {letter: [a b]}
# => ╭───┬────┬────────╮
# => │ # │ in │ letter │
# => ├───┼────┼────────┤
# => │ 0 │  1 │ a      │
# => │ 1 │  1 │ b      │
# => │ 2 │  2 │ a      │
# => │ 3 │  2 │ b      │
# => ╰───┴────┴────────╯
```

- Every value in the record must be a list. Otherwise `prod` fails with "Type mismatch. All values must be lists.", pointing at each value that isn't one.
- An empty list anywhere gives an empty table, and `prod {}` gives one empty record, `[{}]`.
- A table piped in isn't merged into the result. Each of its rows becomes one value in the `in` column.
- A key named `in` replaces the column made from the input.
- To pipe in a range, convert it with [`into list`](#into-list) first, as in `1..3 | into list | prod {letter: [a b]}`.

## `std-rfc/kv`

```nu
use std-rfc/kv *
```

`kv` is a key-value store. Use it to keep a value for later in the session, or to share values between Nushell sessions. It stores each value as NUON in a SQLite table, so a filesize comes back as a filesize and a record as a record. The module needs a Nushell built with the `sqlite` feature, which the default build includes. The `features` field of [`version`](/commands/docs/version.md) lists the features of the running build.

### Setting and reading values

`kv set` stores a value under a key, replacing any value the key had. The value is the second argument or, without one, the pipeline input. `kv get` returns the value, or `null` for a key that doesn't exist. `kv list` returns every pair as a table with `key` and `value` columns, the values decoded from NUON. `kv drop` removes a key and returns the value it had, `null` if there wasn't one.

```nu
kv set retries 3
kv set limit 10MB
kv get limit | describe
# => filesize
kv get missing | describe
# => nothing
kv list
# => ╭───┬─────────┬─────────╮
# => │ # │   key   │  value  │
# => ├───┼─────────┼─────────┤
# => │ 0 │ retries │       3 │
# => │ 1 │ limit   │ 10.0 MB │
# => ╰───┴─────────┴─────────╯
kv drop retries
# => 3
```

When the value is a closure, `kv set` runs it on the pipeline input and stores the result. A closure itself can't be stored.

`--return` (`-r`) sets what `kv set` outputs:

- `input`, or `in` or `i`, is the default. It outputs the pipeline input unchanged, even when an argument supplied the value, and `null` when there was no pipeline input.
- `value`, or `v`, outputs the stored value. For a closure, that's the closure's result.
- `all`, or `a`, outputs every pair in the table, as `kv list` does.

Any other word fails with "Invalid --return option".

With the default, you can store several values from one pipeline and keep going:

```nu
[[name size]; [a.txt 1kb] [b.txt 2kb]]
| kv set names { get name }
| kv set total { get size | math sum }
| length
# => 2
kv get total
# => 3.0 kB
```

`--return value` hands back the new value when you update one:

```nu
kv set counter 1
kv get counter | kv set counter { $in + 1 } --return value
# => 2
```

### Tables

Each command takes `--table` (`-t`) to use a table other than the default, `std_kv_store`. A key in one table is separate from the same key in another:

```nu
kv set --table scratch x 1
kv set x 2
[(kv get x) (kv get --table scratch x)] | to nuon
# => [2, 1]
```

A table name can contain only ASCII letters, digits and underscores. Any other name fails with "Invalid table name".

### In memory or on disk

Without `--universal`, the store is the in-memory database that [`stor`](/commands/docs/stor.md) manages. Every Nushell process has its own, so a script started with `nu script.nu` doesn't see the values of the shell that started it, and the values are gone when the process exits. The `stor` commands work on the same database. You can query the store with SQL, and [`stor reset`](/commands/docs/stor_reset.md) deletes every `kv` value along with your own `stor` tables.

```nu
kv set x 2
stor open | query db "SELECT key, value FROM std_kv_store"
# => ╭───┬─────┬───────╮
# => │ # │ key │ value │
# => ├───┼─────┼───────┤
# => │ 0 │ x   │ 2     │
# => ╰───┴─────┴───────╯
```

With `--universal` (`-u`), the commands use a SQLite file instead, and every Nushell session that uses the same file sees the same keys. Universal keys are separate from the in-memory ones, so `kv get x` and `kv get -u x` can return different values.

```nu
kv set --universal EDITOR hx
kv set --universal retries 3
kv list --universal
# => ╭───┬─────────┬───────╮
# => │ # │   key   │ value │
# => ├───┼─────────┼───────┤
# => │ 0 │ EDITOR  │ hx    │
# => │ 1 │ retries │     3 │
# => ╰───┴─────────┴───────╯
```

`$env.NU_UNIVERSAL_KV_PATH` is the path of that file. When it isn't set, the file is `std_kv_variables.sqlite3` in [`$nu.data-dir`](../special_variables.md#nu). The commands create the file the first time they need it, but its directory has to exist, or they fail with "Failed to open SQLite database". Give an absolute path. The commands use the value as it is, so a relative path points somewhere else after a `cd`, and a leading `~` isn't expanded. Expand it yourself:

```nu
$env.NU_UNIVERSAL_KV_PATH = ('~/nu-kv.sqlite3' | path expand)
```

### Universal variables

`kv universal-variable-hook` turns the universal keys into environment variables in every running session, the way universal variables work in fish. It returns a closure that loads each universal key into `$env` and then sets `$env.NU_KV_UNIVERSALS` to `true`. Store at least one key with `kv set -u` before you add the hook, and keep at least one stored while it's installed. Add it to the [`pre_execution` hooks](../hooks.md#pre-execution-hooks) in `config.nu`:

```nu
use std-rfc/kv *
$env.config.hooks.pre_execution ++= [(kv universal-variable-hook)]
```

The hook runs before each command line you enter. After `kv set -u EDITOR hx` in one session, `$env.EDITOR` is `hx` from the next command line on, in that session and in every other session with the hook. Values keep their type, so `$env.retries` from the example above is an `int`.

`$env.NU_KV_UNIVERSALS` tells `kv drop --universal` that universal keys are loaded as environment variables. When it is `true`, `kv drop -u` also removes the environment variable of the same name from the session that runs it. To remove the variable from another session as well, run [`hide-env`](/commands/docs/hide-env.md) there. The hook sets `NU_KV_UNIVERSALS` for you. If you load the keys another way, for example once at startup with `kv list -u | transpose -dr | load-env`, set `$env.NU_KV_UNIVERSALS = true` yourself.

## `std-rfc/path`

```nu
use std-rfc/path
```

These commands replace one part of a path: the extension, the stem (the file name without its extension), or the parent directory. They split the path with [`path parse`](/commands/docs/path_parse.md), change that part, and put the path back together with [`path join`](/commands/docs/path_join.md). They only compute a new string and never rename anything on disk. Pass the result to [`mv`](/commands/docs/mv.md) for that. Each one takes a single path or a list of paths.

`path with-extension` replaces the last extension, or adds one when there is none. A leading dot in the new extension is optional, and an empty string removes the extension:

```nu
"src/main.rs" | path with-extension bak
# => src/main.bak
["notes.txt" "archive.tar.gz" "README"] | path with-extension .md
# => ╭───┬────────────────╮
# => │ 0 │ notes.md       │
# => │ 1 │ archive.tar.md │
# => │ 2 │ README.md      │
# => ╰───┴────────────────╯
"notes.txt" | path with-extension ""
# => notes
```

`path with-stem` replaces the stem and keeps the extension. When the path ends in a directory, the directory's name is the stem, and a trailing slash is dropped:

```nu
"src/main.rs" | path with-stem lib
# => src/lib.rs
"/home/alice/" | path with-stem bob
# => /home/bob
```

`path with-parent` replaces everything before the last part. A trailing slash on the new parent is optional, and a leading `~` in it stays as it is:

```nu
["/etc/hosts" "/etc/ssh/sshd_config"] | path with-parent /backup
# => ╭───┬─────────────────────╮
# => │ 0 │ /backup/hosts       │
# => │ 1 │ /backup/sshd_config │
# => ╰───┴─────────────────────╯
```

## `std-rfc/pb`

```nu
use std-rfc/pb
```

`pb` drives the progress indicator that some terminals show in a tab or the taskbar, through the OSC 9;4 escape sequence. Each command prints one sequence to standard output with [`print -n`](/commands/docs/print.md) and returns nothing. Whether anything appears, and where, depends on the terminal.

Each sequence is `(ansi osc)`, the parameters below, and `(ansi st)`:

| Command                      | Parameters                    | State                          |
| ---------------------------- | ----------------------------- | ------------------------------ |
| `pb set <percentage>`        | `9;4;1;<percentage>`          | Progress at that percentage    |
| `pb set-idx <index> <total>` | `9;4;1;<index / total * 100>` | Progress as a share of `total` |
| `pb indeterminate`           | `9;4;3`                       | Busy, with no percentage       |
| `pb pause`                   | `9;4;4`                       | Paused                         |
| `pb error [error_code]`      | `9;4;2;<error_code>`          | Error                          |
| `pb clear`                   | `9;4;0`                       | No indicator                   |

A loop that reports each step and clears the indicator at the end:

```nu
let steps = [fetch build test package]
for step in ($steps | enumerate) {
    pb set-idx ($step.index + 1) ($steps | length)
    sleep 500ms
}
pb clear
```

- `pb set` expects a percentage from 0 to 100 but doesn't check it, so `pb set 150` sends 150.
- `pb set-idx` drops the fraction, so `pb set-idx 1 3` sends 33. A `total` of 0 fails with a division by zero error.
- `pb error` puts its number in the field where `pb set` puts the percentage. It defaults to 0.
- The sequences go to standard output, so when you redirect the output of a script that uses `pb`, they end up in the file.
- Import the module without a glob. `use std-rfc/pb *` replaces the built-in `clear` command.

## `std-rfc/random`

```nu
use std-rfc/random
```

`random choice` picks random items from a list without replacement, so each position in the list is picked at most once. Without an argument it returns one item. With a count `n`, it returns a list of `n` items:

```nu
[red green blue] | random choice | describe
# => string
[red green blue] | random choice 2 | length
# => 2
```

- A count larger than the list fails with "Can't sample more elements than there are in input" and a label such as "Tried to sample 4 out of 3". An empty list fails the same way without a count.
- Duplicate values in the list are separate positions, so a sample can hold the same value twice.
- The order of the sample isn't random. A count equal to the list's length returns the list in its original order. Pipe the sample to [`shuffle`](/commands/docs/shuffle.md) when the order matters.
- `random choice` collects a stream before it samples.
- The parser rejects a range as input. Convert it with `into list` from [`std-rfc/conversions`](#into-list):

```nu
use std-rfc/conversions *
1..100 | into list | random choice 5 | length
# => 5
```

## `std-rfc/str`

```nu
use std-rfc/str
```

### `str dedent` and `str unindent`

Both commands remove the indentation that a multi-line string picks up when you indent it to match the code around it. They differ in how they decide how much to remove.

`str dedent` takes the indentation from the last line. The string must start with a line break and end with a line that holds only spaces or tabs, usually the indentation in front of the closing quote. `str dedent` drops both of those lines and removes the last line's whitespace from the start of every other line. It keeps blank lines:

```nu
def usage [] {
    "
    Usage: build [--release]

      --release  Build with optimizations
    " | str dedent
}
usage
# => Usage: build [--release]
# =>
# =>   --release  Build with optimizations
```

`str dedent` is strict. A first line with anything but whitespace fails with "First line must be empty". A last line with anything but whitespace fails with "Last line must contain only whitespace indicating the dedent". A line indented less than the last line fails with a message such as "Line 2 must have an indent of 4 or more.", counting lines from the one after the opening line break. Lines with nothing but whitespace are exempt from that check.

`str dedent` compares the indentation as text, so tab indentation works without a flag.

`str unindent` finds the smallest indentation among the lines that aren't blank and removes that much from every line. It drops the first and the last line only when they hold nothing but whitespace, and uneven indentation is never an error.

```nu
"
        Usage: build [--release]
          --release  Build with optimizations
" | str unindent
# => Usage: build [--release]
# =>   --release  Build with optimizations
```

`str unindent` counts spaces. For tab indentation, add `--tabs` (`-t`), which counts tabs instead. Only the leading run of the chosen character counts, so a line indented with a space and then a tab has an indentation of 1 without `--tabs`.

```nu
"\t\tone\n\t\t\ttwo" | str unindent --tabs | to json
# => "one\n\ttwo"
```

On Windows, both commands look for `\r\n` line endings when they check the first and last lines, because [`char lsep`](/commands/docs/char.md) is `\r\n` there. A string with plain `\n` endings fails the first-line check of `str dedent`, and `str unindent` keeps its blank first and last lines. `str dedent` also joins its output lines with `\r\n` on Windows.

### `str align`

`str align` pads lines so that the first occurrence of a substring lines up in one column. The input is a multi-line string or a list of strings, and the output is a single string with the lines joined by `\n`:

```nu
["name = nu", "version = 0.117.0", "os = linux"] | str align "="
# => name    = nu
# => version = 0.117.0
# => os      = linux
```

`--center` (`-C`) puts the padding at the start of the line instead of in front of the substring, so the text before it ends up right-aligned:

```nu
["name = nu", "version = 0.117.0", "os = linux"] | str align "=" --center
# =>    name = nu
# => version = 0.117.0
# =>      os = linux
```

`--range` (`-r`) aligns only the lines whose index, counting from 0, is in the range. The other lines stay as they are and don't move the column:

```nu
"# key = value pairs\njobs = 8\noptimize = true" | str align "=" --range 1..
# => # key = value pairs
# => jobs     = 8
# => optimize = true
```

`--char` (`-c`) sets the padding, a space by default. `str align` inserts the whole string once for each column of padding, so a two-character string doubles the gap. Lines without the substring are left alone, and empty input returns an empty string.

### `str lcp`

`str lcp` finds the longest common prefix of a list of strings. It returns a record with the `prefix`, the `rest` of each string after it, and `success`, which is `true` when the prefix isn't empty:

```nu
[acme-3.4.5 acme-3.6.0] | str lcp | to nuon
# => {prefix: "acme-3.", rest: ["4.5", "6.0"], success: true}
```

It compares grapheme clusters, so an `é` written as `e` plus a combining accent doesn't share a prefix with a plain `e`. It compares characters, not path components, so the common prefix of `/home/me/src/nu` and `/home/me/srcx` is `/home/me/src`.

An empty list gives `{prefix: "", rest: [], success: false}`. A list with one string gives that string as the prefix, `[""]` as the rest, and `success: true`.

## `std-rfc/tables`

```nu
use std-rfc/tables *
```

The examples in this section use this table:

```nu
let sales = [[region product units]; [north apple 10] [north pear 4] [south apple 7] [south pear 8] [south apple 3]]
```

### `aggregate`

`aggregate` computes summary values for columns of a table, one row per group. Give it the output of [`group-by --to-table`](/commands/docs/group-by.md) and the columns to summarize. Each row holds the grouping columns, a `count` of the group's rows, and then one column per summarized column and operation, named `<column>_<operation>`:

```nu
$sales | group-by region --to-table | aggregate units
# => ╭───┬────────┬───────┬───────────┬───────────┬───────────┬───────────╮
# => │ # │ region │ count │ units_min │ units_avg │ units_max │ units_sum │
# => ├───┼────────┼───────┼───────────┼───────────┼───────────┼───────────┤
# => │ 0 │ north  │     2 │         4 │      7.00 │        10 │        14 │
# => │ 1 │ south  │     3 │         3 │      6.00 │         8 │        18 │
# => ╰───┴────────┴───────┴───────────┴───────────┴───────────┴───────────╯
```

The default operations are `min`, `avg`, `max` and `sum`. `--ops` replaces them with a record of names and closures. Each closure receives one group's values for the column, as a list:

```nu
$sales | group-by region product --to-table | aggregate units --ops {total: {math sum}}
# => ╭───┬────────┬─────────┬───────┬─────────────╮
# => │ # │ region │ product │ count │ units_total │
# => ├───┼────────┼─────────┼───────┼─────────────┤
# => │ 0 │ north  │ apple   │     1 │          10 │
# => │ 1 │ north  │ pear    │     1 │           4 │
# => │ 2 │ south  │ apple   │     2 │          10 │
# => │ 3 │ south  │ pear    │     1 │           8 │
# => ╰───┴────────┴─────────┴───────┴─────────────╯
```

A table that isn't grouped counts as a single group:

```nu
$sales | aggregate units
# => ╭───┬───────┬───────────┬───────────┬───────────┬───────────╮
# => │ # │ count │ units_min │ units_avg │ units_max │ units_sum │
# => ├───┼───────┼───────────┼───────────┼───────────┼───────────┤
# => │ 0 │     5 │         3 │      6.40 │        10 │        32 │
# => ╰───┴───────┴───────────┴───────────┴───────────┴───────────╯
```

- With no columns, `aggregate` returns the grouping columns and `count`.
- A nested cell path such as `stats.ms` gives columns such as `stats.ms_min`.
- A missing column fails with "Cannot find column" and the path it looked for, such as `'$.items.weight'` for grouped input.
- `group-by` without `--to-table` returns a record, which `aggregate` rejects.
- An empty table fails with "Cannot access empty content".
- `aggregate` treats its input as `group-by` output when the first row has an `items` column, so an ungrouped table with a column of that name is misread.

### `select slices` and `reject slices`

These two work like [`select`](/commands/docs/select.md) and [`reject`](/commands/docs/reject.md) with row numbers, but they take ranges as well as single numbers and keep the original row numbers. The output has an `index` column with each row's position in the input, which Nushell displays as the `#` column:

```nu
$sales | select slices 0 3..4
# => ╭───┬────────┬─────────┬───────╮
# => │ # │ region │ product │ units │
# => ├───┼────────┼─────────┼───────┤
# => │ 0 │ north  │ apple   │    10 │
# => │ 3 │ south  │ pear    │     8 │
# => │ 4 │ south  │ apple   │     3 │
# => ╰───┴────────┴─────────┴───────╯
$sales | reject slices 1..3
# => ╭───┬────────┬─────────┬───────╮
# => │ # │ region │ product │ units │
# => ├───┼────────┼─────────┼───────┤
# => │ 0 │ north  │ apple   │    10 │
# => │ 4 │ south  │ apple   │     3 │
# => ╰───┴────────┴─────────┴───────╯
```

For a list, the result is a table with `index` and `item` columns:

```nu
[a b c d] | select slices 1 3 | to nuon
# => [[index, item]; [1, b], [3, d]]
```

- Rows come back in input order, whatever the order of the arguments.
- Give each range an end, as in `3..<($sales | length)`.
- `select slices` ignores a row number past the end. `reject slices` fails on one with "Row number too large".

### `select column-slices` and `reject column-slices`

These two pick or drop columns of a record or a table by position, counting from 0. They take single numbers and ranges:

```nu
$sales | select column-slices 0 2
# => ╭───┬────────┬───────╮
# => │ # │ region │ units │
# => ├───┼────────┼───────┤
# => │ 0 │ north  │    10 │
# => │ 1 │ north  │     4 │
# => │ 2 │ south  │     7 │
# => │ 3 │ south  │     8 │
# => │ 4 │ south  │     3 │
# => ╰───┴────────┴───────╯
{a: 1, b: 2, c: 3, d: 4} | reject column-slices 0 2..3 | to nuon
# => {b: 2}
```

- The columns keep their original order.
- For a table, the positions refer to the first row's columns. A later row that lacks one of the selected columns makes `select column-slices` fail with "Cannot find column".
- A position past the last column matches nothing.
- Give each range an end, as with `select slices`.

## `std-rfc/url`

```nu
use std-rfc/url
```

Each command replaces one part of a URL string and returns the new URL. They take the URL apart with [`url parse`](/commands/docs/url_parse.md) and put it back together with [`url join`](/commands/docs/url_join.md):

```nu
let api = "https://api.example.com/v1/items?page=2"
$api | url with-host staging.example.com
# => https://staging.example.com/v1/items?page=2
$api | url with-port 8443
# => https://api.example.com:8443/v1/items?page=2
$api | url with-path v2/items
# => https://api.example.com/v2/items?page=2
$api | url with-fragment top
# => https://api.example.com/v1/items?page=2#top
$api | url with-params {page: 3, sort: name}
# => https://api.example.com/v1/items?page=3&sort=name
```

- `url with-port` takes an int or a string, and an empty string removes the port. Nothing checks that the port is valid.
- In `url with-path`, a leading `/` is optional.
- In `url with-fragment`, a leading `#` is optional, and an empty string removes the fragment.
- `url with-path` and `url with-fragment` put the text you give them into the URL unchanged, without percent-encoding it. Encode a path or fragment that contains spaces or a `#` with [`url encode`](/commands/docs/url_encode.md) first. `$api | url with-fragment ("a b#c" | url encode)` gives `https://api.example.com/v1/items?page=2#a%20b%23c`.
- `url with-params` replaces the whole query string, so parameters you don't pass are dropped. It takes a record, or a table with `key` and `value` columns. A list value, or the same key in several rows, repeats the parameter. `[]` or `{}` removes the query. [`url build-query`](/commands/docs/url_build-query.md) encodes the values.
- When the URL has no path, `url join` adds a `/`, so `"http://localhost" | url with-port 8080` is `http://localhost:8080/`.

`url replace` changes several parts at once, with `--host`, `--port`, `--path`, `--fragment` and `--params`. Each flag takes the same values as the matching `url with-*` command, and the parts you don't name keep their value:

```nu
$api | url replace --host localhost --port 8080 --params {}
# => https://localhost:8080/v1/items
```

The input must be one string with a scheme. A list is a type error, so use [`each`](/commands/docs/each.md) for several URLs. A string without a scheme, such as `example.com/a`, fails in `url parse` with "Unsupported input".

## `std-rfc/xml`

```nu
use std-rfc/xml
```

`xml xaccess` selects elements from XML that [`from xml`](/commands/docs/from_xml.md) or `open` has parsed, with a query modeled on XPath. It returns a list of the matching nodes, each a record with `tag`, `attributes` and `content` fields.

A query is a sequence of steps. Each step works on the nodes that the steps before it selected:

| Step                       | Selects                                                                     | XPath                        |
| -------------------------- | --------------------------------------------------------------------------- | ---------------------------- |
| A tag name, such as `book` | The children with that tag                                                  | `child::book`                |
| `*`                        | All children, text nodes included                                           | `child::node()`              |
| `**`                       | The nodes themselves and all their descendants                              | `descendant-or-self::node()` |
| An int, such as `0`        | The node at that position among everything selected so far, counting from 0 | `(...)[1]`                   |
| A closure                  | The nodes for which the closure returns `true`                              | A predicate                  |

You can write the steps as one cell path (`library.shelf.book`), as separate arguments (`library shelf book`), as lists (`[library shelf book]`), or as any mix of those. A closure has to be an argument of its own:

```nu
let doc = '<library>
  <shelf name="fiction">
    <book lang="en"><title>Dune</title></book>
    <book lang="fr"><title>Vendredi</title></book>
  </shelf>
  <shelf name="tech">
    <box><book lang="en"><title>SICP</title></book></box>
  </shelf>
</library>' | from xml
$doc | xml xaccess library.shelf.book.title.* | get content | to nuon
# => [Dune, Vendredi]
$doc | xml xaccess library.**.title.* | get content | to nuon
# => [Dune, Vendredi, SICP]
$doc | xml xaccess library.shelf {|s| $s.attributes.name == tech } **.title.* | get content | to nuon
# => [SICP]
```

An int step counts across all the selected nodes, not per parent. `library.shelf.book.0` is the first book in the library, while XPath's `library/shelf/book[1]` is the first book on each shelf.

An empty query fails with "Missing query", and a query that matches nothing returns an empty list.

`xml xaccess` is a rewrite of `xaccess` from `std/xml`. That version takes the whole query as one list, as in `xaccess [library shelf book]`, and has no `**`, so it only finds elements at a depth you spell out. With the document above, `use std/xml; $doc | xml xaccess [library shelf book title *]` finds Dune and Vendredi but not SICP, which sits inside a `box`.
