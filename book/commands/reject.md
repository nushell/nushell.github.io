---
title: reject
version: 0.68.0
usage: |
  Remove the given columns from the table. If you want to remove rows, try 'drop'.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> reject ...rest```

## Parameters

 -  `...rest`: the names of columns to remove from the table

## Examples

Lists the files in a directory without showing the modified column
```shell
> ls | reject modified
```

Reject the specified field in a record
```shell
> echo {a: 1, b: 2} | reject a
```

Reject a nested field in a record
```shell
> echo {a: {b: 3,c: 5}} | reject a.b
```
