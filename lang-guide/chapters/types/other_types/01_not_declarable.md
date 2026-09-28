# Types that are not declarable by the user

The following are valid Nushell data types which cannot be declared by the user. They are used by Nushell internally or by plugins or commands compiled in Nushell like Polars and SQLite database.

Besides `error` values and blocks (see their pages), this group includes [custom values](custom_value.md) such as `semver` and `semver-range` (from `into semver` and `into semver-range`), `matrix` (from `into matrix`), `SQLiteDatabase` (from `open` on a SQLite file or `stor open`), and Polars objects such as `polars_dataframe`. `describe` reports their names, but a name like `semver` cannot be used as a type annotation:

```nu
let v: semver = ("1.2.3" | into semver)
# => Error: nu::parser::unknown_type
# =>
# =>   × Unknown type.
# =>    ╭─[repl_entry #1:1:8]
# =>  1 │ let v: semver = ("1.2.3" | into semver)
# =>    ·        ───┬──
# =>    ·           ╰── unknown type
# =>    ╰────
```

Leave such a variable or parameter unannotated, or annotate it as `any`.
