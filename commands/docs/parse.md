---
title: parse
categories: |
  strings
version: 0.84.0
strings: |
  Parse columns from string data using a simple pattern.
usage: |
  Parse columns from string data using a simple pattern.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> parse (pattern) --regex```

## Parameters

 -  `pattern`: the pattern to match. Eg) "{foo}: {bar}"
 -  `--regex` `(-r)`: use full regex syntax for patterns


## Input/output types:

| input     | output |
| --------- | ------ |
| list\<any\> | table  |
| string    | table  |
## Examples

Parse a string into two named columns
```shell
> "hi there" | parse "{foo} {bar}"
╭───┬─────┬───────╮
│ # │ foo │  bar  │
├───┼─────┼───────┤
│ 0 │ hi  │ there │
╰───┴─────┴───────╯

```

Parse a string using regex pattern
```shell
> "hi there" | parse -r '(?P<foo>\w+) (?P<bar>\w+)'
╭───┬─────┬───────╮
│ # │ foo │  bar  │
├───┼─────┼───────┤
│ 0 │ hi  │ there │
╰───┴─────┴───────╯

```

Parse a string using fancy-regex named capture group pattern
```shell
> "foo bar." | parse -r '\s*(?<name>\w+)(?=\.)'
╭───┬──────╮
│ # │ name │
├───┼──────┤
│ 0 │ bar  │
╰───┴──────╯

```

Parse a string using fancy-regex capture group pattern
```shell
> "foo! bar." | parse -r '(\w+)(?=\.)|(\w+)(?=!)'
╭───┬──────────┬──────────╮
│ # │ capture0 │ capture1 │
├───┼──────────┼──────────┤
│ 0 │          │ foo      │
│ 1 │ bar      │          │
╰───┴──────────┴──────────╯

```

Parse a string using fancy-regex look behind pattern
```shell
> " @another(foo bar)   " | parse -r '\s*(?<=[() ])(@\w+)(\([^)]*\))?\s*'
╭───┬──────────┬───────────╮
│ # │ capture0 │ capture1  │
├───┼──────────┼───────────┤
│ 0 │ @another │ (foo bar) │
╰───┴──────────┴───────────╯

```

Parse a string using fancy-regex look ahead atomic group pattern
```shell
> "abcd" | parse -r '^a(bc(?=d)|b)cd$'
╭───┬──────────╮
│ # │ capture0 │
├───┼──────────┤
│ 0 │ b        │
╰───┴──────────╯

```
