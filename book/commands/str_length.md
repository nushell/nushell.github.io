---
title: str length
version: 0.69.1
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
