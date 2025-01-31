# This Week in Nushell #252

## Nushell

- NotTheDr01ds [fixed the `generate` command's signature](https://github.com/nushell/nushell/pull/13200), [added a `do` example](https://github.com/nushell/nushell/pull/13190), [suppressed column index for default `cal` output](https://github.com/nushell/nushell/pull/13188), and [improved table rendering in `help`](https://github.com/nushell/nushell/pull/13182).
- devyn [added shape_glob_interpolation to default_config.nu](https://github.com/nushell/nushell/pull/13198), [fixed nu-system build on arm64 FreeBSD](https://github.com/nushell/nushell/pull/13196), [fixed compilation for `nu_protocol::value::from_value` on 32-bit targets](https://github.com/nushell/nushell/pull/13169), [moved most peculiar argument handling for external calls into the parser](https://github.com/nushell/nushell/pull/13089), [changed the error style during tests to `plain`](https://github.com/nushell/nushell/pull/13061), and [allowed plugins to report their own version and store it in the registry](https://github.com/nushell/nushell/pull/12883).
- cptpiepmatz [added derive macros for `FromValue` and `IntoValue` to ease the use of `Value`s in Rust code](https://github.com/nushell/nushell/pull/13031).
- zhiburt [added vertical lines to nu-explore and fixed index/transpose issue](https://github.com/nushell/nushell/pull/13147).
- ayax79 made lots of dataframe improvements: [improved performance for Polars inference](https://github.com/nushell/nushell/pull/13193), [added the ability to turn on performance debugging through an env var for the Polars plugin](https://github.com/nushell/nushell/pull/13191), and [enabled opening JSON lines dataframes with Polars lazy JSON lines reader](https://github.com/nushell/nushell/pull/13167).
- fdncred [added a system-level folder for future autoloading](https://github.com/nushell/nushell/pull/13180) and [updated the `try` command's help](https://github.com/nushell/nushell/pull/13173).
- weirdan [updated the `sys users` signature](https://github.com/nushell/nushell/pull/13172).
- edwinjhlee [updated the README.md](https://github.com/nushell/nushell/pull/13157).
- WindSoilder [improved commands that support range input](https://github.com/nushell/nushell/pull/13113).

## Documentation

- weirdan [removed mentions of the `env` command](https://github.com/nushell/nushell.github.io/pull/1452).
- NotTheDr01ds [cleaned up the Imperative Language Map](https://github.com/nushell/nushell.github.io/pull/1451) and made an [extensive Nu Map cleanup](https://github.com/nushell/nushell.github.io/pull/1449).
- dependabot[bot] [bumped braces from 3.0.2 to 3.0.3](https://github.com/nushell/nushell.github.io/pull/1450).
- hustcer [upgraded the shiki syntax highlight plugin and lefthook, among others](https://github.com/nushell/nushell.github.io/pull/1448).
- maxim-uvarov [moved `dataframes_md-update.nu` file into the `tools` folder](https://github.com/nushell/nushell.github.io/pull/1447).

## Nu_Scripts

- fdncred [updated vswhere location for nu_msvs](https://github.com/nushell/nu_scripts/pull/882) and [added find_msvs custom command to the nu_msvs module](https://github.com/nushell/nu_scripts/pull/881).
- IanManske [removed usage of deprecated `str contains --not`](https://github.com/nushell/nu_scripts/pull/880).
