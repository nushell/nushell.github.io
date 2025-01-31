# This week in Nushell #189

## Nushell

- stormasm [added LICENSE to nu-std](https://github.com/nushell/nushell/pull/8803)
- fdncred [made inlays show type instead of shape](https://github.com/nushell/nushell/pull/8801), and [Update .gitignore](https://github.com/nushell/nushell/pull/8717)
- jt [fixed parser recovery after error](https://github.com/nushell/nushell/pull/8798), and [Refactor to support multiple parse errors](https://github.com/nushell/nushell/pull/8765), and [Add atuin to official support](https://github.com/nushell/nushell/pull/8757), and [Add IDE support](https://github.com/nushell/nushell/pull/8745)
- kubouch [removed old alias implementation](https://github.com/nushell/nushell/pull/8797), and [Remove parser keywords label from commands that do not need it](https://github.com/nushell/nushell/pull/8780), and [Aliasing math expression shows error earlier](https://github.com/nushell/nushell/pull/8779), and [Allow multi-word aliases](https://github.com/nushell/nushell/pull/8777)
- amtoine created [FEATURE: make the link in the `ansi` extra usage an ANSI link](https://github.com/nushell/nushell/pull/8795), and [add the standard `help` to the prelude as `std help ...`](https://github.com/nushell/nushell/pull/8794), and [FIX: load the library before anything else](https://github.com/nushell/nushell/pull/8774), and [stdlib: make the library a standalone crate](https://github.com/nushell/nushell/pull/8770), and [refactor the `ansi` help page](https://github.com/nushell/nushell/pull/8713), and [FEATURE: better `ansi -e` error ](https://github.com/nushell/nushell/pull/8709), and [add a cross platform `clip` command to the standard library](https://github.com/nushell/nushell/pull/8695), and [stdlib: add an automatic loading of "prelude" commands](https://github.com/nushell/nushell/pull/8627), and [standard library: implement `help` commands with `$nu`](https://github.com/nushell/nushell/pull/8505)
- ito-hiroki [fixed `config {nu,env}` to open `$nu.{config,env}-file`](https://github.com/nushell/nushell/pull/8792), and [Change default config to display failed LAST_EXIT_CODE](https://github.com/nushell/nushell/pull/8735)
- pingiun [added $nu.current-exe variable](https://github.com/nushell/nushell/pull/8789), and [Add ppid example for ps](https://github.com/nushell/nushell/pull/8768), and [Add ppid to ps command](https://github.com/nushell/nushell/pull/8750)
- presidento created [Stdlib: use default color for info log level](https://github.com/nushell/nushell/pull/8766), and [stdlib: add `assert skip` command to skip test case](https://github.com/nushell/nushell/pull/8748)
- Jan9103 [updated some `help` examples](https://github.com/nushell/nushell/pull/8759)
- sholderbach created [Bump to `0.78.1` development version](https://github.com/nushell/nushell/pull/8741), and [Pin `reedline` to `0.18.0` release](https://github.com/nushell/nushell/pull/8728), and [Fix rest of license year ranges](https://github.com/nushell/nushell/pull/8727), and [Remove unused `atty` dep in `nu-table`](https://github.com/nushell/nushell/pull/8716), and [Bump version to `0.78.0`](https://github.com/nushell/nushell/pull/8715), and [Fix two stable `clippy` lints](https://github.com/nushell/nushell/pull/8712)
- dependabot[bot] created [Bump spin from 0.9.5 to 0.9.8](https://github.com/nushell/nushell/pull/8730), and [Bump git2 from 0.16.1 to 0.17.0](https://github.com/nushell/nushell/pull/8722), and [Bump windows from 0.46.0 to 0.48.0](https://github.com/nushell/nushell/pull/8721), and [Bump miette from 5.6.0 to 5.7.0](https://github.com/nushell/nushell/pull/8720), and [Bump tempfile from 3.4.0 to 3.5.0](https://github.com/nushell/nushell/pull/8719)
- 1Kinoti created [make `str index-of -r` use ranges](https://github.com/nushell/nushell/pull/8724), and [make `bytes at` use ranges](https://github.com/nushell/nushell/pull/8710)
- harshalchaudhari35 created [Fix(tests/nu-command): remove unnecessary cwd() and pipeline(), etc](https://github.com/nushell/nushell/pull/8711)
- fnordpig [added regex separators for split row/list/column](https://github.com/nushell/nushell/pull/8707)
- WindSoilder created [Loops return external stream when external command failed.](https://github.com/nushell/nushell/pull/8646)
- StevenDoesStuffs [allowed NU_LIBS_DIR and friends to be const](https://github.com/nushell/nushell/pull/8538)
- Phreno [added section on removing ANSI sequences with find command](https://github.com/nushell/nushell/pull/8519)
- tcoratger created [Correction bug multiple dots mkdir and touch](https://github.com/nushell/nushell/pull/8486)
- NotLebedev created [Std xml utils](https://github.com/nushell/nushell/pull/8437)
- bobhy created [range operator accepts bot..=top as well as bot..top](https://github.com/nushell/nushell/pull/8382)

## Extension

- fdncred created [add some badges to the readme](https://github.com/nushell/vscode-nushell-lang/pull/87)

## Documentation

- efulleratindeed created [Fix syntax error in blog post](https://github.com/nushell/nushell.github.io/pull/865)
- hustcer created [Update some docs for nu v0.78](https://github.com/nushell/nushell.github.io/pull/863), and [Refresh commands' docs for nu v0.78](https://github.com/nushell/nushell.github.io/pull/859), and [fix #850, make `make_docs.nu` work for nu v0.77.2+](https://github.com/nushell/nushell.github.io/pull/851)
- harrysarson created [use || in closures when configuring prompt](https://github.com/nushell/nushell.github.io/pull/862)
- pingiun created [Remove deprecated str lpad from examples](https://github.com/nushell/nushell.github.io/pull/861), and [Update environment.md](https://github.com/nushell/nushell.github.io/pull/860), and [Remove mention of 'env' command in environment.md](https://github.com/nushell/nushell.github.io/pull/854), and [Remove old 'env' command from configuration section](https://github.com/nushell/nushell.github.io/pull/853)
- fdncred created [Update 2023-04-04-nushell_0_78.md](https://github.com/nushell/nushell.github.io/pull/857)
- sholderbach created [Fix the use of comments](https://github.com/nushell/nushell.github.io/pull/856), and [Release notes for nushell `0.78`](https://github.com/nushell/nushell.github.io/pull/830)
- amtoine created [add a note about #8189 to the 0.77 release](https://github.com/nushell/nushell.github.io/pull/855), and [add a note about better `error make`](https://github.com/nushell/nushell.github.io/pull/849), and [add #8366 to the release notes](https://github.com/nushell/nushell.github.io/pull/848)

## Nu_Scripts

- fdncred created [fix some quoting bugs that the lsp found](https://github.com/nushell/nu_scripts/pull/441), and [replace occurences of `str collect` with `str join`](https://github.com/nushell/nu_scripts/pull/436)
- fnuttens created [Add exa aliases](https://github.com/nushell/nu_scripts/pull/440)
- Tiggax created [Fixed support for env files](https://github.com/nushell/nu_scripts/pull/439)
- fj0r created [upgrade to 0.78: git, ssh, docker, kubernetes](https://github.com/nushell/nu_scripts/pull/438), and [add parameters default value to just's completion and `j` for shortcut](https://github.com/nushell/nu_scripts/pull/435)
- amtoine created [rewrite the theme generation](https://github.com/nushell/nu_scripts/pull/437)
- WindSoilder created [Replace `str collect` with `str join`](https://github.com/nushell/nu_scripts/pull/434)
- jt created [Update TWiN and since last release to 0.78](https://github.com/nushell/nu_scripts/pull/433)

## reedline

- sholderbach created [Bump version for `0.18.0` release](https://github.com/nushell/reedline/pull/564)
