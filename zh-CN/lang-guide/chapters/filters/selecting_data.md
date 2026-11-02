# 选择数据子集的过滤器

Nushell 有一小组用于取列表或表格一部分的过滤器：有的按位置选择**行**，有的按名称选择**列**，
单元格路径则可以深入到嵌套数据中。如果要按条件而不是按位置选择行，请参见 [`where`](./where-filter.md)。

另见：《Nushell 之书》中的[浏览与访问结构化数据](../../../book/navigating_structured_data.md)和
[处理表格](../../../book/working_with_tables.md)，以及 [`get` 与 `select` 的对比](./select-get.md)。

下面的示例使用这张表格：

```nu
let t = [
  [name lang stars];
  [nushell rust 38000]
  [reedline rust 700]
  [nu_scripts nushell 3000]
  [vscode-ext typescript 200]
]
```

## 按位置选择行

| 命令                                                                                                                                                                                   | 保留的内容                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [`first n`](/commands/docs/first.md)、[`last n`](/commands/docs/last.md)                                                                                                               | 前 `n` 行或后 `n` 行（不写数量时是单个项，不是列表） |
| [`take n`](/commands/docs/take.md)、[`skip n`](/commands/docs/skip.md)                                                                                                                 | 前 `n` 行，或它们之后的所有行                        |
| [`drop n`](/commands/docs/drop.md)                                                                                                                                                     | 除最后 `n` 行以外的所有行                            |
| [`slice range`](/commands/docs/slice.md)                                                                                                                                               | 索引落在该区间内的行                                 |
| [`select 0 2 ...`](/commands/docs/select.md)                                                                                                                                           | 具有给定索引的行                                     |
| [`drop nth 0 2 ...`](/commands/docs/drop_nth.md)                                                                                                                                       | 除给定索引以外的每一行                               |
| [`take while`](/commands/docs/take_while.md)、[`skip while`](/commands/docs/skip_while.md)、[`take until`](/commands/docs/take_until.md)、[`skip until`](/commands/docs/skip_until.md) | 条件发生变化的那一行之前，或从它开始的各行           |

```nu
$t | first 2
# => ╭───┬──────────┬──────┬───────╮
# => │ # │   name   │ lang │ stars │
# => ├───┼──────────┼──────┼───────┤
# => │ 0 │ nushell  │ rust │ 38000 │
# => │ 1 │ reedline │ rust │   700 │
# => ╰───┴──────────┴──────┴───────╯
```

`slice` 中的区间包含其末端。用 `..<` 可以排除末端，用负数起点可以从末尾开始计数：

```nu
[a b c d e] | slice 1..3
# => ╭───┬───╮
# => │ 0 │ b │
# => │ 1 │ c │
# => │ 2 │ d │
# => ╰───┴───╯
```

```nu
[a b c d e] | slice (-2)..
# => ╭───┬───╮
# => │ 0 │ d │
# => │ 1 │ e │
# => ╰───┴───╯
```

不带数量的 `first` 和 `last` 对空输入返回 `nothing`。加上 `--strict` 可以改为报错。

## 按名称选择列

- [`select`](/commands/docs/select.md) 保留指定的列并返回表格（输入为记录时返回记录）。
- [`reject`](/commands/docs/reject.md) 去掉指定的列并保留其余部分。
- [`get`](/commands/docs/get.md) 返回**值**：对表格的某一列返回列表，对记录的某个字段返回普通值。

```nu
$t | select name stars | first 2
# => ╭───┬──────────┬───────╮
# => │ # │   name   │ stars │
# => ├───┼──────────┼───────┤
# => │ 0 │ nushell  │ 38000 │
# => │ 1 │ reedline │   700 │
# => ╰───┴──────────┴───────╯
```

```nu
$t | get name
# => ╭───┬────────────╮
# => │ 0 │ nushell    │
# => │ 1 │ reedline   │
# => │ 2 │ nu_scripts │
# => │ 3 │ vscode-ext │
# => ╰───┴────────────╯
```

要从列表传入列名，请用 `...` 展开它。直接传入列表本身会导致类型错误：

```nu
let cols = [name stars]
$t | select ...$cols | first 1
# => ╭───┬─────────┬───────╮
# => │ # │  name   │ stars │
# => ├───┼─────────┼───────┤
# => │ 0 │ nushell │ 38000 │
# => ╰───┴─────────┴───────╯
```

## 单元格路径

单元格路径是列名与行索引组成的点分列表。它可以直接跟在变量后面（`$t.0.name`），
也可以传给 `get`、`select`、`reject`、`update`、`sort-by` 等许多命令。行成员与列成员的顺序可以任意：

```nu
[$t.0.name $t.name.0 ($t | get 1.name)]
# => ╭───┬──────────╮
# => │ 0 │ nushell  │
# => │ 1 │ nushell  │
# => │ 2 │ reedline │
# => ╰───┴──────────╯
```

配合 `select` 使用时，嵌套的单元格路径会变成一列，并以整个路径命名：

```nu
{a: {b: {c: 1}}} | select a.b.c
# => ╭───────┬───╮
# => │ a.b.c │ 1 │
# => ╰───────┴───╯
```

含有空格或点的成员需要加引号：`$record."first name"`。单元格路径也可以用 `$.` 字面量语法存进变量，
例如 `let p = $.a.b; $data | get $p`。

### 缺失数据与大小写

缺失的列或行会报错。在成员后加上 `?`（或给 `get`、`select`、`reject` 传入 `--optional`/`-o`）
可以改为得到 `null`：

```nu
{name: nu} | get version
# => Error: nu::shell::column_not_found
# =>
# =>   × Cannot find column 'version'
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ {name: nu} | get version
# =>    · ─────┬────       ───┬───
# =>    ·      │              ╰── column 'version' is missing in one or more values
# =>    ·      ╰── value originates here
# =>    ╰────
# =>   help: If some rows have this column, try using 'version?' for optional access, or pre-fill using the `default` command
```

```nu
{name: nu} | get version? | describe
# => nothing
```

列名的匹配是区分大小写的。在成员后加上 `!`（或给 `get`、`select`、`reject` 传入 `--ignore-case`）
可以不区分大小写地匹配：

```nu
{Name: nu} | get name!
# => nu
```
