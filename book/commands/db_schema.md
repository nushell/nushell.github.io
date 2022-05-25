---
title: db schema
layout: command
version: 0.63.0
usage: |
  Show database information, including its schema.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> db schema ```

## Examples

Show the schema of a SQLite database
```shell
> open foo.db | db schema
```
