---
title: to url
categories: |
  formats
version: 0.73.1
formats: |
  Convert record or table into URL-encoded text
usage: |
  Convert record or table into URL-encoded text
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> to url ```

## Examples

Outputs a URL string representing the contents of this record
```shell
> { mode:normal userid:31415 } | to url
```

Outputs a URL string representing the contents of this 1-row table
```shell
> [[foo bar]; ["1" "2"]] | to url
```
