---
title: nu-highlight
categories: |
  strings
version: 0.106.0
strings: |
  Syntax highlight the input string.
usage: |
  Syntax highlight the input string.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `nu-highlight` for [strings](/commands/categories/strings.md)

<div class='command-title'>Syntax highlight the input string.</div>

## Signature

```> nu-highlight {flags} ```

## Flags

 -  `--reject-garbage, -r`: Return an error if invalid syntax (garbage) was encountered


## Input/output types:

| input  | output |
| ------ | ------ |
| string | string |
## Examples

Describe the type of a string
```nu
> 'let x = 3' | nu-highlight

```
