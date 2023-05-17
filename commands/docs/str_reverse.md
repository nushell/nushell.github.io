---
title: str reverse
categories: |
  strings
version: 0.80.0
strings: |
  Reverse every string in the pipeline.
usage: |
  Reverse every string in the pipeline.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str reverse ...rest```

## Parameters

 -  `...rest`: For a data structure input, reverse strings at the given cell paths

## Examples

Reverse a single string
```shell
> 'Nushell' | str reverse
llehsuN
```

Reverse multiple strings in a list
```shell
> ['Nushell' 'is' 'cool'] | str reverse
╭───┬─────────╮
│ 0 │ llehsuN │
│ 1 │ si      │
│ 2 │ looc    │
╰───┴─────────╯

```
