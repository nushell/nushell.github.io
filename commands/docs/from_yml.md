---
title: from yml
categories: |
  formats
version: 0.78.0
formats: |
  Parse text as .yaml/.yml and create table.
usage: |
  Parse text as .yaml/.yml and create table.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> from yml ```

## Examples

Converts yaml formatted string to table
```shell
> 'a: 1' | from yaml
╭───┬───╮
│ a │ 1 │
╰───┴───╯
```

Converts yaml formatted string to table
```shell
> '[ a: 1, b: [1, 2] ]' | from yaml
╭───┬────┬───────────╮
│ # │ a  │     b     │
├───┼────┼───────────┤
│ 0 │  1 │    ❎     │
│ 1 │ ❎ │ ╭───┬───╮ │
│   │    │ │ 0 │ 1 │ │
│   │    │ │ 1 │ 2 │ │
│   │    │ ╰───┴───╯ │
╰───┴────┴───────────╯

```
