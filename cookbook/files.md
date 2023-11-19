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
```

Output

`0.59.0`

Make the edit to the version number and save it.

_Note: running this command should work but it will reorder the toml file alphabetically by section._

```nu
open Cargo.toml | upsert package.version { |p| $p | get package.version | inc --patch } | save Cargo.toml
```

Output
_none_

View the changes we made to the file.

```nu
open Cargo.toml | get package.version
```

Output

`0.59.1`

---

### Parsing a file in a non-standard format

Suppose you have a file with the following format.

```
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
```

Output

```
━━━┯━━━━━━━━┯━━━━━━━━━━━━━━━━━━━━━━━━┯━━━━━━
 # │ Band   │ Album                  │ Year
───┼────────┼────────────────────────┼──────
 0 │ Fugazi │ 7 Songs                │ 1988
 1 │ Fugazi │ Repeater               │ 1990
 2 │ Fugazi │ Steady Diet of Nothing │ 1991
 3 │ Fugazi │ In On The Kill Taker   │ 1993
 4 │ Fugazi │ The Argument           │ 2001
━━━┷━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━┷━━━━━━
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

Suppose you would like to check the number of lines the string "Value" appears per file in the nushell project, then sort those files by largest line count.

```nu
rg -c Value | lines | split column ":" file line_count | into int line_count | sort-by line_count | reverse
```

Output

```
───┬──────────────────────────────────────┬────────────
 # │ file                                 │ line_count
───┼──────────────────────────────────────┼────────────
 0 │ crates/nu-source/src/meta.rs         │         27
 1 │ crates/nu-protocol/src/value/dict.rs │         10
 2 │ src/commands/config.rs               │         10
 3 │ crates/nu_plugin_sys/src/sys.rs      │         10
 4 │ src/commands/from_bson.rs            │          9
 5 │ src/utils/data_processing.rs         │          9
 6 │ src/deserializer.rs                  │          8
 7 │ src/commands/histogram.rs            │          7
 8 │ src/commands/split_column.rs         │          6
 9 │ src/data/dict.rs                     │          6
───┴──────────────────────────────────────┴────────────
... example output limited due to large output
```
