---
title: to toml
categories: |
  formats
version: 0.76.0
formats: |
  Convert record into .toml text
usage: |
  Convert record into .toml text
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> to toml ```

## Examples

Outputs an TOML string representing the contents of this record
```shell
> {foo: 1 bar: 'qwe'} | to toml
```
