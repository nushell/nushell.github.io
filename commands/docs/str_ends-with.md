---
title: str ends-with
categories: |
  strings
version: 0.83.0
strings: |
  Check if an input ends with a string.
usage: |
  Check if an input ends with a string.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str ends-with (string) ...rest --ignore-case```

## Parameters

 -  `string`: the string to match
 -  `...rest`: For a data structure input, check strings at the given cell paths, and replace with result
 -  `--ignore-case` `(-i)`: search is case insensitive

## Examples

Checks if string ends with '.rb'
```shell
> 'my_library.rb' | str ends-with '.rb'
true
```

Checks if strings end with '.txt'
```shell
> ['my_library.rb', 'README.txt'] | str ends-with '.txt'
╭───┬───────╮
│ 0 │ false │
│ 1 │ true  │
╰───┴───────╯

```

Checks if string ends with '.RB', case-insensitive
```shell
> 'my_library.rb' | str ends-with -i '.RB'
true
```
