---
title: str reverse
categories: |
  strings
version: 0.76.1
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
```

Reverse multiple strings in a list
```shell
> ['Nushell' 'is' 'cool'] | str reverse
```
