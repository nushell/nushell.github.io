---
title: headers
version: 0.67.1
usage: |
  Use the first row of the table as column names.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> headers ```

## Examples

Returns headers from table
```shell
> "a b c|1 2 3" | split row "|" | split column " " | headers
```

Don't panic on rows with different headers
```shell
> "a b c|1 2 3|1 2 3 4" | split row "|" | split column " " | headers
```
