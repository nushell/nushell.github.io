---
title: db collect
version: 0.64.0
usage: |
  Query a database using SQL.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> db collect ```

## Examples

Collect from a select query
```shell
> open foo.db | db select a | db from table_1 | db collect
```
