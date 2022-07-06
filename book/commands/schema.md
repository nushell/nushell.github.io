---
title: schema
version: 0.65.1
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
> open foo.db | into db | schema
```
