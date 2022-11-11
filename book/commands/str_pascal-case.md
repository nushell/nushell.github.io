---
title: str pascal-case
categories: |
  strings
version: 0.71.0
strings: |
  Convert a string to PascalCase
usage: |
  Convert a string to PascalCase
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> str pascal-case ...rest```

## Parameters

 -  `...rest`: optionally convert text to PascalCase by column paths

## Examples

convert a string to PascalCase
```shell
> 'nu-shell' | str pascal-case
```

convert a string to PascalCase
```shell
> 'this-is-the-first-case' | str pascal-case
```

convert a string to PascalCase
```shell
> 'this_is_the_second_case' | str pascal-case
```

convert a column from a table to PascalCase
```shell
> [[lang, gems]; [nu_test, 100]] | str pascal-case lang
```
