---
title: str reverse
categories: |
  strings
version: 0.70.0
strings: |
  Reverse every string in the pipeline
usage: |
  Reverse every string in the pipeline
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str reverse ...rest```

## Parameters

 -  `...rest`: optionally reverse text by column paths

## Examples

Reverse a single string
```shell
> 'Nushell' | str reverse
```

Reverse multiple strings in a list
```shell
> ['Nushell' 'is' 'cool'] | str reverse
```
