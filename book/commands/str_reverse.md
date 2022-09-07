---
title: str reverse
version: 0.68.0
usage: |
  Reverse every string in the pipeline
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
