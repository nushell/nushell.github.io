# This week in Nushell #262

## Nushell

- fdncred [removed `cfg_atter tarpaulin`](https://github.com/nushell/nushell/pull/13739) and [updated virtual terminal processing](https://github.com/nushell/nushell/pull/13710).
- ayax79 [added expression support for `polars replace` and `polars replace-all`](https://github.com/nushell/nushell/pull/13726), [expression support for `polars uppercase` and `polars lowercase`](https://github.com/nushell/nushell/pull/13724), [new `polars` commands for converting string columns to integer and decimal columns](https://github.com/nushell/nushell/pull/13711), and [changed the category for `panic`, adding search terms and examples](https://github.com/nushell/nushell/pull/13707).
- cptpiepmatz [switched to `heck` from `convert_case` for `nu-derive-value`](https://github.com/nushell/nushell/pull/13708) and [added record key renaming for the `IntoValue` and `FromValue` derive macros](https://github.com/nushell/nushell/pull/13699).
- Bahex [added split cell-path](https://github.com/nushell/nushell/pull/13705).
- ysthakur [used the right options in custom completions](https://github.com/nushell/nushell/pull/13698).
- sholderbach [simplified the bug reporting form](https://github.com/nushell/nushell/pull/13695), [removed `system-clipboard` from the default build](https://github.com/nushell/nushell/pull/13694), [removed `str deunicode`](https://github.com/nushell/nushell/pull/13693), [set up global `cargo` lint configuration](https://github.com/nushell/nushell/pull/13691), and [removed an unnecessary sort in the `explore` search function](https://github.com/nushell/nushell/pull/13690).
- weirdan [enabled respect for user-defined `$env.NU_LOG_FORMAT` and `$env.NU_LOG_DATE_FORMAT`](https://github.com/nushell/nushell/pull/13692).
- cyradotpink [fixed parsing of record values containing colons](https://github.com/nushell/nushell/pull/13413).

## Documentation

- yo-goto [fixed the nothing type literal (`none` → `null`)](https://github.com/nushell/nushell.github.io/pull/1539), [fixed link parentheses on the Float type page](https://github.com/nushell/nushell.github.io/pull/1538), and [fixed content in the binary data type table](https://github.com/nushell/nushell.github.io/pull/1536).
- maniaphobic [updated string.md](https://github.com/nushell/nushell.github.io/pull/1537).
- ysthakur [added info on setting XDG_CONFIG_HOME](https://github.com/nushell/nushell.github.io/pull/1533).
- Hofer-Julian [fixed capitalization for headings levels 2 and 3](https://github.com/nushell/nushell.github.io/pull/1531), [corrected a copy-paste mistake](https://github.com/nushell/nushell.github.io/pull/1530), [ensured consistent headline capitalization](https://github.com/nushell/nushell.github.io/pull/1529), and [fixed a link to handling missing data](https://github.com/nushell/nushell.github.io/pull/1523).
- NotTheDr01ds [promoted Installation to its own top-level Book chapter](https://github.com/nushell/nushell.github.io/pull/1528).
- weirdan [replaced `it` with `elt`, `row`, `line`, etc. (batch 2)](https://github.com/nushell/nushell.github.io/pull/1525) and [continued replacing `it` with `elt`, `row`, `line`, etc.](https://github.com/nushell/nushell.github.io/pull/1524).

## Nu_Scripts

- rgwood [fixed the TWiN script](https://github.com/nushell/nu_scripts/pull/944).
- chtenb [used `--no-color` for git completions](https://github.com/nushell/nu_scripts/pull/943).
- LoicRiegel [added custom completions for pytest](https://github.com/nushell/nu_scripts/pull/941) and [added custom completions for pre-commit](https://github.com/nushell/nu_scripts/pull/940).
- Telpenarmo [added completions for dotnet](https://github.com/nushell/nu_scripts/pull/938).
