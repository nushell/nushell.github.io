---
title: lines
categories: |
  filters
version: 0.90.0
filters: |
  Converts input to lines.
usage: |
  Converts input to lines.
feature: default
---

<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

`> lines {flags} `

## Flags

- `--skip-empty, -s`: skip empty lines

## Input/output types:

| input | output         |
| ----- | -------------- |
| any   | list\<string\> |

## Examples

Split multi-line string into lines

```nu
> $"two\nlines" | lines
╭───┬───────╮
│ 0 │ two   │
│ 1 │ lines │
╰───┴───────╯

```