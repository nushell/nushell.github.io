---
title: from url
layout: command
version: 0.60.0
usage: |
  Parse url-encoded string as a table.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> from url ```

## Examples

Convert url encoded string into a table
```shell
> 'bread=baguette&cheese=comt%C3%A9&meat=ham&fat=butter' | from url
```
