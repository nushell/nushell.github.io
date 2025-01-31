# This week in Nushell #251

## Nushell

- kubouch [fixed deltas not being merged when evaluating menus](https://github.com/nushell/nushell/pull/13120), [extended functionality of tango benchmark helpers](https://github.com/nushell/nushell/pull/13107), and [refactored Span ID (Step 2): Use SpanId of expressions in some places](https://github.com/nushell/nushell/pull/13102).
- zhiburt [improved performance of `explore`](https://github.com/nushell/nushell/pull/13116).
- fdncred [updated uutils crates](https://github.com/nushell/nushell/pull/13130), and [added `$nu.data-dir` for completions and `$nu.cache-dir` for other uses](https://github.com/nushell/nushell/pull/13122).
- IanManske [made the `which-support` feature non-optional](https://github.com/nushell/nushell/pull/13125), [removed the deprecated `--not` flag on `str contains`](https://github.com/nushell/nushell/pull/13124), [removed old `sys` command behavior](https://github.com/nushell/nushell/pull/13114), and made changes to [how `path type` handles errors and missing files](https://github.com/nushell/nushell/pull/13007).
- NotTheDr01ds [expanded tables in help examples in std](https://github.com/nushell/nushell/pull/13146), [added search terms to `if`](https://github.com/nushell/nushell/pull/13145), [fixed help for `banner`](https://github.com/nushell/nushell/pull/13138), [fixed multiple issues with `def --wrapped` help example](https://github.com/nushell/nushell/pull/13123), and [deprecated `--numbered` from `for`](https://github.com/nushell/nushell/pull/13112).
- ayax79 [allowed the addition of an index column to be optional for dataframes](https://github.com/nushell/nushell/pull/13097), and [fixed the use of right-hand expressions in dataframe operations](https://github.com/nushell/nushell/pull/13096).
- hqsz [fixed wrong casting with `into filesize`](https://github.com/nushell/nushell/pull/13110).

## Documentation

- NotTheDr01ds [created a cookbook - new section on handling keypress loops using `input listen`](https://github.com/nushell/nushell.github.io/pull/1445), and [linked from 'TiN -> Immutable Variables' to Variables chapter to reduce redundancy](https://github.com/nushell/nushell.github.io/pull/1439).
- gar1t [replaced `exit` with `dexit` for popd analog](https://github.com/nushell/nushell.github.io/pull/1444).
- kubouch [added C toolchain to Ubuntu install instructions](https://github.com/nushell/nushell.github.io/pull/1443).
- amtoine [removed feature from front matter and commands page](https://github.com/nushell/nushell.github.io/pull/1440).

## Nu_Scripts

- fdncred [updated the nu_msvs module](https://github.com/nushell/nu_scripts/pull/879).
- laisnuto [fixed an alert in kw completions](https://github.com/nushell/nu_scripts/pull/878).
- OJarrisonn [added completions for `kw`](https://github.com/nushell/nu_scripts/pull/877).
