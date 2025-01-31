# This week in Nushell #244

## Nushell

- devyn [fixed inconsistent print behavior](https://github.com/nushell/nushell/pull/12675), [added a bit more delay before `ps` calls in plugin persistence tests](https://github.com/nushell/nushell/pull/12673), [added plugin error propagation on write/flush](https://github.com/nushell/nushell/pull/12670), [introduced Msgpack commands](https://github.com/nushell/nushell/pull/12664), [further improved messages related to error propagation on plugin calls](https://github.com/nushell/nushell/pull/12646), [accepted filenames in other plugin management commands](https://github.com/nushell/nushell/pull/12639), [renamed plugin cache file to plugin registry file](https://github.com/nushell/nushell/pull/12634), [fixed (and tested) a deadlock that can happen while waiting for protocol info](https://github.com/nushell/nushell/pull/12633), [fixed error message propagation on plugin call failure](https://github.com/nushell/nushell/pull/12632), [added `ErrSpan` extension trait for `Result`](https://github.com/nushell/nushell/pull/12626), [updated `toolkit register plugins` to `toolkit add plugins`](https://github.com/nushell/nushell/pull/12613), [made `stress_internals` exit(1) on IO error](https://github.com/nushell/nushell/pull/12612), [deprecated `register` and added `plugin use`](https://github.com/nushell/nushell/pull/12607), and [overhauled the plugin cache file with a new msgpack+brotli format](https://github.com/nushell/nushell/pull/12579).
- IanManske [fixed an `into bits` example](https://github.com/nushell/nushell/pull/12668), [added a deprecation warning to `describe --collect-lazyrecords`](https://github.com/nushell/nushell/pull/12667), [fixed `each` signature](https://github.com/nushell/nushell/pull/12666), [removed deprecated flags on `run-external`](https://github.com/nushell/nushell/pull/12659), [removed deprecated flags on `commandline`](https://github.com/nushell/nushell/pull/12658), [deprecated lazy records](https://github.com/nushell/nushell/pull/12656), [made exit code available in `catch` block](https://github.com/nushell/nushell/pull/12648), [improved the "input and output are the same file" error text](https://github.com/nushell/nushell/pull/12619), [shrunk the size of `Expr`](https://github.com/nushell/nushell/pull/12610), [cleaned up `nu-cmd-lang`](https://github.com/nushell/nushell/pull/12609), [made the same file error more likely to appear](https://github.com/nushell/nushell/pull/12601), [removed the `Value::Block` case](https://github.com/nushell/nushell/pull/12582), and [refactored using `ClosureEval` types](https://github.com/nushell/nushell/pull/12541).
- hustcer [upgraded CI to fix macOS arm64 build errors](https://github.com/nushell/nushell/pull/12681).
- merelymyself [made `grid` throw an error when not enough columns are provided](https://github.com/nushell/nushell/pull/12672).
- WindSoilder [avoided panic when piping a variable to a custom command which has recursive calls](https://github.com/nushell/nushell/pull/12491).
- KAAtheWiseGit [fixed example wording in `seq date`](https://github.com/nushell/nushell/pull/12665).
- fdncred updated to the latest reedline twice ([1](https://github.com/nushell/nushell/pull/12644), [2](https://github.com/nushell/nushell/pull/12630))
- stormasm [bumped reedline](https://github.com/nushell/nushell/pull/12621).
- amtoine [fixed a typo in the documentation of `nuon::ToStyle`](https://github.com/nushell/nushell/pull/12608).
- sholderbach [updated `ratatui` to deduplicate `syn` in build](https://github.com/nushell/nushell/pull/12606) and [did a small refactor in `cal`](https://github.com/nushell/nushell/pull/12604).
- maxim-uvarov [added search_term "str extract" to `parse` command](https://github.com/nushell/nushell/pull/12600).
- ayax79 [added commands for working with the plugin cache](https://github.com/nushell/nushell/pull/12576).

## Extension

- AucaCoyan [added support for `def 'my-function'` syntax highlighting and added tests to it](https://github.com/nushell/vscode-nushell-lang/pull/182).

## Documentation

- isti115 [updated docs for commands from `nu-std/std/dirs.nu`](https://github.com/nushell/nushell.github.io/pull/1369) and provided a [fixup for it](https://github.com/nushell/nushell.github.io/pull/1370).
- IanManske [fixed broken links](https://github.com/nushell/nushell.github.io/pull/1366) and [updated docs for 0.92.0 (file, pipes, and io)](https://github.com/nushell/nushell.github.io/pull/1352).

## Nu_Scripts

- zhangymPerson [added a git worktree command](https://github.com/nushell/nu_scripts/pull/824).
- godrja [made Winget custom completions fixes](https://github.com/nushell/nu_scripts/pull/823).
- sholderbach [added `nu_plugin_polars` as a crate to release](https://github.com/nushell/nu_scripts/pull/814).

## reedline

- sholderbach [removed debug print](https://github.com/nushell/reedline/pull/784).
- sigoden [fixed unexpected spaces after large buffer input](https://github.com/nushell/reedline/pull/783).
- maxomatic458 [fixed ide menu not reporting correct required_lines](https://github.com/nushell/reedline/pull/781).
- bew [properly fixed the logic around prompt re-use & Host Command handling](https://github.com/nushell/reedline/pull/770).
