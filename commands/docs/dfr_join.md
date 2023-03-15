---
title: dfr join
categories: |
  lazyframe
version: 0.77.0
lazyframe: |
  Joins a lazy frame with other lazy frame.
usage: |
  Joins a lazy frame with other lazy frame.
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr join ```

## Examples

Join two lazy dataframes
```shell
> let df_a = ([[a b c];[1 "a" 0] [2 "b" 1] [1 "c" 2] [1 "c" 3]] | dfr into-lazy);
    let df_b = ([["foo" "bar" "ham"];[1 "a" "let"] [2 "c" "var"] [3 "c" "const"]] | dfr into-lazy);
    $df_a | dfr join $df_b a foo | dfr collect
╭───┬───┬───┬───┬─────┬─────╮
│ # │ a │ b │ c │ bar │ ham │
├───┼───┼───┼───┼─────┼─────┤
│ 0 │ 1 │ a │ 0 │ a   │ let │
│ 1 │ 2 │ b │ 1 │ c   │ var │
│ 2 │ 1 │ c │ 2 │ a   │ let │
│ 3 │ 1 │ c │ 3 │ a   │ let │
╰───┴───┴───┴───┴─────┴─────╯

```

Join one eager dataframe with a lazy dataframe
```shell
> let df_a = ([[a b c];[1 "a" 0] [2 "b" 1] [1 "c" 2] [1 "c" 3]] | dfr into-df);
    let df_b = ([["foo" "bar" "ham"];[1 "a" "let"] [2 "c" "var"] [3 "c" "const"]] | dfr into-lazy);
    $df_a | dfr join $df_b a foo
╭───┬───┬───┬───┬─────┬─────╮
│ # │ a │ b │ c │ bar │ ham │
├───┼───┼───┼───┼─────┼─────┤
│ 0 │ 1 │ a │ 0 │ a   │ let │
│ 1 │ 2 │ b │ 1 │ c   │ var │
│ 2 │ 1 │ c │ 2 │ a   │ let │
│ 3 │ 1 │ c │ 3 │ a   │ let │
╰───┴───┴───┴───┴─────┴─────╯

```
