---
title: str reverse
version: 0.69.1
strings: |
  Reverse every string in the pipeline
usage: |
  Reverse every string in the pipeline
---

# <code>{{ $frontmatter.title }}</code> for strings

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.strings }}</div>

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
