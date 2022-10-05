---
title: to url
version: 0.69.1
formats: |
  Convert table into url-encoded text
usage: |
  Convert table into url-encoded text
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> to url ```

## Examples

Outputs an URL string representing the contents of this table
```shell
> [[foo bar]; ["1" "2"]] | to url
```
