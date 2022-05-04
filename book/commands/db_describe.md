---
title: db describe
layout: command
version: 0.62.0
usage: |
  Describes connection and query of the DB object
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> db describe ```

## Examples

Describe SQLite database constructed query
```shell
> db open foo.db | db select table_1 | db describe
```
