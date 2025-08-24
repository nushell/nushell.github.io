---
title: 高级表格工作流
---

# 高级表格工作流

### 合并不同大小的表格

在 [`使用表格`](../book/working_with_tables.md) 中显示的示例在我们的表格具有相等数量的行时工作得很好，但如果我们想合并不同大小的表格呢？

```nu
let first_table = [[a b]; [1 2] [3 4]]
let second_table = [[c d]; [5 6]]
$first_table | merge $second_table
# => ───┬───┬───┬───┬───
# =>  # │ a │ b │ c │ d
# => ───┼───┼───┼───┼───
# =>  0 │ 1 │ 2 │ 5 │ 6
# => ───┼───┼───┼───┼───
# =>  1 │ 3 │ 4 │ ❎│ ❎
# => ───┴───┴───┴───┴───
```

第二行中的列 `c` 和 `d` 是空的，因为我们的 `second` 表只包含单行；Nushell 没有东西可以填充剩余的行。但如果我们希望较小的表格 "环绕" 并继续填充行呢？为此，我们可以使用 [`chunks`](/commands/docs/chunks.md) 命令将较大的表格分割成子表格，将每个子表格与较小的表格合并，然后使用 [`flatten`](/commands/docs/flatten.md) 命令将合并的表格组合在一起。

例如：

```nu
let first_table = [[a b]; [1 2] [3 4]]
let second_table = [[c d]; [5 6]]

$first_table
| chunks ($second_table | length)
| each { merge $second_table }
| flatten
# => ───┬───┬───┬───┬───
# =>  # │ a │ b │ c │ d
# => ───┼───┼───┼───┼───
# =>  0 │ 1 │ 2 │ 5 │ 6
# => ───┼───┼───┼───┼───
# =>  1 │ 3 │ 4 │ 5 │ 6
# => ───┴───┴───┴───┴───
```

我们可以用两个以上的表格来做这个吗？当然可以！让我们添加第三个表格：

```nu
let third_table = [[e f]; [7 8]]
```

我们可以像这样合并所有三个表格：

```nu
$first_table
| chunks ($second_table | length)
| each { merge $second_table }
| flatten
| chunks ($third_table | length)
| each { merge $third_table }
| flatten
# => ───┬───┬───┬───┬───┬───┬───
# =>  # │ a │ b │ c │ d │ e │ f
# => ───┼───┼───┼───┼───┼───┼───
# =>  0 │ 1 │ 2 │ 5 │ 6 │ 7 │ 8
# => ───┼───┼───┼───┼───┼───┼───
# =>  1 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8
# => ───┴───┴───┴───┴───┴───┴───
```

或者如 [实战指南](https://www.nushell.sh/book/working_with_tables.html#merging-tables) 中提到的，我们可以使用 [`reduce`](../commands/docs/reduce.md) 命令递归地合并表格：

```nu
[$first_table $second_table $third_table]
| reduce { |elt, acc|
    $acc
    | chunks ($elt | length)
    | each { merge $elt }
    | flatten
  }
# => ───┬───┬───┬───┬───┬───┬───
# =>  # │ a │ b │ c │ d │ e │ f
# => ───┼───┼───┼───┼───┼───┼───
# =>  0 │ 1 │ 2 │ 5 │ 6 │ 7 │ 8
# => ───┼───┼───┼───┼───┼───┼───
# =>  1 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8
# => ───┴───┴───┴───┴───┴───┴───
```
