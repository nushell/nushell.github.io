# This week in Nushell #246

## Nushell

- IanManske [fixed pipe redirection into `complete`](https://github.com/nushell/nushell/pull/12818), [fixed raw strings as external arguments](https://github.com/nushell/nushell/pull/12817), [fixed syntax highlighting for `not`](https://github.com/nushell/nushell/pull/12815), [fixed/simplified cwd in benchmarks](https://github.com/nushell/nushell/pull/12812), [refactored message printing in `rm`](https://github.com/nushell/nushell/pull/12799), [fixed list spread syntax highlighting](https://github.com/nushell/nushell/pull/12793), [refactored `parse` command](https://github.com/nushell/nushell/pull/12791), [added `sys users` command](https://github.com/nushell/nushell/pull/12787), [passed `Stack` ref to `Completer::fetch`](https://github.com/nushell/nushell/pull/12783), [refactored the CLI code](https://github.com/nushell/nushell/pull/12782), [refactored `describe`](https://github.com/nushell/nushell/pull/12770), [refactored flattening to reduce intermediate allocations](https://github.com/nushell/nushell/pull/12756), [added `sys` subcommands](https://github.com/nushell/nushell/pull/12747), and [touched up `ListStream`](https://github.com/nushell/nushell/pull/12524).
- ayax79 [refactored dataframes to be much more lazy about evaluation](https://github.com/nushell/nushell/pull/12669).
- YizhePKU [implemented PWD recovery](https://github.com/nushell/nushell/pull/12779), and [migrated to a new PWD API (part 2)](https://github.com/nushell/nushell/pull/12749).
- fdncred [cleaned up osc calls for shell_integration](https://github.com/nushell/nushell/pull/12810).
- devyn [made the warning message clearer when running a plugin exe directly](https://github.com/nushell/nushell/pull/12806).
- sholderbach [shrunk `Value` by boxing `Range`/`Closure`](https://github.com/nushell/nushell/pull/12784), and [added SOPs for dealing with adding deps/crates](https://github.com/nushell/nushell/pull/12771).
- WindSoilder [allowed raw strings to be used inside subexpression, list, and closure](https://github.com/nushell/nushell/pull/12776), and [allowed `ls` to work inside dir with [] brackets](https://github.com/nushell/nushell/pull/12625).
- cablehead [added an echo command to nu_plugin_example](https://github.com/nushell/nushell/pull/12754).
- amtoine [improved NUON documentation](https://github.com/nushell/nushell/pull/12717).
- FilipAndersson245 [migrated to the Tango benchmarking framework](https://github.com/nushell/nushell/pull/12469).

## Documentation

- hustcer [added docs for polars related commands](https://github.com/nushell/nushell.github.io/pull/1394), and [fixed make_docs.nu for Nu v0.93.0](https://github.com/nushell/nushell.github.io/pull/1389).
- maxim-uvarov [made corrections to `Operators precedence` chapter](https://github.com/nushell/nushell.github.io/pull/1393), and [updated the Dataframe chapter](https://github.com/nushell/nushell.github.io/pull/1391).
- ajhall [fixed a typo in C#/PowerShell examples](https://github.com/nushell/nushell.github.io/pull/1392).
- woosaaahh [fixed a wrong result in an example from 'lang-guide'](https://github.com/nushell/nushell.github.io/pull/1390).
- justbispo [fixed Keychain instructions in ssh_agent.md](https://github.com/nushell/nushell.github.io/pull/1388).

## Nu_Scripts

- undefined-ux [added adb&fastboot completions](https://github.com/nushell/nu_scripts/pull/834).
- maxim-uvarov [used `typos` for corrections](https://github.com/nushell/nu_scripts/pull/833).
- CarrotManMatt [improved `custom-menus` docs](https://github.com/nushell/nu_scripts/pull/832).
