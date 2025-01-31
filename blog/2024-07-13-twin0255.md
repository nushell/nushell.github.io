# This week in Nushell #255

## Nushell

- devyn landed [a massive Internal Representation (IR) compiler and evaluator PR 🎉🎉🎉](https://github.com/nushell/nushell/pull/13330) and then did lots of mostly related work: [fixed the file count in the `Debug` implementation of `IrBlock`](https://github.com/nushell/nushell/pull/13367), [fixed the order of I/O types in `take until`](https://github.com/nushell/nushell/pull/13356), [included the actual output type in an OutputMismatch error](https://github.com/nushell/nushell/pull/13355), [made the `store-env` IR instruction also update the config](https://github.com/nushell/nushell/pull/13351), [added IR support to the debugger](https://github.com/nushell/nushell/pull/13345), [included more argument types to `view ir`](https://github.com/nushell/nushell/pull/13343), [fixed the signature of `view ir`](https://github.com/nushell/nushell/pull/13342), [set the capacity of the Vec used in `gather_captures()` to the expected number of captures](https://github.com/nushell/nushell/pull/13339), [avoided cloning in `Signature::get_positional()`](https://github.com/nushell/nushell/pull/13338), [made pipe redirections consistent and added `err>|` and similar forms](https://github.com/nushell/nushell/pull/13334), [used Arc for environment variables on the stack](https://github.com/nushell/nushell/pull/13333), [updated the config directly at assignment](https://github.com/nushell/nushell/pull/13332), and [made `into bits` produce a bitstring stream](https://github.com/nushell/nushell/pull/13310).
- ysthakur [prevented the `touch` command from being added twice to the default context](https://github.com/nushell/nushell/pull/13371).
- fdncred [tweaked `parse` usage and examples for better clarity](https://github.com/nushell/nushell/pull/13363) and [did a quick fix up for IR PR as referenced](https://github.com/nushell/nushell/pull/13340).
- sholderbach [fixed `select` cell path renaming behavior](https://github.com/nushell/nushell/pull/13361), [used conventional generic bounds](https://github.com/nushell/nushell/pull/13360), [grouped dependabot updates for uutils/coreutils](https://github.com/nushell/nushell/pull/13346), [bumped the yanked `libc` version](https://github.com/nushell/nushell/pull/13344), and [documented public types in `nu-protocol`](https://github.com/nushell/nushell/pull/12906).
- IanManske [edited path form doc comments](https://github.com/nushell/nushell/pull/13358), [continued the path migration with `nu-test-support`](https://github.com/nushell/nushell/pull/13329), [added and used a new `Signals` struct](https://github.com/nushell/nushell/pull/13314), and [started the path migration](https://github.com/nushell/nushell/pull/13309).
- zhiburt [fixed unused space issues when truncation is used and header on border is configured](https://github.com/nushell/nushell/pull/13353) and [fixed the kv table width issue with header_on_border configuration](https://github.com/nushell/nushell/pull/13325).
- 132ikl [fixed the main binary being rebuilt when nothing has changed](https://github.com/nushell/nushell/pull/13337).
- ayax79 [made `polars unpivot` consistent with `polars pivot`](https://github.com/nushell/nushell/pull/13335) and [implemented a command to expose polars' pivot functionality](https://github.com/nushell/nushell/pull/13282).
- WindSoilder [raised an error when using the invalid `o>|` pipe](https://github.com/nushell/nushell/pull/13323).
- ito-hiroki [fixed `from toml` to handle TOML datetime correctly](https://github.com/nushell/nushell/pull/13315).
- rgwood [updated the `explore` feature to pass config to views at creation time](https://github.com/nushell/nushell/pull/13312).
- hustcer [upgraded Ubuntu runners to 22.04 to fix nightly build errors](https://github.com/nushell/nushell/pull/13273).
- YizhePKU [fixed PWD-aware command hints](https://github.com/nushell/nushell/pull/13024).

## Nu_Scripts

- cdfq152313 [fixed an issue where SSH config might not contain a hostname](https://github.com/nushell/nu_scripts/pull/893) and [added SSH completion](https://github.com/nushell/nu_scripts/pull/891).
- devyn [added a Fibonacci benchmark for fairly low-level evaluation performance](https://github.com/nushell/nu_scripts/pull/892).
