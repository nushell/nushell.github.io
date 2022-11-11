---
title: into db
categories: |
  database
version: 0.71.0
database: |
  Converts the input into an open db connection
usage: |
  Converts the input into an open db connection
---

# <code>{{ $frontmatter.title }}</code> for database

<div class='command-title'>{{ $frontmatter.database }}</div>

## Signature

```> into db ```

## Notes
```text
This function is used as a hint to Nushell to optimize the pipeline for database queries.
```
## Examples

Converts an open file into a db object.
```shell
> open db.sqlite | into db
```
