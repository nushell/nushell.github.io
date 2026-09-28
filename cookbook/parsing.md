---
title: Parsing
---

# Parsing

*Nu* offers the ability to do some basic parsing, with different ways to achieve the same goal.

Builtin-functions that can be used include:

- `lines`
- `detect columns`
- `parse`
- `str ...`
- `from ssv`

A few illustrative examples follow.

## Examples (tabular output)

### `detect columns` (pretty automatic)

```nu
df -h | str replace "Mounted on" Mounted_On | detect columns
# => ╭────┬───────────────────────────────────┬──────┬──────┬───────┬──────┬────────────────────────────────────╮
# => │  # │            Filesystem             │ Size │ Used │ Avail │ Use% │             Mounted_On             │
# => ├────┼───────────────────────────────────┼──────┼──────┼───────┼──────┼────────────────────────────────────┤
# => │  0 │ devtmpfs                          │ 3.2G │ 0    │ 3.2G  │ 0%   │ /dev                               │
# => │  1 │ tmpfs                             │ 32G  │ 304M │ 32G   │ 1%   │ /dev/shm                           │
# => │  2 │ tmpfs                             │ 16G  │ 11M  │ 16G   │ 1%   │ /run                               │
# => │  3 │ tmpfs                             │ 32G  │ 1.2M │ 32G   │ 1%   │ /run/wrappers                      │
# => │  4 │ /dev/nvme0n1p2                    │ 129G │ 101G │ 22G   │ 83%  │ /                                  │
# => │  5 │ /dev/nvme0n1p8                    │ 48G  │ 16G  │ 30G   │ 35%  │ /var                               │
# => │  6 │ efivarfs                          │ 128K │ 24K  │ 100K  │ 20%  │ /sys/firmware/efi/efivars          │
# => │  7 │ tmpfs                             │ 32G  │ 41M  │ 32G   │ 1%   │ /tmp                               │
# => │  8 │ /dev/nvme0n1p3                    │ 315G │ 230G │ 69G   │ 77%  │ /home                              │
# => │  9 │ /dev/nvme0n1p1                    │ 197M │ 120M │ 78M   │ 61%  │ /boot                              │
# => │ 10 │ /dev/mapper/vgBigData-lvBigData01 │ 5.5T │ 4.1T │ 1.1T  │ 79%  │ /bigdata01                         │
# => │ 11 │ tmpfs                             │ 1.0M │ 4.0K │ 1020K │ 1%   │ /run/credentials/nix-serve.service │
# => │ 12 │ tmpfs                             │ 6.3G │ 32M  │ 6.3G  │ 1%   │ /run/user/1000                     │
# => ╰────┴───────────────────────────────────┴──────┴──────┴───────┴──────┴────────────────────────────────────╯
```

For an output like from `df` this is probably the most compact way to achieve a nice tabular output.
The `str replace` is needed here because one of the column headers has a space in it.
Alternatively, `detect columns --guess` works out the columns from their widths, so it keeps the `Mounted on` header intact without the `str replace`:

```nu
df -h | detect columns --guess
```

### Using `from ssv`

Also the builtin `from` data parser for `ssv` (*s*pace *s*eparated *v*alues) can be used:

```nu
df -h | str replace "Mounted on" Mounted_On | from ssv --aligned-columns --minimum-spaces 1
```

The output is identical to the previous example.

`from ssv` supports several modifying flags to tweak its behaviour.

Note we still need to fix the column headers if they contain unexpected spaces.

### Using `parse`

How to parse an arbitrary pattern from a string of text into a multi-column table.

```nu
cargo search shells --limit 10 | lines | parse "{crate_name} = {version} #{description}" | str trim
# => ╭───┬─────────────────────────┬──────────┬─────────────────────────────────────────────────────────╮
# => │ # │       crate_name        │ version  │                       description                       │
# => ├───┼─────────────────────────┼──────────┼─────────────────────────────────────────────────────────┤
# => │ 0 │ shells                  │ "0.2.0"  │ Sugar-coating for invoking shell commands directly from │
# => │   │                         │          │  Rust.                                                  │
# => │ 1 │ virtiofsd               │ "1.14.0" │ A virtio-fs vhost-user device daemon                    │
# => │ 2 │ hurl                    │ "8.0.1"  │ Hurl, run and test HTTP requests                        │
# => │ 3 │ shell-quote             │ "0.8.0"  │ A Rust library for shell-quoting strings, e.g. for      │
# => │   │                         │          │ interpolating into a Bash script.                       │
# => │ 4 │ coreutils               │ "0.12.0" │ coreutils ~ GNU coreutils (updated); implemented as     │
# => │   │                         │          │ universal (cross-platform) utils, wri…                  │
# => │ 5 │ command-stream          │ "1.1.0"  │ Modern shell command execution library with streaming,  │
# => │   │                         │          │ async iteration, and event support                      │
# => │ 6 │ datafusion-sqllogictest │ "55.1.0" │ DataFusion sqllogictest driver                          │
# => │ 7 │ skim                    │ "5.7.2"  │ Fuzzy Finder in rust!                                   │
# => │ 8 │ bashrs                  │ "7.4.1"  │ Rust-to-Shell transpiler for deterministic bootstrap    │
# => │   │                         │          │ scripts                                                 │
# => │ 9 │ shell-words             │ "1.1.1"  │ Process command line according to parsing rules of UNIX │
# => │   │                         │          │  shell                                                  │
# => ╰───┴─────────────────────────┴──────────┴─────────────────────────────────────────────────────────╯
```
