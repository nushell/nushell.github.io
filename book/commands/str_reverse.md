---
title: str reverse
layout: command
version: 0.59.1
usage: |
  outputs the reversals of the strings in the pipeline
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> str reverse ...rest```

## Parameters

 -  `...rest`: optionally reverse text by column paths

## Examples

Return the reversals of multiple strings
```shell
> 'Nushell' | str reverse
```
