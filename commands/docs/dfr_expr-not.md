---
title: dfr expr-not
categories: |
  expression
version: 0.84.0
expression: |
  creates a not expression
usage: |
  creates a not expression
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr expr-not ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Creates a not expression
```shell
> (dfr col a) > 2) | dfr expr-not

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag