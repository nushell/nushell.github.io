---
title: str kebab-case
version: 0.69.1
usage: |
  Convert a string to kebab-case
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> str kebab-case ...rest```

## Parameters

 -  `...rest`: optionally convert text to kebab-case by column paths

## Examples

convert a string to kebab-case
```shell
> 'NuShell' | str kebab-case
```

convert a string to kebab-case
```shell
> 'thisIsTheFirstCase' | str kebab-case
```

convert a string to kebab-case
```shell
> 'THIS_IS_THE_SECOND_CASE' | str kebab-case
```

convert a column from a table to kebab-case
```shell
> [[lang, gems]; [nuTest, 100]] | str kebab-case lang
```
