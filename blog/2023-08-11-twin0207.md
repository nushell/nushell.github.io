## Nushell

- zhiburt [added `table.padding` configuration](https://github.com/nushell/nushell/pull/9983)
- sholderbach [moved `format duration`/`filesize` back into core](https://github.com/nushell/nushell/pull/9978), and [fixed up dataframe build after #9971](https://github.com/nushell/nushell/pull/9974)
- amtoine [fixed the signature of `input list`](https://github.com/nushell/nushell/pull/9977), and [fixed panic with `lines` on an error](https://github.com/nushell/nushell/pull/9967), and [fix the default config for `explore`](https://github.com/nushell/nushell/pull/9962), and [forced version to update when installing with toolkit](https://github.com/nushell/nushell/pull/9947), and [add a test to make sure "nothing" shows up as "nothing" in help](https://github.com/nushell/nushell/pull/9941), and [remove old deprecated commands](https://github.com/nushell/nushell/pull/9840)
- rgwood created [fixed cross-compiling with cross-rs](https://github.com/nushell/nushell/pull/9972), and [put heavy dataframe dependencies behind feature flag](https://github.com/nushell/nushell/pull/9971), and [fixed `match` example whitespace](https://github.com/nushell/nushell/pull/9961)
- fdncred [updated `strip-ansi-escapes` to 0.2.0 and the latest reedline](https://github.com/nushell/nushell/pull/9970), and [update `strip-ansi-escapes` to use new api](https://github.com/nushell/nushell/pull/9958), and [add keybinding for search-history](https://github.com/nushell/nushell/pull/9930)
- jntrnr [fixed the Cargo.lock file](https://github.com/nushell/nushell/pull/9955), and [move `help commands` to use more structure in signatures](https://github.com/nushell/nushell/pull/9949), and [rename `main` to script name when running scripts](https://github.com/nushell/nushell/pull/9948), and [fixed a couple clippy warnings](https://github.com/nushell/nushell/pull/9936), and [auto-expand table based on terminal width](https://github.com/nushell/nushell/pull/9934), and [added tests for script subcommands](https://github.com/nushell/nushell/pull/9933)
- panicbit created [parse: collect external stream chunks before matching](https://github.com/nushell/nushell/pull/9950), and [do not emit None mid-stream during parse](https://github.com/nushell/nushell/pull/9925)
- stormasm created [Categorification: move commands histogram and version out of the default category](https://github.com/nushell/nushell/pull/9946), and [Categorification: move from Default category to Filters](https://github.com/nushell/nushell/pull/9945), and [Categorification: move Path commands out of the default category](https://github.com/nushell/nushell/pull/9937), and [Categorification: graduate nuon --- from the experimental category to the formats category](https://github.com/nushell/nushell/pull/9932), and [Categorification: move uncategorized String commands to Category::Strings](https://github.com/nushell/nushell/pull/9931), and [Cratification: move some str case commands to nu-cmd-extra](https://github.com/nushell/nushell/pull/9926)
- atahabaki created [str-expand: update bracoxide to v0.1.2, fixes #9913](https://github.com/nushell/nushell/pull/9940)
- NotLebedev created a new [Nothing return type](https://github.com/nushell/nushell/pull/9935)
- IanManske [made `Value::columns` return slice instead of cloned Vec](https://github.com/nushell/nushell/pull/9927)
- bobhy [fixed duration type to not report months or years](https://github.com/nushell/nushell/pull/9632)

## Documentation

- rgwood created [Cookbook cleanup](https://github.com/nushell/nushell.github.io/pull/1001)
- rprtr258 created [Update explore.md](https://github.com/nushell/nushell.github.io/pull/1000)
- oatovar created [Update testing examples](https://github.com/nushell/nushell.github.io/pull/997)

## Nu_Scripts

- uroybd created [feat(completions): ✨ add PDM custom completions](https://github.com/nushell/nu_scripts/pull/573)

## reedline

- fdncred created [update to strip-ansi-escapes 0.2.0](https://github.com/nushell/reedline/pull/618), and [update `strip-ansi-escapes` to their latest api](https://github.com/nushell/reedline/pull/617)
