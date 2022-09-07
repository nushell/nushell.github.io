---
title: from yml
version: 0.68.0
usage: |
  Parse text as .yaml/.yml and create table.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> from yml ```

## Examples

Converts yaml formatted string to table
```shell
> 'a: 1' | from yaml
```

Converts yaml formatted string to table
```shell
> '[ a: 1, b: [1, 2] ]' | from yaml
```
