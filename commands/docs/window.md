---
title: window
categories: |
  filters
version: 0.78.0
filters: |
  Creates a sliding window of `window_size` that slide by n rows/elements across input.
usage: |
  Creates a sliding window of `window_size` that slide by n rows/elements across input.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> window (window_size) --stride --remainder```

## Parameters

 -  `window_size`: the size of each window
 -  `--stride {int}`: the number of rows to slide over between windows
 -  `--remainder` `(-r)`: yield last chunks even if they have fewer elements than size

## Examples

A sliding window of two elements
```shell
> [1 2 3 4] | window 2
╭───┬───────────╮
│ 0 │ ╭───┬───╮ │
│   │ │ 0 │ 1 │ │
│   │ │ 1 │ 2 │ │
│   │ ╰───┴───╯ │
│ 1 │ ╭───┬───╮ │
│   │ │ 0 │ 2 │ │
│   │ │ 1 │ 3 │ │
│   │ ╰───┴───╯ │
│ 2 │ ╭───┬───╮ │
│   │ │ 0 │ 3 │ │
│   │ │ 1 │ 4 │ │
│   │ ╰───┴───╯ │
╰───┴───────────╯

```

A sliding window of two elements, with a stride of 3
```shell
> [1, 2, 3, 4, 5, 6, 7, 8] | window 2 --stride 3
╭───┬───────────╮
│ 0 │ ╭───┬───╮ │
│   │ │ 0 │ 1 │ │
│   │ │ 1 │ 2 │ │
│   │ ╰───┴───╯ │
│ 1 │ ╭───┬───╮ │
│   │ │ 0 │ 4 │ │
│   │ │ 1 │ 5 │ │
│   │ ╰───┴───╯ │
│ 2 │ ╭───┬───╮ │
│   │ │ 0 │ 7 │ │
│   │ │ 1 │ 8 │ │
│   │ ╰───┴───╯ │
╰───┴───────────╯

```

A sliding window of equal stride that includes remainder. Equivalent to chunking
```shell
> [1, 2, 3, 4, 5] | window 3 --stride 3 --remainder
╭───┬───────────╮
│ 0 │ ╭───┬───╮ │
│   │ │ 0 │ 1 │ │
│   │ │ 1 │ 2 │ │
│   │ │ 2 │ 3 │ │
│   │ ╰───┴───╯ │
│ 1 │ ╭───┬───╮ │
│   │ │ 0 │ 4 │ │
│   │ │ 1 │ 5 │ │
│   │ ╰───┴───╯ │
╰───┴───────────╯

```
