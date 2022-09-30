---
title: str screaming-snake-case
version: 0.69.1
usage: |
  Convert a string to SCREAMING_SNAKE_CASE
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> str screaming-snake-case ...rest```

## Parameters

 -  `...rest`: optionally convert text to SCREAMING_SNAKE_CASE by column paths

## Examples

convert a string to SCREAMING_SNAKE_CASE
```shell
>  "NuShell" | str screaming-snake-case
```

convert a string to SCREAMING_SNAKE_CASE
```shell
>  "this_is_the_second_case" | str screaming-snake-case
```

convert a string to SCREAMING_SNAKE_CASE
```shell
> "this-is-the-first-case" | str screaming-snake-case
```

convert a column from a table to SCREAMING_SNAKE_CASE
```shell
> [[lang, gems]; [nu_test, 100]] | str screaming-snake-case lang
```
