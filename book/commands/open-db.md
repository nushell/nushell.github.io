---
title: open-db
version: 0.68.0
usage: |
  Open a database
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> open-db (query)```

## Parameters

 -  `query`: SQLite file to be opened

## Examples

Creates a connection to a sqlite database based on the file name
```shell
> open-db file.sqlite
```
