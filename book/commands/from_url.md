---
title: from url
version: 0.70.0
formats: |
  Parse url-encoded string as a table.
usage: |
  Parse url-encoded string as a table.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> from url ```

## Examples

Convert url encoded string into a table
```shell
> 'bread=baguette&cheese=comt%C3%A9&meat=ham&fat=butter' | from url
```
