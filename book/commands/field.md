---
title: field
version: 0.69.1
usage: |
  Creates column expression for database
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> field (name)```

## Parameters

 -  `name`: column name

## Examples

Creates a named field expression
```shell
> field name_1 | into nu
```
