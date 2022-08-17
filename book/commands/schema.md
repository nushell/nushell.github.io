---
title: schema
version: 0.67.0
usage: |
  Show sqlite database information, including its schema.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> schema ```

## Examples

Show the schema of a SQLite database
```shell
> open foo.db | schema
```
