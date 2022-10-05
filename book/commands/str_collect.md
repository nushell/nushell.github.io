---
title: str collect
version: 0.69.1
strings: |
  'str collect' is deprecated. Please use 'str join' instead.
usage: |
  'str collect' is deprecated. Please use 'str join' instead.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.strings }}</div>

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
