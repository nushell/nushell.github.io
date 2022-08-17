---
title: join
version: 0.67.0
usage: |
  Joins a lazy frame with other lazy frame
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> join (other) (left_on) (right_on) --inner --left --outer --cross --suffix```

## Parameters

 -  `other`: LazyFrame to join with
 -  `left_on`: Left column(s) to join on
 -  `right_on`: Right column(s) to join on
 -  `--inner`: inner joing between lazyframes (default)
 -  `--left`: left join between lazyframes
 -  `--outer`: outer join between lazyframes
 -  `--cross`: cross join between lazyframes
 -  `--suffix {string}`: Suffix to use on columns with same name

## Examples

Join two lazy dataframes
```shell
> let df_a = ([[a b c];[1 "a" 0] [2 "b" 1] [1 "c" 2] [1 "c" 3]] | into lazy);
    let df_b = ([["foo" "bar" "ham"];[1 "a" "let"] [2 "c" "var"] [3 "c" "const"]] | into lazy);
    $df_a | join $df_b a foo | collect
```

Join one eager dataframe with a lazy dataframe
```shell
> let df_a = ([[a b c];[1 "a" 0] [2 "b" 1] [1 "c" 2] [1 "c" 3]] | into df);
    let df_b = ([["foo" "bar" "ham"];[1 "a" "let"] [2 "c" "var"] [3 "c" "const"]] | into lazy);
    $df_a | join $df_b a foo
```
