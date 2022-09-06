---
title: columns
version: 0.67.1
usage: |
  Show the columns in the input.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> columns ```

## Examples

Get the columns from the table
```shell
> [[name,age,grade]; [bill,20,a]] | columns
```

Get the first column from the table
```shell
> [[name,age,grade]; [bill,20,a]] | columns | first
```

Get the second column from the table
```shell
> [[name,age,grade]; [bill,20,a]] | columns | select 1
```
