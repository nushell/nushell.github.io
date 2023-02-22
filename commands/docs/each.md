---
title: each
categories: |
  filters
version: 0.76.0
filters: |
  Run a closure on each row of the input list, creating a new list with the results.
usage: |
  Run a closure on each row of the input list, creating a new list with the results.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> each (closure) --keep-empty```

## Parameters

 -  `closure`: the closure to run
 -  `--keep-empty`: keep empty result cells

## Notes
Since tables are lists of records, passing a table into 'each' will
iterate over each record, not necessarily each cell within it.

Avoid passing single records to this command. Since a record is a
one-row structure, 'each' will only run once, behaving similar to 'do'.
To iterate over a record's values, try converting it to a table
with 'transpose' first.
## Examples

Multiplies elements in the list
```shell
> [1 2 3] | each {|e| 2 * $e }
```

Produce a list of values in the record, converted to string
```shell
> {major:2, minor:1, patch:4} | values | each { into string }
```

Produce a list that has "two" for each 2 in the input
```shell
> [1 2 3 2] | each {|e| if $e == 2 { "two" } }
```

Iterate over each element, producing a list showing indexes of any 2s
```shell
> [1 2 3] | enumerate | each {|e| if $e.item == 2 { $"found 2 at ($e.index)!"} }
```

Iterate over each element, keeping null results
```shell
> [1 2 3] | each --keep-empty {|e| if $e == 2 { "found 2!"} }
```
