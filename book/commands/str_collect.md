---
title: str collect
categories: |
  deprecated
version: 0.75.0
deprecated: |
  Deprecated command
usage: |
  Deprecated command
---

# <code>{{ $frontmatter.title }}</code> for deprecated

<div class='command-title'>{{ $frontmatter.deprecated }}</div>

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
