# This week in Nushell #155

## Nushell

- rgwood [clarified external command error](https://github.com/nushell/nushell/pull/6308), and [Fix unused import warning on Linux+Mac](https://github.com/nushell/nushell/pull/6281), and [Temporary: ignore Windows tests that fail on a local machine](https://github.com/nushell/nushell/pull/6279), and [Support running batch files without typing their extension](https://github.com/nushell/nushell/pull/6278), and [Clean up deprecated commands](https://github.com/nushell/nushell/pull/6260), and [Suggest alternative when command not found](https://github.com/nushell/nushell/pull/6256)
- fdncred [made ci use rust-toolchain.toml](https://github.com/nushell/nushell/pull/6305), and [add rust toolchain file to pin rust version](https://github.com/nushell/nushell/pull/6298), and [update build scripts](https://github.com/nushell/nushell/pull/6296), and [Revert "Allow using the system's copy of zstd for Polars"](https://github.com/nushell/nushell/pull/6292), and [update a few nushell dependencies](https://github.com/nushell/nushell/pull/6291), and [remove sharkdp's lscolors repo again](https://github.com/nushell/nushell/pull/6290), and [add search terms to ignore command](https://github.com/nushell/nushell/pull/6288), and [bump lscolors to v12.0](https://github.com/nushell/nushell/pull/6272), and [escape single quotes and remove ansi escape sequences](https://github.com/nushell/nushell/pull/6271), and [new command `into sqlite` allows you to take lists and create a sqlite database](https://github.com/nushell/nushell/pull/6266), and [add more verbose error messages to mv](https://github.com/nushell/nushell/pull/6259)
- WindSoilder created [not resolve symlink](https://github.com/nushell/nushell/pull/6304), and [when spawned process during register plugin, pass env to child process](https://github.com/nushell/nushell/pull/6261), and [add -n for path expand, so it doesn't follow symlink](https://github.com/nushell/nushell/pull/6255)
- elferherrera created [Polars upgrade 0.23](https://github.com/nushell/nushell/pull/6303)
- kubouch [allowed overlays to import prefixed definitions](https://github.com/nushell/nushell/pull/6301)
- sholderbach created [Clippy fix for Rust 1.63](https://github.com/nushell/nushell/pull/6299)
- nibon7 [added custom log target to debugging tips](https://github.com/nushell/nushell/pull/6293), and [Fix panic when building without git](https://github.com/nushell/nushell/pull/6289), and [Fix color settings for logger](https://github.com/nushell/nushell/pull/6285), and [Return error when moving a source directory to a target directory whi…](https://github.com/nushell/nushell/pull/6284), and [Replace pretty_env_logger with simplelog](https://github.com/nushell/nushell/pull/6274), and [Refactor shell listing related code](https://github.com/nushell/nushell/pull/6262), and [Refactor shell switching related code](https://github.com/nushell/nushell/pull/6258)
- jt [fixed intermittent test crash](https://github.com/nushell/nushell/pull/6268), and [bump dev version ahead of language changes](https://github.com/nushell/nushell/pull/6267)
- winterqt created [Allow using the system's copy of zstd for Polars](https://github.com/nushell/nushell/pull/6232)

## Extension

- fdncred created [one last tweak before release](https://github.com/nushell/vscode-nushell-lang/pull/58), and [prepare for new release](https://github.com/nushell/vscode-nushell-lang/pull/57)
- Yethal created [Updated patterns and added generation script](https://github.com/nushell/vscode-nushell-lang/pull/54)

## Documentation

- johnae created [Update config.js/cookbook with direnv example](https://github.com/nushell/nushell.github.io/pull/555), and [Create direnv.md](https://github.com/nushell/nushell.github.io/pull/554)

## Nu_Scripts

- fantasyzhjk created [add rbenv script](https://github.com/nushell/nu_scripts/pull/274)
- johnae created [Add direnv config example.](https://github.com/nushell/nu_scripts/pull/272)

## reedline

- morzel85 created [Ctrl+h edit binding moved from emacs to common](https://github.com/nushell/reedline/pull/461)
