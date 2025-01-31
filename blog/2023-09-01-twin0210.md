# This week in Nushell #210

## Nushell

- sholderbach [simplified rawstrings in tests](https://github.com/nushell/nushell/pull/10180), and [Remove dead tests depending on `inc`](https://github.com/nushell/nushell/pull/10179), and [Keep `arrow2` out of basic `--workspace` build](https://github.com/nushell/nushell/pull/10178)
- kubouch [added NU_VERSION environment variable on startup](https://github.com/nushell/nushell/pull/10177), and [Make $nu constant](https://github.com/nushell/nushell/pull/10160)
- fdncred [updated query web example because wikipedia changed their page](https://github.com/nushell/nushell/pull/10173), and [name hooks internally](https://github.com/nushell/nushell/pull/10127)
- J-Kappes created [Tests: clean up unnecessary use of pipeline()](https://github.com/nushell/nushell/pull/10170)
- zhiburt [fixed #10154](https://github.com/nushell/nushell/pull/10162)
- ayax79 [fixed usages of deprecated chrono DateTime::from_utc](https://github.com/nushell/nushell/pull/10161), and [Updating polars and sqlparser versions](https://github.com/nushell/nushell/pull/10114)
- horasal [skipped comments and eols while parsing pipeline](https://github.com/nushell/nushell/pull/10149), and [handle empty pipeline while parsing let (fix Issue10083)](https://github.com/nushell/nushell/pull/10116)
- stormasm [moved hook to nu_cmd_base](https://github.com/nushell/nushell/pull/10146), and [remove warnings in nu_command tests](https://github.com/nushell/nushell/pull/10145), and [update rust-toolchain doc to 4 weeks from 3](https://github.com/nushell/nushell/pull/10140)
- matthias-Q created [feat: allow `from csv` to accept 4 byte unicode separator chars](https://github.com/nushell/nushell/pull/10138)
- dependabot[bot] [bumped notify-debouncer-full from 0.2.0 to 0.3.1](https://github.com/nushell/nushell/pull/10129)
- SED4906 [updated removed "MDI" icons to current MD icons](https://github.com/nushell/nushell/pull/10126)
- JoaquinTrinanes created [Screen reader-friendly errors](https://github.com/nushell/nushell/pull/10122)
- dead10ck created [Support Termux](https://github.com/nushell/nushell/pull/10013)

## Documentation

- dclausen created [Update cheat_sheet.md](https://github.com/nushell/nushell.github.io/pull/1039)
- simonboots created [Fix small typo in modules.md](https://github.com/nushell/nushell.github.io/pull/1038)
- leetemil created [Update docs for exiting shell in shells](https://github.com/nushell/nushell.github.io/pull/1037)
- jamesarch created [fix missing command](https://github.com/nushell/nushell.github.io/pull/1034)
- narve created [Update loading_data.md, correct link to http command](https://github.com/nushell/nushell.github.io/pull/1033)
- follower created [Move launch instructions earlier in page.](https://github.com/nushell/nushell.github.io/pull/1032)
- adamchalmers created [Link to escape when discussing escapes](https://github.com/nushell/nushell.github.io/pull/1031), and [Clarify how to check config file paths](https://github.com/nushell/nushell.github.io/pull/1030)
- dlamei created [fix typo in book](https://github.com/nushell/nushell.github.io/pull/1028)
- JoaquinTrinanes created [Error style section](https://github.com/nushell/nushell.github.io/pull/1026)
- lomm28 created [nu cheat sheet added](https://github.com/nushell/nushell.github.io/pull/1025)

## Nu_Scripts

- maxim-uvarov created [Update `bar` function](https://github.com/nushell/nu_scripts/pull/589)
- StripedMonkey created [Expand git completions](https://github.com/nushell/nu_scripts/pull/587)

## reedline

- Hofer-Julian created [Fix `read_line` docs](https://github.com/nushell/reedline/pull/629)
- sholderbach created [Bump `crossterm` to 0.27.0](https://github.com/nushell/reedline/pull/625)
- Abdillah created [Add Kitty protocol keyboard enhancement support](https://github.com/nushell/reedline/pull/607)
