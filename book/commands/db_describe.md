---
title: db describe
version: 0.64.0
usage: |
  Describes connection and query of the DB object
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> db describe ```

## Examples

Describe SQLite database constructed query
```shell
> db open foo.db | db select table_1 | db describe
```
