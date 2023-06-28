---
title: fmt
categories: |
  conversions
version: 0.82.0
conversions: |
  Format a number.
usage: |
  Format a number.
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> fmt ```

## Examples

Get a record containing multiple formats for the number 42
```shell
> 42 | fmt
╭──────────┬──────────╮
│ binary   │ 0b101010 │
│ debug    │ 42       │
│ display  │ 42       │
│ lowerexp │ 4.2e1    │
│ lowerhex │ 0x2a     │
│ octal    │ 0o52     │
│ upperexp │ 4.2E1    │
│ upperhex │ 0x2A     │
╰──────────┴──────────╯
```
