# This week in Nushell #259

## Nushell

- ysthakur [added a new `completions.sort` option](https://github.com/nushell/nushell/pull/13311)
- ayax79 [merged `polars sink` and `polars to-*` into `polars save`](https://github.com/nushell/nushell/pull/13568), [added `polars sink` command for streaming collect](https://github.com/nushell/nushell/pull/13562), [made `polars open` open a lazy frame by default](https://github.com/nushell/nushell/pull/13556), [updated `polars first` and `polars last` to handle lazy frames natively](https://github.com/nushell/nushell/pull/13555), [added plist support](https://github.com/nushell/nushell/pull/13545), and [attempted to guess file content type when opening with --raw](https://github.com/nushell/nushell/pull/13521)
- Qnbie [made the math commands const](https://github.com/nushell/nushell/pull/13566)
- qfel [cleaned up key event handling in `explore`](https://github.com/nushell/nushell/pull/13574)
- sholderbach [updated typo definitions](https://github.com/nushell/nushell/pull/13563) and [reworked `help` generation internals](https://github.com/nushell/nushell/pull/13531)
- NotTheDr01ds [added a type signature example for `def command`](https://github.com/nushell/nushell/pull/13561) and [allowed `int` input when using a formatstring in `into datetime`](https://github.com/nushell/nushell/pull/13541)
- kurokirasama [added nu_plugin_polars to build and install scripts](https://github.com/nushell/nushell/pull/13550)
- KAAtheWiseGit [fixed a typo in an example](https://github.com/nushell/nushell/pull/13548) and [created a `random binary` command](https://github.com/nushell/nushell/pull/13542)
- fdncred [updated to latest reedline commit 919292e](https://github.com/nushell/nushell/pull/13540)
- jameschensmith [included empty table data cells in `query web` tables](https://github.com/nushell/nushell/pull/13538)
- weirdan [added multipart/form-data uploads](https://github.com/nushell/nushell/pull/13532)
- cablehead [fixed relay Signals reset to plugins](https://github.com/nushell/nushell/pull/13510)
- lavafroth [added feature to prefer exact match when completion mode is prefix](https://github.com/nushell/nushell/pull/13302)

## Documentation

- NotTheDr01ds [added History and keybindings in Coming from Bash](https://github.com/nushell/nushell.github.io/pull/1502), [added Bash `for` command mapping](https://github.com/nushell/nushell.github.io/pull/1500), [removed dead snippets from translated Installation chapters](https://github.com/nushell/nushell.github.io/pull/1499), [fixed missing links due to changed command names](https://github.com/nushell/nushell.github.io/pull/1498), and [mapped for PowerShell ForEach-Object](https://github.com/nushell/nushell.github.io/pull/1497)
- weirdan [added docs for file uploads](https://github.com/nushell/nushell.github.io/pull/1496)
- danyx23 [fixed line numbers having different line height in code blocks](https://github.com/nushell/nushell.github.io/pull/1495)
- hustcer [upgraded shiki, vuepress and related plugins](https://github.com/nushell/nushell.github.io/pull/1494)

## Nu_Scripts

- phoenixr-codes [added Top commands one-liner](https://github.com/nushell/nu_scripts/pull/926)
- devyn [added warning to release checklist for nu-ansi-term](https://github.com/nushell/nu_scripts/pull/912)

## reedline

- sholderbach [removed out of date YouTube links](https://github.com/nushell/reedline/pull/814)
- tisonkun [ensured lockfile is up-to-date](https://github.com/nushell/reedline/pull/812)
- adaschma [fixed vi mode change not being pastable](https://github.com/nushell/reedline/pull/807)
