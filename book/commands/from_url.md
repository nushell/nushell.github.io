---
title: from url
version: 0.69.1
formats: |
  Parse url-encoded string as a table.
usage: |
  Parse url-encoded string as a table.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.formats }}</div>

## Signature

```> from url ```

## Examples

Convert url encoded string into a table
```shell
> 'bread=baguette&cheese=comt%C3%A9&meat=ham&fat=butter' | from url
```
