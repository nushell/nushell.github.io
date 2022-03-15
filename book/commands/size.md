---
title: size
layout: command
version: 0.59.1
usage: |
  Gather word count statistics on the text.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> size ```

## Examples

Count the number of words in a string
```shell
> "There are seven words in this sentence" | size
```

Counts Unicode characters correctly in a string
```shell
> "Amélie Amelie" | size
```
