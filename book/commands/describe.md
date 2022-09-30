---
title: describe
version: 0.69.1
usage: |
  Describes connection and query of the DB object
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> describe ```

## Examples

Describe SQLite database constructed query
```shell
> open foo.db | from table table_1 | select col_1 | describe
```
