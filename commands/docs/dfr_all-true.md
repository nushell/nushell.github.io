---
title: dfr all-true
categories: |
  dataframe
version: 0.77.0
dataframe: |
  Returns true if all values are true.
usage: |
  Returns true if all values are true.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr all-true ```

## Examples

Returns true if all values are true
```shell
> [true true true] | dfr into-df | dfr all-true
╭───┬──────────╮
│ # │ all_true │
├───┼──────────┤
│ 0 │ true     │
╰───┴──────────╯

```

Checks the result from a comparison
```shell
> let s = ([5 6 2 8] | dfr into-df);
    let res = ($s > 9);
    $res | dfr all-true
╭───┬──────────╮
│ # │ all_true │
├───┼──────────┤
│ 0 │ false    │
╰───┴──────────╯

```
