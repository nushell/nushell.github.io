---
title: lines
categories: |
  filters
version: 0.106.0
filters: |
  Converts input to lines.
usage: |
  Converts input to lines.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `lines` for [filters](/commands/categories/filters.md)

<div class='command-title'>Converts input to lines.</div>

## Signature

```> lines {flags} ```

## Flags

 -  `--skip-empty, -s`: skip empty lines


## Input/output types:

| input | output       |
| ----- | ------------ |
| any   | list&lt;string&gt; |
## Examples

Split multi-line string into lines
```nu
> $"two\nlines" | lines
╭───┬───────╮
│ 0 │ two   │
│ 1 │ lines │
╰───┴───────╯

```
