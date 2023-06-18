---
title: from toml
categories: |
  formats
version: 0.81.0
formats: |
  Parse text as .toml and create record.
usage: |
  Parse text as .toml and create record.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> from toml ```

## Examples

Converts toml formatted string to record
```shell
> 'a = 1' | from toml
╭───┬───╮
│ a │ 1 │
╰───┴───╯
```

Converts toml formatted string to record
```shell
> 'a = 1
b = [1, 2]' | from toml
╭───┬───────────╮
│ a │ 1         │
│   │ ╭───┬───╮ │
│ b │ │ 0 │ 1 │ │
│   │ │ 1 │ 2 │ │
│   │ ╰───┴───╯ │
╰───┴───────────╯
```
