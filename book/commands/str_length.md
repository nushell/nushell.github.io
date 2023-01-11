---
title: str length
categories: |
  strings
version: 0.74.0
strings: |
  Output the length of any strings in the pipeline
usage: |
  Output the length of any strings in the pipeline
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str length ...rest```

## Parameters

 -  `...rest`: For a data structure input, replace strings at the given cell paths with their length

## Examples

Return the lengths of multiple strings
```shell
> 'hello' | str length
```

Return the lengths of multiple strings
```shell
> ['hi' 'there'] | str length
```
