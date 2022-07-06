---
title: uniq
version: 0.65.1
usage: |
  Return the unique rows.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> uniq --count --repeated --ignore-case --unique```

## Parameters

 -  `--count`: Count the unique rows
 -  `--repeated`: Count the rows that has more than one value
 -  `--ignore-case`: Ignore differences in case when comparing
 -  `--unique`: Only return unique values

## Examples

Remove duplicate rows of a list/table
```shell
> [2 3 3 4] | uniq
```

Only print duplicate lines, one for each group
```shell
> [1 2 2] | uniq -d
```

Only print unique lines lines
```shell
> [1 2 2] | uniq -u
```

Ignore differences in case when comparing
```shell
> ['hello' 'goodbye' 'Hello'] | uniq -i
```

Remove duplicate rows and show counts of a list/table
```shell
> [1 2 2] | uniq -c
```
