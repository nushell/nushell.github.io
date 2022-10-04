---
title: from toml
version: 0.69.1
formats: |
  Parse text as .toml and create table.
usage: |
  Parse text as .toml and create table.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.formats }}</div>

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
