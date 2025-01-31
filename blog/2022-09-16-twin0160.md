# This week in Nushell #160

## Nushell

- fdncred [renamed with_sql to query dfr](https://github.com/nushell/nushell/pull/6568), and [update sql-parser crate and all the files it touches](https://github.com/nushell/nushell/pull/6566), and [synchronize the db commands with file names](https://github.com/nushell/nushell/pull/6565), and [update to the latest sysinfo crate](https://github.com/nushell/nushell/pull/6563), and [update text in readme file](https://github.com/nushell/nushell/pull/6557), and [provide a way to use sql to query dataframes](https://github.com/nushell/nushell/pull/6537)
- nibon7 [used style from lscolors to render the rest of the filename](https://github.com/nushell/nushell/pull/6564), and [Use stripped path for lscolors to get style](https://github.com/nushell/nushell/pull/6561), and [Make clickable links smarter](https://github.com/nushell/nushell/pull/6556)
- Kangaxx-0 [fixed 6529 - Trim overlay name](https://github.com/nushell/nushell/pull/6555), and [Add overlay use usage for 'as'](https://github.com/nushell/nushell/pull/6551)
- aroneous [supported Arrow IPC file format with dataframes](https://github.com/nushell/nushell/pull/6548)
- dandavison [reverted foreground process changes to fix MacOS piping bug (less and fzf)](https://github.com/nushell/nushell/pull/6542), and [Don't compute 'did you mean' suggestions unless showing them to user](https://github.com/nushell/nushell/pull/6540), and [`str collect` => `str join`](https://github.com/nushell/nushell/pull/6531)
- hustcer [bumped dev version to v0.68.2](https://github.com/nushell/nushell/pull/6538)
- merelymyself [defaulted to $nothing if cellpath not found](https://github.com/nushell/nushell/pull/6535)
- unrelentingtech created [shell_integration: Report current working directory as OSC 7](https://github.com/nushell/nushell/pull/6481)

## Extension

- fdncred created [Update readme screenshots](https://github.com/nushell/vscode-nushell-lang/pull/65), and [bump version for release](https://github.com/nushell/vscode-nushell-lang/pull/64), and [add some tweaks to the auto-generated syntax](https://github.com/nushell/vscode-nushell-lang/pull/63), and [remove themes + cleanup](https://github.com/nushell/vscode-nushell-lang/pull/62), and [correct syntax highlighting for block parameters](https://github.com/nushell/vscode-nushell-lang/pull/61)
- Yethal created [Updated syntax + fixed generation script](https://github.com/nushell/vscode-nushell-lang/pull/60)

## Documentation

- WindSoilder created [add doc about plugin name](https://github.com/nushell/nushell.github.io/pull/607)
- hustcer created [Refactor vuepress config](https://github.com/nushell/nushell.github.io/pull/605)
- Yethal created [Update modules.md](https://github.com/nushell/nushell.github.io/pull/603)

## reedline

- GrxE created [Basic external printer](https://github.com/nushell/reedline/pull/467)

## Nana

- rgwood created [CI: add fmt+clippy, break CI on warnings](https://github.com/nushell/nana/pull/68), and [Implement save file functionality](https://github.com/nushell/nana/pull/67)
