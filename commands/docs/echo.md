---
title: echo
categories: |
  core
version: 0.106.0
core: |
  Returns its arguments, ignoring the piped-in value.
usage: |
  Returns its arguments, ignoring the piped-in value.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `echo` for [core](/commands/categories/core.md)

<div class='command-title'>Returns its arguments, ignoring the piped-in value.</div>

## Signature

```> echo {flags} ...rest```

## Parameters

 -  `...rest`: The values to echo.


## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | any    |
## Examples

Put a list of numbers in the pipeline. This is the same as [1 2 3].
```nu
> echo 1 2 3
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 2 │
│ 2 │ 3 │
╰───┴───╯

```

Returns the piped-in value, by using the special $in variable to obtain it.
```nu
> echo $in

```

## Notes
Unlike `print`, which prints unstructured text to stdout, `echo` is like an
identity function and simply returns its arguments. When given no arguments,
it returns an empty string. When given one argument, it returns it as a
nushell value. Otherwise, it returns a list of the arguments. There is usually
little reason to use this over just writing the values as-is.