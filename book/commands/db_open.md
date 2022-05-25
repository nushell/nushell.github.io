---
title: db open
layout: command
version: 0.63.0
usage: |
  Open a database
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> db open (query)```

## Parameters

 -  `query`: SQLite file to be opened

## Examples

Open a sqlite file
```shell
> db open file.sqlite
```
