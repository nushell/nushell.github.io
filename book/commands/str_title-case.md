---
title: str title-case
version: 0.69.1
strings: |
  Convert a string to Title Case
usage: |
  Convert a string to Title Case
---

# <code>{{ $frontmatter.title }}</code> for strings

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.strings }}</div>

## Signature

```> str title-case ...rest```

## Parameters

 -  `...rest`: optionally convert text to Title Case by column paths

## Examples

convert a string to Title Case
```shell
> 'nu-shell' | str title-case
```

convert a string to Title Case
```shell
> 'this is a test case' | str title-case
```

convert a column from a table to Title Case
```shell
> [[title, count]; ['nu test', 100]] | str title-case title
```
