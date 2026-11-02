# Dataframes

::: warning 重要！
此功能需要 Polars 插件。请参阅[插件章节](plugins.md)以了解如何安装它。

要测试此插件是否已正确安装，请运行 `help polars`。
:::

正如我们到目前为止所看到的，Nushell 把处理数据作为其主要任务。
`Lists` 和 `Tables` 的存在是为了帮助你循环处理值，以便执行多种操作或轻而易举地找到数据。然而，在某些操作中，基于行的数据布局并不是处理数据的最有效方式，特别是在处理极其庞大的文件时。对于大型数据集的`group-by`或`join`等操作，如果不使用适当的数据格式，会占用大量的内存，并可能耗费大量的计算时间。

出于这个原因，`DataFrame` 结构被引入到 Nushell 中。`DataFrame` 以列格式存储数据，以 [Apache Arrow](https://arrow.apache.org/) 规范为基础，并使用 [Polars](https://github.com/pola-rs/polars) 作为执行极其[快速列式操作](https://h2oai.github.io/db-benchmark/) 的引擎。

你现在可能想知道这个组合能有多快，以及它如何能使数据工作更容易、更可靠。出于这个原因，我们将从本章开始，介绍处理数据时常见操作的性能测试情况。

[[toc]]

## 性能测试对比

在这个小的性能测试练习中，我们将比较本地的 Nushell 原生命令、Nushell DataFrame 相关命令和[Python Pandas](https://pandas.pydata.org/)命令。暂时不要太在意[`Dataframe` 命令](/commands/categories/dataframe.md)，它们将在本页后面的章节中解释。

::: tip 系统细节
本节介绍的性能测试是用一台配备 M1 pro 处理器和 32gb 内存的 Macbook 运行的。计时是在 Nushell 0.97 版本上使用 `nu_plugin_polars 0.97` 测量的，因此仅供参考。当前版本的 `bench --pretty` 会以完整精度打印时长。
:::

### 文件信息

我们将用于性能测试的文件是 [新西兰商业人口统计](https://www.stats.govt.nz/assets/Uploads/New-Zealand-business-demography-statistics/New-Zealand-business-demography-statistics-At-February-2020/Download-data/Geographic-units-by-industry-and-statistical-area-2000-2020-descending-order-CSV.zip) 数据集。
如果你想尝试这些测试，请下载该文件。

该数据集有 5 列，5,429,252 行。我们可以通过使用`polars store-ls`命令来检查：

```nu
let df_0 = polars open --eager Data7602DescendingYearOrder.csv
polars store-ls | select key type columns rows estimated_size
# => ╭───┬──────────────────────────────────────┬───────────┬─────────┬─────────┬────────────────╮
# => │ # │                 key                  │   type    │ columns │  rows   │ estimated_size │
# => ├───┼──────────────────────────────────────┼───────────┼─────────┼─────────┼────────────────┤
# => │ 0 │ 468d6c93-d7ee-4596-8d80-5893f03380cf │ DataFrame │       5 │ 5429252 │       184.4 MB │
# => ╰───┴──────────────────────────────────────┴───────────┴─────────┴─────────┴────────────────╯
```

::: tip
`polars open` 默认以惰性 dataframe 打开文件。
要作为即时 dataframe 打开，请使用 `--eager` 标志。
:::

我们可以用 [`polars first`](/commands/docs/polars_first.md) 看一下文件的第一行：

```nu
$df_0 | polars first
# => ╭───┬──────────┬─────────┬──────┬───────────┬──────────╮
# => │ # │ anzsic06 │  Area   │ year │ geo_count │ ec_count │
# => ├───┼──────────┼─────────┼──────┼───────────┼──────────┤
# => │ 0 │ A        │ A100100 │ 2000 │        96 │      130 │
# => ╰───┴──────────┴─────────┴──────┴───────────┴──────────╯
```

...最后，我们可以了解一下推断出的数据类型：

```nu
$df_0 | polars schema
# => ╭───────────┬─────╮
# => │ anzsic06  │ str │
# => │ Area      │ str │
# => │ year      │ i64 │
# => │ geo_count │ i64 │
# => │ ec_count  │ i64 │
# => ╰───────────┴─────╯
```

### `Group-by`比较

为了输出更具统计意义的计时，让我们加载并使用 `std bench` 命令。

```nu
use std/bench
```

我们将按年份对数据进行分组，并对 `geo_count` 列求和。

首先，让我们测量一下 Nushell 原生命令管道的性能。

```nu
bench -n 10 --pretty {
    open 'Data7602DescendingYearOrder.csv'
    | group-by year --to-table
    | update items {|i|
        $i.items.geo_count
        | math sum
    }
}
# => 3sec 268ms +/- 50ms
```

所以，执行这个聚合操作需要 3.3 秒。

让我们试试在 pandas 中进行同样的操作：

```nu
('import pandas as pd

df = pd.read_csv("Data7602DescendingYearOrder.csv")
res = df.groupby("year")["geo_count"].sum()
print(res)'
| save load.py -f)
```

而性能测试的结果是：

```nu
bench -n 10 --pretty {
    python load.py | complete | null
}
# => 1sec 322ms +/- 6ms
```

一点也不差！Pandas 设法比 Nushell 快了 2.6 倍。
对于更大的文件，Pandas 的优势应该会增加。

为了进行比较，让我们试试 Nushell dataframes。我们要把所有的操作放在一个`nu`文件中，以确保我们做的是正确的比较：

```nu
( 'polars open Data7602DescendingYearOrder.csv
    | polars group-by year
    | polars agg (polars col geo_count | polars sum)
    | polars collect'
| save load.nu -f )
```

而 dataframes 的性能测试结果（为了公平比较，每次测试都加载一个新的 nushell 和 `polars` 实例）是：

```nu
bench -n 10 --pretty {
    nu load.nu | complete | null
}
# => 135ms +/- 4ms
```

`polars` dataframes 插件设法比 `pandas` 和 python 快 10 倍。这不是很好吗？

正如你所看到的，Nushell 的 `polars` 插件和 `polars` 本身一样高效。
结合 Nushell 命令和管道，它能够在不离开终端的情况下进行复杂的分析。

让我们清理一下我们在基准测试期间使用的 dataframe 的缓存。
为此，让我们停止 `polars`。
当我们执行下一个命令时，我们将启动一个新的插件实例。

```nu
plugin stop polars
```

## 使用 Dataframes

在看到了可以用[`Dataframe` 命令](/commands/categories/dataframe.md)完成的事情之后，现在是时候开始测试它们了。首先，让我们创建一个样本 CSV 文件，该文件将成为我们的样本 dataframe，并与示例一起使用。在你喜欢的编辑器中粘贴下面几行来创建样本 csv 文件：

```nu
("int_1,int_2,float_1,float_2,first,second,third,word
1,11,0.1,1.0,a,b,c,first
2,12,0.2,1.0,a,b,c,second
3,13,0.3,2.0,a,b,c,third
4,14,0.4,3.0,b,a,c,second
0,15,0.5,4.0,b,a,a,third
6,16,0.6,5.0,b,a,a,second
7,17,0.7,6.0,b,c,a,third
8,18,0.8,7.0,c,c,b,eight
9,19,0.9,8.0,c,c,b,ninth
0,10,0.0,9.0,c,c,b,ninth"
| save --raw --force test_small.csv)
```

保存该文件并随意命名，在这些例子中，该文件将被称为 `test_small.csv`。

现在，要将该文件作为 dataframe 进行读取，请使用 `polars open` 命令，如下所示：

```nu
let df_1 = polars open --eager test_small.csv
```

这应该会在内存中创建一个值 `$df_1`，用来存放我们刚刚创建的数据。

::: tip
`polars open` 命令可以读取 **csv**、**tsv**、**parquet**、**json(l)**、**arrow** 和 **avro** 格式的文件。
:::

要查看存储在内存中的所有 dataframes，你可以使用：

```nu
polars store-ls | select key type columns rows estimated_size
# => ╭───┬──────────────────────────────────────┬───────────┬─────────┬──────┬────────────────╮
# => │ # │                 key                  │   type    │ columns │ rows │ estimated_size │
# => ├───┼──────────────────────────────────────┼───────────┼─────────┼──────┼────────────────┤
# => │ 0 │ e780af47-c106-49eb-b38d-d42d3946d66e │ DataFrame │       8 │   10 │          403 B │
# => ╰───┴──────────────────────────────────────┴───────────┴─────────┴──────┴────────────────╯
```

正如你所看到的，该命令显示了所创建的 dataframes 以及关于它们的基本信息。

如果你想看到加载的 dataframe 的预览，你可以将 dataframe 变量发送到流中：

```nu
$df_1
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┤
# => │ 0 │     1 │    11 │    0.10 │    1.00 │ a     │ b      │ c     │ first  │
# => │ 1 │     2 │    12 │    0.20 │    1.00 │ a     │ b      │ c     │ second │
# => │ 2 │     3 │    13 │    0.30 │    2.00 │ a     │ b      │ c     │ third  │
# => │ 3 │     4 │    14 │    0.40 │    3.00 │ b     │ a      │ c     │ second │
# => │ 4 │     0 │    15 │    0.50 │    4.00 │ b     │ a      │ a     │ third  │
# => │ 5 │     6 │    16 │    0.60 │    5.00 │ b     │ a      │ a     │ second │
# => │ 6 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third  │
# => │ 7 │     8 │    18 │    0.80 │    7.00 │ c     │ c      │ b     │ eight  │
# => │ 8 │     9 │    19 │    0.90 │    8.00 │ c     │ c      │ b     │ ninth  │
# => │ 9 │     0 │    10 │    0.00 │    9.00 │ c     │ c      │ b     │ ninth  │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────╯
```

有了内存中的 dataframe，我们就可以开始对 `DataFrame` 进行列操作。

::: tip
如果你想看到所有可用的 dataframe 命令，你可以使用 `scope commands | where category =~ dataframe`。
:::

## 基本聚合

让我们从 dataframe 的基本聚合开始。让我们使用 [`polars sum`](/commands/docs/polars_sum.md) 命令对 `df` 中存在的所有列进行求和：

```nu
$df_1 | polars sum | polars collect
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬──────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │ word │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼──────┤
# => │ 0 │    40 │   145 │    4.50 │   46.00 │       │        │       │      │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴──────╯
```

正如你所看到的，聚合函数为那些有意义的列计算出了总和。如果你想过滤掉文本列，你可以使用[`polars select`](/commands/docs/polars_select.md)命令来选择你想要的列。

```nu
$df_1 | polars sum | polars select int_1 int_2 float_1 float_2 | polars collect
# => ╭───┬───────┬───────┬─────────┬─────────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │
# => ├───┼───────┼───────┼─────────┼─────────┤
# => │ 0 │    40 │   145 │    4.50 │   46.00 │
# => ╰───┴───────┴───────┴─────────┴─────────╯
```

你甚至可以像存储任何其他 Nushell 变量一样存储这个聚合的结果：

```nu
let res = $df_1 | polars sum | polars select int_1 int_2 float_1 float_2
```

::: tip
输入 `let res = !!` 并按回车，这将自动完成之前执行的命令。注意 `=` 和 `!!` 之间的空格。
:::

现在我们有两个 dataframe 存储在内存中。`polars sum` 返回惰性 dataframe，所以 `$res` 被列为 `LazyFrame`。`polars store-ls` 不会以固定的顺序列出存储的对象，所以我们按它们的 `created` 时间排序：

```nu
polars store-ls | sort-by created | select key type columns rows estimated_size
# => ╭───┬──────────────────────────────────────┬───────────┬─────────┬──────┬────────────────╮
# => │ # │                 key                  │   type    │ columns │ rows │ estimated_size │
# => ├───┼──────────────────────────────────────┼───────────┼─────────┼──────┼────────────────┤
# => │ 0 │ e780af47-c106-49eb-b38d-d42d3946d66e │ DataFrame │       8 │   10 │          403 B │
# => │ 1 │ 3146f4c1-f2a0-475b-a623-7375c1fdb4a7 │ LazyFrame │       4 │    1 │           32 B │
# => ╰───┴──────────────────────────────────────┴───────────┴─────────┴──────┴────────────────╯
```

很整洁，不是吗？

你可以在 dataframe 上进行若干聚合，以便从中提取基本信息，也可以对你的全新 dataframe 进行基本数据分析。

## 连接 DataFrame

也可以用一个列作为参考来连接(`join`)两个 dataframe。我们将把我们的迷你 dataframe 与另一个迷你 dataframe 连接起来。在另一个文件中复制这些行，并创建相应的 dataframe（在以下例子中，我们将称之为`test_small_a.csv`）。

```nu
"int_1,int_2,float_1,float_2,first
9,14,0.4,3.0,a
8,13,0.3,2.0,a
7,12,0.2,1.0,a
6,11,0.1,0.0,b"
| save --raw --force test_small_a.csv
```

我们使用 `polars open` 命令来创建新的变量：

```nu
let df_2 = polars open --eager test_small_a.csv
```

现在，当第二个 dataframe 加载到内存中时，我们可以使用左边 dataframe 的`int_1`列和右边 dataframe 的`int_1`列来连接它们。

```nu
$df_1 | polars join $df_2 int_1 int_1
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────┬─────────┬───────────┬───────────┬─────────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │ int_2_x │ float_1_x │ float_2_x │ first_x │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┼─────────┼───────────┼───────────┼─────────┤
# => │ 0 │     6 │    16 │    0.60 │    5.00 │ b     │ a      │ a     │ second │      11 │      0.10 │      0.00 │ b       │
# => │ 1 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third  │      12 │      0.20 │      1.00 │ a       │
# => │ 2 │     8 │    18 │    0.80 │    7.00 │ c     │ c      │ b     │ eight  │      13 │      0.30 │      2.00 │ a       │
# => │ 3 │     9 │    19 │    0.90 │    8.00 │ c     │ c      │ b     │ ninth  │      14 │      0.40 │      3.00 │ a       │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────┴─────────┴───────────┴───────────┴─────────╯
```

::: tip
在`Nu`中，当一个命令有多个参数，并期望得到多个值时，我们用方括号`[]`来包裹这些值。在[`polars join`](/commands/docs/polars_join.md)的情况下，我们可以对多个列进行连接，只要它们具有相同的类型。
:::

例如：

```nu
$df_1 | polars join $df_2 [int_1 first] [int_1 first]
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────┬─────────┬───────────┬───────────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │ int_2_x │ float_1_x │ float_2_x │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┼─────────┼───────────┼───────────┤
# => │ 0 │     6 │    16 │    0.60 │    5.00 │ b     │ a      │ a     │ second │      11 │      0.10 │      0.00 │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────┴─────────┴───────────┴───────────╯
```

默认情况下，连接命令做的是内连接，也就是说，它将保留两个 dataframe 都有相同值的记录。你可以选择一个左联接来保留左边 dataframe 中缺失的行。你也可以保存这个结果，以便在以后的操作中使用它。

## DataFrame 分组

可以用 DataFrame 进行的最强大的操作之一是[`polars group-by`](/commands/docs/polars_group-by.md)。这个命令将允许你根据一个分组条件进行聚合操作。在 Nushell 中，`GroupBy`是一种可以被存储和重复使用的对象，可以被用于多个聚合。这是很方便的，因为在进行分组时，创建分组对是最昂贵的运算，如果你打算用同一个分组条件进行多个操作，就没有必要重复该运算。

要创建一个`GroupBy`对象，你只需要使用[`polars group-by`](/commands/docs/polars_group-by.md)命令：

```nu
let group = $df_1 | polars group-by first
$group
# => ╭─────────────┬──────────────────────────────────────────────╮
# => │ LazyGroupBy │ apply aggregation to complete execution plan │
# => ╰─────────────┴──────────────────────────────────────────────╯
```

当打印 `GroupBy` 对象时，我们可以看到它在后台是一个懒惰的操作，等待着通过添加一个聚合来完成。使用 `GroupBy` 我们可以在一个列上创建聚合

```nu
$group | polars agg (polars col int_1 | polars sum)
# => ╭────────────────┬───────────────────────────────────────────────────────────────────────────────────────────╮
# => │ plan           │ AGGREGATE[maintain_order: false]                                                          │
# => │                │   [col("int_1").sum()] BY [col("first")]                                                  │
# => │                │   FROM                                                                                    │
# => │                │   DF ["int_1", "int_2", "float_1", "float_2", ...]; PROJECT */8 COLUMNS                   │
# => │ optimized_plan │ AGGREGATE[maintain_order: false]                                                          │
# => │                │   [col("int_1").sum()] BY [col("first")]                                                  │
# => │                │   FROM                                                                                    │
# => │                │   DF ["int_1", "int_2", "float_1", "float_2", ...]; PROJECT["first", "int_1"] 2/8 COLUMNS │
# => ╰────────────────┴───────────────────────────────────────────────────────────────────────────────────────────╯
```

或者我们可以在相同或不同的列上定义多个聚合：

```nu
$group
| polars agg [
    (polars col int_1 | polars n-unique)
    (polars col int_2 | polars min)
    (polars col float_1 | polars sum)
    (polars col float_2 | polars count)
] | polars sort-by first
# => ╭────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
# => │ plan           │ SORT BY [col("first")]                                                                                               │
# => │                │   AGGREGATE[maintain_order: false]                                                                                   │
# => │                │     [col("int_1").n_unique(), col("int_2").min(), col("float_1").sum(), col("float_2").count()] BY [col("first")]    │
# => │                │     FROM                                                                                                             │
# => │                │     DF ["int_1", "int_2", "float_1", "float_2", ...]; PROJECT */8 COLUMNS                                            │
# => │ optimized_plan │ SORT BY [col("first")]                                                                                               │
# => │                │   AGGREGATE[maintain_order: false]                                                                                   │
# => │                │     [col("int_1").n_unique(), col("int_2").min(), col("float_1").sum(), col("float_2").count()] BY [col("first")]    │
# => │                │     FROM                                                                                                             │
# => │                │     DF ["int_1", "int_2", "float_1", "float_2", ...]; PROJECT["first", "int_1", "int_2", "float_1", ...] 5/8 COLUMNS │
# => ╰────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

正如你所看到的，`GroupBy`对象是一个非常强大的变量，在你操作数据集时，它值得被保留在内存中。

## 创建 DataFrames

也可以从基本的 Nushell 基础类型，如整数、小数或字符串，来构建 dataframes。让我们使用 `polars into-df` 命令来创建一个小的 dataframe：

```nu
let df_3 = [[a b]; [1 2] [3 4] [5 6]] | polars into-df
$df_3
# => ╭───┬───┬───╮
# => │ # │ a │ b │
# => ├───┼───┼───┤
# => │ 0 │ 1 │ 2 │
# => │ 1 │ 3 │ 4 │
# => │ 2 │ 5 │ 6 │
# => ╰───┴───┴───╯
```

::: tip
并非每个 Nushell 值都有对应的 dataframe 类型。无法转换的值（例如闭包或混合类型的列表）会被存放在一个具有通用 `object` 类型的列中。
:::

我们可以在一个 dataframe 中添加列，以创建一个新的变量。作为一个例子，让我们在迷你 dataframe `$df_3` 上添加两列：

```nu
let df_4 = $df_3 | polars with-column $df_3.a --name a2 | polars with-column $df_3.a --name a3
$df_4
# => ╭───┬───┬───┬────┬────╮
# => │ # │ a │ b │ a2 │ a3 │
# => ├───┼───┼───┼────┼────┤
# => │ 0 │ 1 │ 2 │  1 │  1 │
# => │ 1 │ 3 │ 4 │  3 │  3 │
# => │ 2 │ 5 │ 6 │  5 │  5 │
# => ╰───┴───┴───┴────┴────╯
```

Nushell 强大的管道语法允许我们通过从其他 dataframes 中获取数据并将其附加到这些 dataframes 中来创建新的 dataframes。现在，如果你列出存储的对象，你会看到总共五个 dataframe 和 `GroupBy` 对象。`GroupBy` 对象没有 `created` 时间，所以我们按可选的 `created?` 列排序，它会排在最后。

```nu
polars store-ls | sort-by created? | select key type columns rows estimated_size
# => ╭───┬──────────────────────────────────────┬─────────────┬─────────┬──────┬────────────────╮
# => │ # │                 key                  │    type     │ columns │ rows │ estimated_size │
# => ├───┼──────────────────────────────────────┼─────────────┼─────────┼──────┼────────────────┤
# => │ 0 │ e780af47-c106-49eb-b38d-d42d3946d66e │ DataFrame   │       8 │   10 │          403 B │
# => │ 1 │ 3146f4c1-f2a0-475b-a623-7375c1fdb4a7 │ LazyFrame   │       4 │    1 │           32 B │
# => │ 2 │ 455a1483-e328-43e2-a354-35afa32803b9 │ DataFrame   │       5 │    4 │          132 B │
# => │ 3 │ 9504dfaf-4782-42d4-9110-9dae7c8fb95b │ DataFrame   │       2 │    3 │           48 B │
# => │ 4 │ 37ab1bdc-e1fb-426d-8006-c3f974764a3d │ DataFrame   │       4 │    3 │           96 B │
# => │ 5 │ 0d8532a5-083b-4f78-8f66-b5e6b59dc449 │ LazyGroupBy │         │      │                │
# => ╰───┴──────────────────────────────────────┴─────────────┴─────────┴──────┴────────────────╯
```

值得一提的是，在使用 dataframe 时，内存是如何被优化的呢？这要感谢 **Apache Arrow** 和 **Polars**。在一个非常简单的表示中，dataframe 中的每一列都是一个 Arrow 数组，它使用了几种内存规格，以塞满尽可能多的数据（查看 [Arrow 列格式](https://arrow.apache.org/docs/format/Columnar.html) ）；另一个优化技巧是，只要有可能，dataframe 中的列就会在多个 dataframes 之间共享，避免了相同数据的内存重复占用。这意味着 dataframe `$df_3`和`$df_4`共享我们用 `polars into-df` 命令创建的两个列。由于这个原因，不能改变 dataframe 中某一列的值。然而，你可以根据其他列或 dataframes 的数据创建新的列。

## 使用系列

`Series` 是 `DataFrame` 的基本组成部分。每个 Series 代表一个具有相同数据类型的列，我们可以创建多个不同类型的 Series，如浮点、整型或字符串。

让我们通过使用 `polars into-df` 命令创建一个系列，来开始我们对系列的探索：

```nu
let df_5 = [9 8 4] | polars into-df
$df_5
# => ╭───┬───╮
# => │ # │ 0 │
# => ├───┼───┤
# => │ 0 │ 9 │
# => │ 1 │ 8 │
# => │ 2 │ 4 │
# => ╰───┴───╯
```

我们从一个整数列表创建了一个新的系列（我们也可以用浮点数或字符串做同样的事情）。

系列已经定义了自己的基本操作，它们可以用来创建其他系列。让我们通过对先前创建的列进行一些运算来创建一个新的系列：

```nu
let df_6 = $df_5 * 3 + 10
$df_6
# => ╭───┬────╮
# => │ # │ 0  │
# => ├───┼────┤
# => │ 0 │ 37 │
# => │ 1 │ 34 │
# => │ 2 │ 22 │
# => ╰───┴────╯
```

现在我们有一个新的系列，它是通过对前一个变量进行基本操作而构建的。

::: tip
如果你想看看你在内存中存储了多少变量，你可以使用`scope variables`。
:::

让我们重新命名我们之前的系列为 `memorable`

```nu
let df_7 = $df_6 | polars rename "0" memorable
$df_7
# => ╭───┬───────────╮
# => │ # │ memorable │
# => ├───┼───────────┤
# => │ 0 │        37 │
# => │ 1 │        34 │
# => │ 2 │        22 │
# => ╰───┴───────────╯
```

只要两个系列的数据类型相同，我们也可以对它们进行基本操作：

```nu
$df_5 - $df_7
# => ╭───┬─────────────────╮
# => │ # │ sub_0_memorable │
# => ├───┼─────────────────┤
# => │ 0 │             -28 │
# => │ 1 │             -26 │
# => │ 2 │             -18 │
# => ╰───┴─────────────────╯
```


而且我们可以将它们添加到先前定义的 DataFrames 中：

```nu
let df_8 = $df_3 | polars with-column $df_5 --name new_col
$df_8
# => ╭───┬───┬───┬─────────╮
# => │ # │ a │ b │ new_col │
# => ├───┼───┼───┼─────────┤
# => │ 0 │ 1 │ 2 │       9 │
# => │ 1 │ 3 │ 4 │       8 │
# => │ 2 │ 5 │ 6 │       4 │
# => ╰───┴───┴───┴─────────╯
```

存储在 DataFrame 中的系列也可以直接使用，例如，我们可以将列`a`和`b`相乘来创建一个新系列：

```nu
$df_8.a * $df_8.b
# => ╭───┬─────────╮
# => │ # │ mul_a_b │
# => ├───┼─────────┤
# => │ 0 │       2 │
# => │ 1 │      12 │
# => │ 2 │      30 │
# => ╰───┴─────────╯
```

我们可以开始使用管道，以创建新的列和 DataFrames：

```nu
let df_9 = $df_8 | polars with-column ($df_8.a * $df_8.b / $df_8.new_col) --name my_sum
$df_9
# => ╭───┬───┬───┬─────────┬────────╮
# => │ # │ a │ b │ new_col │ my_sum │
# => ├───┼───┼───┼─────────┼────────┤
# => │ 0 │ 1 │ 2 │       9 │      0 │
# => │ 1 │ 3 │ 4 │       8 │      1 │
# => │ 2 │ 5 │ 6 │       4 │      7 │
# => ╰───┴───┴───┴─────────┴────────╯
```

Nushell 的管道系统可以帮助你创建非常有趣的工作流程。

## 系列和掩码

系列在使用 `DataFrames` 时还有另一个关键用途，那就是我们可以用它们来建立布尔掩码（Mask）。让我们先用等于运算符创建一个简单的掩码：

```nu
let mask_0 = $df_5 == 8
$mask_0
# => ╭───┬───────╮
# => │ # │   0   │
# => ├───┼───────┤
# => │ 0 │ false │
# => │ 1 │ true  │
# => │ 2 │ false │
# => ╰───┴───────╯
```

有了这个掩码，我们现在可以过滤一个 DataFrame，像这样：

```nu
$df_9 | polars filter-with $mask_0
# => ╭───┬───┬───┬─────────┬────────╮
# => │ # │ a │ b │ new_col │ my_sum │
# => ├───┼───┼───┼─────────┼────────┤
# => │ 0 │ 3 │ 4 │       8 │      1 │
# => ╰───┴───┴───┴─────────┴────────╯
```

现在我们有一个新的 DataFrame，其中只有掩码为真的值。

掩码也可以从 Nushell 列表中创建，比如：

```nu
let mask_1 = [true true false] | polars into-df
$df_9 | polars filter-with $mask_1
# => ╭───┬───┬───┬─────────┬────────╮
# => │ # │ a │ b │ new_col │ my_sum │
# => ├───┼───┼───┼─────────┼────────┤
# => │ 0 │ 1 │ 2 │       9 │      0 │
# => │ 1 │ 3 │ 4 │       8 │      1 │
# => ╰───┴───┴───┴─────────┴────────╯
```

为了创建复杂的掩码，我们可以使用`AND`：

```nu
$mask_0 and $mask_1
# => ╭───┬─────────╮
# => │ # │ and_0_0 │
# => ├───┼─────────┤
# => │ 0 │ false   │
# => │ 1 │ true    │
# => │ 2 │ false   │
# => ╰───┴─────────╯
```

或者 `OR` 操作：

```nu
$mask_0 or $mask_1
# => ╭───┬────────╮
# => │ # │ or_0_0 │
# => ├───┼────────┤
# => │ 0 │ true   │
# => │ 1 │ true   │
# => │ 2 │ false  │
# => ╰───┴────────╯
```

我们也可以通过检查某些值是否存在于其他系列来创建一个掩码。使用我们创建的第一个 DataFrame，我们可以这样做：

```nu
let mask_2 = $df_1 | polars col first | polars is-in ([b c] | polars into-df)
$mask_2 | describe
# => polars_expression
```

这次的掩码是一个表达式，而不是布尔值系列，但它可以用来以相同的方式过滤 dataframe

```nu
$df_1 | polars filter-with $mask_2
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┤
# => │ 0 │     4 │    14 │    0.40 │    3.00 │ b     │ a      │ c     │ second │
# => │ 1 │     0 │    15 │    0.50 │    4.00 │ b     │ a      │ a     │ third  │
# => │ 2 │     6 │    16 │    0.60 │    5.00 │ b     │ a      │ a     │ second │
# => │ 3 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third  │
# => │ 4 │     8 │    18 │    0.80 │    7.00 │ c     │ c      │ b     │ eight  │
# => │ 5 │     9 │    19 │    0.90 │    8.00 │ c     │ c      │ b     │ ninth  │
# => │ 6 │     0 │    10 │    0.00 │    9.00 │ c     │ c      │ b     │ ninth  │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────╯
```

另一个可以用掩码进行的操作是设置或替换一个系列的值。例如，我们可以改变列 `first` 中的值，如果该值等于 `a`：

```nu
$df_1 | polars get first | polars set new --mask ($df_1.first =~ a)
# => ╭───┬────────╮
# => │ # │ string │
# => ├───┼────────┤
# => │ 0 │ new    │
# => │ 1 │ new    │
# => │ 2 │ new    │
# => │ 3 │ b      │
# => │ 4 │ b      │
# => │ 5 │ b      │
# => │ 6 │ b      │
# => │ 7 │ c      │
# => │ 8 │ c      │
# => │ 9 │ c      │
# => ╰───┴────────╯
```

## 系列作为索引

系列也可以作为过滤 DataFrame 的一种方式，将它们作为索引列表使用。例如，假设我们想从原始 DataFrame 中获取第1、4和6行。针对这一点，我们可以使用以下命令来提取这些信息：

```nu
let indices_0 = [1 4 6] | polars into-df
$df_1 | polars take $indices_0
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┤
# => │ 0 │     2 │    12 │    0.20 │    1.00 │ a     │ b      │ c     │ second │
# => │ 1 │     0 │    15 │    0.50 │    4.00 │ b     │ a      │ a     │ third  │
# => │ 2 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third  │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────╯
```

命令  [`polars take`](/commands/docs/polars_take.md) 非常方便，特别是当我们把它与其他命令混合使用时。
假设我们想提取 `first` 列中含有第一个重复的元素的所有记录。为了做到这一点，我们可以使用 `polars arg-unique` 命令，如下例所示：

```nu
let indices_1 = $df_1 | polars get first | polars arg-unique
$df_1 | polars take $indices_1
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┤
# => │ 0 │     1 │    11 │    0.10 │    1.00 │ a     │ b      │ c     │ first  │
# => │ 1 │     4 │    14 │    0.40 │    3.00 │ b     │ a      │ c     │ second │
# => │ 2 │     8 │    18 │    0.80 │    7.00 │ c     │ c      │ b     │ eight  │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────╯
```

或者，如果我们想使用一个特定的列来创建一个新的有序 DataFrame，该怎么办？我们可以使用`arg-sort`来完成这个任务。在下一个例子中，我们可以通过`word`列对 DataFrame 进行排序：

::: tip
同样的结果也可以用 [`polars sort-by`](/commands/docs/polars_sort-by.md) 命令来完成。
:::

```nu
let indices_2 = $df_1 | polars get word | polars arg-sort
$df_1 | polars take $indices_2
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┤
# => │ 0 │     8 │    18 │    0.80 │    7.00 │ c     │ c      │ b     │ eight  │
# => │ 1 │     1 │    11 │    0.10 │    1.00 │ a     │ b      │ c     │ first  │
# => │ 2 │     9 │    19 │    0.90 │    8.00 │ c     │ c      │ b     │ ninth  │
# => │ 3 │     0 │    10 │    0.00 │    9.00 │ c     │ c      │ b     │ ninth  │
# => │ 4 │     2 │    12 │    0.20 │    1.00 │ a     │ b      │ c     │ second │
# => │ 5 │     4 │    14 │    0.40 │    3.00 │ b     │ a      │ c     │ second │
# => │ 6 │     6 │    16 │    0.60 │    5.00 │ b     │ a      │ a     │ second │
# => │ 7 │     3 │    13 │    0.30 │    2.00 │ a     │ b      │ c     │ third  │
# => │ 8 │     0 │    15 │    0.50 │    4.00 │ b     │ a      │ a     │ third  │
# => │ 9 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third  │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────╯
```

最后，我们可以通过在标记的索引中设置一个新值来创建新的系列。请看下一条命令：

```nu
let indices_3 = [0 2] | polars into-df
$df_1 | polars get int_1 | polars set-with-idx 123 --indices $indices_3
# => ╭───┬───────╮
# => │ # │ int_1 │
# => ├───┼───────┤
# => │ 0 │   123 │
# => │ 1 │     2 │
# => │ 2 │   123 │
# => │ 3 │     4 │
# => │ 4 │     0 │
# => │ 5 │     6 │
# => │ 6 │     7 │
# => │ 7 │     8 │
# => │ 8 │     9 │
# => │ 9 │     0 │
# => ╰───┴───────╯
```

## 唯一值

另一个可以用`Series`完成的操作是在一个列表或列中搜索唯一值。让我们再次使用我们创建的第一个 DataFrame 来测试这些操作。

第一个也是最常见的操作是 `polars value-counts`。这个命令计算出一个系列中存在的唯一值的数量。例如，我们可以用它来计算 `first` 列各值的出现次数。`polars value-counts` 返回的行的顺序是不确定的，所以我们用 `polars sort-by` 对它们排序。

```nu
$df_1 | polars get first | polars value-counts | polars sort-by first
# => ╭───┬───────┬───────╮
# => │ # │ first │ count │
# => ├───┼───────┼───────┤
# => │ 0 │ a     │     3 │
# => │ 1 │ b     │     4 │
# => │ 2 │ c     │     3 │
# => ╰───┴───────┴───────╯
```

正如预期的那样，该命令返回一个新的 DataFrame，可以用来做更多的查询。

继续我们对 `Series` 的探索，我们要做的下一件事是只从一个系列中获得唯一值（同样做了排序，因为顺序是不确定的），像这样：

```nu
$df_1 | polars get first | polars unique | polars sort-by first
# => ╭───┬───────╮
# => │ # │ first │
# => ├───┼───────┤
# => │ 0 │ a     │
# => │ 1 │ b     │
# => │ 2 │ c     │
# => ╰───┴───────╯
```

或者我们可以得到一个掩码，用来过滤出数据唯一或重复的行。例如，我们可以选择列 `word` 中含唯一值的行：

```nu
$df_1 | polars filter-with ($in.word | polars is-unique)
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬───────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │ word  │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼───────┤
# => │ 0 │     1 │    11 │    0.10 │    1.00 │ a     │ b      │ c     │ first │
# => │ 1 │     8 │    18 │    0.80 │    7.00 │ c     │ c      │ b     │ eight │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴───────╯
```

或所有含重复值的行：

```nu
$df_1 | polars filter-with ($in.word | polars is-duplicated)
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┤
# => │ 0 │     2 │    12 │    0.20 │    1.00 │ a     │ b      │ c     │ second │
# => │ 1 │     3 │    13 │    0.30 │    2.00 │ a     │ b      │ c     │ third  │
# => │ 2 │     4 │    14 │    0.40 │    3.00 │ b     │ a      │ c     │ second │
# => │ 3 │     0 │    15 │    0.50 │    4.00 │ b     │ a      │ a     │ third  │
# => │ 4 │     6 │    16 │    0.60 │    5.00 │ b     │ a      │ a     │ second │
# => │ 5 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third  │
# => │ 6 │     9 │    19 │    0.90 │    8.00 │ c     │ c      │ b     │ ninth  │
# => │ 7 │     0 │    10 │    0.00 │    9.00 │ c     │ c      │ b     │ ninth  │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────╯
```

## 惰性 Dataframe

惰性 Dataframe 是一种通过创建逻辑计划来查询数据的方法。这种方法的优点是，在你需要提取数据之前，该计划
永远不会被评估。这样，你可以把聚合、连接和选择连在一起，一旦你对所选操作感到满意，就可以收集数据。

让我们创建一个惰性 Dataframe 的小例子：

```nu
let lf_0 = [[a b]; [1 a] [2 b] [3 c] [4 d]] | polars into-lazy
$lf_0
# => ╭────────────────┬────────────────────────────────────╮
# => │ plan           │ DF ["a", "b"]; PROJECT */2 COLUMNS │
# => │ optimized_plan │ DF ["a", "b"]; PROJECT */2 COLUMNS │
# => ╰────────────────┴────────────────────────────────────╯
```

正如你所看到的，产生的 Dataframe 还没有被评估，它以一组可以对数据进行操作的指令的形式存在。
如果你要收集这个 Dataframe，你会得到如下结果：

```nu
$lf_0 | polars collect
# => ╭───┬───┬───╮
# => │ # │ a │ b │
# => ├───┼───┼───┤
# => │ 0 │ 1 │ a │
# => │ 1 │ 2 │ b │
# => │ 2 │ 3 │ c │
# => │ 3 │ 4 │ d │
# => ╰───┴───┴───╯
```

正如你所看到的，`collect` 命令执行了计划并为你创建了一个 Nushell 表。

所有的 Dataframe 操作都应该能与惰性或者非惰性的 Dataframe 一起工作。为了兼容，这些操作在后台
进行了转换。然而，为了利用惰性操作的优势，我们建议只对惰性 Dataframe 使用惰性操作。

要找到所有惰性 Dataframe 操作，你可以使用：

```nu no-run
scope commands | where category =~ lazyframe | select name category description
```

在定义了你的惰性 Dataframe 后，我们可以开始对它进行链式操作。例如：

```nu
$lf_0
| polars reverse
| polars with-column [
     ((polars col a) * 2 | polars as double_a)
     ((polars col a) / 2 | polars as half_a)
]
| polars collect
# => ╭───┬───┬───┬──────────┬────────╮
# => │ # │ a │ b │ double_a │ half_a │
# => ├───┼───┼───┼──────────┼────────┤
# => │ 0 │ 4 │ d │        8 │      2 │
# => │ 1 │ 3 │ c │        6 │      1 │
# => │ 2 │ 2 │ b │        4 │      1 │
# => │ 3 │ 1 │ a │        2 │      0 │
# => ╰───┴───┴───┴──────────┴────────╯
```

:::tip
你可以使用行缓存编辑器来轻松地格式化你的查询（`ctrl + o`）
:::

这个查询使用惰性 `reverse` 命令来反转 Dataframe，使用 `polars with-column` 命令并使用 `expressions` 来创建新的两列。
`expression` 用于定义在惰性 Dataframe 上执行的操作。当它们组合在一起时，就形成了整个由惰性命令来查询数据的
指令集。要列出所有产生表达式的命令，你可以使用：

```nu no-run
scope commands | where category =~ expression | select name category description
```

在我们前面的例子中，我们使用 `polars col` 命令来表示列 `a` 将被乘以2，然后它将被命名为 `double_a`。
在某些情况下，可以推断出 `polars col` 命令的使用，例如，使用 `polars select` 命令，我们可以只使用一个字符串：

```nu
$lf_0 | polars select a | polars collect
# => ╭───┬───╮
# => │ # │ a │
# => ├───┼───┤
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => │ 3 │ 4 │
# => ╰───┴───╯
```

或者使用 `polars col` 命令：

```nu
$lf_0 | polars select (polars col a) | polars collect
# => ╭───┬───╮
# => │ # │ a │
# => ├───┼───┤
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => │ 3 │ 4 │
# => ╰───┴───╯
```

让我们尝试更复杂的东西，从一个惰性 Dataframe 中创建聚合：

```nu
let lf_1 =  [[name value]; [one 1] [two 2] [one 1] [two 3]] | polars into-lazy

$lf_1
| polars group-by name
| polars agg [
     (polars col value | polars sum | polars as sum)
     (polars col value | polars mean | polars as mean)
]
| polars sort-by name
| polars collect
# => ╭───┬──────┬─────┬──────╮
# => │ # │ name │ sum │ mean │
# => ├───┼──────┼─────┼──────┤
# => │ 0 │ one  │   2 │ 1.00 │
# => │ 1 │ two  │   5 │ 2.50 │
# => ╰───┴──────┴─────┴──────╯
```

我们可以在一个还没有被收集的惰性 Dataframe 上进行连接操作。让我们把产生的分组连接到原来的惰性 Dataframe 中去吧

```nu
let lf_2 =  [[name value]; [one 1] [two 2] [one 1] [two 3]] | polars into-lazy
let group = $lf_2
    | polars group-by name
    | polars agg [
      (polars col value | polars sum | polars as sum)
      (polars col value | polars mean | polars as mean)
    ]

$lf_2 | polars join $group name name | polars collect
# => ╭───┬──────┬───────┬─────┬──────╮
# => │ # │ name │ value │ sum │ mean │
# => ├───┼──────┼───────┼─────┼──────┤
# => │ 0 │ one  │     1 │   2 │ 1.00 │
# => │ 1 │ two  │     2 │   5 │ 2.50 │
# => │ 2 │ one  │     1 │   2 │ 1.00 │
# => │ 3 │ two  │     3 │   5 │ 2.50 │
# => ╰───┴──────┴───────┴─────┴──────╯
```

正如你所看到的，惰性 Dataframe 是一个强大的结构，它可以让你使用灵活的语法来查询数据，从而极快地获得结果。

## Dataframe 命令

到目前为止，我们已经看到了很多可以使用 `DataFrame` 相关命令的操作。然而，到目前为止，我们所使用的命令并不包括所有可用来处理数据的命令，请放心，随着该功能的稳定，还会有更多的命令。

下表列出了可用的`DataFrame`命令及其描述，并尽可能显示其类似的 Nushell 命令。**应用于**列列出了每个命令接受的输入类型。

::: warning
此列表可能已过时。要获取最新的命令列表，请参阅
[Dataframe](/commands/categories/dataframe.md), [Lazyframe](/commands/categories/lazyframe.md), [Dataframe Or Lazyframe](/commands/categories/dataframe_or_lazyframe.md), [Expressions](/commands/categories/expression.md)
命令类别。
:::

<!-- This table was updated using the script from ../tools/dataframes_md-update.nu -->

| 命令名 | 应用于 | 描述 | Nushell 类似命令 |
| --- | --- | --- | --- |
| polars agg | dataframe, lazyframe, group_by | 在一个 group-by 上执行一系列的聚合操作。 | math |
| polars agg-groups | expression, selector | 创建一个 agg_groups 表达式。 |  |
| polars all-false | dataframe, lazyframe | 如果所有的值都是假的，则返回真。 |  |
| polars all-true | dataframe, lazyframe | 如果所有的值都是真的，则返回真。 | all |
| polars append | dataframe, lazyframe | 追加一个新的 dataframe。 |  |
| polars arg-max | dataframe, lazyframe | 返回系列中最大值的索引。 |  |
| polars arg-min | dataframe, lazyframe | 返回系列中最小值的索引。 |  |
| polars arg-sort | dataframe, lazyframe | 返回排序后的系列的索引。 |  |
| polars arg-true | dataframe, lazyframe | 返回值为真的索引。 |  |
| polars arg-unique | dataframe, lazyframe | 返回唯一值的索引。 |  |
| polars arg-where | any | 创建一个表达式，返回表达式为真的参数。 |  |
| polars as | expression, selector | 创建一个别名表达式。 |  |
| polars as-date | dataframe, lazyframe, expression, selector | 将字符串转换为日期。 |  |
| polars as-datetime | dataframe, lazyframe, expression, selector | 将字符串转换为日期时间。 |  |
| polars cache | dataframe, lazyframe | 在一个新的 LazyFrame 中缓存操作。 |  |
| polars cast | dataframe, lazyframe, expression, selector | 将一列转换为不同的 `dtype`。 |  |
| polars col | any | 创建一个命名的列表达式。 |  |
| polars collect | dataframe, lazyframe | 将惰性 dataframe 收集到即时 dataframe 中。 |  |
| polars columns | dataframe, lazyframe | 显示 dataframe 的列。 |  |
| polars concat | any | 连接两个或多个 dataframe。 |  |
| polars concat-str | any | 创建一个连接字符串表达式。 |  |
| polars contains | dataframe, lazyframe, expression, selector | 检查一个模式是否包含在一个字符串中。 |  |
| polars convert-time-zone | expression, selector | 将 datetime 转换为目标时区。 |  |
| polars count | expression, selector | 返回列中非空值的数量。 |  |
| polars count-null | dataframe, lazyframe | 计算空值。 |  |
| polars cumulative | dataframe, lazyframe, expression, selector | 对一列或系列进行累积计算。 |  |
| polars cut | dataframe, lazyframe | 将系列中的连续值分箱为离散类别。 |  |
| polars date-range | any | 创建日期区间表达式。 |  |
| polars date-ranges | any | 创建一列日期区间。 |  |
| polars datepart | expression, selector | 创建一个表达式，用于捕获列中指定的日期部分。 |  |
| polars datetime-range | any | 创建 datetime 区间表达式。 |  |
| polars datetime-ranges | any | 创建一列 datetime 区间。 |  |
| polars decimal | expression, selector | 将字符串列转换为 decimal 列 |  |
| polars drop | dataframe, lazyframe | 通过删除选定的列来创建一个新的 dataframe。 | reject |
| polars drop-duplicates | dataframe, lazyframe | 删除 dataframe 中的重复值。 |  |
| polars drop-nulls | dataframe, lazyframe | 丢弃 dataframe 中的空值。 |  |
| polars dummies | dataframe, lazyframe | 创建一个带有哑变量的新 dataframe。 |  |
| polars entropy | expression, selector | 按 `-sum(pk * log(pk))` 计算熵，其中 `pk` 是离散概率。 |  |
| polars explode | dataframe, lazyframe, expression, selector | 展开一个 dataframe 或创建一个展开表达式。 |  |
| polars expr-not | expression, selector | 创建一个 not 表达式。 |  |
| polars fill-nan | dataframe, lazyframe, expression, selector | 用给定的表达式替换 NaN 值。 |  |
| polars fill-null | dataframe, lazyframe, expression, selector | 用给定的表达式替换 NULL 值。 |  |
| polars filter | dataframe, lazyframe, expression, selector | 基于表达式过滤 dataframe。 |  |
| polars filter-with | dataframe, lazyframe | 使用掩码或表达式作为参考来过滤 dataframe。 |  |
| polars first | dataframe, lazyframe, group_by, expression, selector | 只显示前几行或创建一个 first 表达式。 | first |
| polars flatten | dataframe, expression, selector | polars explode 的别名。 |  |
| polars get | dataframe, lazyframe | 用选定的列创建 dataframe。 | get |
| polars get-day | dataframe, lazyframe, expression, selector | 从日期中获取天。 |  |
| polars get-hour | dataframe, lazyframe, expression, selector | 从 datetime 中获取小时。 |  |
| polars get-minute | dataframe, lazyframe, expression, selector | 从日期中获取分钟。 |  |
| polars get-month | dataframe, lazyframe, expression, selector | 从日期中获取月份。 |  |
| polars get-nanosecond | dataframe, lazyframe, expression, selector | 从日期中获取纳秒。 |  |
| polars get-ordinal | dataframe, lazyframe, expression, selector | 从日期中获取序数。 |  |
| polars get-second | dataframe, lazyframe, expression, selector | 从日期中获取秒。 |  |
| polars get-week | dataframe, lazyframe, expression, selector | 从日期中获取周序号。 |  |
| polars get-weekday | dataframe, lazyframe, expression, selector | 从日期中获取星期几。 |  |
| polars get-year | dataframe, lazyframe, expression, selector | 从日期中获取年份。 |  |
| polars group-by | dataframe, lazyframe | 创建一个 group-by 对象，可用于其他聚合。 | group-by |
| polars horizontal | any | 跨多列的横向计算。 |  |
| polars implode | expression, selector | 将值聚合到一个列表中。 |  |
| polars integer | expression, selector | 将字符串列转换为 integer 列 |  |
| polars into-df | any | 将一个列表、表或记录转换为 dataframe。 |  |
| polars into-dtype | string | 将字符串转换为指定的数据类型。 |  |
| polars into-lazy | any | 将一个 dataframe 转换为惰性 dataframe。 |  |
| polars into-nu | dataframe, lazyframe, group_by, expression, selector, when, datatype, schema | 将一个 dataframe 或表达式转换为 nushell 值以供访问和探索。 |  |
| polars into-repr | dataframe, lazyframe | 以 repr 格式显示 dataframe。 |  |
| polars into-schema | any | 将值转换为 polars schema 对象 |  |
| polars is-duplicated | dataframe, lazyframe | 创建表示重复值的掩码。 |  |
| polars is-in | expression, selector | 创建一个 is-in 表达式或检查元素是否包含在右边的系列中。 | in |
| polars is-not-null | dataframe, lazyframe, expression, selector | 创建值不为空的掩码。 |  |
| polars is-null | dataframe, lazyframe, expression, selector | 创建值为空的掩码。 | `<column_name> == null` |
| polars is-unique | dataframe, lazyframe | 创建表示唯一值的掩码。 |  |
| polars join | dataframe, lazyframe | 将一个惰性 frame 与其他惰性 frame 连接。 |  |
| polars join-where | dataframe, lazyframe | 基于条件将一个惰性 frame 与另一个惰性 frame 连接。 |  |
| polars last | dataframe, lazyframe, group_by, expression, selector | 用尾部行创建新的 dataframe 或创建一个 last 表达式。 | last |
| polars len | any | 返回上下文中的行数。这类似于 SQL 中的 COUNT(*)。 |  |
| polars list-contains | expression, selector | 检查某个元素是否包含在列表中。 |  |
| polars lit | any | 创建一个字面量表达式。 |  |
| polars lowercase | dataframe, lazyframe, expression, selector | 将列中的字符串转换为小写。 |  |
| polars map-batches | dataframe, lazyframe | 在一个或多个 dataframe 列上映射自定义 Nushell 闭包。 |  |
| polars math |  | 可应用于列表达式的数学函数集合。 |  |
| polars math abs | expression, selector | 计算列表达式的绝对值。 |  |
| polars math bitwise-and | expression, selector | 对列表达式执行按位与聚合。 |  |
| polars math bitwise-count-ones | expression, selector | 计算整数列表达式中每个元素已置位的位数。 |  |
| polars math bitwise-count-zeros | expression, selector | 计算整数列表达式中每个元素未置位的位数。 |  |
| polars math bitwise-leading-ones | expression, selector | 计算整数列表达式中每个元素前导已置位的位数。 |  |
| polars math bitwise-leading-zeros | expression, selector | 计算整数列表达式中每个元素前导未置位的位数。 |  |
| polars math bitwise-or | expression, selector | 对列表达式执行按位或聚合。 |  |
| polars math bitwise-trailing-ones | expression, selector | 计算整数列表达式中每个元素尾部已置位的位数。 |  |
| polars math bitwise-trailing-zeros | expression, selector | 计算整数列表达式中每个元素尾部未置位的位数。 |  |
| polars math bitwise-xor | expression, selector | 对列表达式执行按位异或聚合。 |  |
| polars math cos | expression, selector | 计算列表达式的逐元素余弦。 |  |
| polars math dot | expression, selector | 计算两个列表达式的点积。 |  |
| polars math exp | expression, selector | 以 e 为底、以列表达式为指数，逐元素计算幂（e^x）。 |  |
| polars math log | expression, selector | 计算列表达式的逐元素对数。 |  |
| polars math log1p | expression, selector | 计算列表达式的逐元素 ln(1 + x)。 |  |
| polars math sign | expression, selector | 计算列表达式的逐元素符号，返回 -1、0 或 1。 |  |
| polars math sin | expression, selector | 计算列表达式的逐元素正弦。 |  |
| polars math sqrt | expression, selector | 计算列表达式的逐元素平方根。 |  |
| polars max | dataframe, lazyframe, expression, selector | 创建一个 max 表达式或将列聚合到其最大值。 |  |
| polars mean | dataframe, lazyframe, expression, selector | 创建一个用于聚合的 mean 表达式或将列聚合到其平均值。 |  |
| polars median | dataframe, lazyframe, expression, selector | dataframe 中列的中值或为聚合创建表达式。 |  |
| polars min | dataframe, lazyframe, expression, selector | 创建一个 min 表达式或将列聚合到其最小值。 |  |
| polars n-unique | dataframe, lazyframe, expression, selector | 计算唯一值。 |  |
| polars not | dataframe, lazyframe | 反转布尔掩码。 |  |
| polars open | any | 打开 CSV、JSON、NDJSON/JSON lines、arrow、avro 或 parquet 文件以创建 dataframe。若支持，默认会创建惰性 dataframe。 | open |
| polars otherwise | any | 完成一个 when 表达式。 |  |
| polars over | expression, selector | 在由分区表达式定义的窗口组上计算表达式。 |  |
| polars pivot | dataframe, lazyframe | 将 DataFrame 从长格式透视为宽格式。 |  |
| polars profile | dataframe, lazyframe | 分析一个惰性 dataframe。 |  |
| polars qcut | dataframe, lazyframe | 按分位数将系列中的连续值分箱为离散类别。 |  |
| polars quantile | dataframe, lazyframe, expression, selector | 将列聚合到选定的分位数。 |  |
| polars query | dataframe, lazyframe | 使用 SQL 查询 dataframe。注意：在查询的 from 子句中，dataframe 总是命名为 'df'。 |  |
| polars rename | dataframe, lazyframe | 重命名 dataframe 列。 | rename |
| polars replace | expression, selector | 创建一个用新值替换旧值的表达式。 |  |
| polars replace-time-zone | expression, selector | 替换 datetime 列中的时区信息。 |  |
| polars reverse | dataframe, lazyframe | 反转 LazyFrame。 |  |
| polars rolling | dataframe, lazyframe, expression | 对一个系列或表达式进行滚动计算，或对 lazyframe 进行滚动 group-by。 |  |
| polars sample | dataframe, lazyframe | 创建样本 dataframe。 |  |
| polars save | any | 将 dataframe 保存到磁盘。对于惰性 dataframes，如果文件类型支持（parquet、ipc/arrow、csv 和 ndjson），将使用 sink 操作。 |  |
| polars schema | any | 显示 dataframe 的模式。 |  |
| polars select | dataframe, lazyframe | 从 lazyframe 中选择列。 | select |
| polars selector |  | 创建用于 polars 命令的列选择器。 |  |
| polars selector all | any | 创建一个选择所有列的选择器。 |  |
| polars selector alpha | any | 选择所有名称为字母的列（例如：仅字母）。匹配的列名不能包含*任何*非字母字符。注意“字母”默认包含所有有效的 Unicode 字母字符；可通过设置 `--ascii-only` 改变这一点。 |  |
| polars selector alphanumeric | any | 选择所有名称为字母数字的列（例如：仅字母）。匹配的列名不能包含*任何*非字母数字字符。注意“字母数字”默认包含所有有效的 Unicode 字母数字字符；可通过设置 `ascii_only=true` 改变这一点。 |  |
| polars selector array | any | 选择所有 array 列。可选择按固定宽度过滤。 |  |
| polars selector binary | any | 选择所有 binary 列。 |  |
| polars selector boolean | any | 选择所有 boolean 列。 |  |
| polars selector by-dtype | any | 创建一个按数据类型选择列的选择器。 |  |
| polars selector by-index | any | 按索引位置选择列。支持负索引（例如 -1 表示最后一列）。 |  |
| polars selector by-name | any | 创建一个按名称选择列的选择器。 |  |
| polars selector categorical | any | 选择所有 categorical 列。 |  |
| polars selector contains | any | 选择名称包含给定字面子串的列。 |  |
| polars selector date | any | 选择所有 date 列。 |  |
| polars selector datetime | any | 选择所有 datetime 列。可选择按时间单位（ns、us、ms）和/或时区过滤。 |  |
| polars selector decimal | any | 选择所有 decimal 列。 |  |
| polars selector digit | any | 选择名称完全由数字字符组成的列。默认使用 Unicode 十进制数字；用 `--ascii-only` 可限制为 ASCII 0-9。 |  |
| polars selector duration | any | 选择所有 duration 列。可选择按时间单位（ns、us、ms）过滤。 |  |
| polars selector empty | any | 创建一个不匹配任何列的空选择器。可作为组合选择器的基础。 |  |
| polars selector ends-with | any | 选择名称以给定子串结尾的列。 |  |
| polars selector enum | any | 选择所有 enum 列。 |  |
| polars selector exclude | any | 选择除给定名称以外的所有列。这与 `polars selector by-name` 相反。 |  |
| polars selector first | any | 创建一个按索引选择靠前的一列或多列的选择器。 |  |
| polars selector float | any | 选择所有 float 列。 |  |
| polars selector integer | any | 选择所有 integer 列。 |  |
| polars selector last | any | 创建一个按索引选择靠后的一列或多列的选择器。 |  |
| polars selector list | any | 选择所有 list 列。 |  |
| polars selector matches | any | 选择所有匹配给定正则表达式模式的列。 |  |
| polars selector nested | any | 选择所有嵌套列（list、array 或 struct）。 |  |
| polars selector not | selector | 反转选择器。 |  |
| polars selector numeric | any | 选择所有数值列。 |  |
| polars selector object | any | 选择所有 object 列。 |  |
| polars selector signed-integer | any | 选择所有有符号 integer 列。 |  |
| polars selector starts-with | any | 选择名称以给定子串开头的列。 |  |
| polars selector string | any | 选择所有 string 列。使用 `--include-categorical` 可同时选择 categorical 列。 |  |
| polars selector struct | any | 选择所有 struct 列。 |  |
| polars selector temporal | any | 选择所有时间列（date、datetime、duration 和 time）。 |  |
| polars selector unsigned-integer | any | 选择所有无符号 integer 列。 |  |
| polars set | dataframe, lazyframe | 在给定的掩码为真时设置值。 |  |
| polars set-with-idx | dataframe, lazyframe | 在给定的索引中设置值。 |  |
| polars shape | dataframe, lazyframe | 显示 dataframe 的列和行大小。 |  |
| polars shift | dataframe, lazyframe, expression, selector | 按给定的周期平移这些值。 |  |
| polars slice | dataframe, lazyframe | 从行的切片中创建新的 dataframe。 |  |
| polars sort-by | dataframe, lazyframe | 基于表达式对惰性 dataframe 进行排序。 | sort |
| polars std | dataframe, lazyframe, expression, selector | 为 dataframe 中列的 std 值聚合创建一个 std 表达式。 |  |
| polars store-get | any | 从插件缓存中获取 Dataframe 或其他对象。 |  |
| polars store-ls |  | 列出存储的 polars 对象。 |  |
| polars store-rm | any | 从插件缓存中删除存储的 Dataframe 或其他对象。 |  |
| polars str-join | dataframe, lazyframe, expression, selector | 连接一列或 dataframe 内的字符串 |  |
| polars str-lengths | dataframe, lazyframe, expression, selector | 获取所有字符串的长度。 |  |
| polars str-replace | dataframe, lazyframe, expression, selector | 用正则模式替换最左侧的（子）字符串。 |  |
| polars str-replace-all | dataframe, lazyframe, expression, selector | 用正则模式替换所有（子）字符串。 |  |
| polars str-slice | dataframe, lazyframe, expression, selector | 从起始位置切片字符串直到选定的长度。 |  |
| polars str-split | expression, selector | 按子串拆分字符串。结果 dtype 为 `list<str>`。 |  |
| polars str-strip-chars | expression, selector | 去除一列字符串中指定的字符 |  |
| polars strftime | dataframe, lazyframe, expression, selector | 根据字符串规则格式化日期。 |  |
| polars struct-json-encode | expression | 将该 struct 转换为含 json 值的字符串列。 |  |
| polars sum | dataframe, lazyframe, expression, selector | 创建一个用于聚合的 sum 表达式或将列聚合到其总和值。 |  |
| polars summary | dataframe, lazyframe | 对于一个 dataframe，为其数值列生成描述性统计（摘要统计）。 |  |
| polars take | dataframe, lazyframe | 使用给定的索引创建新的 dataframe。 |  |
| polars truncate | expression, selector | 将 date/datetime 区间划分为桶。 |  |
| polars unique | dataframe, lazyframe, expression, selector | 返回 dataframe 中的唯一值。 | uniq |
| polars unnest | dataframe, lazyframe | 将 struct 列分解为其每个字段的独立列。新列会插入到该 struct 列所在的位置。 |  |
| polars unpivot | dataframe, lazyframe | 将 DataFrame 从宽格式逆透视为长格式。 |  |
| polars uppercase | dataframe, lazyframe, expression, selector | 将列中的字符串转换为大写。 |  |
| polars value-counts | dataframe, lazyframe | 返回一个带有系列中唯一值的计数的 dataframe。 |  |
| polars var | dataframe, lazyframe, expression, selector | 为聚合创建一个 var 表达式。 |  |
| polars when | expression, selector | 创建和修改一个 when 表达式。 |  |
| polars with-column | dataframe, lazyframe | 向 dataframe 添加一个系列。 | `insert <column_name> <value> \| upsert <column_name> { <new_value> }` |

## Dataframes 的未来

我们希望在本页结束时，你已经牢固掌握了如何使用 DataFrame 相关命令。正如你所看到的，它们提供了强大的操作，可以帮助你更快更原生地处理数据。

然而，dataframe 命令仍在演进之中，随着 Polars 自身的变化，命令有时会被重命名或移除。随着这些命令的成熟，将加入利用它们的新命令和新工具。

请继续访问本章以及我们的[博客](/blog/)，以了解 DataFrames 的最新情况，以及它们如何帮助你更快更有效地处理数据。
