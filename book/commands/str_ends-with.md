---
title: str ends-with
categories: |
  strings
version: 0.73.1
strings: |
  Check if an input ends with a string
usage: |
  Check if an input ends with a string
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str ends-with (string) ...rest```

## Parameters

 -  `string`: the string to match
 -  `...rest`: For a data structure input, check strings at the given cell paths, and replace with result

## Examples

Checks if string ends with '.rb'
```shell
> 'my_library.rb' | str ends-with '.rb'
```

Checks if string ends with '.txt'
```shell
> 'my_library.rb' | str ends-with '.txt'
```
