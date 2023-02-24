---
title: find
categories: |
  filters
version: 0.76.0
filters: |
  Searches terms in the input.
usage: |
  Searches terms in the input.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> find ...rest --regex --ignore-case --multiline --dotall --invert```

## Parameters

 -  `...rest`: terms to search
 -  `--regex {string}`: regex to match with
 -  `--ignore-case` `(-i)`: case-insensitive regex mode; equivalent to (?i)
 -  `--multiline` `(-m)`: multi-line regex mode: ^ and $ match begin/end of line; equivalent to (?m)
 -  `--dotall` `(-s)`: dotall regex mode: allow a dot . to match newlines \n; equivalent to (?s)
 -  `--invert` `(-v)`: invert the match

## Examples

Search for multiple terms in a command output
```shell
> ls | find toml md sh
```

Search for a term in a string
```shell
> 'Cargo.toml' | find toml
```

Search a number or a file size in a list of numbers
```shell
> [1 5 3kb 4 3Mb] | find 5 3kb
```

Search a char in a list of string
```shell
> [moe larry curly] | find l
```

Find using regex
```shell
> [abc bde arc abf] | find --regex "ab"
```

Find using regex case insensitive
```shell
> [aBc bde Arc abf] | find --regex "ab" -i
```

Find value in records
```shell
> [[version name]; [0.1.0 nushell] [0.1.1 fish] [0.2.0 zsh]] | find -r "nu"
```
