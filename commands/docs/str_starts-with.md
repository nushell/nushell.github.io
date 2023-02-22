---
title: str starts-with
categories: |
  strings
version: 0.76.0
strings: |
  Check if an input starts with a string
usage: |
  Check if an input starts with a string
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str starts-with (string) ...rest```

## Parameters

 -  `string`: the string to match
 -  `...rest`: For a data structure input, check strings at the given cell paths, and replace with result

## Examples

Checks if input string starts with 'my'
```shell
> 'my_library.rb' | str starts-with 'my'
```

Checks if input string starts with 'my'
```shell
> 'Cargo.toml' | str starts-with 'Car'
```

Checks if input string starts with 'my'
```shell
> 'Cargo.toml' | str starts-with '.toml'
```
