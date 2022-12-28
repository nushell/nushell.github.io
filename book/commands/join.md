---
title: join
categories: |
  lazyframe
version: 0.73.1
lazyframe: |
  Joins a lazy frame with other lazy frame
usage: |
  Joins a lazy frame with other lazy frame
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> join ```

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
