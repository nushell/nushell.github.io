# This week in Nushell #257

## Nushell

- devyn [fixed `keybindings list` being empty by default](https://github.com/nushell/nushell/pull/13456), [fixed `$in` in range expressions](https://github.com/nushell/nushell/pull/13447), bumped Nushell's version ([1](https://github.com/nushell/nushell/pull/13439), [2](https://github.com/nushell/nushell/pull/13433)), and [updated parsing for unknown args in known externals to be like normal external calls](https://github.com/nushell/nushell/pull/13414).
- fdncred [updated release-pkg.nu with a working URL for the less license](https://github.com/nushell/nushell/pull/13451), and [updated query web example due to Wikipedia changes](https://github.com/nushell/nushell/pull/13421).
- ayax79 [updated the version for nu-ansi-term and reedline](https://github.com/nushell/nushell/pull/13432).
- NotTheDr01ds [updated the query-web example to use new chunks](https://github.com/nushell/nushell/pull/13429).
- f3wenbo [fixed an output format issue in `char --list`](https://github.com/nushell/nushell/pull/13417).
- IanManske [fixed setting metadata on byte streams](https://github.com/nushell/nushell/pull/13416).

## Documentation

- devyn [added an example for the new CallDecl engine call](https://github.com/nushell/nushell.github.io/pull/1484), [updated the `CustomValue` usage example](https://github.com/nushell/nushell.github.io/pull/1483), [abbreviated the output in an example in dataframes to avoid a typo false positive](https://github.com/nushell/nushell.github.io/pull/1475), [worked on the release notes for 0.96.0](https://github.com/nushell/nushell.github.io/pull/1474), and [added `FindDecl` and `CallDecl` engine calls to the plugin protocol reference](https://github.com/nushell/nushell.github.io/pull/1473).
- sinisa-szabo [updated 00_flow_control_overview.md](https://github.com/nushell/nushell.github.io/pull/1482).
- IanManske [removed unnecessary ignore in typos config](https://github.com/nushell/nushell.github.io/pull/1481), and [replaced `group` with `chunks` in the docs](https://github.com/nushell/nushell.github.io/pull/1470).
- hustcer [refreshed command docs for Nu v0.96.0](https://github.com/nushell/nushell.github.io/pull/1480).
- NotTheDr01ds [updated and fixed Cookbook Tables](https://github.com/nushell/nushell.github.io/pull/1478), and [provided updates for 0.96 $in improvements](https://github.com/nushell/nushell.github.io/pull/1476).
- ayax79 [created release notes for `0.96.0`](https://github.com/nushell/nushell.github.io/pull/1457).

## Nu_Scripts

- NotTheDr01ds [updated themes preview to use `chunks` instead of the deprecated `group`](https://github.com/nushell/nu_scripts/pull/918), [fixed cell-path in themes](https://github.com/nushell/nu_scripts/pull/911), and [updated theme preview scripts and screenshots](https://github.com/nushell/nu_scripts/pull/909).
- christoph-blessing [fixed incorrect docker commands](https://github.com/nushell/nu_scripts/pull/917).
- lizclipse [fixed sys usage](https://github.com/nushell/nu_scripts/pull/916).
- ayax79 [fixed the ordering and added nu-drive-value for nu_release.nu](https://github.com/nushell/nu_scripts/pull/915).
- devyn [added more notes about transferring ownership during release](https://github.com/nushell/nu_scripts/pull/914), and [moved notes for plugin developers to the top level in release notes](https://github.com/nushell/nu_scripts/pull/913).
- sadguitarius [added silent option to nu_msvs](https://github.com/nushell/nu_scripts/pull/910).
- AucaCoyan [fixed `scope commands` call and columns](https://github.com/nushell/nu_scripts/pull/908), and [provided parser fixes](https://github.com/nushell/nu_scripts/pull/801).
- OJarrisonn [fixed catppuccin themes declared as `const` inside a record](https://github.com/nushell/nu_scripts/pull/907), and [updated nu-complete for git ref and git files-and-ref to use nu-complete git switch](https://github.com/nushell/nu_scripts/pull/906).
- amtoine [worked on the `nu-themes` make script](https://github.com/nushell/nu_scripts/pull/905), [bumped the `nu-hooks` package to `0.2.0`](https://github.com/nushell/nu_scripts/pull/901), [proposed an RFC to add a command to help parse arguments in scripts](https://github.com/nushell/nu_scripts/pull/875), and [added `ways-to-add-up-to` to the "math" module](https://github.com/nushell/nu_scripts/pull/874).
- Okdro [added git grep completions](https://github.com/nushell/nu_scripts/pull/898).
