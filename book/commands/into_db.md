---
title: into db
version: 0.69.1
usage: |
  Converts into an open db connection
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> into db ```

## Notes
```text
This function is used as type hint for parser, specially if the query is not started with 'from table'
```
## Examples

Converts an open file into a db object
```shell
> open db.sqlite | into db
```
