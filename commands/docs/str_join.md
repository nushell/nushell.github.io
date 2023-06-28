---
title: str join
categories: |
  strings
version: 0.82.0
strings: |
  Concatenate multiple strings into a single string, with an optional separator between each.
usage: |
  Concatenate multiple strings into a single string, with an optional separator between each.
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str join (separator)```

## Parameters

 -  `separator`: optional separator to use when creating string

## Examples

Create a string from input
```shell
> ['nu', 'shell'] | str join
nushell
```

Create a string from input with a separator
```shell
> ['nu', 'shell'] | str join '-'
nu-shell
```
