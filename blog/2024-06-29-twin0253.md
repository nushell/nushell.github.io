# This week in Nushell #253

## Nushell

- devyn [added context to the I/O error messages in `nu_cmd_plugin::util::modify_plugin_file()`](https://github.com/nushell/nushell/pull/13259) and [mitigated the poor interaction between ndots expansion and non-path strings](https://github.com/nushell/nushell/pull/13218)
- hustcer [updated the Nu version to v0.95 and setup-nu for workflows](https://github.com/nushell/nushell/pull/13265)
- t-mart [addressed surprising symlink resolution for std `path add`](https://github.com/nushell/nushell/pull/13258)
- fdncred [implemented autoloading](https://github.com/nushell/nushell/pull/13217)
- weirdan [added support for multiple attributes to `query web -a`](https://github.com/nushell/nushell/pull/13256), [added `char nul`](https://github.com/nushell/nushell/pull/13241), and [fixed usage parsing for commands defined in CRLF (windows) files](https://github.com/nushell/nushell/pull/13212)
- suimong [fixed a find command output bug with ByteStream input](https://github.com/nushell/nushell/pull/13246)
- ayax79 [upgraded Polars to 0.41](https://github.com/nushell/nushell/pull/13238), [updated lock via cargo check to fix CI](https://github.com/nushell/nushell/pull/13233), [bumped the version to 0.95.1](https://github.com/nushell/nushell/pull/13231), and [converted the perf function to a macro, then used the perf macro within the polars plugin](https://github.com/nushell/nushell/pull/13224)
- kubouch [bumped to 0.95.0](https://github.com/nushell/nushell/pull/13221)
- NotTheDr01ds [updated and added ls examples](https://github.com/nushell/nushell/pull/13222)
- cptpiepmatz [used `IntoValue` and `FromValue` derive macros in `nu_plugin_example` for example usage](https://github.com/nushell/nushell/pull/13220)
- IanManske [defined keywords](https://github.com/nushell/nushell/pull/13213) and [added typed path forms](https://github.com/nushell/nushell/pull/13115)
- ito-hiroki [made the subcommands (`from {csv, tsv, ssv}`) 0-based for consistency](https://github.com/nushell/nushell/pull/13209)
- WindSoilder [enabled reloading changes to a submodule](https://github.com/nushell/nushell/pull/13170) and [restricted strings beginning with a quote to also end with a quote](https://github.com/nushell/nushell/pull/13131)

## Documentation

- t-mart [documented std path add breaking change](https://github.com/nushell/nushell.github.io/pull/1462)
- maxim-uvarov [updated the Dataframes chapter](https://github.com/nushell/nushell.github.io/pull/1461)
- Garbaz [updated installation instructions with `cargo`](https://github.com/nushell/nushell.github.io/pull/1460)
- IanManske [edited `0.95.0` release notes](https://github.com/nushell/nushell.github.io/pull/1459), [edited 0.95.0 release notes](https://github.com/nushell/nushell.github.io/pull/1453), and [added release notes for `0.95.0`](https://github.com/nushell/nushell.github.io/pull/1418)
- hustcer [refreshed command docs for Nu v0.95](https://github.com/nushell/nushell.github.io/pull/1458)
- kubouch [listed PRs in the 0.95.0 release notes](https://github.com/nushell/nushell.github.io/pull/1456)
- devyn [added `Metadata` to the plugin protocol reference and `version()` to the guide](https://github.com/nushell/nushell.github.io/pull/1455) and [created release notes for 0.95.0](https://github.com/nushell/nushell.github.io/pull/1454)

## Nu_Scripts

- IanManske [edited the release notes template](https://github.com/nushell/nu_scripts/pull/887)
- ayax79 [prevented the branch from merging against main](https://github.com/nushell/nu_scripts/pull/886)
- kubouch [fixed an error when listing PRs by milestone](https://github.com/nushell/nu_scripts/pull/885)
- kjelly [fixed the ka command in the kubernetes module](https://github.com/nushell/nu_scripts/pull/884)
