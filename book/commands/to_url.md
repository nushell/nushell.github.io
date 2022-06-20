---
title: to url
version: 0.64.0
usage: |
  Convert table into url-encoded text
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> to url ```

## Examples

Outputs an URL string representing the contents of this table
```shell
> [[foo bar]; ["1" "2"]] | to url
```
