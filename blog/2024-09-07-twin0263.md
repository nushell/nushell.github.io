# This week in Nushell #263

## Nushell

- ayax79 implemented tons of Polars-related improvements ([added expression support for `polars cumulative`](https://github.com/nushell/nushell/pull/13799), [reorganized Polars commands](https://github.com/nushell/nushell/pull/13798), [added expression support for `polars str-slice`](https://github.com/nushell/nushell/pull/13783), [added expression support for `polars str-lengths`](https://github.com/nushell/nushell/pull/13782), [renamed `polars concatenate` and added expression support](https://github.com/nushell/nushell/pull/13781), [added expression support for `polars contains`](https://github.com/nushell/nushell/pull/13769), [added expression support for `polars strftime`](https://github.com/nushell/nushell/pull/13767)) and a few HTTP improvements too ([used String::contains instead of exact match for http request content types](https://github.com/nushell/nushell/pull/13791) and [fixed string values passing their content-type correctly on http requests with a body](https://github.com/nushell/nushell/pull/13731))
- IanManske [added an error on non-zero exit statuses](https://github.com/nushell/nushell/pull/13515), [used `IntoValue` in config code](https://github.com/nushell/nushell/pull/13751), and [implemented `IntoValue` for more types](https://github.com/nushell/nushell/pull/13744)
- devyn [removed bincode and used MessagePack instead for plugin custom values](https://github.com/nushell/nushell/pull/13745), and [made `tee` work more nicely with non-collections](https://github.com/nushell/nushell/pull/13652)
- fdncred [updated the latest reedline](https://github.com/nushell/nushell/pull/13797), [fixed an issue with find not working with symbols that should be escaped](https://github.com/nushell/nushell/pull/13792), [removed config use_grid_icons and moved it to a parameter of the grid command](https://github.com/nushell/nushell/pull/13788), [added version and path to plugin executable help](https://github.com/nushell/nushell/pull/13764), and [fixed --ide-ast when there are errors](https://github.com/nushell/nushell/pull/13737)
- WindSoilder [made a user-friendly message when `use_grid_icons` is used in config](https://github.com/nushell/nushell/pull/13795), and [prevented panic on `detect columns` with `--guess` flag](https://github.com/nushell/nushell/pull/13752)
- sholderbach [fixed `serde` feature selection in `nu-protocol`](https://github.com/nushell/nushell/pull/13793), and [removed unneeded `serde` feature on `byte-unit` dep](https://github.com/nushell/nushell/pull/13749)
- hustcer [added aarch64-unknown-linux-musl and armv7-unknown-linux-musleabihf release targets](https://github.com/nushell/nushell/pull/13775)
- cptpiepmatz [added `#[nu_value(rename = "...")]` as helper attribute on members for derive macros](https://github.com/nushell/nushell/pull/13761)
- JTopanotti [refactored send_request in client.rs](https://github.com/nushell/nushell/pull/13701)

## Documentation

- NotTheDr01ds [added a blog announcement for Discord Showcase](https://github.com/nushell/nushell.github.io/pull/1543), [updated the Plugin Chapter](https://github.com/nushell/nushell.github.io/pull/1542), and [added a dropdown for docs on the main page](https://github.com/nushell/nushell.github.io/pull/1508)
- lfrancke [fixed broken links](https://github.com/nushell/nushell.github.io/pull/1540)

## Nu_Scripts

- Schweber [added handling of empty input to nix activation-script](https://github.com/nushell/nu_scripts/pull/945)

## reedline

- HKalbasi [fixed panic in long item completion in ide menu](https://github.com/nushell/reedline/pull/823)
