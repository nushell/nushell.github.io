---
title: db schema
version: 0.64.0
usage: |
  Show database information, including its schema.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> db schema ```

## Examples

Show the schema of a SQLite database
```shell
> open foo.db | db schema
```
