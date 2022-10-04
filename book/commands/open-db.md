---
title: open-db
version: 0.69.1
database: |
  Open a database
usage: |
  Open a database
---

# <code>{{ $frontmatter.title }}</code> for database

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.database }}</div>

## Signature

```> open-db (query)```

## Parameters

 -  `query`: SQLite file to be opened

## Examples

Creates a connection to a sqlite database based on the file name
```shell
> open-db file.sqlite
```
