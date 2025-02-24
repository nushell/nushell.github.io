# DataFrames

::: warning
要使用`DataFrame`支持，您需要使用 `cargo build --features dataframe` 构建一个具有完整功能的版本。从版本 0.72 开始，Nushell 的二进制发布版本中 *不* 包含`DataFrame`。[请参阅安装说明](/book/installation.md) 以获取更多详细信息。
:::

正如我们到目前为止所看到的，Nushell 把数据处理作为其主要任务。`Lists` 和 `Tables`的存在是为了帮助你循环处理值，以便执行多种操作或轻而易举地找到数据。然而，在某些操作中，基于行的数据布局并不是处理数据的最有效方式，特别是在处理极其庞大的文件时。对于大型数据集的`group-by`或`join`等操作，如果不使用适当的数据格式，会占用大量的内存，并可能耗费大量的计算时间。

出于这个原因，Nushell 引入了`DataFrame`结构。`DataFrame`以列格式存储数据，以 [Apache Arrow](https://arrow.apache.org/) 规范为基础，并使用 [Polars](https://github.com/pola-rs/polars) 作为执行极其 [快速列式操作](https://h2oai.github.io/db-benchmark/) 的马达。

你现在可能想知道这个组合能有多快，以及它如何能使数据工作更容易、更可靠。出于这个原因，让我们在本页开始时介绍一下处理数据时的常见操作的性能测试情况。

## 性能测试对比

在这个小的性能测试练习中，我们将比较本地的 Nushell 原生命令、Nushell DataFrame 相关命令和[Python Pandas](https://pandas.pydata.org/)命令。暂时不要太在意`dataframe`命令，它们将在本页后面的章节中解释。

> 系统细节：本节介绍的性能测试是用一台配备 Intel(R) Core(TM) i7-10710U
> （CPU @1.10GHz 1.61GHz）和 16 GB 内存的机器运行的。
>
> 所有的例子都在 Nushell 0.78 版本上运行。

### 文件信息

我们将用于性能测试的文件是 [新西兰商业人口统计](https://www.stats.govt.nz/assets/Uploads/New-Zealand-business-demography-statistics/New-Zealand-business-demography-statistics-At-February-2020/Download-data/Geographic-units-by-industry-and-statistical-area-2000-2020-descending-order-CSV.zip) 数据集。
如果你想尝试这些测试，请下载该文件。

该数据集有 5 列，5,429,252 行。我们可以通过使用`dfr ls`命令来检查：

```nu
❯ let df = (dfr open .\Data7602DescendingYearOrder.csv)
❯ dfr ls

╭───┬────────┬─────────┬─────────╮
│ # │  name  │ columns │  rows   │
├───┼────────┼─────────┼─────────┤
│ 0 │ $df    │       5 │ 5429252 │
╰───┴────────┴─────────┴─────────╯
```

我们可以用 `first` 看一下文件的第一行：

```nu
❯ $df | dfr first
╭───┬──────────┬─────────┬──────┬───────────┬──────────╮
│ # │ anzsic06 │  Area   │ year │ geo_count │ ec_count │
├───┼──────────┼─────────┼──────┼───────────┼──────────┤
│ 0 │ A        │ A100100 │ 2000 │        96 │      130 │
╰───┴──────────┴─────────┴──────┴───────────┴──────────╯
```

...最后，我们可以了解一下推断出的数据类型：

```nu
❯ $df | dfr dtypes
╭───┬───────────┬───────╮
│ # │  column   │ dtype │
├───┼───────────┼───────┤
│ 0 │ anzsic06  │ str   │
│ 1 │ Area      │ str   │
│ 2 │ year      │ i64   │
│ 3 │ geo_count │ i64   │
│ 4 │ ec_count  │ i64   │
╰───┴───────────┴───────╯
```

### 加载文件

让我们先来比较一下各种方法的加载时间。首先，我们将使用 Nushell 的[`open`](/commands/docs/open.md)命令加载数据：

```nu
❯ timeit {open .\Data7602DescendingYearOrder.csv}
30sec 479ms 614us 400ns
```

使用原生的 Nushell 功能加载文件需要 30 秒。对于加载 500 万条记录来说，这还算不错！但我们可以做得更好一些。

现在让我们使用 Pandas。我们将使用以下脚本来加载文件：

```python
import pandas as pd

df = pd.read_csv("Data7602DescendingYearOrder.csv")
```

而它的性能测试结果是：

```nu
❯ timeit {python load.py}
2sec 91ms 872us 900ns
```

这是一个很大的进步，从 30 秒到 2 秒。干得好，Pandas!

也许我们加载数据可以再快一点，这一次我们将使用 Nushell 的 `dfr open` 命令：

```nu
❯ timeit {dfr open .\Data7602DescendingYearOrder.csv}
601ms 700us 700ns
```

这一次，我们花了 0.6 秒。一点也不差。

### `Group-by`比较

这次让我们做一个稍微复杂的操作。我们将按年份对数据进行分组，并根据`geo_count`列对分组求和。

同样，我们要从 Nushell 的原生命令开始：

::: tip
如果你想运行这个例子，请注意接下来的命令将使用大量的内存，在该命令执行期间可能会影响你的系统性能。
:::

```nu
❯ timeit {
	open .\Data7602DescendingYearOrder.csv
	| group-by year
	| transpose header rows
	| upsert rows { get rows | math sum }
	| flatten
}

6min 30sec 622ms 312us
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

```nu
❯ timeit {python .\load.py}

1sec 966ms 954us 800ns
```

一点也不差！同样，Pandas 设法在很短的时间内完成了它。

为了进行比较，让我们试试 Nushell DataFrames。我们要把所有的操作放在一个`nu`文件中，以确保我们做的是类似的操作：

```nu
let df = (dfr open Data7602DescendingYearOrder.csv)
let res = ($df | dfr group-by year | dfr agg (dfr col geo_count | dfr sum))
$res
```

当使用 DataFrames 时的性能测试结果是：

```nu
❯ timeit {source load.nu}

557ms 658us 500ns
```

幸运的是，Nushell DataFrame 设法将时间再次减半。这不是很好吗？

正如你所看到的，Nushell 的[`Dataframe`](/commands/categories/dataframe.md)命令和现在最常见的做数据分析的工具一样快。这个发行版中的命令有可能成为你做数据分析的首选工具。通过组合复杂的 Nushell 管道，你可以以一种可靠的方式从数据中提取信息。

## 使用 DataFrames

在看到了可以用[`Dataframe`](/commands/categories/dataframe.md)命令完成的事情之后，现在是时候开始测试它们了。首先，让我们创建一个样本 CSV 文件，该文件将成为我们的样本 DataFrame，并与示例一起使用。在你喜欢的编辑器中粘贴下面几行来创建样本 csv 文件：

```text
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

保存该文件并随意命名，在这些例子中，该文件将被称为 `test_small.csv`。

现在，要将该文件作为 DataFrame 进行读取，请使用 `dfr open` 命令，如下所示：

```nu
let df = (dfr open test_small.csv)
```

这应该会在内存中创建一个值 `$df`，用来存放我们刚刚创建的数据。

::: tip
`dfr open` 命令可以读取 **csv** 或 **parquet** 文件。
:::

要查看存储在内存中的所有 DataFrames，你可以使用：

```nu
❯ dfr ls
╭───┬──────┬─────────┬──────╮
│ # │ name │ columns │ rows │
├───┼──────┼─────────┼──────┤
│ 0 │ $df  │       8 │   10 │
╰───┴──────┴─────────┴──────╯
```

正如你所看到的，该命令显示了所创建的 DataFrame 以及关于它们的基本信息。

如果你想看到加载的 DataFrame 的预览，你可以将 DataFrame 变量发送到流中：

```nu
❯ $df
╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────╮
│ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │
├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┤
│ 0 │     1 │    11 │    0.10 │    1.00 │ a     │ b      │ c     │ first  │
│ 1 │     2 │    12 │    0.20 │    1.00 │ a     │ b      │ c     │ second │
│ 2 │     3 │    13 │    0.30 │    2.00 │ a     │ b      │ c     │ third  │
│ 3 │     4 │    14 │    0.40 │    3.00 │ b     │ a      │ c     │ second │
│ 4 │     0 │    15 │    0.50 │    4.00 │ b     │ a      │ a     │ third  │
│ 5 │     6 │    16 │    0.60 │    5.00 │ b     │ a      │ a     │ second │
│ 6 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third  │
│ 7 │     8 │    18 │    0.80 │    7.00 │ c     │ c      │ b     │ eight  │
│ 8 │     9 │    19 │    0.90 │    8.00 │ c     │ c      │ b     │ ninth  │
│ 9 │     0 │    10 │    0.00 │    9.00 │ c     │ c      │ b     │ ninth  │
╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────╯
```

有了内存中的 DataFrame，我们就可以开始对 `DataFrame` 进行列操作。

::: tip
如果你想看到所有可用的 DataFrame 命令，你可以使用 `scope commands | where category =~ dataframe`。
:::

## 基本聚合

让我们从 DataFrame 的基本聚合开始，通过使用`aggregate`命令对`df`中存在的所有列进行求和：

```nu
❯ $df | dfr sum
╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬──────╮
│ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │ word │
├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼──────┤
│ 0 │    40 │   145 │    4.50 │   46.00 │       │        │       │      │
╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴──────╯
```

正如你所看到的，聚合函数(`aggregate`)为那些有意义的列计算出了总和。如果你想过滤掉文本列，你可以使用`select`命令来选择你想要的列。

```nu
❯ $df | dfr sum | dfr select int_1 int_2 float_1 float_2
╭───┬───────┬───────┬─────────┬─────────╮
│ # │ int_1 │ int_2 │ float_1 │ float_2 │
├───┼───────┼───────┼─────────┼─────────┤
│ 0 │    40 │   145 │    4.50 │   46.00 │
╰───┴───────┴───────┴─────────┴─────────╯
```

你甚至可以像存储任何其他 Nushell 变量一样存储这个聚合的结果：

```nu
❯ let res = ($df | dfr sum | dfr select int_1 int_2 float_1 float_2)
```

::: tip
输入 `let res = ( !! )` 并按回车，这将自动完成之前执行的命令。注意 ( 和 !! 之间的空格。
:::

现在我们有两个 DataFrame 存储在内存中：

```nu
❯ dfr ls
╭───┬──────┬─────────┬──────╮
│ # │ name │ columns │ rows │
├───┼──────┼─────────┼──────┤
│ 0 │ $res │       4 │    1 │
│ 1 │ $df  │       8 │   10 │
╰───┴──────┴─────────┴──────╯
```

很整洁，不是吗？

你可以在 DataFrame 上进行若干聚合，以便从中提取基本信息，也可以对你的全新 DataFrame 进行基本数据分析。

## 连接 DataFrame

也可以用一个列作为参考来连接(`join`)两个 DataFrame。我们将把我们的迷你 DataFrame 与另一个迷你 DataFrame 连接起来。在另一个文件中复制这些行，并创建相应的 DataFrame（在以下例子中，我们将称之为`test_small_a.csv`）。

```text
int_1,int_2,float_1,float_2,first
9,14,0.4,3.0,a
8,13,0.3,2.0,a
7,12,0.2,1.0,a
6,11,0.1,0.0,b
```

我们使用 `dfr open` 命令来创建新的变量：

```nu
❯ let df_a = (dfr open test_small_a.csv)
```

现在，当第二个 DataFrame 加载到内存中时，我们可以使用左边 DataFrame 的`int_1`列和右边 DataFrame 的`int_1`列来连接它们。

```nu
❯ $df | dfr join $df_a int_1 int_1
╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────┬─────────┬───────────┬───────────┬─────────╮
│ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │ int_2_x │ float_1_x │ float_2_x │ first_x │
├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┼─────────┼───────────┼───────────┼─────────┤
│ 0 │     6 │    16 │    0.60 │    5.00 │ b     │ a      │ a     │ second │      11 │      0.10 │      0.00 │ b       │
│ 1 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third  │      12 │      0.20 │      1.00 │ a       │
│ 2 │     8 │    18 │    0.80 │    7.00 │ c     │ c      │ b     │ eight  │      13 │      0.30 │      2.00 │ a       │
│ 3 │     9 │    19 │    0.90 │    8.00 │ c     │ c      │ b     │ ninth  │      14 │      0.40 │      3.00 │ a       │
╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────┴─────────┴───────────┴───────────┴─────────╯
```

::: tip
在`Nu`中，当一个命令有多个参数，并期望得到多个值时，我们用方括号`[]`来包裹这些值。在`dfr join`的情况下，我们可以对多个列进行连接，只要它们具有相同的类型。
:::

例如：

```nu
❯ $df | dfr join $df_a [int_1 first] [int_1 first]
╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────┬─────────┬───────────┬───────────╮
│ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │ int_2_x │ float_1_x │ float_2_x │
├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┼─────────┼───────────┼───────────┤
│ 0 │     6 │    16 │    0.60 │    5.00 │ b     │ a      │ a     │ second │      11 │      0.10 │      0.00 │
╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────┴─────────┴───────────┴───────────╯
```

默认情况下，连接命令做的是内连接，也就是说，它将保留两个 DataFrame 都有相同值的记录。你可以选择一个左联接来保留左边 DataFrame 中缺失的行。你也可以保存这个结果，以便在以后的操作中使用它。

## DataFrame 分组

可以用 DataFrame 进行的最强大的操作之一是`dfr group-by`。这个命令将允许你根据一个分组条件进行聚合操作。在 Nushell 中，`GroupBy`是一种可以被存储和重复使用的对象，可以被用于多个聚合。这是很方便的，因为在进行分组时，创建分组对是最昂贵的运算，如果你打算用同一个分组条件进行多个操作，就没有必要重复该运算。

要创建一个`GroupBy`对象，你只需要使用`group-by`命令：

```nu
❯ let group = ($df | dfr group-by first)
❯ $group
╭─────────────┬──────────────────────────────────────────────╮
│ LazyGroupBy │ apply aggregation to complete execution plan │
╰─────────────┴──────────────────────────────────────────────╯
```

当打印 `GroupBy` 对象时，我们可以看到它在后台是一个懒惰的操作，等待着通过添加一个聚合来完成。使用 `GroupBy` 我们可以在一个列上创建聚合

```nu
❯ $group | dfr agg (dfr col int_1 | dfr sum)
╭───┬───────┬───────╮
│ # │ first │ int_1 │
├───┼───────┼───────┤
│ 0 │ b     │    17 │
│ 1 │ a     │     6 │
│ 2 │ c     │    17 │
╰───┴───────┴───────╯
```

或者我们可以在相同或不同的列上定义多个聚合：

```nu
❯ $group | dfr agg [
∙ (dfr col int_1 | dfr n-unique)
∙ (dfr col int_2 | dfr min)
∙ (dfr col float_1 | dfr sum)
∙ (dfr col float_2 | dfr count)
∙ ] | dfr sort-by first
╭───┬───────┬───────┬───────┬─────────┬─────────╮
│ # │ first │ int_1 │ int_2 │ float_1 │ float_2 │
├───┼───────┼───────┼───────┼─────────┼─────────┤
│ 0 │ a     │     3 │    11 │    0.60 │       3 │
│ 1 │ b     │     4 │    14 │    2.20 │       4 │
│ 2 │ c     │     3 │    10 │    1.70 │       3 │
╰───┴───────┴───────┴───────┴─────────┴─────────╯
```

正如你所看到的，`GroupBy`对象是一个非常强大的变量，在你操作数据集时，它值得被保留在内存中。

## 创建 DataFrames

也可以从基本的 Nushell 基础类型，如整数、小数或字符串，来构建 DataFrames。让我们使用 `into df` 命令来创建一个小的 DataFrame：

```nu
❯ let a = ([[a b]; [1 2] [3 4] [5 6]] | dfr into-df)
❯ $a
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 1 │ 2 │
│ 1 │ 3 │ 4 │
│ 2 │ 5 │ 6 │
╰───┴───┴───╯
```

::: tip
目前，并不是所有的 Nushell 基本类型都可以转换为 DataFrame。随着 DataFrame 功能的成熟，这一点将在未来发生变化。
:::

我们可以在一个 DataFrame 中添加列，以创建一个新的变量。作为一个例子，让我们在迷你 DataFrame `$a` 上添加两列：

```nu
❯ let a2 = ($a | dfr with-column $a.a --name a2 | dfr with-column $a.a --name a3)
❯ $a2
╭───┬───┬───┬────┬────╮
│ # │ a │ b │ a2 │ a3 │
├───┼───┼───┼────┼────┤
│ 0 │ 1 │ 2 │  1 │  1 │
│ 1 │ 3 │ 4 │  3 │  3 │
│ 2 │ 5 │ 6 │  5 │  5 │
╰───┴───┴───┴────┴────╯
```

Nushell 强大的管道语法允许我们通过从其他 DataFrame 中获取数据并将其附加到这些 DataFrame 中来创建新的 DataFrame。现在，如果你列出你的 DataFrame，你会看到总共有四个：

```nu
❯ dfr ls
╭───┬───────┬─────────┬──────╮
│ # │ name  │ columns │ rows │
├───┼───────┼─────────┼──────┤
│ 0 │ $a2   │       4 │    3 │
│ 1 │ $df_a │       5 │    4 │
│ 2 │ $df   │       8 │   10 │
│ 3 │ $a    │       2 │    3 │
│ 4 │ $res  │       4 │    1 │
╰───┴───────┴─────────┴──────╯
```

值得一提的是，在使用 DataFrame 时，内存是如何被优化的呢？这要感谢 **Apache Arrow** 和 **Polars**。在一个非常简单的表示中，DataFrame 中的每一列都是一个 Arrow 数组，它使用了几种内存规格，以塞满尽可能多的数据（查看 [Arrow 列格式](https://arrow.apache.org/docs/format/Columnar.html) ）；另一个优化技巧是，只要有可能，DataFrame 中的列就会在多个 DataFrame 之间共享，避免了相同数据的内存重复占用。这意味着 DataFrame `$a`和`$a2`共享我们用 `into df` 命令创建的两个列。由于这个原因，不能改变 DataFrame 中某一列的值。然而，你可以根据其他列或 DataFrame 的数据创建新的列。

## 使用系列

系列(`Series`) 是 `DataFrame` 的基本组成部分。每个系列代表一个具有相同数据类型的列，我们可以创建多个不同类型的系列，如浮点、整型或字符串。

让我们通过使用 `into df` 命令创建一个系列，来开始我们对系列的探索：

```nu
❯ let new = ([9 8 4] | dfr into-df)
❯ $new
╭───┬───╮
│ # │ 0 │
├───┼───┤
│ 0 │ 9 │
│ 1 │ 8 │
│ 2 │ 4 │
╰───┴───╯
```

我们从一个整数列表创建了一个新的系列（我们也可以用浮点数或字符串做同样的事情）。

系列已经定义了自己的基本操作，它们可以用来创建其他系列。让我们通过对先前创建的列进行一些运算来创建一个新的系列：

```nu
❯ let new_2 = ($new * 3 + 10)
❯ $new_2
╭───┬────╮
│ # │ 0  │
├───┼────┤
│ 0 │ 37 │
│ 1 │ 34 │
│ 2 │ 22 │
╰───┴────╯
```

现在我们有一个新的系列，它是通过对前一个变量进行基本操作而构建的。

::: tip
如果你想看看你在内存中存储了多少变量，你可以使用`scope variables`。
:::

让我们重新命名我们之前的系列为 `memorable`

```nu
❯ let new_2 = ($new_2 | dfr rename "0" memorable)
❯ $new_2
╭───┬───────────╮
│ # │ memorable │
├───┼───────────┤
│ 0 │        37 │
│ 1 │        34 │
│ 2 │        22 │
╰───┴───────────╯
```

只要两个系列的数据类型相同，我们也可以对它们进行基本操作：

```nu
❯ $new - $new_2
╭───┬─────────────────╮
│ # │ sub_0_memorable │
├───┼─────────────────┤
│ 0 │             -28 │
│ 1 │             -26 │
│ 2 │             -18 │
╰───┴─────────────────╯
```


而且我们可以将它们添加到先前定义的 DataFrames 中：

```nu
❯ let new_df = ($a | dfr with-column $new --name new_col)
❯ $new_df
╭───┬───┬───┬─────────╮
│ # │ a │ b │ new_col │
├───┼───┼───┼─────────┤
│ 0 │ 1 │ 2 │       9 │
│ 1 │ 3 │ 4 │       8 │
│ 2 │ 5 │ 6 │       4 │
╰───┴───┴───┴─────────╯
```

存储在 DataFrame 中的系列也可以直接使用，例如，我们可以将列`a`和`b`相乘来创建一个新系列：

```nu
❯ $new_df.a * $new_df.b
╭───┬─────────╮
│ # │ mul_a_b │
├───┼─────────┤
│ 0 │       2 │
│ 1 │      12 │
│ 2 │      30 │
╰───┴─────────╯
```

我们可以开始使用管道，以创建新的列和 DataFrames：

```nu
❯ let $new_df = ($new_df | dfr with-column ($new_df.a * $new_df.b / $new_df.new_col) --name my_sum)
❯ $new_df
╭───┬───┬───┬─────────┬────────╮
│ # │ a │ b │ new_col │ my_sum │
├───┼───┼───┼─────────┼────────┤
│ 0 │ 1 │ 2 │       9 │      0 │
│ 1 │ 3 │ 4 │       8 │      1 │
│ 2 │ 5 │ 6 │       4 │      7 │
╰───┴───┴───┴─────────┴────────╯
```

Nushell 的管道系统可以帮助你创建非常有趣的工作流程。

## 系列和掩码

在使用 DataFrames 时，系列还有另一个关键用途，那就是我们可以用它们来建立布尔掩码（Mask）。让我们先用等于运算符创建一个简单的掩码：

```nu
❯ let mask = ($new == 8)
❯ $mask
╭───┬───────╮
│ # │   0   │
├───┼───────┤
│ 0 │ false │
│ 1 │ true  │
│ 2 │ false │
╰───┴───────╯
```

有了这个掩码，我们现在可以过滤一个 DataFrame，像这样：

```nu
❯ $new_df | dfr filter-with $mask
╭───┬───┬───┬─────────┬────────╮
│ # │ a │ b │ new_col │ my_sum │
├───┼───┼───┼─────────┼────────┤
│ 0 │ 3 │ 4 │       8 │      1 │
╰───┴───┴───┴─────────┴────────╯
```

现在我们有一个新的 DataFrame，其中只有掩码为真的值。

掩码也可以从 Nushell 列表中创建，比如：

```nu
❯ let mask1 = ([true true false] | dfr into-df)
❯ $new_df | dfr filter-with $mask1
╭───┬───┬───┬─────────┬────────╮
│ # │ a │ b │ new_col │ my_sum │
├───┼───┼───┼─────────┼────────┤
│ 0 │ 1 │ 2 │       9 │      0 │
│ 1 │ 3 │ 4 │       8 │      1 │
╰───┴───┴───┴─────────┴────────╯
```

为了创建复杂的掩码，我们可以使用`AND`：

```nu
❯ $mask and $mask1
╭───┬─────────╮
│ # │ and_0_0 │
├───┼─────────┤
│ 0 │ false   │
│ 1 │ true    │
│ 2 │ false   │
╰───┴─────────╯
```

或者 `OR` 操作：

```nu
❯ $mask or $mask1
╭───┬────────╮
│ # │ or_0_0 │
├───┼────────┤
│ 0 │ true   │
│ 1 │ true   │
│ 2 │ false  │
╰───┴────────╯
```

我们也可以通过检查某些值是否存在于其他系列来创建一个掩码。使用我们创建的第一个 DataFrame，我们可以这样做：

```nu
❯ let mask3 = ($df | dfr col first | dfr is-in [b c])
❯ $mask3
╭──────────┬─────────────────────────────────────────────────────────────────────────────────────────────────╮
│          │ ╭───┬─────────┬──────────────╮                                                                  │
│ input    │ │ # │  expr   │    value     │                                                                  │
│          │ ├───┼─────────┼──────────────┤                                                                  │
│          │ │ 0 │ column  │ first        │                                                                  │
│          │ │ 1 │ literal │ Series[list] │                                                                  │
│          │ ╰───┴─────────┴──────────────╯                                                                  │
│ function │ IsIn                                                                                            │
│ options  │ FunctionOptions { collect_groups: ApplyFlat, input_wildcard_expansion: false, auto_explode: tru │
│          │ e, fmt_str: "", cast_to_supertypes: true, allow_rename: false, pass_name_to_apply: false }      │
╰──────────┴─────────────────────────────────────────────────────────────────────────────────────────────────╯
```

而这个新的掩码可以用来过滤 DataFrame

```nu
❯ $df | dfr filter-with $mask3
╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────╮
│ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │
├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┤
│ 0 │     4 │    14 │    0.40 │    3.00 │ b     │ a      │ c     │ second │
│ 1 │     0 │    15 │    0.50 │    4.00 │ b     │ a      │ a     │ third  │
│ 2 │     6 │    16 │    0.60 │    5.00 │ b     │ a      │ a     │ second │
│ 3 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third  │
│ 4 │     8 │    18 │    0.80 │    7.00 │ c     │ c      │ b     │ eight  │
│ 5 │     9 │    19 │    0.90 │    8.00 │ c     │ c      │ b     │ ninth  │
│ 6 │     0 │    10 │    0.00 │    9.00 │ c     │ c      │ b     │ ninth  │
╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────╯
```

另一个可以用掩码进行的操作是设置或替换一个系列的值。例如，我们可以改变列`first`中的值，如果该值包含`a`：

```nu
❯ $df | dfr get first | dfr set new --mask ($df.first =~ a)
╭───┬────────╮
│ # │ string │
├───┼────────┤
│ 0 │ new    │
│ 1 │ new    │
│ 2 │ new    │
│ 3 │ b      │
│ 4 │ b      │
│ 5 │ b      │
│ 6 │ b      │
│ 7 │ c      │
│ 8 │ c      │
│ 9 │ c      │
╰───┴────────╯
```

## 系列作为索引

系列也可以作为过滤 DataFrame 的一种方式，将它们作为索引列表使用。例如，假设我们想从原始 DataFrame 中获取第1、4和6行。针对这一点，我们可以使用以下命令来提取这些信息：

```nu
❯ let indices = ([1 4 6] | dfr into-df)
❯  $df | dfr take $indices
╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────╮
│ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │
├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┤
│ 0 │     2 │    12 │    0.20 │    1.00 │ a     │ b      │ c     │ second │
│ 1 │     0 │    15 │    0.50 │    4.00 │ b     │ a      │ a     │ third  │
│ 2 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third  │
╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────╯
```

命令  `dfr take` 非常方便，特别是当我们把它与其他命令混合使用时。
假设我们想提取 `first` 列中含有第一个重复的元素的的所有记录。为了做到这一点，我们可以使用 `arg-unique` 命令，如下例所示：

```nu
❯ let indices = ($df | dfr get first | dfr arg-unique)
❯ $df | dfr take $indices
╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────╮
│ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │
├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┤
│ 0 │     1 │    11 │    0.10 │    1.00 │ a     │ b      │ c     │ first  │
│ 1 │     4 │    14 │    0.40 │    3.00 │ b     │ a      │ c     │ second │
│ 2 │     8 │    18 │    0.80 │    7.00 │ c     │ c      │ b     │ eight  │
╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────╯
```

或者，如果我们想使用一个特定的列来创建一个新的有序 DataFrame，该怎么办？我们可以使用`arg-sort`来完成这个任务。在下一个例子中，我们可以通过`word`列对 DataFrame 进行排序：

::: tip
同样的结果也可以用[`sort`](/commands/docs/sort.md)命令来完成。
:::

```nu
❯ let indices = ($df | dfr get word | dfr arg-sort)
❯ $df | dfr take $indices
╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────╮
│ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │
├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┤
│ 0 │     8 │    18 │    0.80 │    7.00 │ c     │ c      │ b     │ eight  │
│ 1 │     1 │    11 │    0.10 │    1.00 │ a     │ b      │ c     │ first  │
│ 2 │     9 │    19 │    0.90 │    8.00 │ c     │ c      │ b     │ ninth  │
│ 3 │     0 │    10 │    0.00 │    9.00 │ c     │ c      │ b     │ ninth  │
│ 4 │     2 │    12 │    0.20 │    1.00 │ a     │ b      │ c     │ second │
│ 5 │     4 │    14 │    0.40 │    3.00 │ b     │ a      │ c     │ second │
│ 6 │     6 │    16 │    0.60 │    5.00 │ b     │ a      │ a     │ second │
│ 7 │     3 │    13 │    0.30 │    2.00 │ a     │ b      │ c     │ third  │
│ 8 │     0 │    15 │    0.50 │    4.00 │ b     │ a      │ a     │ third  │
│ 9 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third  │
╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────╯
```

最后，我们可以通过在标记的索引中设置一个新值来创建新的系列。请看下一条命令：

```nu
❯ let indices = ([0 2] | dfr into-df);
❯ $df | dfr get int_1 | dfr set-with-idx 123 --indices $indices
╭───┬───────╮
│ # │ int_1 │
├───┼───────┤
│ 0 │   123 │
│ 1 │     2 │
│ 2 │   123 │
│ 3 │     4 │
│ 4 │     0 │
│ 5 │     6 │
│ 6 │     7 │
│ 7 │     8 │
│ 8 │     9 │
│ 9 │     0 │
╰───┴───────╯
```

## 唯一值

另一个可以用`Series`完成的操作是在一个列表或列中搜索唯一值。让我们再次使用我们创建的第一个 DataFrame 来测试这些操作。

第一个也是最常见的操作是`value_counts`。这个命令计算出一个系列中存在的唯一值的数量。例如，我们可以用它来计算 `first` 列各值的出现次数：

```nu
❯ $df | dfr get first | dfr value-counts
╭───┬───────┬────────╮
│ # │ first │ counts │
├───┼───────┼────────┤
│ 0 │ b     │      4 │
│ 1 │ a     │      3 │
│ 2 │ c     │      3 │
╰───┴───────┴────────╯
```

正如预期的那样，该命令返回一个新的 DataFrame，可以用来做更多的查询。

继续我们对 `Series` 的探索，我们要做的下一件事是只从一个系列中获得唯一值，像这样：

```nu
❯ $df | dfr get first | dfr unique
╭───┬───────╮
│ # │ first │
├───┼───────┤
│ 0 │ c     │
│ 1 │ b     │
│ 2 │ a     │
╰───┴───────╯
```

或者我们可以得到一个掩码，用来过滤出数据唯一或重复的行。例如，我们可以选择列 `word` 中含唯一值的行：

```nu
❯ $df | dfr filter-with ($df | dfr get word | dfr is-unique)
╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬───────╮
│ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │ word  │
├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼───────┤
│ 0 │     1 │    11 │    0.10 │    1.00 │ a     │ b      │ c     │ first │
│ 1 │     8 │    18 │    0.80 │    7.00 │ c     │ c      │ b     │ eight │
╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴───────╯
```

或所有含重复值的行：

```nu
❯ $df | dfr filter-with ($df | dfr get word | dfr is-duplicated)
╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬────────╮
│ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │  word  │
├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼────────┤
│ 0 │     2 │    12 │    0.20 │    1.00 │ a     │ b      │ c     │ second │
│ 1 │     3 │    13 │    0.30 │    2.00 │ a     │ b      │ c     │ third  │
│ 2 │     4 │    14 │    0.40 │    3.00 │ b     │ a      │ c     │ second │
│ 3 │     0 │    15 │    0.50 │    4.00 │ b     │ a      │ a     │ third  │
│ 4 │     6 │    16 │    0.60 │    5.00 │ b     │ a      │ a     │ second │
│ 5 │     7 │    17 │    0.70 │    6.00 │ b     │ c      │ a     │ third  │
│ 6 │     9 │    19 │    0.90 │    8.00 │ c     │ c      │ b     │ ninth  │
│ 7 │     0 │    10 │    0.00 │    9.00 │ c     │ c      │ b     │ ninth  │
╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴────────╯
```

## 惰性 Dataframe

惰性 Dataframe 是一种通过创建逻辑计划来查询数据的方法。这种方法的优点是，在你需要提取数据之前，该计划
永远不会被评估。这样，你可以把聚合、连接和选择连在一起，一旦你对所选操作感到满意，就可以收集数据。

让我们创建一个惰性 Dataframe 的小例子：

```nu
❯ let a = ([[a b]; [1 a] [2 b] [3 c] [4 d]] | dfr into-lazy)
❯ $a
╭────────────────┬─────────────────────────────────────────────────────────╮
│ plan           │   DF ["a", "b"]; PROJECT */2 COLUMNS; SELECTION: "None" │
│                │                                                         │
│ optimized_plan │   DF ["a", "b"]; PROJECT */2 COLUMNS; SELECTION: "None" │
│                │                                                         │
╰────────────────┴─────────────────────────────────────────────────────────╯
```

正如你所看到的，产生的 Dataframe 还没有被评估，它以一组可以对数据进行操作的指令的形式存在。
如果你要收集这个 Dataframe，你会得到如下结果：

```nu
❯ $a | dfr collect
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 1 │ a │
│ 1 │ 2 │ b │
│ 2 │ 3 │ c │
│ 3 │ 4 │ d │
╰───┴───┴───╯
```

正如你所看到的，`collect` 命令执行了计划并为你创建了一个 Nushell 表。

所有的 Dataframe 操作都应该能与惰性或者非惰性的 Dataframe 一起工作。为了兼容，这些操作在后台
进行了转换。然而，为了利用惰性操作的优势，我们建议只对惰性 Dataframe 使用惰性操作。

要找到所有惰性 Dataframe 操作，你可以使用：

```nu
scope commands | where category =~ lazyframe
```

在定义了你的惰性 Dataframe 后，我们可以开始对它进行链式操作。例如：

```nu
❯ $a |
∙ dfr reverse |
∙ dfr with-column [
∙  ((dfr col a) * 2 | dfr as double_a)
∙  ((dfr col a) / 2 | dfr as half_a)
∙ ] | dfr collect
╭───┬───┬───┬──────────┬────────╮
│ # │ a │ b │ double_a │ half_a │
├───┼───┼───┼──────────┼────────┤
│ 0 │ 4 │ d │        8 │      2 │
│ 1 │ 3 │ c │        6 │      1 │
│ 2 │ 2 │ b │        4 │      1 │
│ 3 │ 1 │ a │        2 │      0 │
╰───┴───┴───┴──────────┴────────╯
```

:::tip
你可以使用行缓存编辑器来轻松地格式化你的查询（ctr + o）
:::

这个查询使用惰性 `reverse` 命令来反转 Dataframe，使用 `dfr with-column` 命令并使用 `expressions` 来创建新的两列。
`expression` 用于定义在惰性 Dataframe 上执行的操作。当它们组合在一起时，就形成了整个由惰性命令来查询数据的
指令集。要列出所有产生表达式的命令，你可以使用：

```nu
❯ scope commands | where category =~ expression
```

在我们前面的例子中，我们使用 `dfr col` 命令来表示列 `a` 将被乘以2，然后它将被命名为 `double_a`。
在某些情况下，可以推断出 `dfr col` 命令的使用，例如，使用 `dfr select` 命令，我们可以只使用一个字符串：

```nu
❯ $a | dfr select a | dfr collect
```

或者使用 `dfr col` 命令：

```nu
❯ $a | dfr select (dfr col a) | dfr collect
```

让我们尝试更复杂的东西，从一个惰性 Dataframe 中创建聚合：

```nu
❯ let a = ( [[name value]; [one 1] [two 2] [one 1] [two 3]] | dfr into-lazy )
❯ $a |
∙ dfr group-by name |
∙ dfr agg [
∙ (dfr col value | dfr sum | dfr as sum)
∙ (dfr col value | dfr mean | dfr as mean)
∙ ] | dfr collect
╭───┬──────┬─────┬──────╮
│ # │ name │ sum │ mean │
├───┼──────┼─────┼──────┤
│ 0 │ two  │   5 │ 2.50 │
│ 1 │ one  │   2 │ 1.00 │
╰───┴──────┴─────┴──────╯
```

我们可以在一个还没有被收集的惰性 Dataframe 上进行连接操作。让我们把产生的分组连接到原来的惰性 Dataframe 中去吧

```nu
❯ let a = ( [[name value]; [one 1] [two 2] [one 1] [two 3]] | dfr into-lazy )
❯ let group = ($a
∙ | dfr group-by name
∙ | dfr agg [
∙   (dfr col value | dfr sum | dfr as sum)
∙   (dfr col value | dfr mean | dfr as mean)
∙ ])
❯ $a | dfr join $group name name | dfr collect
╭───┬──────┬───────┬─────┬──────╮
│ # │ name │ value │ sum │ mean │
├───┼──────┼───────┼─────┼──────┤
│ 0 │ one  │     1 │   2 │ 1.00 │
│ 1 │ two  │     2 │   5 │ 2.50 │
│ 2 │ one  │     1 │   2 │ 1.00 │
│ 3 │ two  │     3 │   5 │ 2.50 │
╰───┴──────┴───────┴─────┴──────╯
```

正如你所看到的，惰性 Dataframe 是一个强大的结构，它可以让你使用灵活的语法来查询数据，从而极快地获得结果。

## Dataframe 命令

到目前为止，我们已经看到了很多可以使用 `DataFrame` 相关命令的操作。然而，到目前为止，我们所使用的命令并不包括所有可用来处理数据的命令，请放心，随着该功能的稳定，还会有更多的命令。

下表列出了可用的`DataFrame`命令及其描述，并尽可能显示其类似的 Nushell 命令。

::: warning
此列表可能已过时。要获取最新的命令列表，请参阅
[Dataframe](/commands/categories/dataframe.md)
[Lazyframe](/commands/categories/lazyframe.md) 和
[Dataframe Or Lazyframe](/commands/categories/dataframe_or_lazyframe.md)
命令类别。
:::

| 命令名          | 应用于                      | 描述                                               | Nushell 类似命令              |
| --------------- | --------------------------- | -------------------------------------------------- | ----------------------------- |
| aggregate       | DataFrame, GroupBy, Series  | 在一个 DataFrame、GroupBy 或系列对象上执行聚合操作 | math                          |
| all-false       | Series                      | 如果所有的值都是假的，则返回真                     |                               |
| all-true        | Series                      | 如果所有的值都是真的，则返回真                     | all                           |
| arg-max         | Series                      | 返回系列中最大值的索引                             |                               |
| arg-min         | Series                      | 返回系列中最小值的索引                             |                               |
| arg-sort        | Series                      | 返回排序后的系列的索引                             |                               |
| arg-true        | Series                      | 返回值为真的索引                                   |                               |
| arg-unique      | Series                      | 返回唯一值的索引                                   |                               |
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
| ls-df           |                             | 列出已存储的 DataFrame                             |                               |
| melt            | DataFrame                   | 将一个 DataFrame 从宽格式转为长格式                |                               |
| not             | Series Inverts boolean mask |                                                    |
| open            |                             | 从 csv 文件中加载 DataFrame                        | open                          |
| pivot           | GroupBy                     | 在 GroupBy 对象上执行透视操作                      | pivot                         |
| rename          | Dataframe, Series           | 重命名一个系列                                     | rename                        |
| sample          | DataFrame                   | 创建样本 DataFrame                                 |                               |
| select          | DataFrame                   | 用选定的列创建一个新的 DataFrame                   | select                        |
| set             | Series                      | 在给定的 Mask 为真时设置值                         |                               |
| set-with-idx    | Series                      | 设置给定索引中的值                                 |                               |
| shift           | Series                      | 将值移到一个给定的时段                             |                               |
| show            | DataFrame                   | 将 DataFrame 的一个部分转换为一个表或列表值        |                               |
| slice           | DataFrame                   | 从行的切片中创建新的 DataFrame                     |                               |
| sort-by         | DataFrame, Series           | 创建新的排序 DataFrame 或系列                      | sort                          |
| take            | DataFrame, Series           | 使用给定的索引创建新的 DataFrame                   |                               |
| to csv          | DataFrame                   | 将 DataFrame 保存为 csv 文件                       | to csv                        |
| into df         |                             | 将一个管道里的表或列表转换为 DataFrame             |                               |
| dummies         | DataFrame                   | 创建一个带有假值的新 DataFrame                     |                               |
| to parquet      | DataFrame                   | 将 DataFrame 保存到 parquet 文件中                 |                               |
| unique          | Series                      | 返回一个系列中的唯一值                             | uniq                          |
| value-counts    | Series                      | 返回一个带有系列中唯一值的计数的 DataFrame         |                               |
| where           | DataFrame                   | 过滤 DataFrame 以符合条件                          | where                         |
| with-column     | DataFrame                   | 在 DataFrame 中添加一个系列                        | `insert <column_name> <value> \| upsert <column_name> { <new_value> }` |

## DataFrames 的未来

我们希望在本页结束时，你已经牢固掌握了如何使用 DataFrame 相关命令。正如你所看到的，它们提供了强大的操作，可以帮助你更快更原生地处理数据。

然而，DataFrames 的未来仍然是非常实验性的，随着这些命令的成熟，新的命令和利用这些命令的工具将被加入。例如，DataFrames 的下一步是引入惰性 DataFrames，这将允许你定义复杂的数据操作，这些操作将在你决定 "**完成**" 这个管道时才被执行。这将使 Nushell 有机会选择最佳计划来查询你所要求的数据。

请继续访问本书，以查看 DataFrames 的最新情况，以及它们如何帮助你更快更有效地处理数据。
