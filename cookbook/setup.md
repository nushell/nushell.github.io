---
title: Setup
---

# Setup

To get the most out of nu, it is important to setup your path and env for easy access.
There are other ways to view these values and variables, however setting up your nu configuration will make it much easier as these have cross-platform support.

---

### Configure your path and other environment variables

In order to configure your path in nushell you'll need to modify your `PATH` environment variable in your `config.nu` file. Open your `config.nu` file and put an entry in it like `let-env PATH = "path1;path2;path3"` ensuring that you use the proper path separation character, which is different by platform.

Alternately, if you want to change your path temporarily, you can do the same command at the prompt.

If you want to append a folder to your `PATH` environment variable you can do that too using the `append` or `prepend` command like this:

```shell
> let-env PATH = ($env.PATH | append "some/other/path")
```

For more detailed instructions, see the environment variables documentation [here](/book/environment.html#setting-environment-variables)

### How to list your environment variables

```shell
> $env
```

Output

```
─────────────────────────────────┬────────────────────────────────────────────
 ALLUSERSPROFILE                 │ C:\ProgramData
 CARGO_PKG_AUTHORS               │ The Nu Project Contributors
 CARGO_PKG_DESCRIPTION           │ A new type of shell
 CARGO_PKG_HOMEPAGE              │ https://www.nushell.sh
 CARGO_PKG_LICENSE               │ MIT
 CARGO_PKG_LICENSE_FILE          │
 CARGO_PKG_NAME                  │ nu
 CARGO_PKG_REPOSITORY            │ https://github.com/nushell/nushell
 CARGO_PKG_VERSION               │ 0.59.0
 CARGO_PKG_VERSION_MAJOR         │ 0
```

or for a more detailed view, use our new `env` command.

```shell
> env
```

Output

```
────┬─────────────────────────────┬─────────────────────────────┬─────────────────────────────┬──────────────────────────────
 #  │            name             │            type             │            value            │             raw
────┼─────────────────────────────┼─────────────────────────────┼─────────────────────────────┼──────────────────────────────
  0 │ ALLUSERSPROFILE             │ string                      │ C:\ProgramData              │ C:\ProgramData
  1 │ APPDATA                     │ string                      │ C:\Users\someuser10\AppData │ C:\Users\someuser10\AppData
    │                             │                             │ \Roaming                    │ \Roaming
  2 │ CARGO                       │ string                      │ \\?\C:\Users\someuser10\.ru │ \\?\C:\Users\someuser10\.ru
    │                             │                             │ stup\toolchains\stable-x86_ │ stup\toolchains\stable-x86_
    │                             │                             │ 64-pc-windows-msvc\bin\carg │ 64-pc-windows-msvc\bin\carg
    │                             │                             │ o.exe                       │ o.exe
  3 │ CARGO_HOME                  │ string                      │ C:\Users\someuser10\.cargo  │ C:\Users\someuser10\.cargo
  4 │ CARGO_MANIFEST_DIR          │ string                      │ C:\Users\someuser10\source\ │ C:\Users\someuser10\source\
    │                             │                             │ repos\forks\nushell         │ repos\forks\nushell
  5 │ CARGO_PKG_AUTHORS           │ string                      │ The Nu Project Contributors │ The Nu Project Contributors
  6 │ CARGO_PKG_DESCRIPTION       │ string                      │ A new type of shell         │ A new type of shell
  7 │ CARGO_PKG_HOMEPAGE          │ string                      │ https://www.nushell.sh      │ https://www.nushell.sh
  8 │ CARGO_PKG_LICENSE           │ string                      │ MIT                         │ MIT
  9 │ CARGO_PKG_LICENSE_FILE      │ string                      │                             │
 10 │ CARGO_PKG_NAME              │ string                      │ nu                          │ nu
 11 │ CARGO_PKG_REPOSITORY        │ string                      │ https://github.com/nushell/ │ https://github.com/nushell/
```

Let's practise that and set `$EDITOR` in our `env.nu` file using `vim` (or an editor of your choice)

```
vim $nu.env-path
```

Note: if you've never used `vim` before and you want to leave typing `:q!` will close without saving.

Go to the end of the file and add

```
let-env EDITOR = vim
```

or `emacs`, `vscode` or whatever editor you like. Don't forget that the program needs to be accessible on the `PATH`
and to reload your configuration with `exec nu` on linux/mac or restart your nushell on windows.

You should now be able to run `config nu` or `config env` and edit those files easily.

---

### How to get a single environment variable's value

```shell
> $env.APPDATA
```

or

```shell
> env | where name == APPDATA
```

```
───┬─────────┬────────┬─────────────────────────────────────┬─────────────────────────────────────
 # │  name   │  type  │                value                │                 raw
───┼─────────┼────────┼─────────────────────────────────────┼─────────────────────────────────────
 0 │ APPDATA │ string │ C:\Users\someuser10\AppData\Roaming │ C:\Users\someuser10\AppData\Roaming
───┴─────────┴────────┴─────────────────────────────────────┴─────────────────────────────────────
```
