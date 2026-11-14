# Types that are not declarable by the user

The following are valid Nushell data types which cannot be declared by the user. They are used by Nushell internally or by plugins or commands compiled in Nushell like Polars and SQLite database.

Besides `error` values and blocks (see their pages), this group includes [custom values](custom_value.md) such as `semver` and `semver-range` (from `into semver` and `into semver-range`), `matrix` (from `into matrix`), `SQLiteDatabase` (from `open` on a SQLite file or `stor open`), and Polars objects such as `polars_dataframe`. `describe` reports their names. Since Nushell 0.117.0, such a name also works as a type annotation when a command in scope declares that type in its signature. The built-in types above always qualify, and a plugin's types, such as `polars_dataframe`, do once the plugin is added:

```nu
def bump-minor [v: semver]: nothing -> semver { $v | semver bump minor }
bump-minor ("1.2.3" | into semver)
# => 1.3.0
```

The parser checks the argument, so `bump-minor "1.2.3"` fails with `expected semver`. Convert the string with `into semver` first.

A name that no command in scope declares, such as `polars_dataframe` without the Polars plugin, is an `unknown type` error. Leave such a variable or parameter unannotated, or annotate it as `any`.
