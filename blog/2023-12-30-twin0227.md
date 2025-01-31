# This week in Nushell #227

## Nushell

- ysthakur [added more specific errors for missing values in records](https://github.com/nushell/nushell/pull/11423), and [allowed spreading arguments to commands](https://github.com/nushell/nushell/pull/11289)
- nibon7 [fixed a panic when `http_client` fails](https://github.com/nushell/nushell/pull/11422), and improved redirection: [1](https://github.com/nushell/nushell/pull/11421), [2](https://github.com/nushell/nushell/pull/11384)
- sholderbach [simplified the feature gates for `stor` commands](https://github.com/nushell/nushell/pull/11416), [made polars deps optional for `cargo test --all`](https://github.com/nushell/nushell/pull/11415), and [limited direct construction of `Record`](https://github.com/nushell/nushell/pull/11414), [added a check for clean repo after tests](https://github.com/nushell/nushell/pull/11409), [fixed sandboxing of redirection tests](https://github.com/nushell/nushell/pull/11407), and [bumped the reedline development version](https://github.com/nushell/nushell/pull/11406)
- fdncred [reverted "Bump reedline development version"](https://github.com/nushell/nushell/pull/11425)
- SebastianIonel [fixed a bug with "bytes remove --end" .](https://github.com/nushell/nushell/pull/11428)
- IanManske [removed the unnecessary `replace_in_variable`](https://github.com/nushell/nushell/pull/11424)
- lavafroth implemented [fix: prevent greedy matching of directory names](https://github.com/nushell/nushell/pull/11403)
- cyradotpink [allowed `http` commands' automatic redirect-following to be disabled](https://github.com/nushell/nushell/pull/11329)

## Documentation

- frogshead created [fix typo](https://github.com/nushell/nushell.github.io/pull/1185)
- ysthakur created [Add information on spread operator](https://github.com/nushell/nushell.github.io/pull/1176)

## Nu_Scripts

- AucaCoyan created [:bug: fix `(default)` and `(installed)` on rustup completions](https://github.com/nushell/nu_scripts/pull/721), and [:bug: rename `yarn` for `yarn-v4` and add `run` cmpl](https://github.com/nushell/nu_scripts/pull/720), and [:sparkles: `code` completions](https://github.com/nushell/nu_scripts/pull/719), and [:sparkles: add completion to `gh pr checkout <tab>`](https://github.com/nushell/nu_scripts/pull/714)
- frogshead created [fix broken links in modules readme](https://github.com/nushell/nu_scripts/pull/718), and [fix broken link on README.md](https://github.com/nushell/nu_scripts/pull/716)
- edhowland created [Adds Modules/recursion : Examples of Fun with Recursive functions in Nu](https://github.com/nushell/nu_scripts/pull/717)
- fj0r created [comma test runner](https://github.com/nushell/nu_scripts/pull/715)

## reedline

- nibon7 created [Fix `prompt_start_row` reset to 0 when opening a file without newline in Nushell](https://github.com/nushell/reedline/pull/688)
- sholderbach created [Fix clippy from the future](https://github.com/nushell/reedline/pull/687), and [Bump `itertools` to `0.12.0` from `0.10.x`](https://github.com/nushell/reedline/pull/686)
