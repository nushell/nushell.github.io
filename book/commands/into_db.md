---
title: into db
version: 0.66.1
usage: |
  Converts into an open db connection
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> into db ```

## Examples

Converts an open file into a db object
```shell
> open db.mysql | into db
```
