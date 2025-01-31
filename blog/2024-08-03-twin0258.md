# This week in Nushell #258

## Nushell

- WindSoilder [made `save` print to stderr when needed](https://github.com/nushell/nushell/pull/13422)
- sholderbach [created a security policy](https://github.com/nushell/nushell/pull/13486), [fixed up an example](https://github.com/nushell/nushell/pull/13529) and did tons of refactoring: [replaced the manual `Record::get` implementation](https://github.com/nushell/nushell/pull/13525), [lifted `SharedCow::to_mut` out of if let branches](https://github.com/nushell/nushell/pull/13524), [simplified column look-up in `default`](https://github.com/nushell/nushell/pull/13522), [bumped rust toolchain](https://github.com/nushell/nushell/pull/13499), [made contentious clippy fixes](https://github.com/nushell/nushell/pull/13498), [fixed clippy issues for toolchain bump](https://github.com/nushell/nushell/pull/13497), and [fixed clippy issues from stable and nightly](https://github.com/nushell/nushell/pull/13455)
- Embers-of-the-Fire [fixed an overflowing table in command documentation](https://github.com/nushell/nushell/pull/13526), [fixed an internal panic for `query web`](https://github.com/nushell/nushell/pull/13507), and [added a new `--upgrade` flag for `mv` command](https://github.com/nushell/nushell/pull/13505)
- NotTheDr01ds [clarified `default` command help](https://github.com/nushell/nushell/pull/13519), [added doc and examples for multi-dot directory traversal](https://github.com/nushell/nushell/pull/13513), [clarified `random chars` documentation](https://github.com/nushell/nushell/pull/13511), and [clarified `random int` help](https://github.com/nushell/nushell/pull/13503)
- cablehead [made ctrlc available to plugins](https://github.com/nushell/nushell/pull/13181)
- IanManske kept working on migrating to Nu-specific path types: [part 3: `$nu` paths](https://github.com/nushell/nushell/pull/13368) and [part 4: various tests](https://github.com/nushell/nushell/pull/13373)
- ayax79 [set content type metadata on all core `to *` commands](https://github.com/nushell/nushell/pull/13506), and [made pipeline metadata available to plugins](https://github.com/nushell/nushell/pull/13495)
- weirdan [made a change to consider numbers to be part of a word in `split words`](https://github.com/nushell/nushell/pull/13502), and [added links to security contacts](https://github.com/nushell/nushell/pull/13488)
- fdncred [made `math sqrt` const](https://github.com/nushell/nushell/pull/13487)
- userwiths [made `log` respect `use_ansi_coloring` setting](https://github.com/nushell/nushell/pull/13442)
- devyn [bumped version to `0.96.2`](https://github.com/nushell/nushell/pull/13485), [fixed bad method links in docstrings](https://github.com/nushell/nushell/pull/13471), [cleaned up arguments added to stack after `CallDecl` engine call](https://github.com/nushell/nushell/pull/13469), [fixed incorrect capturing of subexpressions in IR](https://github.com/nushell/nushell/pull/13467), and [made assignment and `const` consistent with `let`/`mut`](https://github.com/nushell/nushell/pull/13385)
- maxim-uvarov [stopped forcing stripping of ANSI codes from strings in `stor`](https://github.com/nushell/nushell/pull/13464)
- Bahex [supplied <acc> to the closure as pipeline input in reduce](https://github.com/nushell/nushell/pull/13461)
- suimong [added "--as-columns" flag to `polars into-df`](https://github.com/nushell/nushell/pull/13449)
- qfel [used the Default implementation of Suggestion](https://github.com/nushell/nushell/pull/13409), and [factored out style-setting code](https://github.com/nushell/nushell/pull/13406)
- lyuha [kept forward slash when autocompleting on Windows](https://github.com/nushell/nushell/pull/13321)

## Documentation

- NotTheDr01ds [made a quick fix to String docs](https://github.com/nushell/nushell.github.io/pull/1493), [improved 'Moving around' chapter](https://github.com/nushell/nushell.github.io/pull/1490), [substantially improved String doc](https://github.com/nushell/nushell.github.io/pull/1489), and [added cd multiple levels](https://github.com/nushell/nushell.github.io/pull/1486)
- devyn [added release notes for `0.96.1`](https://github.com/nushell/nushell.github.io/pull/1485)

## Nu_Scripts

- NotTheDr01ds [added additional theme Features](https://github.com/nushell/nu_scripts/pull/925)
- devyn [added recursive fibonacci benchmark](https://github.com/nushell/nu_scripts/pull/924)
