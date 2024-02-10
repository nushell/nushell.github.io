---
title: Parsing
---

# Parsing

_Nu_ offers the ability to do some basic parsing, with different ways to achieve the same goal.

Builtin-functions that can be used include:

- `lines`
- `detect columns`
- `parse`
- `str ...`
- `from ssv`

A few illustrative examples follow.

## Examples (tabular output)

### `detect columns` (pretty automatic)

```nushell
df -h | str replace "Mounted on" Mounted_On | detect columns
```

**Output**:

```
╭────┬───────────────────────────────────┬──────┬──────┬───────┬──────┬────────────────────────────────────╮
│  # │            Filesystem             │ Size │ Used │ Avail │ Use% │             Mounted_On             │
├────┼───────────────────────────────────┼──────┼──────┼───────┼──────┼────────────────────────────────────┤
│  0 │ devtmpfs                          │ 3.2G │ 0    │ 3.2G  │ 0%   │ /dev                               │
│  1 │ tmpfs                             │ 32G  │ 304M │ 32G   │ 1%   │ /dev/shm                           │
│  2 │ tmpfs                             │ 16G  │ 11M  │ 16G   │ 1%   │ /run                               │
│  3 │ tmpfs                             │ 32G  │ 1.2M │ 32G   │ 1%   │ /run/wrappers                      │
│  4 │ /dev/nvme0n1p2                    │ 129G │ 101G │ 22G   │ 83%  │ /                                  │
│  5 │ /dev/nvme0n1p8                    │ 48G  │ 16G  │ 30G   │ 35%  │ /var                               │
│  6 │ efivarfs                          │ 128K │ 24K  │ 100K  │ 20%  │ /sys/firmware/efi/efivars          │
│  7 │ tmpfs                             │ 32G  │ 41M  │ 32G   │ 1%   │ /tmp                               │
│  9 │ /dev/nvme0n1p3                    │ 315G │ 230G │ 69G   │ 77%  │ /home                              │
│ 10 │ /dev/nvme0n1p1                    │ 197M │ 120M │ 78M   │ 61%  │ /boot                              │
│ 11 │ /dev/mapper/vgBigData-lvBigData01 │ 5.5T │ 4.1T │ 1.1T  │ 79%  │ /bigdata01                         │
│ 12 │ tmpfs                             │ 1.0M │ 4.0K │ 1020K │ 1%   │ /run/credentials/nix-serve.service │
│ 13 │ tmpfs                             │ 6.3G │ 32M  │ 6.3G  │ 1%   │ /run/user/1000                     │
╰────┴───────────────────────────────────┴──────┴──────┴───────┴──────┴────────────────────────────────────╯
```

For an output like from `df` this is probably the most compact way to achieve a nice tabular output.
The `str replace` is needed here because one of the column headers has a space in it.

### Using `from ssv`

Also the builtin `from` data parser for `ssv` (*s*pace *s*eparated *v*alues) can be used:

```nushell
df -h | str replace "Mounted on" Mounted_On | from ssv --aligned-columns --minimum-spaces 1
```

The output is identical to the previous example.

`from ssv` supports several modifying flags to tweak its behaviour.

Note we still need to fix the column headers if they contain unexpected spaces.

### Using `parse`

How to parse an arbitrary pattern from a string of text into a multi-column table.

```nushell
cargo search shells --limit 10 | lines | parse "{crate_name} = {version} #{description}" | str trim
```

**Output**:

```
───┬──────────────┬─────────────────┬────────────────────────────────────────────────────────────────────────────────
 # │  crate_name  │     version     │                                  description
───┼──────────────┼─────────────────┼────────────────────────────────────────────────────────────────────────────────
 0 │ shells       │ "0.2.0"         │ Sugar-coating for invoking shell commands directly from Rust.
 1 │ pyc-shell    │ "0.3.0"         │ Pyc is a simple CLI application, which allows you to perform shell commands in
   │              │                 │ cyrillic and other a…
 2 │ ion-shell    │ "0.0.0"         │ The Ion Shell
 3 │ sheldon      │ "0.6.6"         │ Fast, configurable, shell plugin manager.
 4 │ nu           │ "0.44.0"        │ A new type of shell
 5 │ git-gamble   │ "2.3.0"         │ blend TCR + TDD to make sure to develop the right thing, babystep by babystep
 6 │ martin       │ "1.0.0-alpha.0" │ Blazing fast and lightweight PostGIS vector tiles server
 7 │ fnm          │ "1.29.2"        │ Fast and simple Node.js version manager
 8 │ remote_shell │ "2.0.0"         │ remote shell written by rust.
 9 │ sauce        │ "0.6.6"         │ A tool for managing directory-specific state.
───┴──────────────┴─────────────────┴────────────────────────────────────────────────────────────────────────────────
```
