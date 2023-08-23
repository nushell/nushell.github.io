---
title: to toml
categories: |
  formats
version: 0.84.0
formats: |
  Convert record into .toml text.
usage: |
  Convert record into .toml text.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> to toml ```


## Input/output types:

| input  | output |
| ------ | ------ |
| record | string |

## Examples

Outputs an TOML string representing the contents of this record
```shell
> {foo: 1 bar: 'qwe'} | to toml
bar = "qwe"
foo = 1

```
