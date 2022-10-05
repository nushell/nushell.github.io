---
title: str contains
version: 0.69.1
strings: |
  Checks if input contains string
usage: |
  Checks if input contains string
---

# <code>{{ $frontmatter.title }}</code> for strings

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.strings }}</div>

## Signature

```> str contains (string) ...rest --insensitive --not```

## Parameters

 -  `string`: the string to find
 -  `...rest`: optionally check if input contains string by column paths
 -  `--insensitive`: search is case insensitive
 -  `--not`: does not contain

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
