# This week in Nushell #132

## Nushell

- elferherrera fixed [partial completions bug](https://github.com/nushell/nushell/pull/4728), and added [partial completions](https://github.com/nushell/nushell/pull/4704), and [dataframe list command](https://github.com/nushell/nushell/pull/4681), and [Polars upgrade](https://github.com/nushell/nushell/pull/4665), and [flags for find](https://github.com/nushell/nushell/pull/4663), and [menu keybindings in default file](https://github.com/nushell/nushell/pull/4651), and [Plugins without file](https://github.com/nushell/nushell/pull/4650), and [Find with regex flag](https://github.com/nushell/nushell/pull/4649)
- fdncred fixed [match is now in the find command](https://github.com/nushell/nushell/pull/4727), and [remove some old documentation, relocate others](https://github.com/nushell/nushell/pull/4726), and [add windows build script](https://github.com/nushell/nushell/pull/4720), and [removed decode from pipeline for vivid](https://github.com/nushell/nushell/pull/4688), and [relocate default config in sample_config folder](https://github.com/nushell/nushell/pull/4678), and [add last exit code to starship parameters](https://github.com/nushell/nushell/pull/4670), and [add char separators](https://github.com/nushell/nushell/pull/4667)
- jt [moved $scope variable into $nu variable](https://github.com/nushell/nushell/pull/4725), and [Move old plugins](https://github.com/nushell/nushell/pull/4721), and [Remove the pack-in plugins](https://github.com/nushell/nushell/pull/4719), and [Add support for escape characters, make nuon a JSON superset](https://github.com/nushell/nushell/pull/4706), and [Make sure we have text before json parse](https://github.com/nushell/nushell/pull/4697), and [Experiment: Allow both $true/true and $false/false](https://github.com/nushell/nushell/pull/4696), and [Pass redirects into call](https://github.com/nushell/nushell/pull/4694), and [Bump to 0.59.1](https://github.com/nushell/nushell/pull/4689), and [Move to latest stable crossterm, with fix](https://github.com/nushell/nushell/pull/4684), and [Add binary literals](https://github.com/nushell/nushell/pull/4680), and [Fix open ended ranges](https://github.com/nushell/nushell/pull/4677), and [Use default_config.nu by default](https://github.com/nushell/nushell/pull/4675), and [Add back in default keybindings](https://github.com/nushell/nushell/pull/4673), and [don't use table compaction in to nuon if not a table](https://github.com/nushell/nushell/pull/4671), and [Add shortcircuiting boolean operators](https://github.com/nushell/nushell/pull/4668), and [Lets internals also have exit codes](https://github.com/nushell/nushell/pull/4664)
- hustcer [fixed typo, update some examples and regenerate docs](https://github.com/nushell/nushell/pull/4718), and [Update some examples and docs](https://github.com/nushell/nushell/pull/4682), and [Fix unsupported type message for some math related commands](https://github.com/nushell/nushell/pull/4672)
- dgalbraith [added installation instructions using Chocolatey](https://github.com/nushell/nushell/pull/4714)
- wingertge [added aliases to command completions](https://github.com/nushell/nushell/pull/4708), and [Fix aliases to known externals](https://github.com/nushell/nushell/pull/4707), and [Add completion options for custom completions](https://github.com/nushell/nushell/pull/4674)
- dreilly [added tab indentation option for JSON files.](https://github.com/nushell/nushell/pull/4705)
- m-rutter [documented environment variable for starship prompt](https://github.com/nushell/nushell/pull/4691)
- kubouch fixed [use Nushell's PATH in which](https://github.com/nushell/nushell/pull/4690)
- ohno418 [added `into duration`](https://github.com/nushell/nushell/pull/4683)
- lucatrv [fixed alias in `docs/sample_config/config.toml`](https://github.com/nushell/nushell/pull/4669)
- jmoore34 added [date parse refactor](https://github.com/nushell/nushell/pull/4661)
- sholderbach [updated reedline, revert crossterm](https://github.com/nushell/nushell/pull/4657), and [Add profiling build profile and symbol strip](https://github.com/nushell/nushell/pull/4630)
- LordMZTE [added LAST_EXIT_CODE variable](https://github.com/nushell/nushell/pull/4655)

## Documentation

- fdncred [added 3rd party prompts and theming to the book](https://github.com/nushell/nushell.github.io/pull/251), and [tweak the last two git log commands](https://github.com/nushell/nushell.github.io/pull/244), and [update git log](https://github.com/nushell/nushell.github.io/pull/243), and [updates to the cookbook](https://github.com/nushell/nushell.github.io/pull/242), and [unfix pipes](https://github.com/nushell/nushell.github.io/pull/233), and [Bash and config](https://github.com/nushell/nushell.github.io/pull/232)
- hustcer [updated docs for commands](https://github.com/nushell/nushell.github.io/pull/250), and [Translate table_of_contents to zh_CN from commit #89b037c2d](https://github.com/nushell/nushell.github.io/pull/236)
- dgalbraith [added installation instructions using Chocolatey](https://github.com/nushell/nushell.github.io/pull/249), and [Correct Winget installation instructions](https://github.com/nushell/nushell.github.io/pull/248)
- sebastian-xyz [added german as language](https://github.com/nushell/nushell.github.io/pull/245)
- jt [added the 0.59 post](https://github.com/nushell/nushell.github.io/pull/241), and [Update command docs](https://github.com/nushell/nushell.github.io/pull/240), and [Fix intro example](https://github.com/nushell/nushell.github.io/pull/238), and [Add a few more chapters](https://github.com/nushell/nushell.github.io/pull/237), and [Refresh command docs](https://github.com/nushell/nushell.github.io/pull/231), and [Add creating errors section](https://github.com/nushell/nushell.github.io/pull/230), and [Add modules](https://github.com/nushell/nushell.github.io/pull/229), and [Fix sidebar, add warning](https://github.com/nushell/nushell.github.io/pull/228), and [Copy old book to old_book](https://github.com/nushell/nushell.github.io/pull/227), and [WIP: updating for the 0.60 release](https://github.com/nushell/nushell.github.io/pull/220)
- elferherrera [removed column from dfr list](https://github.com/nushell/nushell.github.io/pull/235)
- stormasm added [small fixes in environment.md](https://github.com/nushell/nushell.github.io/pull/234)
- DawnMagnet [update README.md with Chinese Translations](https://github.com/nushell/nushell.github.io/pull/226), and [Update README.md with more Chinese Translations](https://github.com/nushell/nushell.github.io/pull/225)

## Nu_Scripts

- wingertge [fixed winget completions](https://github.com/nushell/nu_scripts/pull/171), and [Parse winget output to structured in more cases](https://github.com/nushell/nu_scripts/pull/165)
- efx [ported git_gone to 0.60 era syntax](https://github.com/nushell/nu_scripts/pull/170)
- ZetaNumbers [added completions for cargo packages](https://github.com/nushell/nu_scripts/pull/169)
- fdncred [removed some unnecessary code](https://github.com/nushell/nu_scripts/pull/168), and [add exit status to oh-my.nu](https://github.com/nushell/nu_scripts/pull/167), and [tweak git completions](https://github.com/nushell/nu_scripts/pull/166)

## reedline

- elferherrera [updated values after common string](https://github.com/nushell/reedline/pull/332), and [Partial completions](https://github.com/nushell/reedline/pull/331), and [partial completions for menu](https://github.com/nushell/reedline/pull/330)
- jt added a [better crossterm fix](https://github.com/nushell/reedline/pull/329), and [Move to crossterm on git](https://github.com/nushell/reedline/pull/328)
- sholderbach created [Use chars in `str::replace` where applicable](https://github.com/nushell/reedline/pull/327), and [Revert crossterm: key modifier issue on win](https://github.com/nushell/reedline/pull/326), and [Provide cursor position for highlighting](https://github.com/nushell/reedline/pull/324), and [Add event to keybind a command in the hosting app](https://github.com/nushell/reedline/pull/323)
