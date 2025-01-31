# This week in Nushell #260

## Nushell

- fdncred [updated to latest reedline](https://github.com/nushell/nushell/pull/13629), [added the osc633e escape for VS Code](https://github.com/nushell/nushell/pull/13625), [created a better error message for bad glob patterns](https://github.com/nushell/nushell/pull/13613), [allowed glob to take a glob or a string as input](https://github.com/nushell/nushell/pull/13612), and [added more helpful error with text/xml](https://github.com/nushell/nushell/pull/13609)
- sholderbach [removed code duplication in glob](https://github.com/nushell/nushell/pull/13626) and [included only `*.nu` files in the vendor autoload](https://github.com/nushell/nushell/pull/13599)
- WindSoilder [made `ls -lf` output full path in symbolic target](https://github.com/nushell/nushell/pull/13605) and [added support for SyntaxShape::OneOf in named args](https://github.com/nushell/nushell/pull/13553)
- ysthakur [implemented parse time type checking for range](https://github.com/nushell/nushell/pull/13595)
- weirdan [dropped outdated `touch -d` example](https://github.com/nushell/nushell/pull/13631), [removed unused `fs_extra` and `hamcrest2` dependencies](https://github.com/nushell/nushell/pull/13628), and [added fallback to extension-based content type detection when parsing `Content-Type` header fails](https://github.com/nushell/nushell/pull/13610)
- ayax79 [incremented the eager dataframe cache value before returning it](https://github.com/nushell/nushell/pull/13624)
- qfel [preferred process name over executable path](https://github.com/nushell/nushell/pull/13618) and [fixed handling of spaces in executable names](https://github.com/nushell/nushell/pull/13596)
- devyn [added `--raw` switch to `print` for binary data](https://github.com/nushell/nushell/pull/13597) and [added parse error for external commands used in assignment without caret](https://github.com/nushell/nushell/pull/13585)
- Aakash788 [fixed: Only home dir path in pwd will be replaced with `~` in titlebar](https://github.com/nushell/nushell/pull/13600)
- playdohface [made error-message more helpful when user invokes a non-executable file (#13477)](https://github.com/nushell/nushell/pull/13589)

## Documentation

- NotTheDr01ds [corrected a few links and added table-links in Types](https://github.com/nushell/nushell.github.io/pull/1507), [reworked Completions and Externs chapters](https://github.com/nushell/nushell.github.io/pull/1505), and [updated the Book - Types chapter](https://github.com/nushell/nushell.github.io/pull/1492)

## Nu_Scripts

- AucaCoyan [added worktree completions](https://github.com/nushell/nu_scripts/pull/933)
- koffydrop [updated scoop completions](https://github.com/nushell/nu_scripts/pull/930)
- christoph-blessing [fixed network option missing type](https://github.com/nushell/nu_scripts/pull/929)

## reedline

- tisonkun [implemented ClearScreen with crossterm's Clear](https://github.com/nushell/reedline/pull/813)
