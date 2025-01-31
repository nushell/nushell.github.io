# This week in Nushell #240

## Nushell

- sholderbach made a ton of changes: [reused existing small allocations where possible](https://github.com/nushell/nushell/pull/12335), [used nightly clippy for dead code removal/style fixes](https://github.com/nushell/nushell/pull/12334), [elided a clone in `V::follow_cell_path` for record](https://github.com/nushell/nushell/pull/12325), [avoided uses of `Record` internals again](https://github.com/nushell/nushell/pull/12312), [fixed a bug with history hints and case sensitivity](https://github.com/nushell/nushell/pull/12310), [renamed `Value::CustomValue` to `Value::Custom`](https://github.com/nushell/nushell/pull/12309), [deduplicated `nix` dependency versions](https://github.com/nushell/nushell/pull/12307), [benchmarked table creation and access](https://github.com/nushell/nushell/pull/12293), [fixed `return` in `filter` closure eval](https://github.com/nushell/nushell/pull/12292), [moved some `Option` if/else to method chains in style](https://github.com/nushell/nushell/pull/12285), [removed dead `impl PluginEncoder for EncodingType`](https://github.com/nushell/nushell/pull/12284), and [followed API guidelines for public types](https://github.com/nushell/nushell/pull/12283)
- WindSoilder [introduced a `--guess flag` and removed `--legacy` for `detect columns`](https://github.com/nushell/nushell/pull/12333), [improved the default algorithm in `detect columns`](https://github.com/nushell/nushell/pull/12277), and [made `ls`, `rm`, `cp`, `open`, `touch`, `mkdir` not expand tilde if input path is a quoted string or a variable](https://github.com/nushell/nushell/pull/12232)
- dead10ck [fixed insertion of null values in `into sqlite`](https://github.com/nushell/nushell/pull/12328)
- devyn [fixed the build of nu-protocol without the plugin feature enabled](https://github.com/nushell/nushell/pull/12323), [removed serde derive for `ShellError`, replaced via `LabeledError`](https://github.com/nushell/nushell/pull/12319), [replaced the `difference` crate with `similar`](https://github.com/nushell/nushell/pull/12282), [added example tests (nu-plugin-test-support) for plugins in repo](https://github.com/nushell/nushell/pull/12281), and [changed PluginCommand API to be more like Command](https://github.com/nushell/nushell/pull/12279)
- IanManske [fixed file redirection for external streams](https://github.com/nushell/nushell/pull/12321), [made `Record.cols` private](https://github.com/nushell/nushell/pull/12317), [used safe `nix` APIs instead of `libc`](https://github.com/nushell/nushell/pull/12315), [cancelled old CI runs on commit](https://github.com/nushell/nushell/pull/12298), [always pretty printed binary values in `table`](https://github.com/nushell/nushell/pull/12294), and [added a `command_prelude` module](https://github.com/nushell/nushell/pull/12291)
- fdncred [added a few more logging statements for debugging startup](https://github.com/nushell/nushell/pull/12316), [kept sqlparser at 39 until polars is upgraded](https://github.com/nushell/nushell/pull/12311), and [cleaned up coreutils tagging](https://github.com/nushell/nushell/pull/12286)
- merelymyself [exposed the recursion limit value as a config option](https://github.com/nushell/nushell/pull/12308)
- AucaCoyan [reworked some help strings](https://github.com/nushell/nushell/pull/12306), and [fixed a bug with IDE tooltips](https://github.com/nushell/nushell/pull/12273)
- FilipAndersson245 [fixed a broken benchmark](https://github.com/nushell/nushell/pull/12297), and [boxed records for smaller Value enum](https://github.com/nushell/nushell/pull/12252)
- Dorumin [implemented parameterization for `query db`](https://github.com/nushell/nushell/pull/12249)
- dmatos2012 [created an initial implementation for uutils `uname`](https://github.com/nushell/nushell/pull/11684)
- schrieveslaach [included more info for LSP completion](https://github.com/nushell/nushell/pull/11443)

## Extension

- AucaCoyan [added `prettier` to dev dependencies](https://github.com/nushell/vscode-nushell-lang/pull/181)

## Documentation

- devyn [created docs for recent plugin changes](https://github.com/nushell/nushell.github.io/pull/1318), and [authored release notes for 0.92](https://github.com/nushell/nushell.github.io/pull/1317)
- sholderbach [fixed a plugin reference to `Value::Custom` rename](https://github.com/nushell/nushell.github.io/pull/1316)
- IanManske [updated redirection examples in "coming from bash" for 0.92.0](https://github.com/nushell/nushell.github.io/pull/1315), [added `tee` example to "coming from bash"](https://github.com/nushell/nushell.github.io/pull/1314)
- petrisch [updated control_flow.md](https://github.com/nushell/nushell.github.io/pull/1313)
- texastoland [documented minimal config files](https://github.com/nushell/nushell.github.io/pull/1310)

## Nu_Scripts

- AucaCoyan [added `gh gist` and `gh repo list` and `view`](https://github.com/nushell/nu_scripts/pull/803), [added `rye` completions](https://github.com/nushell/nu_scripts/pull/802)
- enzalito [added Micromamba support](https://github.com/nushell/nu_scripts/pull/800)
- dam4rus [fixed git branch cleanup for nushell version 0.91+](https://github.com/nushell/nu_scripts/pull/799)
- fj0r [refined kube for backup](https://github.com/nushell/nu_scripts/pull/793)

## reedline

- sholderbach [fixed case-consistency searching sqlite history](https://github.com/nushell/reedline/pull/777), [fixed `OpenOptions` clippy](https://github.com/nushell/reedline/pull/776), [bumped `fd-lock` requirement and locked deps](https://github.com/nushell/reedline/pull/775)
