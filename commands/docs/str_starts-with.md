---
title: str starts-with
categories: |
  strings
version: 0.80.0
strings: |
  Check if an input starts with a string.
usage: |
  Check if an input starts with a string.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str starts-with (string) ...rest --ignore-case```

## Parameters

 -  `string`: the string to match
 -  `...rest`: For a data structure input, check strings at the given cell paths, and replace with result
 -  `--ignore-case` `(-i)`: search is case insensitive

## Examples

Checks if input string starts with 'my'
```shell
> 'my_library.rb' | str starts-with 'my'
true
```

Checks if input string starts with 'Car'
```shell
> 'Cargo.toml' | str starts-with 'Car'
true
```

Checks if input string starts with '.toml'
```shell
> 'Cargo.toml' | str starts-with '.toml'
false
```

Checks if input string starts with 'cargo', case-insensitive
```shell
> 'Cargo.toml' | str starts-with -i 'cargo'
true
```
