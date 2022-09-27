---
title: str join
version: 0.68.0
usage: |
  Concatenate multiple strings into a single string, with an optional separator between each
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> str join (separator)```

## Parameters

 -  `separator`: optional separator to use when creating string

## Examples

Create a string from input
```shell
> ['nu', 'shell'] | str join
```

Create a string from input with a separator
```shell
> ['nu', 'shell'] | str join '-'
```
