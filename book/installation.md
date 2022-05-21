# Installing Nu

There are lots of ways to get Nu up and running. You can download pre-built binaries from our [release page](https://github.com/nushell/nushell/releases), [use your favourite package manager](https://repology.org/project/nushell/versions), or build from source.

## Pre-built binaries

Nu binaries are published for Linux, macOS, and Windows [with each GitHub release](https://github.com/nushell/nushell/releases). Just download, extract the binaries, then copy them to a location on your PATH.

## Package managers

Nu is available via several package managers:

[![Packaging status](https://repology.org/badge/vertical-allrepos/nushell.svg)](https://repology.org/project/nushell/versions)

For macOS and Linux, [Homebrew](https://brew.sh/) is a popular choice (`brew install nushell`).

For Windows:

- [Winget](https://docs.microsoft.com/en-us/windows/package-manager/winget/) (`winget install nushell`)
- [Chocolatey](https://chocolatey.org/) (`choco install nushell`)
- [Scoop](https://scoop.sh/) (`scoop install nu`)

## Build from source

You can also build Nu from source. First, you will need to set up the Rust toolchain and its dependencies.

### Installing a compiler suite

For Rust to work properly, you'll need to have a compatible compiler suite installed on your system. These are the recommended compiler suites:

- Linux: GCC or Clang
- macOS: Clang (install Xcode)
- Windows: MSVC (install [Visual Studio](https://visualstudio.microsoft.com/vs/community/) or the [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022))
  - Make sure to install the "Desktop development with C++" workload
  - Any Visual Studio edition will work (Community is free)

### Installing Rust

If we don't already have Rust on our system, the best way to install it is via [rustup](https://rustup.rs/). Rustup is a way of managing Rust installations, including managing using different Rust versions.

Nu currently requires the **latest stable (1.60 or later)** version of Rust. The best way is to let `rustup` find the correct version for you. When you first open `rustup` it will ask what version of Rust you wish to install:

<<< @/snippets/installation/rustup_choose_rust_version.sh

Once we are ready, we press 1 and then enter.

If you'd rather not install Rust via `rustup`, you can also install it via other methods (e.g. from a package in a Linux distro). Just be sure to install a version of Rust that is 1.60 or later.

### Dependencies

#### Debian/Ubuntu

You will need to install the "pkg-config" and "libssl-dev" package:

<<< @/snippets/installation/install_pkg_config_libssl_dev.sh

Linux users who wish to use the `rawkey` or `clipboard` optional features will need to install the "libx11-dev" and "libxcb-composite0-dev" packages:

<<< @/snippets/installation/use_rawkey_and_clipboard.sh

#### RHEL based distros

You will need to install "libxcb", "openssl-devel" and "libX11-devel":

<<< @/snippets/installation/install_rhel_dependencies.sh

#### macOS

Using [Homebrew](https://brew.sh/), you will need to install "openssl" and "cmake" using:

<<< @/snippets/installation/macos_deps.sh

### Build using [crates.io](https://crates.io)

Nu releases are published as source to the popular Rust package registry [crates.io](https://crates.io/). This makes it easy to build+install the latest Nu release with `cargo`:

<<< @/snippets/installation/cargo_install_nu.sh

That's it! The `cargo` tool will do the work of downloading Nu and its source dependencies, building it, and installing it into the cargo bin path so we can run it.

If you want to install with more features, you can use:

<<< @/snippets/installation/cargo_install_nu_more_features.sh

Once installed, we can run Nu using the `nu` command:

<<< @/snippets/installation/crates_run_nu.sh

### Building from the GitHub repository

We can also build our own Nu from the latest source on GitHub. This gives us immediate access to the latest features and bug fixes. First, clone the repo:

<<< @/snippets/installation/git_clone_nu.sh

From there, we can build and run Nu with:

<<< @/snippets/installation/build_nu_from_source.sh

You can also build and run Nu in release mode:

<<< @/snippets/installation/build_nu_from_source_release.sh

People familiar with Rust may wonder why we do both a "build" and a "run" step if "run" does a build by default. This is to get around a shortcoming of the new `default-run` option in Cargo, and ensure that all plugins are built, though this may not be required in the future.

## Setting the login shell (\*nix)

**!!! Nu is still in development, and may not be stable for everyday use. !!!**

To set the login shell you can use the [`chsh`](https://linux.die.net/man/1/chsh) command.
Some Linux distributions have a list of valid shells located in `/etc/shells` and will disallow changing the shell until Nu is in the whitelist. You may see an error similar to the one below if you haven't updated the `shells` file:

<<< @/snippets/installation/chsh_invalid_shell_error.sh

You can add Nu to the list of allowed shells by appending your Nu binary to the `shells` file.
The path to add can be found with the command `which nu`, usually it is `$HOME/.cargo/bin/nu`.

## Setting the default shell (Windows Terminal)

If you are using [Windows Terminal](https://github.com/microsoft/terminal) you can set `nu` as your default shell by adding:

<<< @/snippets/installation/windows_terminal_default_shell.sh

to `"profiles"` in your Terminal Settings (JSON-file). The last thing to do is to change the `"defaultProfile"` to:

<<< @/snippets/installation/windows_change_default_profile.sh

Now, `nu` should load on startup of the Windows Terminal.
