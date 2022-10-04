---
title: from ini
version: 0.69.1
formats: |
  Parse text as .ini and create table
usage: |
  Parse text as .ini and create table
---

# <code>{{ $frontmatter.title }}</code> for formats

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.formats }}</div>

## Signature

```> from ini ```

## Examples

Converts ini formatted string to table
```shell
> '[foo]
a=1
b=2' | from ini
```
