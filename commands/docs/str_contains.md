---
title: str contains
categories: |
  strings
version: 0.82.0
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
true
```

Check if input contains string case insensitive
```shell
> 'my_library.rb' | str contains -i '.RB'
true
```

Check if input contains string in a table
```shell
>  [[ColA ColB]; [test 100]] | str contains 'e' ColA
╭───┬──────┬──────╮
│ # │ ColA │ ColB │
├───┼──────┼──────┤
│ 0 │ true │  100 │
╰───┴──────┴──────╯

```

Check if input contains string in a table
```shell
>  [[ColA ColB]; [test 100]] | str contains -i 'E' ColA
╭───┬──────┬──────╮
│ # │ ColA │ ColB │
├───┼──────┼──────┤
│ 0 │ true │  100 │
╰───┴──────┴──────╯

```

Check if input contains string in a table
```shell
>  [[ColA ColB]; [test hello]] | str contains 'e' ColA ColB
╭───┬──────┬──────╮
│ # │ ColA │ ColB │
├───┼──────┼──────┤
│ 0 │ true │ true │
╰───┴──────┴──────╯

```

Check if input string contains 'banana'
```shell
> 'hello' | str contains 'banana'
false
```

Check if list contains string
```shell
> [one two three] | str contains o
╭───┬───────╮
│ 0 │ true  │
│ 1 │ true  │
│ 2 │ false │
╰───┴───────╯

```

Check if list does not contain string
```shell
> [one two three] | str contains -n o
╭───┬───────╮
│ 0 │ false │
│ 1 │ false │
│ 2 │ true  │
╰───┴───────╯

```
