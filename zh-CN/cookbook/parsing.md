---
title: 解析
---

# 解析

_Nu_ 提供了进行一些基本解析的能力，有多种方法可以实现相同的目标。

可以使用的内置函数包括：

- `lines`
- `detect columns`
- `parse`
- `str ...`
- `from ssv`

下面是一些说明性示例。

## 示例（表格输出）

### `detect columns`（相当地自动化）

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
# => │  9 │ /dev/nvme0n1p3                    │ 315G │ 230G │ 69G   │ 77%  │ /home                              │
# => │ 10 │ /dev/nvme0n1p1                    │ 197M │ 120M │ 78M   │ 61%  │ /boot                              │
# => │ 11 │ /dev/mapper/vgBigData-lvBigData01 │ 5.5T │ 4.1T │ 1.1T  │ 79%  │ /bigdata01                         │
# => │ 12 │ tmpfs                             │ 1.0M │ 4.0K │ 1020K │ 1%   │ /run/credentials/nix-serve.service │
# => │ 13 │ tmpfs                             │ 6.3G │ 32M  │ 6.3G  │ 1%   │ /run/user/1000                     │
# => ╰────┴───────────────────────────────────┴──────┴──────┴───────┴──────┴────────────────────────────────────╯
```

对于像 `df` 这样的输出，这可能是实现漂亮表格输出的最紧凑方式。
这里的 `str replace` 是必要的，因为其中一个列标题包含空格。

### 使用 `from ssv`

也可以使用内置的 `from` 数据解析器来处理 `ssv`（*s*pace *s*eparated *v*alues，空格分隔值）：

```nu
df -h | str replace "Mounted on" Mounted_On | from ssv --aligned-columns --minimum-spaces 1
```

输出与上一个示例相同。

`from ssv` 支持几个修改标志来调整其行为。

注意，如果列标题包含意外的空格，我们仍然需要修复它们。

### 使用 `parse`

如何从文本字符串中解析任意模式到多列表格。

```nu
cargo search shells --limit 10 | lines | parse "{crate_name} = {version} #{description}" | str trim
# => ───┬──────────────┬─────────────────┬────────────────────────────────────────────────────────────────────────────────
# =>  # │  crate_name  │     version     │                                  description
# => ───┼──────────────┼─────────────────┼────────────────────────────────────────────────────────────────────────────────
# =>  0 │ shells       │ "0.2.0"         │ Sugar-coating for invoking shell commands directly from Rust.
# =>  1 │ pyc-shell    │ "0.3.0"         │ Pyc is a simple CLI application, which allows you to perform shell commands in
# =>    │              │                 │ cyrillic and other a…
# =>  2 │ ion-shell    │ "0.0.0"         │ The Ion Shell
# =>  3 │ sheldon      │ "0.6.6"         │ Fast, configurable, shell plugin manager.
# =>  4 │ nu           │ "0.44.0"        │ A new type of shell
# =>  5 │ git-gamble   │ "2.3.0"         │ blend TCR + TDD to make sure to develop the right thing, babystep by babystep
# =>  6 │ martin       │ "1.0.0-alpha.0" │ Blazing fast and lightweight PostGIS vector tiles server
# =>  7 │ fnm          │ "1.29.2"        │ Fast and simple Node.js version manager
# =>  8 │ remote_shell │ "2.0.0"         │ remote shell written by rust.
# =>  9 │ sauce        │ "0.6.6"         │ A tool for managing directory-specific state.
# => ───┴──────────────┴─────────────────┴────────────────────────────────────────────────────────────────────────────────
```
