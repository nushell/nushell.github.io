---
title: describe
version: 0.65.1
usage: |
  Describe the type and structure of the value(s) piped in.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> describe ```

## Examples

Describe the type of piped in variables
```shell
> 1 | describe
int
> ls | describe
table<name: string, type: string, size: filesize, modified: date>
```

Describes connection and query of to a SQLite database
```shell
> open foo.db | into db | select col_1 | from table_1 | describe
```
