---
title: from ini
categories: |
  formats
version: 0.74.0
formats: |
  Parse text as .ini and create record
usage: |
  Parse text as .ini and create record
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> from ini ```

## Examples

Converts ini formatted string to record
```shell
> '[foo]
a=1
b=2' | from ini
```
