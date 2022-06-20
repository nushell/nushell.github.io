---
title: db as
version: 0.64.0
usage: |
  Creates an alias for a column selection
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> db as (alias)```

## Parameters

 -  `alias`: alias name

## Examples

Creates an alias for a column selection
```shell
> db col name_a | db as new_a
```
