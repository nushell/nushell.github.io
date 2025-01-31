# This week in Nushell #145

## Nushell

- sholderbach [used search terms in the help menu search](https://github.com/nushell/nushell/pull/5708), and [Update nu-ansi-term to remove `Deref` impl](https://github.com/nushell/nushell/pull/5706), and [Improve internal documentation of `save` command](https://github.com/nushell/nushell/pull/5704), and [Update reedline](https://github.com/nushell/nushell/pull/5678), and [Clarify error message for `let` in pipeline](https://github.com/nushell/nushell/pull/5677)
- VergeDX [fixed: Panic when passthru small number of `table -w`.](https://github.com/nushell/nushell/pull/5705)
- rgwood [fixed `ls` for Windows system files](https://github.com/nushell/nushell/pull/5703)
- PerBothner created [Minor fixes to shell integation in repl.](https://github.com/nushell/nushell/pull/5701), and [Improve table output of 'to html',](https://github.com/nushell/nushell/pull/5699)
- Yethal [added completions for nu](https://github.com/nushell/nushell/pull/5700)
- kubouch [fixed wrong `path` help message](https://github.com/nushell/nushell/pull/5698)
- hustcer [fixed doc building for vuepress-next, avoid using angle brackets](https://github.com/nushell/nushell/pull/5696), and [feat: Add sensitive flag to get, fix #4295](https://github.com/nushell/nushell/pull/5685)
- merelymyself created [Small typo fix in `signature.rs`](https://github.com/nushell/nushell/pull/5693), and [prevent panic with `let` alone in pipeline](https://github.com/nushell/nushell/pull/5676), and [Add '-o'/`--output` flag to `fetch` to download to file](https://github.com/nushell/nushell/pull/5673)
- WindSoilder [expanded env for path](https://github.com/nushell/nushell/pull/5692), and [make ls works better with glob](https://github.com/nushell/nushell/pull/5691), and [base64 command more friendly](https://github.com/nushell/nushell/pull/5680)
- elferherrera created [Lazy dataframes](https://github.com/nushell/nushell/pull/5687)
- mjclements [differentiated internal signature from external signature w.r.t. help](https://github.com/nushell/nushell/pull/5667)
- Kangaxx-0 [fixed cp bug](https://github.com/nushell/nushell/pull/5642)

## Documentation

- hustcer created [Update prettier config and run code format](https://github.com/nushell/nushell.github.io/pull/479), and [fix feed plugin add atom support](https://github.com/nushell/nushell.github.io/pull/478), and [Fix search box style, make it wider](https://github.com/nushell/nushell.github.io/pull/477), and [Fix search box style, make it align left](https://github.com/nushell/nushell.github.io/pull/476), and [Trigger deploy workflow](https://github.com/nushell/nushell.github.io/pull/475), and [Fix command detail page, update make_docs.nu](https://github.com/nushell/nushell.github.io/pull/474), and [Upgrade vuepress to v2 and add dark mode support](https://github.com/nushell/nushell.github.io/pull/465)
- merelymyself created [Add documentation for switch flags](https://github.com/nushell/nushell.github.io/pull/471)
- fdncred created [remove file paths since they're not a thing any longer](https://github.com/nushell/nushell.github.io/pull/470)
- jgollenz created [Add 'Reading environment variables' section](https://github.com/nushell/nushell.github.io/pull/469), and [typos](https://github.com/nushell/nushell.github.io/pull/462)
- Yethal created [Update dataframes.md](https://github.com/nushell/nushell.github.io/pull/467)
- elferherrera created [lazyframes section](https://github.com/nushell/nushell.github.io/pull/466)

## Nu_Scripts

- ehdevries created [Improve panache-git performance for changes with many files](https://github.com/nushell/nu_scripts/pull/240)
- Yethal created [Update remoting.nu](https://github.com/nushell/nu_scripts/pull/239), and [Update ssh script for 0.63.0](https://github.com/nushell/nu_scripts/pull/238)
- Jacobious52 created [generated nu completions from fish](https://github.com/nushell/nu_scripts/pull/237), and [autogenerate from Fish shell completions](https://github.com/nushell/nu_scripts/pull/236)
- Dan-Gamin created [Add pwd-short to cool-oneliners](https://github.com/nushell/nu_scripts/pull/235), and [Add more cargo completions](https://github.com/nushell/nu_scripts/pull/233)
- sholderbach created [Script to gather test coverage for nushell](https://github.com/nushell/nu_scripts/pull/234)

## reedline

- sholderbach created [Update nu-ansi-term/update crate patch versions](https://github.com/nushell/reedline/pull/437), and [Fix clippy lints that will become warnings](https://github.com/nushell/reedline/pull/435)
- WindSoilder created [Don't panic when parent directory does not exist](https://github.com/nushell/reedline/pull/436)
- Artturin created [Move ctrl+a & ctrl+e to common navigation binds](https://github.com/nushell/reedline/pull/434)
