---
title: uniq
version: 0.69.1
filters: |
  Return the distinct values in the input.
usage: |
  Return the distinct values in the input.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.filters }}</div>

## Signature

```> uniq --count --repeated --ignore-case --unique```

## Parameters

 -  `--count`: Return a table containing the distinct input values together with their counts
 -  `--repeated`: Return the input values that occur more than once
 -  `--ignore-case`: Ignore differences in case when comparing input values
 -  `--unique`: Return the input values that occur once only

## Examples

Return the distinct values of a list/table (remove duplicates so that each value occurs once only)
```shell
> [2 3 3 4] | uniq
```

Return the input values that occur more than once
```shell
> [1 2 2] | uniq -d
```

Return the input values that occur once only
```shell
> [1 2 2] | uniq -u
```

Ignore differences in case when comparing input values
```shell
> ['hello' 'goodbye' 'Hello'] | uniq -i
```

Return a table containing the distinct input values together with their counts
```shell
> [1 2 2] | uniq -c
```
