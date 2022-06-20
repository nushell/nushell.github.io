---
title: str length
version: 0.64.0
usage: |
  Output the length of any strings in the pipeline
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> str length ...rest```

## Parameters

 -  `...rest`: optionally find length of text by column paths

## Examples

Return the lengths of multiple strings
```shell
> 'hello' | str length
```

Return the lengths of multiple strings
```shell
> ['hi' 'there'] | str length
```
