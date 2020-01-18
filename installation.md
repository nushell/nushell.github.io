---
layout: doc
title: Installation
---

This is just a short description of how you can install Nu.
There is an installation guide offering more detailed documentation on how to install Nu.
It is available in different languages:
[English](https://book.nushell.sh/en/installation),
[Español](https://book.nushell.sh/es/instalacion),
[Português do Brasil](https://book.nushell.sh/pt-br/instalacao) and
[日本語](https://book.nushell.sh/ja/installation).

# Pre-built binaries

## Windows

**Please Note:** Nu works on Windows 10 and does not currently have Windows 7/8.1 support.

Download the current released `.zip`-file from the [release page](https://github.com/nushell/nushell/releases)
and extract it, for example, to:

```
C:\Program Files
```

And then add the folder of `nu` to your `PATH`.
Once we have done that, we can run Nu using the `nu` command:

```
> nu
C:\Users\user>
```

## macOS

You can download Nu pre-built from the [release page](https://github.com/nushell/nushell/releases).

## Homebrew

If you use [Homebrew](https://brew.sh/) on macOS or Linux, you can install the binary by running

```shell
> brew install nushell
```

## Docker containers

If you want to pull a pre-built container, you can browse tags for the
[nushell organization](https://quay.io/organization/nushell) on Quay.io.
Pulling a container would come down to:

```bash
$ docker pull quay.io/nushell/nu
$ docker pull quay.io/nushell/nu-base
```

Both "nu-base" and "nu" provide the `nu` binary, however nu-base also includes the source code at `/code`
in the container and all dependencies.

Optionally, you can also build the containers locally using the
[dockerfiles provided](https://github.com/nushell/nushell/tree/master/docker).
To build the base image:

```bash
$ docker build -f docker/Dockerfile.nu-base -t nushell/nu-base .
``` 

And then to build the smaller container (using a Multistage build):

```bash
$ docker build -f docker/Dockerfile -t nushell/nu .
``` 

Either way, you can run either container as follows:

```bash
$ docker run -it nushell/nu-base
$ docker run -it nushell/nu
/> exit
```

The second container is a bit smaller, if size is important to you.

# Building it locally

To build Nu, you will need to use the **latest stable (1.39 or later)** version of the compiler.

For Rust to work properly, you'll need to have a compatible compiler suite installed on your system.
These are the recommended compiler suites:

* Linux: GCC or Clang
* macOS: Clang (install Xcode)
* Windows: [Visual Studio Community Edition](https://visualstudio.microsoft.com/vs/community/)
  (make sure to install the "C++ build tools")

### Required dependencies:

* pkg-config and libssl (only needed on Linux)  
  ➜ on Debian/Ubuntu: `apt install pkg-config libssl-dev`  
  ➜ on macOS: `brew install openssl cmake`

### Optional dependencies:

* To use Nu with all possible optional features enabled, you'll also need the following:  
  ➜ on Linux (on Debian/Ubuntu): `apt install libxcb-composite0-dev libx11-dev`

## Installing from crates.io

To install Nu via cargo (make sure you have installed [rustup](https://rustup.rs/)
and the latest stable compiler via `rustup install stable`):

```
cargo install nu
```

You can also install Nu with all the bells and whistles (be sure to have installed the
[dependencies](https://book.nushell.sh/en/installation#dependencies) for your platform):

```
cargo install nu --features=stable
```

## Building from source

We can also build our own Nu from source directly from GitHub.
This gives us immediate access to the latest Nu features and bug fixes.

```
> git clone https://github.com/nushell/nushell.git
```

Git will clone the main nushell repo for us.
From there, we can build and run Nu if we are using `rustup` with:

```
> cd nushell
nushell> cargo build --features=stable && cargo run --features=stable
```

You can also build and run Nu in release mode:

```
nushell> cargo build --release && cargo run --release
```

People familiar with Rust may wonder why we do both a "build" and a "run" step if "run" does a build by default.
This is to get around a shortcoming of the new `default-run` option in Cargo,
and ensure that all plugins are built, though this may not be required in the future.
