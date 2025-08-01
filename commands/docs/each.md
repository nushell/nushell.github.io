---
title: each
categories: |
  filters
version: 0.106.0
filters: |
  Run a closure on each row of the input list, creating a new list with the results.
usage: |
  Run a closure on each row of the input list, creating a new list with the results.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `each` for [filters](/commands/categories/filters.md)

<div class='command-title'>Run a closure on each row of the input list, creating a new list with the results.</div>

## Signature

```> each {flags} (closure)```

## Flags

 -  `--keep-empty, -k`: keep empty result cells

## Parameters

 -  `closure`: The closure to run.


## Input/output types:

| input     | output    |
| --------- | --------- |
| list&lt;any&gt; | list&lt;any&gt; |
| table     | list&lt;any&gt; |
| any       | any       |
## Examples

Multiplies elements in the list
```nu
> [1 2 3] | each {|e| 2 * $e }
╭───┬───╮
│ 0 │ 2 │
│ 1 │ 4 │
│ 2 │ 6 │
╰───┴───╯

```

Produce a list of values in the record, converted to string
```nu
> {major:2, minor:1, patch:4} | values | each {|| into string }
╭───┬───╮
│ 0 │ 2 │
│ 1 │ 1 │
│ 2 │ 4 │
╰───┴───╯

```

'null' items will be dropped from the result list. It has the same effect as 'filter_map' in other languages.
```nu
> [1 2 3 2] | each {|e| if $e == 2 { "two" } }
╭───┬─────╮
│ 0 │ two │
│ 1 │ two │
╰───┴─────╯

```

Iterate over each element, producing a list showing indexes of any 2s
```nu
> [1 2 3] | enumerate | each {|e| if $e.item == 2 { $"found 2 at ($e.index)!"} }
╭───┬───────────────╮
│ 0 │ found 2 at 1! │
╰───┴───────────────╯

```

Iterate over each element, keeping null results
```nu
> [1 2 3] | each --keep-empty {|e| if $e == 2 { "found 2!"} }
╭───┬──────────╮
│ 0 │          │
│ 1 │ found 2! │
│ 2 │          │
╰───┴──────────╯

```

## Notes
Since tables are lists of records, passing a table into 'each' will
iterate over each record, not necessarily each cell within it.

Avoid passing single records to this command. Since a record is a
one-row structure, 'each' will only run once, behaving similar to 'do'.
To iterate over a record's values, use 'items' or try converting it to a table
with 'transpose' first.

## Subcommands:

| name                                         | description                                                                                                 | type     |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------- |
| [`each while`](/commands/docs/each_while.md) | Run a closure on each row of the input list until a null is found, then create a new list with the results. | built-in |