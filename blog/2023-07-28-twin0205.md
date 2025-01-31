# This week in Nushell #205

## Nushell

- jntrnr [fixed transpose's input/output types](https://github.com/nushell/nushell/pull/9842), and [fixed prepend's type](https://github.com/nushell/nushell/pull/9828), and [fixed the implied collect type to 'any'](https://github.com/nushell/nushell/pull/9827), and [set the rest variable to the correct type](https://github.com/nushell/nushell/pull/9816), and [bumped the version to 0.83](https://github.com/nushell/nushell/pull/9802)
- sholderbach [narrowed the signature of `math ceil`/`floor`](https://github.com/nushell/nushell/pull/9836), and [fixed `math min`/`max` signatures](https://github.com/nushell/nushell/pull/9830), and [fixed signature of `split row`](https://github.com/nushell/nushell/pull/9829), and [bumped `trash` in lockfile due to yank](https://github.com/nushell/nushell/pull/9824), and [pinned `reedline` to `0.22.0` release](https://github.com/nushell/nushell/pull/9794), and [fixed signatures for cellpath access of records](https://github.com/nushell/nushell/pull/9793), and [updated `nu-ansi-term`, `lscolors`, and `reedline`](https://github.com/nushell/nushell/pull/9787), and added [Abort type determination for List early](https://github.com/nushell/nushell/pull/9779), and [adjusted signatures for cellpath access of tables](https://github.com/nushell/nushell/pull/9778), and [removed `Signature.vectorizes_over_list` entirely](https://github.com/nushell/nushell/pull/9777), and [used explicit in/out list types for vectorized commands](https://github.com/nushell/nushell/pull/9742), and [added explicit input types for vectorized `into int` form](https://github.com/nushell/nushell/pull/9741), and [fixed output signature of `split chars`/`words`](https://github.com/nushell/nushell/pull/9739)
- amtoine [allowed `print` to take data as input again](https://github.com/nushell/nushell/pull/9823), and [changed the signature of `enumerate` to `any -> table`](https://github.com/nushell/nushell/pull/9822), and [added `table -> table` to `into datetime`](https://github.com/nushell/nushell/pull/9775)
- WindSoilder [fixed append's signature](https://github.com/nushell/nushell/pull/9821)
- fdncred [added input_output_type to ansi command](https://github.com/nushell/nushell/pull/9817), and [bumped to dev version 0.83.1](https://github.com/nushell/nushell/pull/9811)
- hustcer [fixed command docs deployment for `input listen`](https://github.com/nushell/nushell/pull/9805)

## Extension

- fdncred created [Audit fix](https://github.com/nushell/vscode-nushell-lang/pull/147)
- gaetschwartz created [Don't try to read if file doesn't exist](https://github.com/nushell/vscode-nushell-lang/pull/143)

## Documentation

- WindSoilder created [update doc about env assignment](https://github.com/nushell/nushell.github.io/pull/991)
- mike-ninja created [Updated the oh-my-posh setup guide](https://github.com/nushell/nushell.github.io/pull/990)
- amtoine created [give real links to our GitHub contributors](https://github.com/nushell/nushell.github.io/pull/989), and [replace `let-env FOO = ...` by `$env.FOO = ...`](https://github.com/nushell/nushell.github.io/pull/972), and [Release notes for `0.83`](https://github.com/nushell/nushell.github.io/pull/966)
- hustcer created [Refresh docs for nu v0.83](https://github.com/nushell/nushell.github.io/pull/987)

## Nu_Scripts

- amtoine created [add a script to bump the version of Nushell](https://github.com/nushell/nu_scripts/pull/565), and [apply some minor style fixes to the release guide](https://github.com/nushell/nu_scripts/pull/562), and [add `$.version` to `package.nuon`](https://github.com/nushell/nu_scripts/pull/548)
- sholderbach created [Specify that config versions need updating as well](https://github.com/nushell/nu_scripts/pull/564)
- fj0r created [gn allows init git repo in current directory, and use main as default branch](https://github.com/nushell/nu_scripts/pull/563)

## reedline

- sholderbach created [Bump version for `0.22` release](https://github.com/nushell/reedline/pull/614), and [Bump `nu-ansi-term` to 0.49.0](https://github.com/nushell/reedline/pull/613)
