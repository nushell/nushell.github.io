# This week in Nushell #243

## Nushell

- devyn made lots of improvements, mostly around plugin support: [switched the plugin msgpack protocol to named format](https://github.com/nushell/nushell/pull/12580), [fixed the error output in the Python plugin to match LabeledError](https://github.com/nushell/nushell/pull/12575), [added an example Nushell plugin written in Nushell itself](https://github.com/nushell/nushell/pull/12574), [improved safety of `get_unchecked_str` in `nu_system::macos`](https://github.com/nushell/nushell/pull/12550), [replaced subtraction of Instants and Durations with saturating subtractions](https://github.com/nushell/nushell/pull/12549), [removed unnecessary fields from Python plugin signature](https://github.com/nushell/nushell/pull/12533), [added a panic unwind handler during plugin calls](https://github.com/nushell/nushell/pull/12526), [improved error messages for plugin protocol by removing `#[serde(untagged)]`](https://github.com/nushell/nushell/pull/12510), [introduced local socket mode and foreground terminal control for plugins](https://github.com/nushell/nushell/pull/12448), and [implemented copy-on-write for record values](https://github.com/nushell/nushell/pull/12305)
- ayax79 did lots of work on dataframe support: [removed the polars dtypes command](https://github.com/nushell/nushell/pull/12577), and [only marked collected dataframes as from_lazy=false when collect is called from the collect command](https://github.com/nushell/nushell/pull/12571), and [upgraded nu-cmd-dataframe to polars 0.39](https://github.com/nushell/nushell/pull/12554), and [upgraded nu_plugin_polars to polars 0.39.1](https://github.com/nushell/nushell/pull/12551), and [fixed NuLazyFrame/NuDataFrame conversion issues](https://github.com/nushell/nushell/pull/12538), and [cleaned up to_pipe_line_data and cache_and_to_value, making them part of CustomValueSupport](https://github.com/nushell/nushell/pull/12528), and [ensured that lazy frames converted via to-lazy are not converted back to eager frames later in the pipeline](https://github.com/nushell/nushell/pull/12525)
- poliorcetics [added more details to `version`](https://github.com/nushell/nushell/pull/12593)
- amtoine [added "to nuon" enumeration of possible styles](https://github.com/nushell/nushell/pull/12591), and [created a new `nuon` crate from `from nuon` and `to nuon`](https://github.com/nushell/nushell/pull/12553)
- fdncred [improved `nu --lsp` command tooltips](https://github.com/nushell/nushell/pull/12589), and [added the ability to set metadata](https://github.com/nushell/nushell/pull/12564)
- WindSoilder [set the type of default NU_LIB_DIRS and NU_PLUGIN_DIRS to `list<string>`](https://github.com/nushell/nushell/pull/12573), and [disallowed skip on external stream](https://github.com/nushell/nushell/pull/12559), and [removed useless path.rs](https://github.com/nushell/nushell/pull/12534), and [unified `working_set.error` usage](https://github.com/nushell/nushell/pull/12531)
- TheLostLambda [fixed shell_integration to set window title on startup](https://github.com/nushell/nushell/pull/12569)
- IanManske [boxed `ImportPattern` in `Expr`](https://github.com/nushell/nushell/pull/12568), and [added `ListItem` type for `Expr::List`](https://github.com/nushell/nushell/pull/12529), and [made `group-by` return errors in closure](https://github.com/nushell/nushell/pull/12508), and [added `Record::into_columns`](https://github.com/nushell/nushell/pull/12324)
- sholderbach [updated crate feature flags](https://github.com/nushell/nushell/pull/12566), and [implemented `FusedIterator` for record iterators](https://github.com/nushell/nushell/pull/12542), [did minor housekeeping in the parser](https://github.com/nushell/nushell/pull/12540), and [improved `with-env` robustness](https://github.com/nushell/nushell/pull/12523), and [disallowed setting the `PWD` via `load-env` input](https://github.com/nushell/nushell/pull/12522)
- merelymyself [used abbreviated string instead of debug string for `DatetimeParseError`s](https://github.com/nushell/nushell/pull/12517)
- schrieveslaach [improved config behaviour in LSP Mode](https://github.com/nushell/nushell/pull/12454)
- YizhePKU [fixed circular source causing Nushell to crash](https://github.com/nushell/nushell/pull/12262)

## Documentation

- SCKelemen [fixed(lang-guide): IEE-754 -> IEEE-754](https://github.com/nushell/nushell.github.io/pull/1356)
- maxim-uvarov [added the `not` operator in the list of the order of operations](https://github.com/nushell/nushell.github.io/pull/1355)
- devyn [documented all variants of `Value` and fixed error types](https://github.com/nushell/nushell.github.io/pull/1353)
- hustcer [upgraded all actions for GitHub workflows](https://github.com/nushell/nushell.github.io/pull/1351)

## Nu_Scripts

- devyn [added nu_plugin_nu_example to bump-version.nu](https://github.com/nushell/nu_scripts/pull/822)
- nils-degroot [added `zellij action new-tab` completions](https://github.com/nushell/nu_scripts/pull/821)
- kubouch [reverted "fix: prefix conda commands with `conda`"](https://github.com/nushell/nu_scripts/pull/820)
- zhangymPerson [added mvn completion](https://github.com/nushell/nu_scripts/pull/819)
