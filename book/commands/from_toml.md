---
title: from toml
layout: command
version: 0.60.1
usage: |
  Parse text as .toml and create table.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
