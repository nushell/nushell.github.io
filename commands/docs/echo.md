---
title: echo
categories: |
  core
version: 0.79.0
core: |
  Returns its arguments, ignoring the piped-in value.
usage: |
  Returns its arguments, ignoring the piped-in value.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> echo ...rest```

## Parameters

 -  `...rest`: the values to echo

## Notes
When given no arguments, it returns an empty string. When given one argument,
it returns it. Otherwise, it returns a list of the arguments. There is usually
little reason to use this over just writing the values as-is.
## Examples

Put a list of numbers in the pipeline. This is the same as [1 2 3].
```shell
> echo 1 2 3
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 2 │
│ 2 │ 3 │
╰───┴───╯

```

Returns the piped-in value, by using the special $in variable to obtain it.
```shell
> echo $in

```
