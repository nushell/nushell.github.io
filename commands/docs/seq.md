---
title: seq
categories: |
  generators
version: 0.77.0
generators: |
  Output sequences of numbers.
usage: |
  Output sequences of numbers.
---

# <code>{{ $frontmatter.title }}</code> for generators

<div class='command-title'>{{ $frontmatter.generators }}</div>

## Signature

```> seq ...rest```

## Parameters

 -  `...rest`: sequence values

## Examples

sequence 1 to 10
```shell
> seq 1 10
╭───┬────╮
│ 0 │  1 │
│ 1 │  2 │
│ 2 │  3 │
│ 3 │  4 │
│ 4 │  5 │
│ 5 │  6 │
│ 6 │  7 │
│ 7 │  8 │
│ 8 │  9 │
│ 9 │ 10 │
╰───┴────╯

```

sequence 1.0 to 2.0 by 0.1s
```shell
> seq 1.0 0.1 2.0
╭────┬────────╮
│  0 │ 1.0000 │
│  1 │ 1.1000 │
│  2 │ 1.2000 │
│  3 │ 1.3000 │
│  4 │ 1.4000 │
│  5 │ 1.5000 │
│  6 │ 1.6000 │
│  7 │ 1.7000 │
│  8 │ 1.8000 │
│  9 │ 1.9000 │
│ 10 │ 2.0000 │
╰────┴────────╯

```

sequence 1 to 5, then convert to a string with a pipe separator
```shell
> seq 1 5 | str join '|'

```
