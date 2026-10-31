# 处理表格

[[toc]]

## 概述

在 Nu 中查看数据的常见方式之一是通过表格。Nu 自带许多用于处理表格的命令，让你能方便地找到所需内容，并把数据缩小到只剩你需要的部分。

首先，让我们获取一张可以使用的表格：

```nu
ls
# => ╭───┬───────────────┬──────┬─────────┬─────────────╮
# => │ # │     name      │ type │  size   │  modified   │
# => ├───┼───────────────┼──────┼─────────┼─────────────┤
# => │ 0 │ files.rs      │ file │  4.6 kB │ 5 days ago  │
# => │ 1 │ lib.rs        │ file │   330 B │ 5 days ago  │
# => │ 2 │ lite_parse.rs │ file │  6.3 kB │ 5 days ago  │
# => │ 3 │ parse.rs      │ file │ 49.8 kB │ a day ago   │
# => │ 4 │ path.rs       │ file │  2.1 kB │ 5 days ago  │
# => │ 5 │ rustfmt.toml  │ file │    17 B │ a month ago │
# => │ 6 │ shapes.rs     │ file │  4.7 kB │ 5 days ago  │
# => │ 7 │ signature.rs  │ file │  1.2 kB │ 5 days ago  │
# => ╰───┴───────────────┴──────┴─────────┴─────────────╯
```

::: tip 改变表格的显示方式
默认情况下，当终端宽度至少有 100 列时，Nu 会展开表格中的嵌套数据。你可以通过修改 `display_output` 钩子来改变这一行为。
更多信息请参阅[钩子](hooks.md#改变输出的显示方式)。
:::

## 排序数据

我们可以通过调用 [`sort-by`](/commands/docs/sort-by.md) 命令并告诉它要用哪些列进行排序来对表格排序。假设我们想按文件大小对表格排序：

```nu
ls | sort-by size
# => ╭───┬───────────────┬──────┬─────────┬─────────────╮
# => │ # │     name      │ type │  size   │  modified   │
# => ├───┼───────────────┼──────┼─────────┼─────────────┤
# => │ 0 │ rustfmt.toml  │ file │    17 B │ a month ago │
# => │ 1 │ lib.rs        │ file │   330 B │ 5 days ago  │
# => │ 2 │ signature.rs  │ file │  1.2 kB │ 5 days ago  │
# => │ 3 │ path.rs       │ file │  2.1 kB │ 5 days ago  │
# => │ 4 │ files.rs      │ file │  4.6 kB │ 5 days ago  │
# => │ 5 │ shapes.rs     │ file │  4.7 kB │ 5 days ago  │
# => │ 6 │ lite_parse.rs │ file │  6.3 kB │ 5 days ago  │
# => │ 7 │ parse.rs      │ file │ 49.8 kB │ a day ago   │
# => ╰───┴───────────────┴──────┴─────────┴─────────────╯
```

我们可以按任何可比较的列对表格排序。例如，我们也可以用“name”、“type”或“modified”列对上面的表格排序。

有关排序的更多信息，请参阅[排序](sorting.md)。

## 选择你想要的数据

::: tip 注意
以下是一个基本的概述。关于本主题的深入讨论，请参阅[导航与访问结构化数据](./navigating_structured_data.md)一章。
:::

我们可以通过选择特定的列或特定的行来从表格中选取数据。让我们用 [`select`](/commands/docs/select.md) 从表格中选取几列来使用：

```nu
ls | select name size
# => ╭───┬───────────────┬─────────╮
# => │ # │     name      │  size   │
# => ├───┼───────────────┼─────────┤
# => │ 0 │ files.rs      │  4.6 kB │
# => │ 1 │ lib.rs        │   330 B │
# => │ 2 │ lite_parse.rs │  6.3 kB │
# => │ 3 │ parse.rs      │ 49.8 kB │
# => │ 4 │ path.rs       │  2.1 kB │
# => │ 5 │ rustfmt.toml  │    17 B │
# => │ 6 │ shapes.rs     │  4.7 kB │
# => │ 7 │ signature.rs  │  1.2 kB │
# => ╰───┴───────────────┴─────────╯
```

这有助于创建一张更聚焦于我们所需内容的表格。接下来，假设我们只想查看该目录中最小的 5 个文件：

```nu
ls | sort-by size | first 5
# => ╭───┬──────────────┬──────┬────────┬─────────────╮
# => │ # │     name     │ type │  size  │  modified   │
# => ├───┼──────────────┼──────┼────────┼─────────────┤
# => │ 0 │ rustfmt.toml │ file │   17 B │ a month ago │
# => │ 1 │ lib.rs       │ file │  330 B │ 5 days ago  │
# => │ 2 │ signature.rs │ file │ 1.2 kB │ 5 days ago  │
# => │ 3 │ path.rs      │ file │ 2.1 kB │ 5 days ago  │
# => │ 4 │ files.rs     │ file │ 4.6 kB │ 5 days ago  │
# => ╰───┴──────────────┴──────┴────────┴─────────────╯
```

你会注意到，我们先按大小对表格排序以得到最小的文件，然后用 `first 5` 返回表格的前 5 行。

你也可以 [`skip`](/commands/docs/skip.md) 掉你不想要的行。让我们跳过上面返回的 5 行中的前两行：

```nu
ls | sort-by size | first 5 | skip 2
# => ╭───┬──────────────┬──────┬────────┬────────────╮
# => │ # │     name     │ type │  size  │  modified  │
# => ├───┼──────────────┼──────┼────────┼────────────┤
# => │ 0 │ signature.rs │ file │ 1.2 kB │ 5 days ago │
# => │ 1 │ path.rs      │ file │ 2.1 kB │ 5 days ago │
# => │ 2 │ files.rs     │ file │ 4.6 kB │ 5 days ago │
# => ╰───┴──────────────┴──────┴────────┴────────────╯
```

我们把它缩小到了我们关心的三行。

让我们再看几个用于选择数据的命令。你可能想知道为什么表格的行是数字。这是一种获取单行的便捷方式。让我们按文件名对表格排序，然后用 [`select`](/commands/docs/select.md) 命令按行号选取其中一行：

```nu
ls | sort-by name
# => ╭───┬───────────────┬──────┬─────────┬─────────────╮
# => │ # │     name      │ type │  size   │  modified   │
# => ├───┼───────────────┼──────┼─────────┼─────────────┤
# => │ 0 │ files.rs      │ file │  4.6 kB │ 5 days ago  │
# => │ 1 │ lib.rs        │ file │   330 B │ 5 days ago  │
# => │ 2 │ lite_parse.rs │ file │  6.3 kB │ 5 days ago  │
# => │ 3 │ parse.rs      │ file │ 49.8 kB │ a day ago   │
# => │ 4 │ path.rs       │ file │  2.1 kB │ 5 days ago  │
# => │ 5 │ rustfmt.toml  │ file │    17 B │ a month ago │
# => │ 6 │ shapes.rs     │ file │  4.7 kB │ 5 days ago  │
# => │ 7 │ signature.rs  │ file │  1.2 kB │ 5 days ago  │
# => ╰───┴───────────────┴──────┴─────────┴─────────────╯

ls | sort-by name | select 5
# => ╭───┬──────────────┬──────┬──────┬─────────────╮
# => │ # │     name     │ type │ size │  modified   │
# => ├───┼──────────────┼──────┼──────┼─────────────┤
# => │ 0 │ rustfmt.toml │ file │ 17 B │ a month ago │
# => ╰───┴──────────────┴──────┴──────┴─────────────╯
```

## 从表格中取出数据

到目前为止，我们都是通过把表格裁剪到只剩所需内容来处理表格。有时我们可能想更进一步，只查看单元格中的值，而不是取一整列。例如，假设我们只想得到一个文件名的列表。为此，我们使用 [`get`](/commands/docs/get.md) 命令：

```nu
ls | get name
# => ╭───┬───────────────╮
# => │ 0 │ files.rs      │
# => │ 1 │ lib.rs        │
# => │ 2 │ lite_parse.rs │
# => │ 3 │ parse.rs      │
# => │ 4 │ path.rs       │
# => │ 5 │ rustfmt.toml  │
# => │ 6 │ shapes.rs     │
# => │ 7 │ signature.rs  │
# => ╰───┴───────────────╯
```

现在我们得到了每个文件名的值。

这可能看起来很像我们前面看到的 [`select`](/commands/docs/select.md) 命令，所以让我们把它也放在这里，以便比较两者：

```nu
ls | select name
# => ╭───┬───────────────╮
# => │ # │     name      │
# => ├───┼───────────────┤
# => │ 0 │ files.rs      │
# => │ 1 │ lib.rs        │
# => │ 2 │ lite_parse.rs │
# => │ 3 │ parse.rs      │
# => │ 4 │ path.rs       │
# => │ 5 │ rustfmt.toml  │
# => │ 6 │ shapes.rs     │
# => │ 7 │ signature.rs  │
# => ╰───┴───────────────╯
```

它们看起来非常相似！让我们来说明这两个命令之间的区别，以便弄清楚：

- [`select`](/commands/docs/select.md) - 创建一张只包含指定列的新表格
- [`get`](/commands/docs/get.md) - 以列表形式返回指定列中的值

:::tip
传给 `select` 和 `get` 的参数是[单元格路径](types_of_data.md#单元格路径)，它是 Nu 查询语言的基础部分。关于单元格路径和其它导航主题的深入讨论，请参阅下一章[导航与访问结构化数据](./navigating_structured_data.md)。
:::

## 修改表格中的数据

除了从表格中选择数据，我们还可以更新表格的内容。我们可能想合并表格、添加新列，或编辑某个单元格的内容。在 Nu 中，本节中的每个命令都不是就地编辑，而是会在管道中返回一张新表格。

### 拼接表格

我们可以使用 [`append`](/commands/docs/append.md) 来拼接表格：

```nu
let first = [[a b]; [1 2]]
let second = [[a b]; [3 4]]
$first | append $second
# => ╭───┬───┬───╮
# => │ # │ a │ b │
# => ├───┼───┼───┤
# => │ 0 │ 1 │ 2 │
# => │ 1 │ 3 │ 4 │
# => ╰───┴───┴───╯
```

如果列名不完全相同，则会根据需要创建额外的列和值：

```nu
let first = [[a b]; [1 2]]
let second = [[a b]; [3 4]]
let third = [[a c]; [3 4]]
$first | append $second | append $third
# => ╭───┬───┬────┬────╮
# => │ # │ a │ b  │ c  │
# => ├───┼───┼────┼────┤
# => │ 0 │ 1 │  2 │ ❎ │
# => │ 1 │ 3 │  4 │ ❎ │
# => │ 2 │ 3 │ ❎ │  4 │
# => ╰───┴───┴────┴────╯
```

你也可以使用 `++` 运算符作为 `append` 的内联替代：

```nu
$first ++ $second ++ $third
# => ╭───┬───┬────┬────╮
# => │ # │ a │ b  │ c  │
# => ├───┼───┼────┼────┤
# => │ 0 │ 1 │  2 │ ❎ │
# => │ 1 │ 3 │  4 │ ❎ │
# => │ 2 │ 3 │ ❎ │  4 │
# => ╰───┴───┴────┴────╯
```

### 合并表格

我们可以使用 [`merge`](/commands/docs/merge.md) 命令把两个（或更多）表格合并在一起

```nu
let first = [[a b]; [1 2]]
let second = [[c d]; [3 4]]
$first | merge $second
# => ╭───┬───┬───┬───┬───╮
# => │ # │ a │ b │ c │ d │
# => ├───┼───┼───┼───┼───┤
# => │ 0 │ 1 │ 2 │ 3 │ 4 │
# => ╰───┴───┴───┴───┴───╯
```

让我们添加第三张表格：

```nu
let third = [[e f]; [5 6]]
```

我们可以这样把三张表格全部连接起来：

```nu
$first | merge $second  | merge $third
# => ╭───┬───┬───┬───┬───┬───┬───╮
# => │ # │ a │ b │ c │ d │ e │ f │
# => ├───┼───┼───┼───┼───┼───┼───┤
# => │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │
# => ╰───┴───┴───┴───┴───┴───┴───╯
```

或者我们可以使用 [`reduce`](/commands/docs/reduce.md) 命令动态合并所有表格：

```nu
[$first $second $third] | reduce {|elt, acc| $acc | merge $elt }
# => ╭───┬───┬───┬───┬───┬───┬───╮
# => │ # │ a │ b │ c │ d │ e │ f │
# => ├───┼───┼───┼───┼───┼───┼───┤
# => │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │
# => ╰───┴───┴───┴───┴───┴───┴───╯
```

### 连接表格

`merge` 按位置对齐各行。若要像数据库连接那样按列中的值匹配来合并行，请使用 [`join`](/commands/docs/join.md)。它接受右侧表格、左侧表的连接列，以及（若名称不同）右侧表的连接列：

```nu
let orders = [[id customer]; [1 alice] [2 bob] [3 carol]]
let shipped = [[order_id carrier]; [1 ups] [3 fedex]]
$orders | join $shipped id order_id
# => ╭───┬────┬──────────┬──────────┬─────────╮
# => │ # │ id │ customer │ order_id │ carrier │
# => ├───┼────┼──────────┼──────────┼─────────┤
# => │ 0 │  1 │ alice    │        1 │ ups     │
# => │ 1 │  3 │ carol    │        3 │ fedex   │
# => ╰───┴────┴──────────┴──────────┴─────────╯
```

默认情况下，只保留两张表中都有匹配的行。`--left`、`--right` 和 `--outer` 还会保留一侧或两侧没有匹配的行。`--anti` 只保留左表中*没有*匹配的行，且不添加任何列，这可以回答诸如“哪些订单还没有发货？”这样的问题：

```nu
$orders | join --anti $shipped id order_id
# => ╭───┬────┬──────────╮
# => │ # │ id │ customer │
# => ├───┼────┼──────────┤
# => │ 0 │  2 │ bob      │
# => ╰───┴────┴──────────╯
```

### 添加新列

我们可以使用 [`insert`](/commands/docs/insert.md) 命令为表格添加新列。让我们看一个例子：

```nu
open rustfmt.toml
# => ╭─────────┬──────╮
# => │ edition │ 2018 │
# => ╰─────────┴──────╯
```

让我们添加一个名为“next_edition”的列，值为 2021：

```nu
open rustfmt.toml | insert next_edition 2021
# => ╭──────────────┬──────╮
# => │ edition      │ 2018 │
# => │ next_edition │ 2021 │
# => ╰──────────────┴──────╯
```

这个视觉效果可能有点令人困惑，因为看起来我们刚才做的是添加了一行。在这种情况下请记住：行有编号，列有名称。如果仍然感到困惑，请注意再追加一行会让表格按预期渲染：

```nu
open rustfmt.toml | insert next_edition 2021 | append {edition: 2021 next_edition: 2024}
# => ╭───┬─────────┬──────────────╮
# => │ # │ edition │ next_edition │
# => ├───┼─────────┼──────────────┤
# => │ 0 │ 2018    │         2021 │
# => │ 1 │    2021 │         2024 │
# => ╰───┴─────────┴──────────────╯
```

请注意，如果我们打开原始文件，其内容保持不变：

```nu
open rustfmt.toml
# => ╭─────────┬──────╮
# => │ edition │ 2018 │
# => ╰─────────┴──────╯
```

在 Nu 中，修改是函数式的，也就是说它们作用于值本身，而不是试图造成永久性的改变。这让我们可以在管道中做许多不同类型的处理，直到准备好时再把结果连同我们想要的任何改动一起写出。这里我们可以用 [`save`](/commands/docs/save.md) 命令写出结果：

```nu
open rustfmt.toml | insert next_edition 2021 | save rustfmt2.toml
open rustfmt2.toml
# => ╭──────────────┬──────╮
# => │ edition      │ 2018 │
# => │ next_edition │ 2021 │
# => ╰──────────────┴──────╯
```

### 更新列

与 [`insert`](/commands/docs/insert.md) 命令类似，我们也可以使用 [`update`](/commands/docs/update.md) 命令把某一列的内容改为新值。为了看看它的实际效果，让我们打开同一个文件：

```nu
open rustfmt.toml
# => ╭─────────┬──────╮
# => │ edition │ 2018 │
# => ╰─────────┴──────╯
```

现在，让我们把 edition 更新为我们希望支持的下一个版本：

```nu
open rustfmt.toml | update edition 2021
# => ╭─────────┬──────╮
# => │ edition │ 2021 │
# => ╰─────────┴──────╯
```

你也可以使用 [`upsert`](/commands/docs/upsert.md) 命令，根据该列是否已存在来插入或更新。

### 移动列

你可以使用 [`move`](/commands/docs/move.md) 来移动表格中的列。例如，如果我们想把 [`ls`](/commands/docs/ls.md) 的“name”列移到“size”列之后，可以这样做：

```nu
ls | move name --after size | first 5
# => ╭───┬──────┬─────────┬───────────────┬────────────╮
# => │ # │ type │  size   │     name      │  modified  │
# => ├───┼──────┼─────────┼───────────────┼────────────┤
# => │ 0 │ file │  4.6 kB │ files.rs      │ 5 days ago │
# => │ 1 │ file │   330 B │ lib.rs        │ 5 days ago │
# => │ 2 │ file │  6.3 kB │ lite_parse.rs │ 5 days ago │
# => │ 3 │ file │ 49.8 kB │ parse.rs      │ a day ago  │
# => │ 4 │ file │  2.1 kB │ path.rs       │ 5 days ago │
# => ╰───┴──────┴─────────┴───────────────┴────────────╯
```

### 重命名列

你也可以通过把表格传给 rename 命令来 [`rename`](/commands/docs/rename.md) 其中的列。如果我们想运行 [`ls`](/commands/docs/ls.md) 并重命名这些列，可以使用下面这个例子：

```nu
ls | rename filename filetype filesize date | first 5
# => ╭───┬───────────────┬──────────┬──────────┬────────────╮
# => │ # │   filename    │ filetype │ filesize │    date    │
# => ├───┼───────────────┼──────────┼──────────┼────────────┤
# => │ 0 │ files.rs      │ file     │   4.6 kB │ 5 days ago │
# => │ 1 │ lib.rs        │ file     │    330 B │ 5 days ago │
# => │ 2 │ lite_parse.rs │ file     │   6.3 kB │ 5 days ago │
# => │ 3 │ parse.rs      │ file     │  49.8 kB │ a day ago  │
# => │ 4 │ path.rs       │ file     │   2.1 kB │ 5 days ago │
# => ╰───┴───────────────┴──────────┴──────────┴────────────╯
```

### 剔除 / 删除列

你也可以通过把表格传给 reject 命令来 [`reject`](/commands/docs/reject.md) 其中的列。如果我们想运行 [`ls`](/commands/docs/ls.md) 并删除这些列，可以使用下面这个例子：

```nu
ls -l / | reject readonly num_links inode created accessed modified | first 8
# => ╭───┬────────┬─────────┬─────────┬───────────┬──────┬───────┬────────╮
# => │ # │  name  │  type   │ target  │   mode    │ user │ group │  size  │
# => ├───┼────────┼─────────┼─────────┼───────────┼──────┼───────┼────────┤
# => │ 0 │ /bin   │ symlink │ usr/bin │ rwxrwxrwx │ root │ root  │    7 B │
# => │ 1 │ /boot  │ dir     │         │ rwxr-xr-x │ root │ root  │ 1.0 kB │
# => │ 2 │ /dev   │ dir     │         │ rwxr-xr-x │ root │ root  │ 4.1 kB │
# => │ 3 │ /etc   │ dir     │         │ rwxr-xr-x │ root │ root  │ 3.6 kB │
# => │ 4 │ /home  │ dir     │         │ rwxr-xr-x │ root │ root  │   12 B │
# => │ 5 │ /lib   │ symlink │ usr/lib │ rwxrwxrwx │ root │ root  │    7 B │
# => │ 6 │ /lib64 │ symlink │ usr/lib │ rwxrwxrwx │ root │ root  │    7 B │
# => │ 7 │ /mnt   │ dir     │         │ rwxr-xr-x │ root │ root  │    0 B │
# => ╰───┴────────┴─────────┴─────────┴───────────┴──────┴───────┴────────╯
```

### # 索引列

你已经注意到，每张表格默认都以一列标题为 `#` 的列开头。这一列可以以两种模式之一工作：

1. 内部 #

   - 默认模式
   - Nushell 提供一个从 0 开始的连续索引
   - 始终对应于单元格路径的行号，其中 `select 0` 会返回列表中的第一项，而 `select <n-1>` 返回第 n 项
   - 只是内部表示的显示。换句话说，它不能通过列名访问。例如，`get index` 不起作用，`get #` 也不行

1. 重命名为“index”的 #

   - 当创建了一个名为“index”的列时（无论是直接创建还是作为其它命令的副作用），这个 `index` 列就会在表格显示中取代 `#` 列的位置。在表格输出中，列标题仍然是 `#`，但该列的*名称*现在是 `index`。

     示例：

     ```nu
     ls | each { insert index { 1000 }} | first 5
     # => ╭──────┬───────────────┬──────┬─────────┬────────────╮
     # => │    # │     name      │ type │  size   │  modified  │
     # => ├──────┼───────────────┼──────┼─────────┼────────────┤
     # => │ 1000 │ files.rs      │ file │  4.6 kB │ 5 days ago │
     # => │ 1000 │ lib.rs        │ file │   330 B │ 5 days ago │
     # => │ 1000 │ lite_parse.rs │ file │  6.3 kB │ 5 days ago │
     # => │ 1000 │ parse.rs      │ file │ 49.8 kB │ a day ago  │
     # => │ 1000 │ path.rs       │ file │  2.1 kB │ 5 days ago │
     # => ╰──────┴───────────────┴──────┴─────────┴────────────╯
     ```

     - 如果表格中的每一行都添加了 `index` 键，那么它就可以通过 `select` 和 `get` 访问：

     ```nu
     ls | each { insert index { 1000 }} | first 5 | select index name
     # => ╭──────┬───────────────╮
     # => │    # │     name      │
     # => ├──────┼───────────────┤
     # => │ 1000 │ files.rs      │
     # => │ 1000 │ lib.rs        │
     # => │ 1000 │ lite_parse.rs │
     # => │ 1000 │ parse.rs      │
     # => │ 1000 │ path.rs       │
     # => ╰──────┴───────────────╯
     ```

     - 另一方面，如果某些行有 `index` 键而另一些没有，那么 `index` 就不是整张表格的一列。表格的类型只包含每一行都有的列，因此 `index` 只能作为可选列来访问：

       ```nu
       ls | upsert 3.index { "--->" } | first 5
       # => ╭──────┬───────────────┬──────┬─────────┬────────────╮
       # => │    # │     name      │ type │  size   │  modified  │
       # => ├──────┼───────────────┼──────┼─────────┼────────────┤
       # => │    0 │ files.rs      │ file │  4.6 kB │ 5 days ago │
       # => │    1 │ lib.rs        │ file │   330 B │ 5 days ago │
       # => │    2 │ lite_parse.rs │ file │  6.3 kB │ 5 days ago │
       # => │ ---> │ parse.rs      │ file │ 49.8 kB │ a day ago  │
       # => │    4 │ path.rs       │ file │  2.1 kB │ 5 days ago │
       # => ╰──────┴───────────────┴──────┴─────────┴────────────╯

       ls | upsert 3.index { "--->" } | first 5 | describe
       # => table<name: string, type: string, size: filesize, modified: datetime> (stream)

       ls | upsert 3.index { "--->" } | select index name
       # => Error: nu::shell::column_not_found
       # =>
       # =>   × Cannot find column 'index'
       # =>    ╭─[repl_entry #1:1:1]
       # =>  1 │ ls | upsert 3.index { "--->" } | select index name
       # =>    · ─┬                                      ──┬──
       # =>    ·  │                                        ╰── column 'index' is missing in one or more values
       # =>    ·  ╰── value originates here
       # =>    ╰────
       # =>   help: If some rows have this column, try using 'index?' for optional access, or pre-fill using the `default` command

       ls | upsert 3.index { "--->" } | select index? name | first 5
       # => ╭──────┬───────────────╮
       # => │    # │     name      │
       # => ├──────┼───────────────┤
       # => │      │ files.rs      │
       # => │      │ lib.rs        │
       # => │      │ lite_parse.rs │
       # => │ ---> │ parse.rs      │
       # => │      │ path.rs       │
       # => ╰──────┴───────────────╯
       ```

   - 正如上面的例子所示，表格中任何没有 `index` 键的行（记录）都会继续显示内部表示。

#### 其它索引示例

##### 把 # 转换为索引

一个有用的模式是把内部的 `#` 转换为所有行的索引，同时保持原有的编号：

```nu
ls | enumerate | flatten
```

虽然结果*看起来*一样，但 `index` 现在已与内部单元格路径解耦。例如：

```nu
ls | enumerate | flatten | sort-by modified | first 5
# => ╭───┬──────────────┬──────┬────────┬─────────────╮
# => │ # │     name     │ type │  size  │  modified   │
# => ├───┼──────────────┼──────┼────────┼─────────────┤
# => │ 5 │ rustfmt.toml │ file │   17 B │ a month ago │
# => │ 8 │ signature.rs │ file │ 1.2 kB │ 5 days ago  │
# => │ 1 │ lib.rs       │ file │  330 B │ 5 days ago  │
# => │ 4 │ path.rs      │ file │ 2.1 kB │ 5 days ago  │
# => │ 0 │ files.rs     │ file │ 4.6 kB │ 5 days ago  │
# => ╰───┴──────────────┴──────┴────────┴─────────────╯

ls | enumerate | flatten | sort-by modified | select 4
# => ╭───┬──────────┬──────┬────────┬────────────╮
# => │ # │   name   │ type │  size  │  modified  │
# => ├───┼──────────┼──────┼────────┼────────────┤
# => │ 0 │ files.rs │ file │ 4.6 kB │ 5 days ago │
# => ╰───┴──────────┴──────┴────────┴────────────╯
```

`sort-by modified` 现在*也*会把 `index` 与其它列一起排序。

##### 添加行标题

```nu
let table = [
[additions   deletions   delta ];
[       10          20     -10 ]
[       15           5      10 ]
[        8           6       2 ]]

let totals_row = ($table | math sum | insert index {"Totals"})
$table | append $totals_row
# => ╭────────┬───────────┬───────────┬───────╮
# => │      # │ additions │ deletions │ delta │
# => ├────────┼───────────┼───────────┼───────┤
# => │      0 │        10 │        20 │   -10 │
# => │      1 │        15 │         5 │    10 │
# => │      2 │         8 │         6 │     2 │
# => │ Totals │        33 │        31 │     2 │
# => ╰────────┴───────────┴───────────┴───────╯
```

### `table` 命令

[`table`](/commands/docs/table.md) 命令用于*渲染*结构化数据。这包括：

- 表格
- 列表
- 记录
- 范围

也许与最初的设想相反，渲染这些类型的结果是一个 `string`。例如：

```nu
[ Nagasaki Ghent Cambridge Izmir Graz Lubango ] | table | describe
# => string (stream)
```

其它数据类型会原样通过 `table` 命令。

在不带参数的情况下，`table` 命令渲染的输出通常*显示*得与未渲染的形式相同。例如：

```nu
[ Nagasaki Ghent Cambridge Izmir Graz Lubango ]
# => ╭───┬───────────╮
# => │ 0 │ Nagasaki  │
# => │ 1 │ Ghent     │
# => │ 2 │ Cambridge │
# => │ 3 │ Izmir     │
# => │ 4 │ Graz      │
# => │ 5 │ Lubango   │
# => ╰───┴───────────╯
[ Nagasaki Ghent Cambridge Izmir Graz Lubango ] | table
# => ╭───┬───────────╮
# => │ 0 │ Nagasaki  │
# => │ 1 │ Ghent     │
# => │ 2 │ Cambridge │
# => │ 3 │ Izmir     │
# => │ 4 │ Graz      │
# => │ 5 │ Lubango   │
# => ╰───┴───────────╯
```

当你需要把结构化数据的渲染视图保存为字符串时，这会很有用。例如，要移除表格中的所有 ANSI 格式（颜色）：

```nu
ls | table | ansi strip
```

`table` 命令还有多个用于*改变*表格渲染方式的选项，例如：

- `-e` 用于展开渲染时通常会被折叠的数据。比较 `scope modules | table` 与 `scope modules | table -e`。
- `-i false` 用于隐藏 `index`/`#` 列
- `-a 5` 用于把表格缩写为只有前后各 5 条
- 等等
