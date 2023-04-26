---
title: uniq
categories: |
  filters
version: 0.79.0
filters: |
  Return the distinct values in the input.
usage: |
  Return the distinct values in the input.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> uniq --count --repeated --ignore-case --unique```

## Parameters

 -  `--count` `(-c)`: Return a table containing the distinct input values together with their counts
 -  `--repeated` `(-d)`: Return the input values that occur more than once
 -  `--ignore-case` `(-i)`: Compare input values case-insensitively
 -  `--unique` `(-u)`: Return the input values that occur once only

## Examples

Return the distinct values of a list/table (remove duplicates so that each value occurs once only)
```shell
> [2 3 3 4] | uniq
╭───┬───╮
│ 0 │ 2 │
│ 1 │ 3 │
│ 2 │ 4 │
╰───┴───╯

```

Return the input values that occur more than once
```shell
> [1 2 2] | uniq -d
╭───┬───╮
│ 0 │ 2 │
╰───┴───╯

```

Return the input values that occur once only
```shell
> [1 2 2] | uniq -u
╭───┬───╮
│ 0 │ 1 │
╰───┴───╯

```

Ignore differences in case when comparing input values
```shell
> ['hello' 'goodbye' 'Hello'] | uniq -i
╭───┬─────────╮
│ 0 │ hello   │
│ 1 │ goodbye │
╰───┴─────────╯

```

Return a table containing the distinct input values together with their counts
```shell
> [1 2 2] | uniq -c
╭───┬───────┬───────╮
│ # │ value │ count │
├───┼───────┼───────┤
│ 0 │     1 │     1 │
│ 1 │     2 │     2 │
╰───┴───────┴───────╯

```
