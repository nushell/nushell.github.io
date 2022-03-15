---
title: empty?
layout: command
version: 0.59.1
usage: |
  Check for empty values.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> empty? ...rest```

## Parameters

 -  `...rest`: the names of the columns to check emptiness

## Examples

Check if a string is empty
```shell
> '' | empty?
```

Check if a list is empty
```shell
> [] | empty?
```

Check if more than one column are empty
```shell
> [[meal size]; [arepa small] [taco '']] | empty? meal size
```
