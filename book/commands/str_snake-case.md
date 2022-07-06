---
title: str snake-case
version: 0.65.1
usage: |
  Convert a string to snake_case
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> str snake-case ...rest```

## Parameters

 -  `...rest`: optionally convert text to snake_case by column paths

## Examples

convert a string to snake_case
```shell
>  "NuShell" | str snake-case
```

convert a string to snake_case
```shell
>  "this_is_the_second_case" | str snake-case
```

convert a string to snake_case
```shell
> "this-is-the-first-case" | str snake-case
```

convert a column from a table to snake_case
```shell
> [[lang, gems]; [nuTest, 100]] | str snake-case lang
```
