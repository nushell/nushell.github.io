---
title: size
categories: |
  strings
version: 0.73.1
strings: |
  Gather word count statistics on the text.
usage: |
  Gather word count statistics on the text.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> size ```

## Examples

Count the number of words in a string
```shell
> "There are seven words in this sentence" | size
```

Counts unicode characters
```shell
> '今天天气真好' | size
```

Counts Unicode characters correctly in a string
```shell
> "Amélie Amelie" | size
```
