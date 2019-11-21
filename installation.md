---
layout: doc
title: Installation
---

This is just a short description of how you can install Nu. There is better documented [installation guide](https://book.nushell.sh/en/installation) in our book which is covering much more ways and possibilties.

## Local

To build Nu, you will need to use the **latest stable (1.39 or later)** version of the compiler.

Required dependencies:

* pkg-config and libssl (only needed on Linux)
  * on Debian/Ubuntu: `apt install pkg-config libssl-dev`

Optional dependencies:

* To use Nu with all possible optional features enabled, you'll also need the following:
  * on Linux (on Debian/Ubuntu): `apt install libxcb-composite0-dev libx11-dev`

To install Nu via cargo (make sure you have installed [rustup](https://rustup.rs/) and the latest stable compiler via `rustup install stable`):

```
cargo install nu
```

You can also install Nu with all the bells and whistles (be sure to have installed the [dependencies](https://book.nushell.sh/en/installation#dependencies) for your platform):

```
cargo install nu --all-features
```

## Pre-built binaries

### Windows

**Please Note:** Nu works on Windows 10 and does not currently have Windows 7/8.1 support.

Download the current released `.zip`-file from the [release page](https://github.com/nushell/nushell/releases) and extract it for example to:

```
C:\Program Files
```

And then add the folder of `nu` to your PATH. Once we have done that, we can run Nu using the `nu` command:

```
> nu
C:\Users\user>
```

### Docker

If you want to pull a pre-built container, you can browse tags for the [nushell organization](https://quay.io/organization/nushell)
on Quay.io. Pulling a container would come down to:

```bash
$ docker pull quay.io/nushell/nu
$ docker pull quay.io/nushell/nu-base
```

Both "nu-base" and "nu" provide the nu binary, however nu-base also includes the source code at `/code`
in the container and all dependencies.

Optionally, you can also build the containers locally using the [dockerfiles provided](docker):
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

The second container is a bit smaller if the size is important to you.