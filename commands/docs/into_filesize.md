---
title: into filesize
categories: |
  conversions
version: 0.83.0
conversions: |
  Convert value to filesize.
usage: |
  Convert value to filesize.
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> into filesize ...rest```

## Parameters

 -  `...rest`: for a data structure input, convert data at the given cell paths

## Examples

Convert string to filesize in table
```shell
> [[device size]; ["/dev/sda1" "200"] ["/dev/loop0" "50"]] | into filesize size
╭───┬────────────┬───────╮
│ # │   device   │ size  │
├───┼────────────┼───────┤
│ 0 │ /dev/sda1  │ 200 B │
│ 1 │ /dev/loop0 │  50 B │
╰───┴────────────┴───────╯

```

Convert string to filesize
```shell
> '2' | into filesize
2 B
```

Convert decimal to filesize
```shell
> 8.3 | into filesize
8 B
```

Convert int to filesize
```shell
> 5 | into filesize
5 B
```

Convert file size to filesize
```shell
> 4KB | into filesize
3.9 KiB
```
