# CustomValue

<!-- prettier-ignore -->
|     |     |
| --- | --- |
| **_Description:_**    | An opaque data type that is only used internally in Nushell by built-in commands or plugins.
| **_Annotation:_**     | The type name reported by `describe`, such as `semver`, when a command in scope declares it (see [Types which are not declarable](./01_not_declarable.md))
| **_Literal syntax:_** | None
| **_Casts:_**          | None

## Additional Language Notes

1. Custom values are those that might be created by Nushell internal commands or plugins. For instance, a plugin might generate a custom value that encodes data in a binary format or some other data type like structured data used by the Polars plugin or SQLite.

   Example - SQLite:

   ```nu
   [[a b]; [c d] [e f]] | into sqlite test.db
   open test.db | describe
   # => SQLiteDatabase
   ```

   The output from describe is `SQLiteDatabase`, which is a CustomValue data type.

   Example - Polars Plugin (formerly DataFrame)

   Note: The `nu_plugin_polars` plugin is required for the following example to work - See [the Polars release announcement](https://www.nushell.sh/blog/2024-04-30-nushell_0_93_0.html#installation) or [The Book](/book/plugins.md#installing-plugins) for instructions on installing and registering.

   ```nu
   ls | polars into-df | describe
   # => polars_dataframe
   ```

   Example - SemVer (built into Nushell):

   ```nu
   let v = "1.2.3" | into semver
   $v | describe
   # => semver
   $v.minor
   # => 2
   ```

   Other built-in custom values include `semver-range` (from `into semver-range`) and `matrix` (from `into matrix`).

1. Values used by external commands (e.g., `curl`) are **not** of the `CustomValue` type.

1. You might encounter a custom value in your interaction with parts of Nushell. Depending on the specific example, you should let the command handle it as described in the help documentation for that command or plugin.

1. There is not necessarily a string representation of any custom value, and `to nuon` rejects custom values. The [`into value`](/commands/docs/into_value.md) command converts a custom value into a regular Nushell value when the custom value supports it:

   ```nu
   "1.2.3" | into semver | into value | describe
   # => string
   [[1 2] [3 4]] | into matrix | into value | describe
   # => list<list<float>>
   ```

   Any other input passes through `into value` unchanged, so it is safe on input that may or may not be a custom value. It converts only a custom value that is the whole input. A list, record or stream that holds custom values comes back as it was, and passing it through [`collect`](/commands/docs/collect.md) first doesn't change that, despite the hint in `help into value`. Convert each item instead, or use `update` for a record field:

   ```nu
   ["1.2.3" "2.0.0"] | into semver | into value | describe
   # => list<semver> (stream)
   ["1.2.3" "2.0.0"] | into semver | each { into value } | describe
   # => list<string> (stream)
   ```

1. A custom value's type name, as `describe` reports it, can be used as a type annotation when a command in scope declares that type. The built-in `semver`, `semver-range`, `matrix` and `SQLiteDatabase` always qualify, and a plugin's types do once the plugin is loaded (see [Types which are not declarable](./01_not_declarable.md)). The name also works inside other types:

   ```nu
   def newest [versions: list<semver>] { $versions | sort | last }
   newest (["1.2.0" "1.10.0"] | into semver)
   # => 1.10.0
   ```

## Plugin custom values

A plugin's custom value, such as a Polars dataframe, is a handle to data that the plugin manages. Whenever Nushell needs something from the value, it asks the plugin: to display it, to follow a cell path into it, to apply an operator, to compare it (as `sort` does), or to `save` it. If the plugin isn't running at that moment, Nushell starts it again first, the same way it does for one of the plugin's commands.

A restart brings back the plugin but not what it kept in memory. The Polars plugin keeps each dataframe in a cache inside its own process. While that cache holds anything, Polars keeps the [plugin garbage collector](/book/plugins.md#plugin-garbage-collector) from stopping it, but `plugin stop polars` still ends the process. After that, an existing dataframe value can't be resolved, and using it fails with an error that the dataframe was not found in the cache. Create the dataframe again. Other plugins that keep their values in memory have the same limit.

## SemVer

[`into semver`](/commands/docs/into_semver.md) accepts a string or a record. A string must be a full `major.minor.patch` version, which can have a pre-release after `-` and build metadata after `+`, as in `1.2.3-rc.1+build.5`. `--loose` (`-l`) also accepts a prefix of `v` or `V`, alone or followed by `.`, `:`, `-` or `_`, as in `v1.2.3` or `v.1.2.3`. Even with `--loose`, `1.2` is not a version.

A record needs the int fields `major`, `minor` and `patch`, and can have the string fields `pre`, `build` and `prefix`:

```nu
{major: 1, minor: 2, patch: 3, pre: "rc.1", build: "abc", prefix: "v"} | into semver
# => v1.2.3-rc.1+abc
```

A list of strings gives a list of versions. For a table or record, name the columns to convert as cell paths after the command, as in `$deps | into semver version`.

A cell path can read six fields from a `semver`. `major`, `minor` and `patch` are ints, and `pre`, `build` and `prefix` are strings, empty when the version has none:

```nu
let v = "v1.2.3-rc.1+build.5" | into semver --loose
[$v.major $v.minor $v.patch $v.pre $v.build $v.prefix] | to nuon
# => [1, 2, 3, "rc.1", "build.5", v]
```

Versions compare by semantic version precedence, so `1.10.0` comes after `1.2.0` and a pre-release such as `1.0.0-rc.1` comes before `1.0.0`. This holds for `<`, `>` and the other comparison operators, and for `sort`. The prefix is only for display, so `v1.0.0` and `1.0.0` are equal.

When the `semver` is on the left, the right side can also be a version string, read as if by `into semver --loose`:

```nu
let v = "1.2.3" | into semver
$v > "1.0.0"
# => true
```

With the string on the left, as in `"1.0.0" < $v`, the parser rejects the comparison (`nu::parser::operator_incompatible_types`). A string that isn't a version is an error when the comparison runs, with the help "expected another semver or a valid version string".

Nushell never turns a string into a `semver` on its own. A `semver` variable or parameter rejects a string literal when the code is parsed:

```nu
let v: semver = "1.2.3"
# => Error: nu::parser::type_mismatch
# =>
# =>   × Type mismatch.
# =>    ╭─[repl_entry #1:1:17]
# =>  1 │ let v: semver = "1.2.3"
# =>    ·                 ───┬───
# =>    ·                    ╰── expected semver, found string
# =>    ╰────
```

## SemVer ranges

[`into semver-range`](/commands/docs/into_semver-range.md) turns a version requirement into a `semver-range` value. Its use is the `in` operator, which tests whether a version meets the requirement:

```nu
let r = "^1.2" | into semver-range
["1.2.0" "1.9.9" "2.0.0" "1.1.0"] | each {|s| {version: $s, ok: (($s | into semver) in $r)} }
# => ╭───┬─────────┬───────╮
# => │ # │ version │  ok   │
# => ├───┼─────────┼───────┤
# => │ 0 │ 1.2.0   │ true  │
# => │ 1 │ 1.9.9   │ true  │
# => │ 2 │ 2.0.0   │ false │
# => │ 3 │ 1.1.0   │ false │
# => ╰───┴─────────┴───────╯
```

Requirements use the syntax of Cargo, the Rust package manager, as implemented by the [semver crate](https://docs.rs/semver/latest/semver/struct.VersionReq.html):

- `^1.2.3` allows any later version that keeps the leftmost non-zero number, so `^1.2.3` stops before `2.0.0` and `^0.2.3` stops before `0.3.0`. A bare version means the same thing: `"1.2.3" | into semver-range` displays as `^1.2.3`.
- `~1.2` allows only patch updates, from `1.2.0` up to but not including `1.3.0`.
- `=`, `>`, `>=`, `<` and `<=` compare with a single version.
- `*` matches any version, and `1.2.*` any `1.2` version.
- Requirements separated by commas must all hold, as in `>=1.0.0, <2.0.0`.

A pre-release version only matches a requirement that names a pre-release of the same `major.minor.patch`, so `1.5.0-beta` is not in `^1.0`, while `1.0.0-beta.2` is in `^1.0.0-beta`. `--loose` lets the versions inside the requirement have the same prefixes that `into semver --loose` accepts, as in `>=v1.0.0`.

The left side of `in` must be a `semver`. A string there is rejected when the code is parsed, so write `("1.5.0" | into semver) in $r`.

## Matrices

[`into matrix`](/commands/docs/into_matrix.md) turns a list of lists of numbers, or a table of numbers, into a `matrix`: an array of floats that the `matrix` commands work on. They cover arithmetic (`matrix add`, `matrix subtract`, `matrix scale`, and `matrix multiply` for the matrix product), reductions (`matrix sum`, `matrix mean`, `matrix max`, `matrix reduce`), shape changes (`matrix transpose`, `matrix reshape`), access to rows and columns (`matrix get-row`, `matrix set-row`, `matrix get-col`, `matrix set-col`), `matrix map`, and the constructors `matrix identity` and `matrix zeros`. `help matrix` lists them.

```nu
let m = [[1 2] [3 4]] | into matrix
$m | matrix multiply $m | matrix into-nu | to nuon
# => [[7.0, 10.0], [15.0, 22.0]]
```

A table, or any list of records, is read one record at a time, with the values in each record's field order. Every row must have the same length:

```nu
[[1 2] [3]] | into matrix
# => Error: nu::shell::error
# =>
# =>   × Inconsistent row lengths
# =>    ╭─[repl_entry #1:1:15]
# =>  1 │ [[1 2] [3]] | into matrix
# =>    ·               ─────┬─────
# =>    ·                    ╰── row 1 has 1 elements, expected 2
# =>    ╰────
```

A value that isn't a number, as in `[[1 "a"]]`, is an `only_supports_this_input_type` error.

[`matrix into-nu`](/commands/docs/matrix_into-nu.md) converts a matrix back to a list of lists of floats, as `into value` does. `--as-records` (`-r`) gives a table instead, with the columns `col0`, `col1` and so on:

```nu
[[1 2] [3 4]] | into matrix | matrix into-nu --as-records | to nuon
# => [["col0", "col1"]; [1.0, 2.0], [3.0, 4.0]]
```
