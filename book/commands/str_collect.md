---
title: str collect
categories: |
  deprecated
version: 0.71.0
deprecated: |
  'str collect' is deprecated. Please use 'str join' instead.
usage: |
  'str collect' is deprecated. Please use 'str join' instead.
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
