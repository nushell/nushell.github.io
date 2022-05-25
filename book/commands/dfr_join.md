---
title: dfr join
layout: command
version: 0.63.0
usage: |
  Joins a lazy frame with other lazy frame
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr join (other) (left_on) (right_on) --inner --left --outer --cross --suffix```

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
> let df_a = ([[a b c];[1 "a" 0] [2 "b" 1] [1 "c" 2] [1 "c" 3]] | dfr to-lazy);
    let df_b = ([["foo" "bar" "ham"];[1 "a" "let"] [1 "c" "var"] [1 "c" "const"]] | dfr to-lazy);
    $df_a | dfr join $df_b a foo | dfr collect
```

Join one eager dataframe with a lazy dataframe
```shell
> let df_a = ([[a b c];[1 "a" 0] [2 "b" 1] [1 "c" 2] [1 "c" 3]] | dfr to-df);
    let df_b = ([["foo" "bar" "ham"];[1 "a" "let"] [1 "c" "var"] [1 "c" "const"]] | dfr to-lazy);
    $df_a | dfr join $df_b a foo
```
