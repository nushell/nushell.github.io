---
title: str collect
version: 0.67.1
usage: |
  Concatenate multiple strings into a single string, with an optional separator between each
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> str collect (separator)```

## Parameters

 -  `separator`: optional separator to use when creating string

## Examples

Create a string from input
```shell
> ['nu', 'shell'] | str collect
```

Create a string from input with a separator
```shell
> ['nu', 'shell'] | str collect '-'
```
