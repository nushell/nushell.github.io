# This week in Nushell #250

## Nushell

- kubouch initiated [Span ID Refactor - Step 1](https://github.com/nushell/nushell/pull/12960) and [fixed a test failure when running tests with nextest](https://github.com/nushell/nushell/pull/13101).
- WindSoilder [removed inner quotes once Nushell gets `=` sign in `run_external`](https://github.com/nushell/nushell/pull/13073), used [pathdiff::diff_path to handle relative paths in `run_external.rs`](https://github.com/nushell/nushell/pull/13056), and [bumped version to 0.94.3](https://github.com/nushell/nushell/pull/13055).
- sholderbach [grouped `polars` crate updates in dependabot](https://github.com/nushell/nushell/pull/13084), and moved [`format date` to `Category::Strings`](https://github.com/nushell/nushell/pull/13083).
- devyn [added options for filtering the log output from `nu`](https://github.com/nushell/nushell/pull/13044), increased [default compression level in msgpackz](https://github.com/nushell/nushell/pull/13035), fixed [`run_external::expand_glob()` to return PWD-relative paths](https://github.com/nushell/nushell/pull/13028), fixed [external command name parsing with backslashes, and added tests](https://github.com/nushell/nushell/pull/13027), and [bumped version to `0.94.2`](https://github.com/nushell/nushell/pull/13014).
- rgwood [overhauled `explore` config](https://github.com/nushell/nushell/pull/13075), [fixed `explore` panic on empty lists](https://github.com/nushell/nushell/pull/13074), made [LS_COLORS functionality faster in `explore`, especially on Windows](https://github.com/nushell/nushell/pull/12984), and [refactored `explore` cursor code](https://github.com/nushell/nushell/pull/12979).
- ayax79 [upgraded to polars 0.40](https://github.com/nushell/nushell/pull/13069), [fixed a couple of incorrect error messages](https://github.com/nushell/nushell/pull/13043), and allowed [int values to be converted into floats](https://github.com/nushell/nushell/pull/13025).
- stormasm [reduced log tracing in nu-cli](https://github.com/nushell/nushell/pull/13067).
- abusch [made `query xml` return nodes in document order](https://github.com/nushell/nushell/pull/13047), and tried [to preserve the ordering of elements in from toml](https://github.com/nushell/nushell/pull/13045).
- JoaoFidalgo1403 [allowed stor insert and stor update to accept pipeline input](https://github.com/nushell/nushell/pull/12882).
- Decodetalkers [fixed a coredump without any messages](https://github.com/nushell/nushell/pull/13034).
- NotTheDr01ds [corrected an erroneous example in the 'touch' help](https://github.com/nushell/nushell/pull/13095), and updated [`cd`/`def --env` examples](https://github.com/nushell/nushell/pull/13068).
- Embers-of-the-Fire [made string related commands parse-time evaluatable](https://github.com/nushell/nushell/pull/13032).
- KAAtheWiseGit [used native toml datetime type in `to toml`](https://github.com/nushell/nushell/pull/13018).
- amtoine [completed the type of `--error-label` in `std assert` commands](https://github.com/nushell/nushell/pull/12998).
- IanManske [fixed display formatting for command type in `help commands`](https://github.com/nushell/nushell/pull/12996).
- roaldarbol [created `CITATION.cff`](https://github.com/nushell/nushell/pull/12983).
- hqsz [supported plus sign for "into filesize"](https://github.com/nushell/nushell/pull/12974).
- ymcx [fixed the colors when completing using a relative path](https://github.com/nushell/nushell/pull/12898).

## Documentation

- hustcer [added common tools dir](https://github.com/nushell/nushell.github.io/pull/1438).
- maxim-uvarov [updated `dataframes` chapter table with `commands`](https://github.com/nushell/nushell.github.io/pull/1437).
- kubouch [added 0.94.2 patch notes](https://github.com/nushell/nushell.github.io/pull/1436).
- tesujimath [added reference to bash-env to cookbook](https://github.com/nushell/nushell.github.io/pull/1434).
- ZennoZenith [fixed a broken link pointing to localhost](https://github.com/nushell/nushell.github.io/pull/1433).
- Kissaki [improved translation overview text for #261](https://github.com/nushell/nushell.github.io/pull/1431), and [fixed module env usage tip](https://github.com/nushell/nushell.github.io/pull/1423).
- amtoine [updated testing doc](https://github.com/nushell/nushell.github.io/pull/1422).

## Nu_Scripts

- maxim-uvarov [proposed an improvement to `std bench`](https://github.com/nushell/nu_scripts/pull/873), simplified the [`std bench` improvement candidate](https://github.com/nushell/nu_scripts/pull/865), and offered a [hotfix for `significant-digits` to not error if the input was 0](https://github.com/nushell/nu_scripts/pull/863), and [updated `significant-digits` to not use string conversions](https://github.com/nushell/nu_scripts/pull/862).
- neur1n [resolved several issues in nu_conda and nu_msvs](https://github.com/nushell/nu_scripts/pull/872).
- OJarrisonn [updated rustup completions to use the new rustup help page style](https://github.com/nushell/nu_scripts/pull/871), and [added `eza` completions](https://github.com/nushell/nu_scripts/pull/870).
- fdncred [reverted "Add git coommit completions"](https://github.com/nushell/nu_scripts/pull/869), and [originally added git commit completions then reverted](https://github.com/nushell/nu_scripts/pull/868).
- th-duvanel [added docker completions](https://github.com/nushell/nu_scripts/pull/867).
- laisnuto [completed git pull](https://github.com/nushell/nu_scripts/pull/866).
- zhangymPerson [added docker aliases](https://github.com/nushell/nu_scripts/pull/861).
