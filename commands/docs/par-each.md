---
title: par-each
categories: |
  filters
version: 0.83.0
filters: |
  Run a closure on each row of the input list in parallel, creating a new list with the results.
usage: |
  Run a closure on each row of the input list in parallel, creating a new list with the results.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> par-each (closure) --threads```

## Parameters

 -  `closure`: the closure to run
 -  `--threads {int}`: the number of threads to use

## Examples

Multiplies each number. Note that the list will become arbitrarily disordered.
```shell
> [1 2 3] | par-each {|| 2 * $in }

```

Output can still be sorted afterward
```shell
> [foo bar baz] | par-each {|e| $e + '!' } | sort
╭───┬──────╮
│ 0 │ bar! │
│ 1 │ baz! │
│ 2 │ foo! │
╰───┴──────╯

```

Enumerate and sort-by can be used to reconstruct the original order
```shell
> 1..3 | enumerate | par-each {|p| update item ($p.item * 2)} | sort-by item | get item
╭───┬───╮
│ 0 │ 2 │
│ 1 │ 4 │
│ 2 │ 6 │
╰───┴───╯

```

Iterate over each element, producing a list showing indexes of any 2s
```shell
> [1 2 3] | enumerate | par-each { |e| if $e.item == 2 { $"found 2 at ($e.index)!"} }
╭───┬───────────────╮
│ 0 │ found 2 at 1! │
╰───┴───────────────╯

```
