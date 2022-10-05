---
title: schema
version: 0.69.1
database: |
  Show sqlite database information, including its schema.
usage: |
  Show sqlite database information, including its schema.
---

# <code>{{ $frontmatter.title }}</code> for database

<div class='command-title'>{{ $frontmatter.database }}</div>

## Signature

```> schema ```

## Examples

Show the schema of a SQLite database
```shell
> open foo.db | schema
```
