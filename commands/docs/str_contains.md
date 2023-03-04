---
title: str contains
categories: |
  strings
version: 0.76.1
strings: |
  Checks if string input contains a substring.
usage: |
  Checks if string input contains a substring.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str contains (string) ...rest --ignore-case --not```

## Parameters

 -  `string`: the substring to find
 -  `...rest`: For a data structure input, check strings at the given cell paths, and replace with result
 -  `--ignore-case` `(-i)`: search is case insensitive
 -  `--not` `(-n)`: does not contain

## Examples

Check if input contains string
```shell
> 'my_library.rb' | str contains '.rb'
```

Check if input contains string case insensitive
```shell
> 'my_library.rb' | str contains -i '.RB'
```

Check if input contains string in a table
```shell
>  [[ColA ColB]; [test 100]] | str contains 'e' ColA
```

Check if input contains string in a table
```shell
>  [[ColA ColB]; [test 100]] | str contains -i 'E' ColA
```

Check if input contains string in a table
```shell
>  [[ColA ColB]; [test hello]] | str contains 'e' ColA ColB
```

Check if input string contains 'banana'
```shell
> 'hello' | str contains 'banana'
```

Check if list contains string
```shell
> [one two three] | str contains o
```

Check if list does not contain string
```shell
> [one two three] | str contains -n o
```
