# 处理表格

[[toc]]

## 概述

在 Nu 中查看数据的一种常见方式是通过表格。Nu 提供了许多处理表格的命令以方便找到你想要的内容以及将数据缩小到你需要的范围。

首先，让我们获得一个可用的表：

```nu
ls
# => ───┬───────────────┬──────┬─────────┬────────────
# =>  # │ name          │ type │ size    │ modified
# => ───┼───────────────┼──────┼─────────┼────────────
# =>  0 │ files.rs      │ File │  4.6 KB │ 5 days ago
# =>  1 │ lib.rs        │ File │   330 B │ 5 days ago
# =>  2 │ lite_parse.rs │ File │  6.3 KB │ 5 days ago
# =>  3 │ parse.rs      │ File │ 49.8 KB │ 1 day ago
# =>  4 │ path.rs       │ File │  2.1 KB │ 5 days ago
# =>  5 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
# =>  6 │ signature.rs  │ File │  1.2 KB │ 5 days ago
# => ───┴───────────────┴──────┴─────────┴────────────
```

::: tip 改变表格显示方式
Nu 默认会展开所有表格结构。你可以通过修改 `display_output` 钩子来改变这一行为。
详见 [hooks](/zh-CN/book/hooks.md#changing-how-output-is-displayed)。
:::

## 排序

我们可以通过调用[`sort-by`](/commands/docs/sort-by.md)命令对一个表进行排序，并指定需要排序的列。比如，按照文件的大小对表格进行排序：

```nu
ls | sort-by size
# => ───┬───────────────┬──────┬─────────┬────────────
# =>  # │ name          │ type │ size    │ modified
# => ───┼───────────────┼──────┼─────────┼────────────
# =>  0 │ lib.rs        │ File │   330 B │ 5 days ago
# =>  1 │ signature.rs  │ File │  1.2 KB │ 5 days ago
# =>  2 │ path.rs       │ File │  2.1 KB │ 5 days ago
# =>  3 │ files.rs      │ File │  4.6 KB │ 5 days ago
# =>  4 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
# =>  5 │ lite_parse.rs │ File │  6.3 KB │ 5 days ago
# =>  6 │ parse.rs      │ File │ 49.8 KB │ 1 day ago
# => ───┴───────────────┴──────┴─────────┴────────────
```

我们可以通过任何可以比较的列来对一个表进行排序。例如，我们也可以用 "name", "accessed" 或者 "modified" 列对上述内容进行排序。

## 选取

我们可以从表中通过选择特定的列或行来获得数据。让我们从表中选择（[`select`](/commands/docs/select.md)）几列吧：

```nu
ls | select name size
# => ───┬───────────────┬─────────
# =>  # │ name          │ size
# => ───┼───────────────┼─────────
# =>  0 │ files.rs      │  4.6 KB
# =>  1 │ lib.rs        │   330 B
# =>  2 │ lite_parse.rs │  6.3 KB
# =>  3 │ parse.rs      │ 49.8 KB
# =>  4 │ path.rs       │  2.1 KB
# =>  5 │ shapes.rs     │  4.7 KB
# =>  6 │ signature.rs  │  1.2 KB
# => ───┴───────────────┴─────────
```

这有助于创建一个更专注于我们所需的表格。接下来，假设我们只想看这个目录中最小的 5 个文件：

```nu
ls | sort-by size | first 5
# => ───┬──────────────┬──────┬────────┬────────────
# =>  # │ name         │ type │ size   │ modified
# => ───┼──────────────┼──────┼────────┼────────────
# =>  0 │ lib.rs       │ File │  330 B │ 5 days ago
# =>  1 │ signature.rs │ File │ 1.2 KB │ 5 days ago
# =>  2 │ path.rs      │ File │ 2.1 KB │ 5 days ago
# =>  3 │ files.rs     │ File │ 4.6 KB │ 5 days ago
# =>  4 │ shapes.rs    │ File │ 4.7 KB │ 5 days ago
# => ───┴──────────────┴──────┴────────┴────────────
```

你会注意到我们首先按大小对表进行排序以得到最小的文件，然后我们用`first 5`来返回表的前 5 行。

你也可以跳过(`skip`)不需要的行，让我们跳过上面所得 5 行中的前两行：

```nu
ls | sort-by size | first 5 | skip 2
# => ───┬───────────┬──────┬────────┬────────────
# =>  # │ name      │ type │ size   │ modified
# => ───┼───────────┼──────┼────────┼────────────
# =>  0 │ path.rs   │ File │ 2.1 KB │ 5 days ago
# =>  1 │ files.rs  │ File │ 4.6 KB │ 5 days ago
# =>  2 │ shapes.rs │ File │ 4.7 KB │ 5 days ago
# => ───┴───────────┴──────┴────────┴────────────
```

我们已将其缩小为我们关心的三行。

让我们看看其他几个用于选择数据的命令。你可能想知道为什么选取表格的行是通过数字，这是选择单行数据的便捷方式。让我们按文件名对表进行排序，然后使用 `select` 命令通过行号来选择其中的一行：

```nu
ls | sort-by name
# => ───┬───────────────┬──────┬─────────┬────────────
# =>  # │ name          │ type │ size    │ modified
# => ───┼───────────────┼──────┼─────────┼────────────
# =>  0 │ files.rs      │ File │  4.6 KB │ 5 days ago
# =>  1 │ lib.rs        │ File │   330 B │ 5 days ago
# =>  2 │ lite_parse.rs │ File │  6.3 KB │ 5 days ago
# =>  3 │ parse.rs      │ File │ 49.8 KB │ 1 day ago
# =>  4 │ path.rs       │ File │  2.1 KB │ 5 days ago
# =>  5 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
# =>  6 │ signature.rs  │ File │  1.2 KB │ 5 days ago
# => ───┴───────────────┴──────┴─────────┴────────────

ls | sort-by name | select 5
# => ───┬───────────────┬──────┬─────────┬────────────
# =>  # │ name          │ type │ size    │ modified
# => ───┼───────────────┼──────┼─────────┼────────────
# =>  0 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
# => ───┴───────────────┴──────┴─────────┴────────────
```

## 从表格提取数据

到目前为止，我们在处理表格时都是将表格修剪成我们需要的样子。有时我们可能想更进一步，只看单元格本身的值，而不是取整列。比如，我们只想得到一个包含所有文件名的列表。在此，我们使用[`get`](/commands/docs/get.md) 命令：

```nu
ls | get name
# => ───┬───────────────
# =>  0 │ files.rs
# =>  1 │ lib.rs
# =>  2 │ lite_parse.rs
# =>  3 │ parse.rs
# =>  4 │ path.rs
# =>  5 │ shapes.rs
# =>  6 │ signature.rs
# => ───┴───────────────
```

现在我们获得了每一个文件的文件名。

这可能看起来很像我们之前使用的[`select`](/commands/docs/select.md)命令，所以也把它放在这里以便于比较：

```nu
ls | select name
# => ───┬───────────────
# =>  # │ name
# => ───┼───────────────
# =>  0 │ files.rs
# =>  1 │ lib.rs
# =>  2 │ lite_parse.rs
# =>  3 │ parse.rs
# =>  4 │ path.rs
# =>  5 │ shapes.rs
# =>  6 │ signature.rs
# => ───┴───────────────
```

这看起来非常相似！让我们看看能不能把这两个命令的区别说清楚：

- [`select`](/commands/docs/select.md) - 创建一个只包括指定列的新表；
- [`get`](/commands/docs/get.md) - 以列表形式返回指定列内的值；

区分这些表格的方法是 —— 列名没有了，也让我们知道这是一个我们可以处理的值的列表。

[`get`](/commands/docs/get.md)命令可以更进一步，它可以接受表中更深的数据路径。这简化了对复杂数据的处理，比如那些你可能在.json 文件中发现的结构。

## 修改表格数据

除了从表中选择数据外，还可以更新其中的数据。我们可能想合并表格，添加新的列，或编辑单元格的内容等。在 Nushell 中，本节中的每个命令都会在管道中返回一个新的表而非对原表进行编辑。

### 拼接表格

我们可以使用[`append`](/commands/docs/append.md)将列名相同的表拼接起来：

```nu
let $first = [[a b]; [1 2]]
let $second = [[a b]; [3 4]]
$first | append $second
# => ───┬───┬───
# =>  # │ a │ b
# => ───┼───┼───
# =>  0 │ 1 │ 2
# =>  1 │ 3 │ 4
# => ───┴───┴───
```

### 合并表格

我们可以使用[`merge`](/commands/docs/merge.md)命令将两个（或多个）表格合并在一起：

```nu
let $first = [[a b]; [1 2]]
let $second = [[c d]; [3 4]]
$first | merge { $second }
# => ───┬───┬───┬───┬───
# =>  # │ a │ b │ c │ d
# => ───┼───┼───┼───┼───
# =>  0 │ 1 │ 2 │ 3 │ 4
# => ───┴───┴───┴───┴───
```

让我们再加一个表格吧：

```nu
let $third = [[e f]; [5 6]]
```

我们可以将以上三个表格合并在一起，操作如下：

```nu
$first | merge { $second } | merge { $third }
# => ───┬───┬───┬───┬───┬───┬───
# =>  # │ a │ b │ c │ d │ e │ f
# => ───┼───┼───┼───┼───┼───┼───
# =>  0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6
# => ───┴───┴───┴───┴───┴───┴───
```

或者我们可以使用[`reduce`](/commands/docs/reduce.md)命令来动态地合并所有的表格：

```nu
[$first $second $third] | reduce {|elt, acc| $acc | merge { $elt }}
# => ───┬───┬───┬───┬───┬───┬───
# =>  # │ a │ b │ c │ d │ e │ f
# => ───┼───┼───┼───┼───┼───┼───
# =>  0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6
# => ───┴───┴───┴───┴───┴───┴───
```

### 添加新列

我们可以使用[`insert`](/commands/docs/insert.md)命令在表中增加新列，让我们看一个例子：

```nu
open rustfmt.toml
# => ─────────┬──────
# =>  edition │ 2018
# => ─────────┴──────
```

让我们添加一个名为 "next_edition" 的列并将 2021 作为值：

```nu
open rustfmt.toml | insert next_edition 2021
# => ──────────────┬──────
# =>  edition      │ 2018
# =>  next_edition │ 2021
# => ──────────────┴──────
```

注意，我们如果打开原始文件，会发现内容没变：

```nu
open rustfmt.toml
# => ─────────┬──────
# =>  edition │ 2018
# => ─────────┴──────
```

Nu 的更改是函数性更改，这意味着它们只在值上起作用，而不是试图引起永久性变更。这使我们可以在管道中进行许多不同类型的操作直到我们准备好将结果输出(如果我们选择这样做的话)。这里我们可以使用 [`save`](/commands/docs/save.md) 命令保存结果：

```nu
open rustfmt.toml | insert next_edition 2021 | save rustfmt2.toml
open rustfmt2.toml
# => ──────────────┬──────
# =>  edition      │ 2018
# =>  next_edition │ 2021
# => ──────────────┴──────
```

### 更新一列

与[`insert`](/commands/docs/insert.md)命令类似，我们也可以使用[`update`](/commands/docs/update.md)命令将某一列的内容修改为新值。为了看看效果，让我们打开同一个文件：

```nu
open rustfmt.toml
# => ─────────┬──────
# =>  edition │ 2018
# => ─────────┴──────
```

现在，用我们希望支持的下一个版本更新 edition：

```nu
open rustfmt.toml | update edition 2021
# => ─────────┬──────
# =>  edition │ 2021
# => ─────────┴──────
```

你也可以使用[`upsert`](/commands/docs/upsert.md)命令来插入或更新，这取决于该列是否已经存在。

### 移动列

你可以使用`move`来移动表中的列。例如，如果想把`ls`中的 "name" 列移到 "size" 列之后，我们可以这样做：

```nu
ls | move name --after size
# => ╭────┬──────┬─────────┬───────────────────┬──────────────╮
# => │ #  │ type │  size   │       name        │   modified   │
# => ├────┼──────┼─────────┼───────────────────┼──────────────┤
# => │  0 │ dir  │   256 B │ Applications      │ 3 days ago   │
# => │  1 │ dir  │   256 B │ Data              │ 2 weeks ago  │
# => │  2 │ dir  │   448 B │ Desktop           │ 2 hours ago  │
# => │  3 │ dir  │   192 B │ Disks             │ a week ago   │
# => │  4 │ dir  │   416 B │ Documents         │ 4 days ago   │
# => ...
```

### 重命名列

你也可以通过`rename`命令对表中的列进行**重命名**。我们可以使用这个例子来运行`ls`并重命名这些列：

```nu
ls | rename filename filetype filesize date
# => ╭────┬───────────────────┬──────────┬──────────┬──────────────╮
# => │ #  │     filename      │ filetype │ filesize │     date     │
# => ├────┼───────────────────┼──────────┼──────────┼──────────────┤
# => │  0 │ Applications      │ dir      │    256 B │ 3 days ago   │
# => │  1 │ Data              │ dir      │    256 B │ 2 weeks ago  │
# => │  2 │ Desktop           │ dir      │    448 B │ 2 hours ago  │
# => │  3 │ Disks             │ dir      │    192 B │ a week ago   │
# => │  4 │ Documents         │ dir      │    416 B │ 4 days ago   │
# => ...
```

### 删除列

你可以使用[`reject`](/commands/docs/reject.md)命令删除表中的列。例如，我们可以运行[`ls`](/commands/docs/ls.md)并删除不需要的列：

```nu
ls -l / | reject readonly num_links inode created accessed modified
# => ╭────┬────────┬─────────┬─────────┬───────────┬──────┬───────┬────────╮
# => │  # │  name  │  type   │ target  │   mode    │ uid  │ group │  size  │
# => ├────┼────────┼─────────┼─────────┼───────────┼──────┼───────┼────────┤
# => │  0 │ /bin   │ symlink │ usr/bin │ rwxrwxrwx │ root │ root  │    7 B │
# => │  1 │ /boot  │ dir     │         │ rwxr-xr-x │ root │ root  │ 1.0 KB │
# => │  2 │ /dev   │ dir     │         │ rwxr-xr-x │ root │ root  │ 4.1 KB │
# => │  3 │ /etc   │ dir     │         │ rwxr-xr-x │ root │ root  │ 3.6 KB │
# => │  4 │ /home  │ dir     │         │ rwxr-xr-x │ root │ root  │   12 B │
# => │  5 │ /lib   │ symlink │ usr/lib │ rwxrwxrwx │ root │ root  │    7 B │
# => │  6 │ /lib64 │ symlink │ usr/lib │ rwxrwxrwx │ root │ root  │    7 B │
# => │  7 │ /mnt   │ dir     │         │ rwxr-xr-x │ root │ root  │    0 B │
# => ...
```

## # 索引列

你可能已经注意到每个表格默认都有一个以`#`为标题的列。这个列有两种工作模式：

1. 内部索引 #

   - 默认模式
   - Nu提供从0开始的连续索引
   - 总是对应单元格路径的行号，`select 0`会返回列表中的第一项，`select <n-1>`会返回第n项
   - 只是内部表示的一种显示方式，不能通过列名访问

2. 重命名的索引 #
   - 当创建一个名为"index"的列时，这个`index`列会取代表格显示中的`#`列
   - 如果表格中的某些行有`index`键而其他行没有，结果将不再是表格而是`list<any>`

### 索引列示例

#### 将#转换为索引

将内部`#`转换为所有行的索引同时保持原始编号的有用模式是：

```nu
ls | enumerate | flatten
```

#### 添加行标题

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

## `table` 命令

[`table`](/commands/docs/table.md)命令用于*渲染*结构化数据，包括：

- 表格
- 列表
- 记录
- 范围

`table`命令的渲染结果实际上是一个`string`类型。例如：

```nu
[ Nagasaki Ghent Cambridge Izmir Graz Lubango ] | table | describe
# => string (stream)
```

`table`命令还有多个选项可以*改变*表格的渲染方式，例如：

- `-e` 展开通常会被折叠的数据
- `-i false` 隐藏索引/`#`列
- `-a 5` 将表格缩写为仅显示前5项和后5项
- 以及其他选项
