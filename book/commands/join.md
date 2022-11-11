---
title: join
categories: |
  database
  lazyframe
version: 0.71.0
database: |
  Joins with another table or derived table. Default join type is inner
lazyframe: |
  Joins a lazy frame with other lazy frame
usage: |
  Joins with another table or derived table. Default join type is inner
  Joins a lazy frame with other lazy frame
---

# <code>{{ $frontmatter.title }}</code> for database

<div class='command-title'>{{ $frontmatter.database }}</div>

## Signature

```> join (table) (on) --as --left --right --outer --cross```

## Parameters

 -  `table`: table or derived table to join on
 -  `on`: expression to join tables
 -  `--as {string}`: Alias for the selected join
 -  `--left`: left outer join
 -  `--right`: right outer join
 -  `--outer`: full outer join
 -  `--cross`: cross join

## Examples

joins two tables on col_b
```shell
> open db.sqlite
    | from table table_1 --as t1
    | join table_2 col_b --as t2
    | select col_a
    | describe
```

joins a table with a derived table using aliases
```shell
> open db.sqlite
    | from table table_1 --as t1
    | join (
        open db.sqlite
        | from table table_2
        | select col_c
      ) ((field t1.col_a) == (field t2.col_c)) --as t2 --right
    | select col_a
    | describe
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

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
