---
title: from nuon
version: 0.67.1
usage: |
  Convert from nuon to structured data
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> from nuon ```

## Examples

Converts nuon formatted string to table
```shell
> '{ a:1 }' | from nuon
```

Converts nuon formatted string to table
```shell
> '{ a:1, b: [1, 2] }' | from nuon
```
