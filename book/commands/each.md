---
title: each
categories: |
  filters
version: 0.71.0
filters: |
  Run a block on each row of input
usage: |
  Run a block on each row of input
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> each (block) --keep-empty --numbered```

## Parameters

 -  `block`: the block to run
 -  `--keep-empty`: keep empty result cells
 -  `--numbered`: iterate with an index

## Notes
```text
Since tables are lists of records, passing a table into 'each' will
iterate over each record, not necessarily each cell within it.

Avoid passing single records to this command. Since a record is a
one-row structure, 'each' will only run once, behaving similar to 'do'.
To iterate over a record's values, try converting it to a table
with 'transpose' first.
```
## Examples

Multiplies elements in list
```shell
> [1 2 3] | each { |it| 2 * $it }
```

Iterate over each element, keeping only values that succeed
```shell
> [1 2 3] | each { |it| if $it == 2 { echo "found 2!"} }
```

Iterate over each element, print the matching value and its index
```shell
> [1 2 3] | each -n { |it| if $it.item == 2 { echo $"found 2 at ($it.index)!"} }
```

Iterate over each element, keeping all results
```shell
> [1 2 3] | each --keep-empty { |it| if $it == 2 { echo "found 2!"} }
```
