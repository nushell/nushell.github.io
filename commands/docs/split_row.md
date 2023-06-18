---
title: split row
categories: |
  strings
version: 0.81.0
strings: |
  Split a string into multiple rows using a separator.
usage: |
  Split a string into multiple rows using a separator.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> split row (separator) --number --regex```

## Parameters

 -  `separator`: a character or regex that denotes what separates rows
 -  `--number {int}`: Split into maximum number of items
 -  `--regex` `(-r)`: use regex syntax for separator

## Examples

Split a string into rows of char
```shell
> 'abc' | split row ''
╭───┬───╮
│ 0 │   │
│ 1 │ a │
│ 2 │ b │
│ 3 │ c │
│ 4 │   │
╰───┴───╯

```

Split a string into rows by the specified separator
```shell
> 'a--b--c' | split row '--'
╭───┬───╮
│ 0 │ a │
│ 1 │ b │
│ 2 │ c │
╰───┴───╯

```

Split a string by '-'
```shell
> '-a-b-c-' | split row '-'
╭───┬───╮
│ 0 │   │
│ 1 │ a │
│ 2 │ b │
│ 3 │ c │
│ 4 │   │
╰───┴───╯

```

Split a string by regex
```shell
> 'a   b       c' | split row -r '\s+'
╭───┬───╮
│ 0 │ a │
│ 1 │ b │
│ 2 │ c │
╰───┴───╯

```
