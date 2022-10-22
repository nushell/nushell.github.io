---
title: from toml
categories: |
  formats
version: 0.70.0
formats: |
  Parse text as .toml and create table.
usage: |
  Parse text as .toml and create table.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> from toml ```

## Examples

Converts toml formatted string to table
```shell
> 'a = 1' | from toml
```

Converts toml formatted string to table
```shell
> 'a = 1
b = [1, 2]' | from toml
```
