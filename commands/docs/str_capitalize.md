---
title: str capitalize
categories: |
  strings
version: 0.77.0
strings: |
  Capitalize first letter of text.
usage: |
  Capitalize first letter of text.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str capitalize ...rest```

## Parameters

 -  `...rest`: For a data structure input, convert strings at the given cell paths

## Examples

Capitalize contents
```shell
> 'good day' | str capitalize
Good day
```

Capitalize contents
```shell
> 'anton' | str capitalize
Anton
```

Capitalize a column in a table
```shell
> [[lang, gems]; [nu_test, 100]] | str capitalize lang
╭───┬─────────┬──────╮
│ # │  lang   │ gems │
├───┼─────────┼──────┤
│ 0 │ Nu_test │  100 │
╰───┴─────────┴──────╯

```
