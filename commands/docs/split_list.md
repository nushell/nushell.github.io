---
title: split list
categories: |
  filters
version: 0.78.0
filters: |
  Split a list into multiple lists using a separator.
usage: |
  Split a list into multiple lists using a separator.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> split list (separator)```

## Parameters

 -  `separator`: the value that denotes what separates the list

## Examples

Split a list of chars into two lists
```shell
> [a, b, c, d, e, f, g] | split list d
╭───┬───────────╮
│ 0 │ ╭───┬───╮ │
│   │ │ 0 │ a │ │
│   │ │ 1 │ b │ │
│   │ │ 2 │ c │ │
│   │ ╰───┴───╯ │
│ 1 │ ╭───┬───╮ │
│   │ │ 0 │ e │ │
│   │ │ 1 │ f │ │
│   │ │ 2 │ g │ │
│   │ ╰───┴───╯ │
╰───┴───────────╯

```

Split a list of lists into two lists of lists
```shell
> [[1,2], [2,3], [3,4]] | split list [2,3]
╭───┬───────────────────╮
│ 0 │ ╭───┬───────────╮ │
│   │ │ 0 │ ╭───┬───╮ │ │
│   │ │   │ │ 0 │ 1 │ │ │
│   │ │   │ │ 1 │ 2 │ │ │
│   │ │   │ ╰───┴───╯ │ │
│   │ ╰───┴───────────╯ │
│ 1 │ ╭───┬───────────╮ │
│   │ │ 0 │ ╭───┬───╮ │ │
│   │ │   │ │ 0 │ 3 │ │ │
│   │ │   │ │ 1 │ 4 │ │ │
│   │ │   │ ╰───┴───╯ │ │
│   │ ╰───┴───────────╯ │
╰───┴───────────────────╯

```

Split a list of chars into two lists
```shell
> [a, b, c, d, a, e, f, g] | split list a
╭───┬───────────╮
│ 0 │ ╭───┬───╮ │
│   │ │ 0 │ b │ │
│   │ │ 1 │ c │ │
│   │ │ 2 │ d │ │
│   │ ╰───┴───╯ │
│ 1 │ ╭───┬───╮ │
│   │ │ 0 │ e │ │
│   │ │ 1 │ f │ │
│   │ │ 2 │ g │ │
│   │ ╰───┴───╯ │
╰───┴───────────╯

```
