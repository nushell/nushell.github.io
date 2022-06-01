# DataFrames

::: tip
DataFrame 相关命令从 0.33.1 版本开始支持
:::

正如我们到目前为止所看到的，Nushell 把数据处理作为其主要任务。`Lists` 和 `Tables`的存在是为了帮助你循环处理值，以便执行多种操作或轻而易举地找到数据。然而，在某些操作中，基于行的数据布局并不是处理数据的最有效方式，特别是在处理极其庞大的文件时。对于大型数据集的`group-by`或`join`等操作，如果不使用适当的数据格式，会占用大量的内存，并可能耗费大量的计算时间。

出于这个原因，Nushell 引入了`DataFrame`结构。`DataFrame`以列格式存储数据，以 [Apache Arrow](https://arrow.apache.org/) 规范为基础，并使用 [Polars](https://github.com/pola-rs/polars) 作为执行极其 [快速列式操作](https://h2oai.github.io/db-benchmark/) 的马达。

你现在可能想知道这个组合能有多快，以及它如何能使数据工作更容易、更可靠。出于这个原因，让我们在本页开始时介绍一下处理数据时的常见操作的性能测试情况。

## 性能测试对比

在这个小的性能测试练习中，我们将比较本地的 Nushell 原生命令、Nushell DataFrame 相关命令和[Python Pandas](https://pandas.pydata.org/)命令。暂时不要太在意`dataframe`命令，它们将在本页后面的章节中解释。

> 系统细节：本节介绍的性能测试是用一台配备 Intel(R) Core(TM) i7-10710U
> （CPU @1.10GHz 1.61GHz）和 16 GB 内存的机器运行的。
>
> 所有的例子都在 Nushell 0.33.1 版本上运行。

### 文件信息

我们将用于性能测试的文件是 [新西兰商业人口统计](https://www.stats.govt.nz/assets/Uploads/New-Zealand-business-demography-statistics/New-Zealand-business-demography-statistics-At-February-2020/Download-data/Geographic-units-by-industry-and-statistical-area-2000-2020-descending-order-CSV.zip) 数据集。
如果你想尝试这些测试，请下载该文件。

该数据集有 5 列，5,429,252 行。我们可以通过使用`dfr list`命令来检查：

```shell
> let df = (dfr open .\Data7602DescendingYearOrder.csv)
> dfr list

───┬──────┬─────────┬─────────
 # │ name │  rows   │ columns
───┼──────┼─────────┼─────────
 0 │ $df  │ 5429252 │ 5
───┴──────┴─────────┴─────────
```

我们可以用`dfr first`看一下文件的第一行：

```shell
> $df | dfr first

───┬──────────┬─────────┬──────┬───────────┬──────────
 # │ anzsic06 │  Area   │ year │ geo_count │ ec_count
───┼──────────┼─────────┼──────┼───────────┼──────────
 0 │ A        │ A100100 │ 2000 │        96 │      130
 1 │ A        │ A100200 │ 2000 │       198 │      110
 2 │ A        │ A100300 │ 2000 │        42 │       25
 3 │ A        │ A100400 │ 2000 │        66 │       40
 4 │ A        │ A100500 │ 2000 │        63 │       40
───┴──────────┴─────────┴──────┴───────────┴──────────
```

...最后，我们可以了解一下推断出的数据类型：

```shell
> $df | dfr dtypes

───┬───────────┬───────
 # │  column   │ dtype
───┼───────────┼───────
 0 │ anzsic06  │ str
 1 │ Area      │ str
 2 │ year      │ i64
 3 │ geo_count │ i64
 4 │ ec_count  │ i64
───┴───────────┴───────
```

### 加载文件

让我们先来比较一下各种方法的加载时间。首先，我们将使用 Nushell 的[`open`](/book/commands/open.md)命令加载数据：

```shell
> benchmark {open .\Data7602DescendingYearOrder.csv}

───┬─────────────────────────
 # │        real time
───┼─────────────────────────
 0 │ 30sec 479ms 614us 400ns
───┴─────────────────────────
```

使用原生的 Nushell 功能加载文件需要 30 秒。对于加载 500 万条记录来说，这还算不错！但我们可以做得更好一些。

现在让我们使用 Pandas。我们将使用以下脚本来加载文件：

```python
import pandas as pd

df = pd.read_csv("Data7602DescendingYearOrder.csv")
```

而它的性能测试结果是：

```shell
> benchmark {python load.py}

───┬───────────────────────
 # │       real time
───┼───────────────────────
 0 │ 2sec 91ms 872us 900ns
───┴───────────────────────
```

这是一个很大的进步，从 30 秒到 2 秒。干得好，Pandas!

也许我们加载数据可以再快一点，这一次我们将使用 Nushell 的`dfr open`命令：

```shell
> benchmark {dfr open .\Data7602DescendingYearOrder.csv}

───┬───────────────────
 # │     real time
───┼───────────────────
 0 │ 601ms 700us 700ns
───┴───────────────────
```

这一次，我们花了 0.6 秒。一点也不差。

### `Group-by`比较

这次让我们做一个稍微复杂的操作。我们将按年份对数据进行分组，并根据`geo_count`列对分组求和。

同样，我们要从 Nushell 的原生命令开始：

::: tip
如果你想运行这个例子，请注意接下来的命令将使用大量的内存，在该命令执行期间可能会影响你的系统性能。
:::

```shell
> benchmark {
	open .\Data7602DescendingYearOrder.csv
	| group-by year
	| pivot header rows
	| upsert rows { get rows | math sum }
	| flatten
}

───┬────────────────────────
 # │       real time
───┼────────────────────────
 0 │ 6min 30sec 622ms 312us
───┴────────────────────────
```

所以，执行这个聚合操作需要 6 分钟。

让我们试试在`pandas`中进行同样的操作：

```python
import pandas as pd

df = pd.read_csv("Data7602DescendingYearOrder.csv")
res = df.groupby("year")["geo_count"].sum()
print(res)
```

而性能测试的结果是：

```shell
> benchmark {python .\load.py}

───┬────────────────────────
 # │       real time
───┼────────────────────────
 0 │ 1sec 966ms 954us 800ns
───┴────────────────────────
```

一点也不差！同样，Pandas 设法在很短的时间内完成了它。

为了进行比较，让我们试试 Nushell DataFrames。我们要把所有的操作放在一个`nu`文件中，以确保我们做的是类似的操作：

```shell
let df = (dfr open Data7602DescendingYearOrder.csv)
let res = ($df | dfr group-by year | dfr aggregate sum | dfr select geo_count)
$res
```

当使用 DataFrames 时的性能测试结果是：

```shell
> benchmark {source load.nu}

───┬───────────────────
 # │     real time
───┼───────────────────
 0 │ 557ms 658us 500ns
───┴───────────────────
```

幸运的是，Nushell DataFrame 设法将时间再次减半。这不是很好吗？

正如你所看到的，Nushell 的`DataFrame`命令和现在最常见的做数据分析的工具一样快。这个发行版中的命令有可能成为你做数据分析的首选工具。通过组合复杂的 Nushell 管道，你可以以一种可靠的方式从数据中提取信息。

## 使用 DataFrames

在看到了可以用`DataFrame`命令完成的事情之后，现在是时候开始测试它们了。首先，让我们创建一个样本 CSV 文件，该文件将成为我们的样本 DataFrame，并与示例一起使用。在你喜欢的编辑器中粘贴下面几行来创建样本 csv 文件：

```csv
int_1,int_2,float_1,float_2,first,second,third,word
1,11,0.1,1.0,a,b,c,first
2,12,0.2,1.0,a,b,c,second
3,13,0.3,2.0,a,b,c,third
4,14,0.4,3.0,b,a,c,second
0,15,0.5,4.0,b,a,a,third
6,16,0.6,5.0,b,a,a,second
7,17,0.7,6.0,b,c,a,third
8,18,0.8,7.0,c,c,b,eight
9,19,0.9,8.0,c,c,b,ninth
0,10,0.0,9.0,c,c,b,ninth
```

保存该文件并随意命名，在这些例子中，该文件将被称为`test_small.csv`。

现在，要将该文件作为 DataFrame 进行读取，请使用`dfr open`命令，如下所示：

```shell
> let df = (dfr open test_small.csv)
```

这应该会在内存中创建一个值`df`，用来存放我们刚刚创建的数据。

::: tip
`dfrs open`命令可以读取 **csv** 或 **parquet** 文件。
:::

要查看存储在内存中的所有 DataFrames，你可以使用：

```shell
> dfr list

───┬──────┬──────┬─────────
 # │ name │ rows │ columns
───┼──────┼──────┼─────────
 0 │ $df  │ 10   │ 8
───┴──────┴──────┴─────────
```

正如你所看到的，该命令显示了所创建的 DataFrame 以及关于它们的基本信息。

如果你想看到加载的 DataFrame 的预览，你可以将 DataFrame 变量发送到流中：

```shell
> $df

───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────
 # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word
───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────
 0 │     1 │    11 │  0.1000 │  1.0000 │ a     │ b      │ c     │ first
 1 │     2 │    12 │  0.2000 │  1.0000 │ a     │ b      │ c     │ second
 2 │     3 │    13 │  0.3000 │  2.0000 │ a     │ b      │ c     │ third
 3 │     4 │    14 │  0.4000 │  3.0000 │ b     │ a      │ c     │ second
 4 │     0 │    15 │  0.5000 │  4.0000 │ b     │ a      │ a     │ third
 5 │     6 │    16 │  0.6000 │  5.0000 │ b     │ a      │ a     │ second
 6 │     7 │    17 │  0.7000 │  6.0000 │ b     │ c      │ a     │ third
 7 │     8 │    18 │  0.8000 │  7.0000 │ c     │ c      │ b     │ eight
 8 │     9 │    19 │  0.9000 │  8.0000 │ c     │ c      │ b     │ ninth
 9 │     0 │    10 │  0.0000 │  9.0000 │ c     │ c      │ b     │ ninth
───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────
```

有了内存中的 DataFrame，我们就可以开始对 `DataFrame` 进行列操作。

::: tip
如果你想看到所有可用的 DataFrame 命令，你可以使用`help dfr`。
:::

## 基本聚合

让我们从 DataFrame 的基本聚合开始，通过使用`aggregate`命令对`df`中存在的所有列进行求和：

```shell
> $df | dfr aggregate sum

───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬──────
 # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │ word
───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼──────
 0 │    40 │   145 │  4.5000 │ 46.0000 │       │        │       │
───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴──────
```

正如你所看到的，聚合函数(`aggregate`)为那些有意义的列计算出了总和。如果你想过滤掉文本列，你可以使用`select`命令来选择你想要的列。

```shell
$df | dfr aggregate sum | dfr select int_1 int_2 float_1 float_2

───┬───────┬───────┬─────────┬─────────
 # │ int_1 │ int_2 │ float_1 │ float_2
───┼───────┼───────┼─────────┼─────────
 0 │    40 │   145 │  4.5000 │ 46.0000
───┴───────┴───────┴─────────┴─────────
```

你甚至可以像存储任何其他 Nushell 变量一样存储这个聚合的结果：

```shell
> let res = ($df | dfr aggregate sum | dfr select int_1 int_2 float_1 float_2)
```

现在我们有两个 DataFrame 存储在内存中：

```shell
> dfr list

───┬──────┬──────┬─────────
 # │ name │ rows │ columns
───┼──────┼──────┼─────────
 0 │ $df  │ 10   │ 8
 1 │ $res │ 1    │ 4
───┴──────┴──────┴─────────
```

很整洁，不是吗？

你可以在 DataFrame 上进行若干聚合，以便从中提取基本信息，也可以对你的全新 DataFrame 进行基本数据分析。

## 连接 DataFrame

也可以用一个列作为参考来连接(`join`)两个 DataFrame。我们将把我们的迷你 DataFrame 与另一个迷你 DataFrame 连接起来。在另一个文件中复制这些行，并创建相应的 DataFrame（在以下例子中，我们将称之为`test_small_a.csv`）。

```
int_1a,int_2,float_1,float_2,first
9,14,0.4,3.0,a
8,13,0.3,2.0,a
7,12,0.2,1.0,a
6,11,0.1,0.0,b
```

我们使用`dfr open`命令来创建新的变量：

```shell
> let df_a = (dfr open test_small_a.csv)
```

现在，当第二个 DataFrame 加载到内存中时，我们可以使用左边 DataFrame 的`int_1`列和右边 DataFrame 的`int_1a`列来连接它们。

```shell
> $df | dfr join $df_a -l [int_1] -r [int_1a]

───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬─────────┬─────────────┬───────────────┬───────────────┬─────────────
 # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word   │ int_2_right │ float_1_right │ float_2_right │ first_right
───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼─────────┼─────────────┼───────────────┼───────────────┼─────────────
 0 │     6 │    16 │  0.6000 │  5.0000 │ b     │ a      │ a     │ second  │          11 │        0.1000 │        0.0000 │ b
 1 │     7 │    17 │  0.7000 │  6.0000 │ b     │ c      │ a     │ third   │          12 │        0.2000 │        1.0000 │ a
 2 │     8 │    18 │  0.8000 │  7.0000 │ c     │ c      │ b     │ eight   │          13 │        0.3000 │        2.0000 │ a
 3 │     9 │    19 │  0.9000 │  8.0000 │ c     │ c      │ b     │ ninth   │          14 │        0.4000 │        3.0000 │ a
───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴─────────┴─────────────┴───────────────┴───────────────┴─────────────
```

::: tip
在`Nu`中，当一个命令有多个参数，并期望得到多个值时，我们用方括号`[]`来包裹这些值。在`dfr join`的情况下，我们可以对多个列进行连接，只要它们具有相同的类型，例如我们可以这样做：`$df | dfr join $df_a -l [int_1 int_2] -r [int_1a int_2]`。
:::

默认情况下，连接命令做的是内连接，也就是说，它将保留两个 DataFrame 都有相同值的记录。你可以选择一个左联接来保留左边 DataFrame 中缺失的行。你也可以保存这个结果，以便在以后的操作中使用它。

## DataFrame 分组

可以用 DataFrame 进行的最强大的操作之一是`group-by`。这个命令将允许你根据一个分组条件进行聚合操作。在 Nushell 中，`GroupBy`是一种可以被存储和重复使用的对象，可以被用于多个聚合。这是很方便的，因为在进行分组时，创建分组对是最昂贵的运算，如果你打算用同一个分组条件进行多个操作，就没有必要重复该运算。

要创建一个`GroupBy`对象，你只需要使用`group-by`命令：

```shell
> let group = ($df | dfr group-by first)
> $group

───┬──────────┬───────
 # │ property │ value
───┼──────────┼───────
 0 │ group by │ first
───┴──────────┴───────
```

当打印 `GroupBy` 对象时，我们可以看到被用作条件的列来对 DataFrame 进行分组。使用`GroupBy`，我们可以使用多种操作对 DataFrame 进行聚合。

```shell
$group | dfr aggregate sum

───┬───────┬───────────┬───────────┬─────────────┬─────────────
 # │ first │ int_1     │ int_2     │ float_1     │ float_2
───┼───────┼───────────┼───────────┼─────────────┼─────────────
 0 │ a     │         6 │        36 │      0.6000 │      4.0000
 1 │ b     │        17 │        62 │      2.2000 │     18.0000
 2 │ c     │        17 │        47 │      1.7000 │     24.0000
───┴───────┴───────────┴───────────┴─────────────┴─────────────
```

使用同样的 `GroupBy`，你可以对整个 DataFrame 进行另一个操作，比如本例中的`min`：

```shell
$group | aggregate min

───┬───────┬───────────┬───────────┬─────────────┬─────────────
 # │ first │ int_1     │ int_2     │ float_1     │ float_2
───┼───────┼───────────┼───────────┼─────────────┼─────────────
 0 │ a     │         1 │        11 │      0.1000 │      1.0000
 1 │ b     │         0 │        14 │      0.4000 │      3.0000
 2 │ c     │         0 │        10 │      0.0000 │      7.0000
───┴───────┴───────────┴───────────┴─────────────┴─────────────
```

创建的`GroupBy`对象非常方便，它甚至可以被用作表格透视的基础。作为一个例子，让我们使用名为`second`的列作为透视列，而`float_1`列作为值列：

```shell
> $group | dfr pivot second float_1 sum

───┬───────┬────────┬────────┬────────
 # │ first │   b    │   a    │   c
───┼───────┼────────┼────────┼────────
 0 │ a     │ 0.6000 │        │
 1 │ c     │        │        │ 1.7000
 2 │ b     │        │ 1.5000 │ 0.7000
───┴───────┴────────┴────────┴────────
```

::: tip
透视操作是一种基于两列数据进行聚合的方法。在前面的例子中，透视命令的结果产生了一个表格，代表了列`float_1`中所有数值的总和，这些数值在列`first`（现在是行）和`second`（现在是列）中共享。因此，显示在第`b`行和第`a`列的值`1.5`是所有浮点的总和，其中第`first`列是`b`，第`second`列是`a`。
:::

正如你所看到的，`GroupBy`对象是一个非常强大的变量，在你操作数据集时，它值得被保留在内存中。

## 创建 DataFrames

也可以从基本的 Nushell 基础类型，如整数、小数或字符串，来构建 DataFrames。让我们使用`to-df`命令来创建一个小的 DataFrame：

```shell
> let a = ([[a b]; [1 2] [3 4] [5 6]] | dfr to-df)
> $a

───┬───┬───
 # │ b │ a
───┼───┼───
 0 │ 2 │ 1
 1 │ 4 │ 3
 2 │ 6 │ 5
───┴───┴───
```

::: tip
目前，并不是所有的 Nushell 基本类型都可以转换为 DataFrame。随着 DataFrame 功能的成熟，这一点将在未来发生变化。
:::

我们可以在一个 DataFrame 中添加列，以创建一个新的变量。作为一个例子，让我们在迷你 DataFrame `$a` 上添加两列：

```shell
> let a2 = ($a | dfr with-column $a.a --name a2 | dfr with-column $a.a --name a3)

───┬───┬───┬────┬────
 # │ b │ a │ a2 │ a3
───┼───┼───┼────┼────
 0 │ 2 │ 1 │  1 │  1
 1 │ 4 │ 3 │  3 │  3
 2 │ 6 │ 5 │  5 │  5
───┴───┴───┴────┴────
```

Nushell 强大的管道语法允许我们通过从其他 DataFrame 中获取数据并将其附加到这些 DataFrame 中来创建新的 DataFrame。现在，如果你列出你的 DataFrame，你会看到总共有四个：

```shell
> dfr list

───┬───────┬──────┬─────────
 # │  name │ rows │ columns
───┼───────┼──────┼─────────
 0 │ $a    │ 3    │ 2
 1 │ $a2   │ 3    │ 4
 2 │ $df_a │ 4    │ 5
 3 │ $df   │ 10   │ 8
───┴───────┴──────┴─────────
```

值得一提的是，在使用 DataFrame 时，内存是如何被优化的呢？这要感谢 **Apache Arrow** 和 **Polars**。在一个非常简单的表示中，DataFrame 中的每一列都是一个 Arrow 数组，它使用了几种内存规格，以塞满尽可能多的数据（查看 [Arrow 列格式](https://arrow.apache.org/docs/format/Columnar.html) ）；另一个优化技巧是，只要有可能，DataFrame 中的列就会在多个 DataFrame 之间共享，避免了相同数据的内存重复占用。这意味着 DataFrame `$a`和`$a2`共享我们用`to-df`命令创建的两个列。由于这个原因，不能改变 DataFrame 中某一列的值。然而，你可以根据其他列或 DataFrame 的数据创建新的列。

## 使用系列

系列(`Series`) 是 `DataFrame` 的基本组成部分。每个系列代表一个具有相同数据类型的列，我们可以创建多个不同类型的系列，如浮点、整型或字符串。

让我们通过使用`to-df`命令创建一个系列，来开始我们对系列的探索：

```shell
> let new = ([9 8 4] | dfr to-df)
> $new

───┬───
 # │ 0
───┼───
 0 │ 9
 1 │ 8
 2 │ 4
───┴───
```

我们从一个整数列表创建了一个新的系列（我们也可以用浮点数或字符串做同样的事情）。

系列已经定义了自己的基本操作，它们可以用来创建其他系列。让我们通过对先前创建的列进行一些运算来创建一个新的系列：

```shell
> let new_2 = ($new * 3 + 10)
> $new_2

───┬────
 # │ 0
───┼────
 0 │ 37
 1 │ 34
 2 │ 22
───┴────
```

现在我们有一个新的系列，它是通过对前一个变量进行基本操作而构建的。

::: tip
如果你想看看你在内存中存储了多少变量，你可以使用`$nu.scope.vars`。
:::

让我们重新命名我们之前的系列为 `memorable`

```shell
> let new_2 = ($new_2 | dfr rename memorable)
> $new_2

───┬───────────
 # │ memorable
───┼───────────
 0 │        37
 1 │        34
 2 │        22
───┴───────────
```

只要两个系列的数据类型相同，我们也可以对它们进行基本操作：

```shell
> $new - $new_2

───┬──────────
 # │ sub_0_0
───┼──────────
 0 │     -28
 1 │     -26
 2 │     -18
───┴──────────
```

而且我们可以将它们添加到先前定义的 DataFrames 中：

```shell
> let new_df = ($a | dfr with-column $new --name new_col)
> $new_df

───┬───┬───┬─────────
 # │ b │ a │ new_col
───┼───┼───┼─────────
 0 │ 2 │ 1 │       9
 1 │ 4 │ 3 │       8
 2 │ 6 │ 5 │       4
───┴───┴───┴─────────
```

存储在 DataFrame 中的系列也可以直接使用，例如，我们可以将列`a`和`b`相乘来创建一个新系列：

```shell
> $new_df.a * $new_df.b

───┬─────────
 # │ mul_a_b
───┼─────────
 0 │       2
 1 │      12
 2 │      30
───┴─────────
```

我们可以开始使用管道，以创建新的列和 DataFrames：

```shell
> let $new_df = ($new_df | dfr with-column ($new_df.a * $new_df.b / $new_df.new_col) --name my_sum)
> let $new_df

───┬───┬───┬─────────┬────────
 # │ b │ a │ new_col │ my_sum
───┼───┼───┼─────────┼────────
 0 │ 2 │ 1 │       9 │      0
 1 │ 4 │ 3 │       8 │      1
 2 │ 6 │ 5 │       4 │      7
───┴───┴───┴─────────┴────────
```

Nushell 的管道系统可以帮助你创建非常有趣的工作流程。

## 系列和掩码

在使用 DataFrames 时，系列还有另一个关键用途，那就是我们可以用它们来建立布尔掩码（Mask）。让我们先用等于运算符创建一个简单的掩码：

```shell
> let mask = ($new == 8)
> $mask

───┬─────────
 # │ new_col
───┼─────────
 0 │ false
 1 │ true
 2 │ false
───┴─────────
```

有了这个掩码，我们现在可以过滤一个 DataFrame，像这样：

```shell
> $new_df | dfr filter-with $mask

───┬───┬───┬─────────┬────────
 # │ a │ b │ new_col │ my_sum
───┼───┼───┼─────────┼────────
 0 │ 3 │ 4 │       8 │      1
───┴───┴───┴─────────┴────────
```

现在我们有一个新的 DataFrame，其中只有掩码为真的值。

掩码也可以从 Nushell 列表中创建，比如：

```shell
> let mask1 = ([true true false] | dfr to-df mask)
> $new_df | dfr filter-with $mask1

───┬───┬───┬─────────┬────────
 # │ a │ b │ new_col │ my_sum
───┼───┼───┼─────────┼────────
 0 │ 1 │ 2 │       9 │      0
 1 │ 3 │ 4 │       8 │      1
───┴───┴───┴─────────┴────────
```

为了创建复杂的掩码，我们可以使用`AND`：

```shell
> $mask && $mask1

───┬──────────────────
 # │ and_new_col_mask
───┼──────────────────
 0 │ false
 1 │ true
 2 │ false
───┴──────────────────
```

或者 `OR` 操作：

```shell
> $mask || $mask1

───┬─────────────────
 # │ or_new_col_mask
───┼─────────────────
 0 │ true
 1 │ true
 2 │ false
───┴─────────────────
```

我们也可以通过检查某些值是否存在于其他系列来创建一个掩码。使用我们创建的第一个 DataFrame，我们可以这样做：

```shell
> let mask3 = ($df.first | dfr is-in ([b c] | dfr to-df))

───┬──────
 # │ first
───┼───────
 0 │ false
 1 │ false
 2 │ false
 3 │ true
 4 │ true
 5 │ true
 6 │ true
 7 │ true
 8 │ true
 9 │ true
───┴───────
```

而这个新的掩码可以用来过滤 DataFrame

```shell
> $df | dfr filter-with $mask3

───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬─────────
 # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word
───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼─────────
 0 │     4 │    14 │  0.4000 │  3.0000 │ b     │ a      │ c     │ second
 1 │     0 │    15 │  0.5000 │  4.0000 │ b     │ a      │ a     │ third
 2 │     6 │    16 │  0.6000 │  5.0000 │ b     │ a      │ a     │ second
 3 │     7 │    17 │  0.7000 │  6.0000 │ b     │ c      │ a     │ third
 4 │     8 │    18 │  0.8000 │  7.0000 │ c     │ c      │ b     │ eight
 5 │     9 │    19 │  0.9000 │  8.0000 │ c     │ c      │ b     │ ninth
 6 │     0 │    10 │  0.0000 │  9.0000 │ c     │ c      │ b     │ ninth
───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴─────────
```

另一个可以用掩码进行的操作是设置或替换一个系列的值。例如，我们可以改变列`first`中的值，如果该值包含`a`：

```shell
> $df.first | dfr set new --mask ($df.first =~ a)

───┬────────
 # │ string
───┼────────
 0 │ new
 1 │ new
 2 │ new
 3 │ b
 4 │ b
 5 │ b
 6 │ b
 7 │ c
 8 │ c
 9 │ c
───┴────────
```

## 系列作为索引

系列也可以作为过滤 DataFrame 的一种方式，将它们作为索引列表使用。例如，假设我们想从原始 DataFrame 中获取第1、4和6行。针对这一点，我们可以使用以下命令来提取这些信息：

```shell
> let indices = ([1 4 6] | dfr to-df)
> $df | dfr take $indices

───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────
 # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word
───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────
 0 │     2 │    12 │  0.2000 │  1.0000 │ a     │ b      │ c     │ second
 1 │     0 │    15 │  0.5000 │  4.0000 │ b     │ a      │ a     │ third
 2 │     7 │    17 │  0.7000 │  6.0000 │ b     │ c      │ a     │ third
───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────
```

命令`take`非常方便，特别是当我们把它与其他命令混合使用时。
比方说，我们想提取列`first`的唯一元素的所有行。为了做到这一点，我们可以使用`dfr arg-unique`命令，如下例所示：

```shell
> let indices = ($df.first | dfr arg-unique)
> $df | dfr take $indices

───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────
 # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word
───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────
 0 │     1 │    11 │  0.1000 │  1.0000 │ a     │ b      │ c     │ first
 1 │     4 │    14 │  0.4000 │  3.0000 │ b     │ a      │ c     │ second
 2 │     8 │    18 │  0.8000 │  7.0000 │ c     │ c      │ b     │ eight
───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────
```

或者，如果我们想使用一个特定的列来创建一个新的有序 DataFrame，该怎么办？我们可以使用`dfr arg-sort`来完成这个任务。在下一个例子中，我们可以通过`word`列对 DataFrame 进行排序：

::: tip
同样的结果也可以用`sort`命令来完成。
:::

```shell
> let indices = ($df.word | dfr arg-sort)
> $df | dfr take $indices

───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────
 # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word
───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────
 0 │     8 │    18 │  0.8000 │  7.0000 │ c     │ c      │ b     │ eight
 1 │     1 │    11 │  0.1000 │  1.0000 │ a     │ b      │ c     │ first
 2 │     9 │    19 │  0.9000 │  8.0000 │ c     │ c      │ b     │ ninth
 3 │     0 │    10 │  0.0000 │  9.0000 │ c     │ c      │ b     │ ninth
 4 │     2 │    12 │  0.2000 │  1.0000 │ a     │ b      │ c     │ second
 5 │     4 │    14 │  0.4000 │  3.0000 │ b     │ a      │ c     │ second
 6 │     6 │    16 │  0.6000 │  5.0000 │ b     │ a      │ a     │ second
 7 │     3 │    13 │  0.3000 │  2.0000 │ a     │ b      │ c     │ third
 8 │     0 │    15 │  0.5000 │  4.0000 │ b     │ a      │ a     │ third
 9 │     7 │    17 │  0.7000 │  6.0000 │ b     │ c      │ a     │ third
───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────
```

最后，我们可以通过在标记的索引中设置一个新值来创建新的系列。请看下一条命令：

```shell
> let indices = ([0 2] | dfr to-df);
> $df.int_1 | dfr set-with-idx 123 --indices $indices

───┬───────
 # │ int_1
───┼───────
 0 │   123
 1 │     2
 2 │   123
 3 │     4
 4 │     0
 5 │     6
 6 │     7
 7 │     8
 8 │     9
 9 │     0
───┴───────
```

## 唯一值

另一个可以用`Series`完成的操作是在一个列表或列中搜索唯一值。让我们再次使用我们创建的第一个 DataFrame 来测试这些操作。

第一个也是最常见的操作是`value_counts`。这个命令计算出一个系列中存在的唯一值的数量。例如，我们可以用它来计算 `first` 列各值的出现次数：

```shell
> $df.first | dfr value-counts

───┬───────┬────────
 # │ first │ counts
───┼───────┼────────
 0 │ b     │      4
 1 │ c     │      3
 2 │ a     │      3
───┴───────┴────────
```

正如预期的那样，该命令返回一个新的 DataFrame，可以用来做更多的查询。

继续我们对 `Series` 的探索，我们要做的下一件事是只从一个系列中获得唯一值，像这样：

```shell
> $df.first | dfr unique

───┬───────
 # │ first
───┼───────
 0 │ c
 1 │ b
 2 │ a
───┴───────
```

或者我们可以得到一个掩码，用来过滤出数据唯一或重复的行。例如，我们可以选择列 `word` 中含唯一值的行：

```shell
> $df | dfr filter-with ($df.word | dfr is-unique)

───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬───────
 # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │ word
───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼───────
 0 │     1 │    11 │  0.1000 │  1.0000 │ a     │ b      │ c     │ first
 1 │     8 │    18 │  0.8000 │  7.0000 │ c     │ c      │ b     │ eight
───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴───────
```

或所有含重复值的行：

```shell
> $df | dfr filter-with ($df.word | dfr is-duplicated)

───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────
 # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word
───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────
 0 │     2 │    12 │  0.2000 │  1.0000 │ a     │ b      │ c     │ second
 1 │     3 │    13 │  0.3000 │  2.0000 │ a     │ b      │ c     │ third
 2 │     4 │    14 │  0.4000 │  3.0000 │ b     │ a      │ c     │ second
 3 │     0 │    15 │  0.5000 │  4.0000 │ b     │ a      │ a     │ third
 4 │     6 │    16 │  0.6000 │  5.0000 │ b     │ a      │ a     │ second
 5 │     7 │    17 │  0.7000 │  6.0000 │ b     │ c      │ a     │ third
 6 │     9 │    19 │  0.9000 │  8.0000 │ c     │ c      │ b     │ ninth
 7 │     0 │    10 │  0.0000 │  9.0000 │ c     │ c      │ b     │ ninth
───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────
```

## Dataframe 命令

到目前为止，我们已经看到了很多可以使用 `DataFrame` 相关命令的操作。然而，到目前为止，我们所使用的命令并不包括所有可用来处理数据的命令，请放心，随着该功能的稳定，还会有更多的命令。

下表列出了可用的`DataFrame`命令及其描述，并尽可能显示其类似的 Nushell 命令。

| 命令名          | 应用于                      | 描述                                               | Nushell 类似命令              |
| --------------- | --------------------------- | -------------------------------------------------- | ----------------------------- |
| aggregate       | DataFrame, GroupBy, Series  | 在一个 DataFrame、GroupBy 或系列对象上执行聚合操作 | math                          |
| all-false       | Series                      | 如果所有的值都是假的，则返回真                     |                               |
| all-true        | Series                      | 如果所有的值都是真的，则返回真                     | all?                          |
| arg-max         | Series                      | 返回系列中最大值的索引                             |                               |
| arg-min         | Series                      | 返回系列中最小值的索引                             |                               |
| arg-sort        | Series                      | 返回排序后的系列的索引                             |                               |
| arg-true        | Series                      | 返回值为真的索引                                   |                               |
| arg-unique      | Series                      | 返回唯一值的索引                                   |                               |
| column          | DataFrame                   | 将选定的列作为系列返回                             | get                           |
| count-null      | Series                      | 计算空值                                           |                               |
| count-unique    | Series                      | 计算唯一值                                         |                               |
| drop            | DataFrame                   | 通过删除选定的列来创建一个新的 DataFrame           | drop                          |
| drop-duplicates | DataFrame                   | 删除 DataFrame 中的重复值                          |                               |
| drop-nulls      | DataFrame, Series           | 丢弃 DataFrame 中的空值                            |                               |
| dtypes          | DataFrame                   | 显示 DataFrame 的数据类型                          |                               |
| filter-with     | DataFrame                   | 使用 Mask 作为参考来过滤 DataFrame                 |                               |
| first           | DataFrame                   | 用第一行创建新的 DataFrame                         | first                         |
| get             | DataFrame                   | 用选定的列创建 DataFrame                           | get                           |
| group-by        | DataFrame                   | 创建一个 GroupBy 对象，可用于其他聚合              | group-by                      |
| is-duplicated   | Series                      | 创建表示重复值的 Mask                              |                               |
| is-in           | Series                      | 检查一个系列的元素是否包含在右边的系列中           | in                            |
| is-not-null     | Series                      | 创建值为非空的 Mask                                |                               |
| is-null         | Series                      | 创建值为空的 Mask                                  | `<column_name> == $nothing`   |
| is-unique       | Series                      | 创建表示唯一值的 Mask                              |                               |
| join            | DataFrame                   | 使用列作为参考来连接一个 DataFrame                 |                               |
| last            | DataFrame                   | 用最后几行创建新的 DataFrame                       | last                          |
| list            |                             | 列出已存储的 DataFrame                             |                               |
| melt            | DataFrame                   | 将一个 DataFrame 从宽格式转为长格式                |                               |
| not             | Series Inverts boolean mask |                                                    |
| open            |                             | 从 csv 文件中加载 DataFrame                        | open                          |
| pivot           | GroupBy                     | 在 GroupBy 对象上执行透视操作                      | pivot                         |
| rename          | Series                      | 重命名一个系列                                     | rename                        |
| sample          | DataFrame                   | 创建样本 DataFrame                                 |                               |
| select          | DataFrame                   | 用选定的列创建一个新的 DataFrame                   | select                        |
| set             | Series                      | 在给定的 Mask 为真时设置值                         |                               |
| set-with-idx    | Series                      | 设置给定索引中的值                                 |                               |
| shift           | Series                      | 将值移到一个给定的时段                             |                               |
| show            | DataFrame                   | 将 DataFrame 的一个部分转换为一个表或列表值        |                               |
| slice           | DataFrame                   | 从行的切片中创建新的 DataFrame                     |                               |
| sort            | DataFrame, Series           | 创建新的排序 DataFrame 或系列                      | sort                          |
| take            | DataFrame, Series           | 使用给定的索引创建新的 DataFrame                   |                               |
| to-csv          | DataFrame                   | 将 DataFrame 保存为 csv 文件                       | to csv                        |
| to-df           |                             | 将一个管道里的表或列表转换为 DataFrame             |                               |
| to-dummies      | DataFrame                   | 创建一个带有假值的新 DataFrame                     |                               |
| to-parquet      | DataFrame                   | 将 DataFrame 保存到 parquet 文件中                 |                               |
| unique          | Series                      | 返回一个系列中的唯一值                             | uniq                          |
| value-counts    | Series                      | 返回一个带有系列中唯一值的计数的 DataFrame         |                               |
| where           | DataFrame                   | 过滤 DataFrame 以符合条件                          | where                         |
| with-column     | DataFrame                   | 在 DataFrame 中添加一个系列                        | `insert <column_name> <value> \| upsert <column_name> { <new_value> }` |

## DataFrames 的未来

我们希望在本页结束时，你已经牢固掌握了如何使用 DataFrame 相关命令。正如你所看到的，它们提供了强大的操作，可以帮助你更快更原生地处理数据。

然而，DataFrames 的未来仍然是非常实验性的，随着这些命令的成熟，新的命令和利用这些命令的工具将被加入。例如，DataFrames 的下一步是引入惰性 DataFrames，这将允许你定义复杂的数据操作，这些操作将在你决定 "**完成**" 这个管道时才被执行。这将使 Nushell 有机会选择最佳计划来查询你所要求的数据。

请继续访问本书，以查看 DataFrames 的最新情况，以及它们如何帮助你更快更有效地处理数据。
