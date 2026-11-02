# 理解 `get` 和 `select` 的区别

简而言之，[`get`](/commands/docs/get.md) 从输入中取出**值**，而 [`select`](/commands/docs/select.md) 保留输入的**结构**（记录仍是记录，表格仍是表格），只去掉你没有要求的部分。

`get` 取出值：指定单个键时返回单个值，指定多个键时返回列表。

```nu
{a: 1, b: 2, c: 3} | get b
# => 2
{a: 1, b: 2, c: 3} | get b c
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 3 │
# => ╰───┴───╯
```

`select` 保留 Nushell 的值，并返回按列名或键选中的记录。

```nu
{a: 1, b: 2, c: 3} | select b
# => ╭───┬───╮
# => │ b │ 2 │
# => ╰───┴───╯
{a: 1, b: 2, c: 3} | select b c
# => ╭───┬───╮
# => │ b │ 2 │
# => │ c │ 3 │
# => ╰───┴───╯
```

## 用于表格

下面的示例使用这张表格：

```nu
let t = [[name lang]; [nushell rust] [reedline rust] [vscode-ext typescript]]
```

对于一列，`get` 返回该列值的列表，而 `select` 返回只包含该列的表格：

```nu
$t | get name
# => ╭───┬────────────╮
# => │ 0 │ nushell    │
# => │ 1 │ reedline   │
# => │ 2 │ vscode-ext │
# => ╰───┴────────────╯
$t | select name
# => ╭───┬────────────╮
# => │ # │    name    │
# => ├───┼────────────┤
# => │ 0 │ nushell    │
# => │ 1 │ reedline   │
# => │ 2 │ vscode-ext │
# => ╰───┴────────────╯
```

对于行索引，`get` 以记录形式返回该行，而 `select` 返回只包含该行的表格：

```nu
$t | get 1
# => ╭──────┬──────────╮
# => │ name │ reedline │
# => │ lang │ rust     │
# => ╰──────┴──────────╯
$t | select 1
# => ╭───┬──────────┬──────╮
# => │ # │   name   │ lang │
# => ├───┼──────────┼──────┤
# => │ 0 │ reedline │ rust │
# => ╰───┴──────────┴──────╯
```

## 嵌套数据

两个命令都接受单元格路径。`get` 沿着路径走，返回路径末端的值。`select` 则为该路径保留一列，
并以整个路径命名：

```nu
{a: {b: 1}} | get a.b
# => 1
{a: {b: 1}} | select a.b
# => ╭─────┬───╮
# => │ a.b │ 1 │
# => ╰─────┴───╯
```

## 缺失数据

当列不存在时，两个命令都会报错。在单元格路径成员后加上 `?`，或传入 `--optional`（`-o`），
可以让每个成员都变成可选的。此时 `get` 返回 `null`，而 `select` 返回一个空单元格：

```nu
{a: 1} | get -o z | describe
# => nothing
{a: 1} | select -o z
# => ╭───┬──╮
# => │ z │  │
# => ╰───┴──╯
```

两个命令也都接受 `--ignore-case`，用于以不区分大小写的方式匹配列名。

另见：[选择数据子集的过滤器](./selecting_data.md)，以及《Nushell 之书》中的
[使用 `get` 和 `select`](../../../book/navigating_structured_data.md#使用get和select)。
