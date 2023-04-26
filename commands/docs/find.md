---
title: find
categories: |
  filters
version: 0.79.0
filters: |
  Searches terms in the input.
usage: |
  Searches terms in the input.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> find ...rest --regex --ignore-case --multiline --dotall --columns --invert```

## Parameters

 -  `...rest`: terms to search
 -  `--regex {string}`: regex to match with
 -  `--ignore-case` `(-i)`: case-insensitive regex mode; equivalent to (?i)
 -  `--multiline` `(-m)`: multi-line regex mode: ^ and $ match begin/end of line; equivalent to (?m)
 -  `--dotall` `(-s)`: dotall regex mode: allow a dot . to match newlines \n; equivalent to (?s)
 -  `--columns {list<string>}`: column names to be searched (with rest parameter, not regex yet)
 -  `--invert` `(-v)`: invert the match

## Examples

Search for multiple terms in a command output
```shell
> ls | find toml md sh

```

Search for a term in a string
```shell
> 'Cargo.toml' | find toml
Cargo.toml
```

Search a number or a file size in a list of numbers
```shell
> [1 5 3kb 4 3Mb] | find 5 3kb
╭───┬─────────╮
│ 0 │       5 │
│ 1 │ 2.9 KiB │
╰───┴─────────╯

```

Search a char in a list of string
```shell
> [moe larry curly] | find l
╭───┬───────╮
│ 0 │ larry │
│ 1 │ curly │
╰───┴───────╯

```

Find using regex
```shell
> [abc bde arc abf] | find --regex "ab"
╭───┬─────╮
│ 0 │ abc │
│ 1 │ abf │
╰───┴─────╯

```

Find using regex case insensitive
```shell
> [aBc bde Arc abf] | find --regex "ab" -i
╭───┬─────╮
│ 0 │ aBc │
│ 1 │ abf │
╰───┴─────╯

```

Find value in records
```shell
> [[version name]; ['0.1.0' nushell] ['0.1.1' fish] ['0.2.0' zsh]] | find -r "nu"
╭───┬─────────┬─────────╮
│ # │ version │  name   │
├───┼─────────┼─────────┤
│ 0 │ 0.1.0   │ nushell │
╰───┴─────────┴─────────╯

```

Remove ANSI sequences from result
```shell
> [[foo bar]; [abc 123] [def 456]] | find 123 | get bar | ansi strip

```

Find and highlight text in specific columns
```shell
> [[col1 col2 col3]; [moe larry curly] [larry curly moe]] | find moe -c [col1 col3]
╭───┬───────┬───────┬───────╮
│ # │ col1  │ col2  │ col3  │
├───┼───────┼───────┼───────┤
│ 0 │ moe   │ larry │ curly │
│ 1 │ larry │ curly │ moe   │
╰───┴───────┴───────┴───────╯

```
