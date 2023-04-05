---
title: from url
categories: |
  formats
version: 0.78.0
formats: |
  Parse url-encoded string as a record.
usage: |
  Parse url-encoded string as a record.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> from url ```

## Examples

Convert url encoded string into a record
```shell
> 'bread=baguette&cheese=comt%C3%A9&meat=ham&fat=butter' | from url
╭────────┬──────────╮
│ bread  │ baguette │
│ cheese │ comté    │
│ meat   │ ham      │
│ fat    │ butter   │
╰────────┴──────────╯
```
