# Installing Nu

The best way currently to get Nu up and running is to install from [crates.io](https://crates.io), download pre-built binaries from our [release page](https://github.com/nushell/nushell/releases), or build from source.

## Pre-built binaries

You can download Nu pre-built from the [release page](https://github.com/nushell/nushell/releases). Alternatively, if you use [Homebrew](https://brew.sh/) for macOS, you can install the binary by running `brew install nushell`.

### Windows

**Please note:** Nu works on Windows 10 and does not currently have Windows 7/8.1 support.

Download the current released `.zip`-file from the [release page](https://github.com/nushell/nushell/releases) and extract it for example to:

<<< @/snippets/installation/windows_example_extraction_location.sh

And then add the folder of `nu` to your PATH. Once we have done that, we can run Nu using the `nu` command:

<<< @/snippets/installation/windows_run_nu.sh

If you are using [Windows Terminal](https://github.com/microsoft/terminal) you can set `nu` as your default shell by adding:

<<< @/snippets/installation/windows_terminal_default_shell.sh

to  `"profiles"` in your Terminal Settings (JSON-file). The last thing to do is to change the `"defaultProfile"` to:

<<< @/snippets/installation/windows_change_default_profile.sh

Now, `nu` should load on startup of the Windows Terminal.

## Getting Ready

Before we can install Nu, we need to make sure our system has the necessary requirements. Currently, this means making sure we have both the Rust toolchain and local dependencies installed.

### Installing a compiler suite

For Rust to work properly, you'll need to have a compatible compiler suite installed on your system. These are the recommended compiler suites:

* Linux: GCC or Clang
* macOS: Clang (install Xcode)
* Windows: [Visual Studio Community Edition](https://visualstudio.microsoft.com/vs/community/)

For Windows, when you install Visual Studio Community Edition, make sure to install the "C++ build tools" as what we need is `link.exe` which is provided as part of that optional install.  With that, we're ready to move to the next step.

### Installing Rust

If we don't already have Rust on our system, the best way to install it is via [rustup](https://rustup.rs/). Rustup is a way of managing Rust installations, including managing using different Rust versions. 

Nu currently requires the **latest stable (1.55 or later)** version of Rust. The best way is to let `rustup` find the correct version for you. When you first open `rustup` it will ask what version of Rust you wish to install:

<<< @/snippets/installation/rustup_choose_rust_version.sh

Once we are ready, we press 1 and then enter.

If you'd rather not install Rust via `rustup`, you can also install it via other methods (e.g. from a package in a Linux distro). Just be sure to install a version of Rust that is 1.55 or later.

## Dependencies

### Debian/Ubuntu

You will need to install the "pkg-config" and "libssl-dev" package:

<<< @/snippets/installation/install_pkg_config_libssl_dev.sh

Linux users who wish to use the `rawkey` or `clipboard` optional features will need to install the "libx11-dev" and "libxcb-composite0-dev" packages:

<<< @/snippets/installation/use_rawkey_and_clipboard.sh

### RHEL based distros

You will need to install "libxcb", "openssl-devel" and "libX11-devel":

<<< @/snippets/installation/install_rhel_dependencies.sh

### macOS

Using [Homebrew](https://brew.sh/), you will need to install the "openssl" and "cmake" using: 

<<< @/snippets/installation/macos_deps.sh

## Installing from [crates.io](https://crates.io)

Once we have the dependencies Nu needs, we can install it using the `cargo` command that comes with the Rust compiler.

<<< @/snippets/installation/cargo_install_nu.sh

That's it!  The cargo tool will do the work of downloading Nu and its source dependencies, building it, and installing it into the cargo bin path so that we can run it.

If you want to install with more features, you can use:

<<< @/snippets/installation/cargo_install_nu_more_features.sh

For all the available features, the easiest way is to check out Nu and build it yourself using the same Rust tools:

<<< @/snippets/installation/build_nu_yourself.sh

For this to work, make sure you have all the dependencies (shown above) on your system.

Once installed, we can run Nu using the `nu` command:

<<< @/snippets/installation/crates_run_nu.sh

## Building from source

We can also build our own Nu from source directly from github. This gives us immediate access to the latest Nu features and bug fixes.

<<< @/snippets/installation/git_clone_nu.sh

Git will clone the main nushell repo for us. From there, we can build and run Nu if we are using `rustup` with:

<<< @/snippets/installation/build_nu_from_source.sh

You can also build and run Nu in release mode:

<<< @/snippets/installation/build_nu_from_source_release.sh

People familiar with Rust may wonder why we do both a "build" and a "run" step if "run" does a build by default. This is to get around a shortcoming of the new `default-run` option in Cargo, and ensure that all plugins are built, though this may not be required in the future.

## Setting as your login shell

**!!! Nu is still in development, and may not be stable for everyday use. !!!**

To set the login shell you can use the [`chsh`](https://linux.die.net/man/1/chsh) command.
Some Linux distributions have a list of valid shells located in `/etc/shells` and will disallow changing the shell until Nu is in the whitelist. You may see an error similar to the one below if you haven't updated the `shells` file:

<<< @/snippets/installation/chsh_invalid_shell_error.sh

You can add Nu to the list of allowed shells by appending your Nu binary to the `shells` file.
The path to add can be found with the command `which nu`, usually it is `$HOME/.cargo/bin/nu`.
