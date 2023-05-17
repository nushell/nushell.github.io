---
title: size
categories: |
  strings
version: 0.80.0
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
╭───────────┬────╮
│ lines     │ 1  │
│ words     │ 7  │
│ bytes     │ 38 │
│ chars     │ 38 │
│ graphemes │ 38 │
╰───────────┴────╯
```

Counts unicode characters
```shell
> '今天天气真好' | size
╭───────────┬────╮
│ lines     │ 1  │
│ words     │ 6  │
│ bytes     │ 18 │
│ chars     │ 6  │
│ graphemes │ 6  │
╰───────────┴────╯
```

Counts Unicode characters correctly in a string
```shell
> "Amélie Amelie" | size
╭───────────┬────╮
│ lines     │ 1  │
│ words     │ 2  │
│ bytes     │ 15 │
│ chars     │ 14 │
│ graphemes │ 13 │
╰───────────┴────╯
```
