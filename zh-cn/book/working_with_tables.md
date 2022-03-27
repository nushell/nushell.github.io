# 处理表

在 Nu 中查看数据的一种常见方法是通过表格。 Nu 带有许多用于处理表的命令，以方便查找所需的内容以及将数据缩小到所需的范围。

首先，让我们获得一个可用的表：

```
> ls
───┬───────────────┬──────┬─────────┬────────────
 # │ name          │ type │ size    │ modified
───┼───────────────┼──────┼─────────┼────────────
 0 │ files.rs      │ File │  4.6 KB │ 5 days ago
 1 │ lib.rs        │ File │   330 B │ 5 days ago
 2 │ lite_parse.rs │ File │  6.3 KB │ 5 days ago
 3 │ parse.rs      │ File │ 49.8 KB │ 1 day ago
 4 │ path.rs       │ File │  2.1 KB │ 5 days ago
 5 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
 6 │ signature.rs  │ File │  1.2 KB │ 5 days ago
───┴───────────────┴──────┴─────────┴────────────
```

## 排序

我们可以调用 `sort-by` 命令来给一个表排序并且指定要作为排序依据的列。让我们以文件的大小来进行排序：

```
> ls | sort-by size
───┬───────────────┬──────┬─────────┬────────────
 # │ name          │ type │ size    │ modified
───┼───────────────┼──────┼─────────┼────────────
 0 │ lib.rs        │ File │   330 B │ 5 days ago
 1 │ signature.rs  │ File │  1.2 KB │ 5 days ago
 2 │ path.rs       │ File │  2.1 KB │ 5 days ago
 3 │ files.rs      │ File │  4.6 KB │ 5 days ago
 4 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
 5 │ lite_parse.rs │ File │  6.3 KB │ 5 days ago
 6 │ parse.rs      │ File │ 49.8 KB │ 1 day ago
───┴───────────────┴──────┴─────────┴────────────
```

我们可以指定任何可以被比较的列来排序。例如，我们可以使用 "name", "accessed" 或 "modified" 列。

## 选取

我们可以通过选择选择特定的列或特定的行来从表中选择数据。 让我们从表中选择几列来使用：

```
> ls | select name size
───┬───────────────┬─────────
 # │ name          │ size
───┼───────────────┼─────────
 0 │ files.rs      │  4.6 KB
 1 │ lib.rs        │   330 B
 2 │ lite_parse.rs │  6.3 KB
 3 │ parse.rs      │ 49.8 KB
 4 │ path.rs       │  2.1 KB
 5 │ shapes.rs     │  4.7 KB
 6 │ signature.rs  │  1.2 KB
───┴───────────────┴─────────
```

这有助于创建一个更专注于我们需要的表。 接下来，假设我们只希望查看此目录中最小的 5 个文件：

```
> ls | sort-by size | first 5
───┬──────────────┬──────┬────────┬────────────
 # │ name         │ type │ size   │ modified
───┼──────────────┼──────┼────────┼────────────
 0 │ lib.rs       │ File │  330 B │ 5 days ago
 1 │ signature.rs │ File │ 1.2 KB │ 5 days ago
 2 │ path.rs      │ File │ 2.1 KB │ 5 days ago
 3 │ files.rs     │ File │ 4.6 KB │ 5 days ago
 4 │ shapes.rs    │ File │ 4.7 KB │ 5 days ago
───┴──────────────┴──────┴────────┴────────────
```

你会注意到我们先通过大小排序表以获得最小的文件，然后当我们使用了 `first t` 后，返回了表中的前 5 行。

你也可以 `skip` 不需要的行。让我们跳过上面所得 5 行中的前两行：

```
> ls | sort-by size | first 5 | skip 2
───┬───────────┬──────┬────────┬────────────
 # │ name      │ type │ size   │ modified
───┼───────────┼──────┼────────┼────────────
 0 │ path.rs   │ File │ 2.1 KB │ 5 days ago
 1 │ files.rs  │ File │ 4.6 KB │ 5 days ago
 2 │ shapes.rs │ File │ 4.7 KB │ 5 days ago
───┴───────────┴──────┴────────┴────────────
```

我们已将其缩小为我们关心的三行。

让我们看看其他一些用于选择数据的命令。 您可能想知道为什么表格的行是数字。 这是到达单行的便捷方式。 让我们按文件名对表进行排序，然后使用 `nth` 命令使用其行号来选择其中的一行：

```
> ls | sort-by name
───┬───────────────┬──────┬─────────┬────────────
 # │ name          │ type │ size    │ modified
───┼───────────────┼──────┼─────────┼────────────
 0 │ files.rs      │ File │  4.6 KB │ 5 days ago
 1 │ lib.rs        │ File │   330 B │ 5 days ago
 2 │ lite_parse.rs │ File │  6.3 KB │ 5 days ago
 3 │ parse.rs      │ File │ 49.8 KB │ 1 day ago
 4 │ path.rs       │ File │  2.1 KB │ 5 days ago
 5 │ shapes.rs     │ File │  4.7 KB │ 5 days ago
 6 │ signature.rs  │ File │  1.2 KB │ 5 days ago
───┴───────────────┴──────┴─────────┴────────────

> ls | sort-by name | nth 5
──────────┬────────────
 name     │ shapes.rs
 type     │ File
 size     │ 4.7 KB
 modified │ 5 days ago
──────────┴────────────
```

## 获取表格之外的数据

到目前为止，我们已经通过将表格缩小到仅需要的尺寸来处理表格。 有时我们可能想更进一步，只查看单元格本身中的值，而不是整列。 比方说，例如，我们只想获取文件名的列表。 为此，我们使用 `get` 命令：

```
> ls | get name
───┬───────────────
 0 │ files.rs
 1 │ lib.rs
 2 │ lite_parse.rs
 3 │ parse.rs
 4 │ path.rs
 5 │ shapes.rs
 6 │ signature.rs
───┴───────────────
```

我们获得了每一个文件的文件名。

容易发现这和 `select` 命令很接近，所以让我们在这里对比一下：

```
> ls | select name
───┬───────────────
 # │ name
───┼───────────────
 0 │ files.rs
 1 │ lib.rs
 2 │ lite_parse.rs
 3 │ parse.rs
 4 │ path.rs
 5 │ shapes.rs
 6 │ signature.rs
───┴───────────────
```

看起来非常像！让我们看看是否可以清楚地说明这两个命令之间的区别：

- `select` - 创建一个新的包含指定列的表
- `get` - 以列表形式返回列中的值

分开看表的一种方法是特征性的 `value` 列名，它使我们知道这将是我们可以使用的值的列表。

`get` 命令可以更进一步，并在表中更深入地查找数据。 这简化了处理更复杂的数据的工作，例如可以在 .json 文件中找到的结构。

## 修改表中的数据

除了从表中选择数据之外，我们还可以更新表中的内容。 我们可能想要添加新列，或编辑单元格的内容。 在 Nu 中，该部分中的每个命令都将在管道中返回一个新表，而不是进行适当的编辑。

### 添加新列

我们可以使用 `insert` 命令向表中添加新的列，例如：

```
> open rustfmt.toml
─────────┬──────
 edition │ 2018
─────────┴──────
```

让我们添加一个名为 "next_edition" 的列并附带 2021 作为值：

```
> open rustfmt.toml | insert next_addition 2021
───────────────┬──────
 edition       │ 2018
 next_addition │ 2021
───────────────┴──────
```

注意我们如果打开原始文件，会发现内容没变：

```
> open rustfmt.toml
─────────┬──────
 edition │ 2018
─────────┴──────
```

Nu 的更改是函数性更改，这意味着它们自己在值上起作用，而不是试图引起永久性更改。 这使我们可以在我们的工作中进行许多不同类型的工作
直到我们准备好将结果（如果我们愿意的话）进行写出，我们就可以进行流水线处理。 这里我们可以使用 `save` 命令写出结果：

```
> open rustfmt.toml | insert next_edition 2021 | save rustfmt2.toml
> open rustfmt2.toml
───────────────┬──────
 edition       │ 2018
 next_addition │ 2021
───────────────┴──────
```

### 更新一列

类似 `insert` 命令，我们可以使用 `update` 命令来用一个新的值更新现存的列。让我们打开同样的文件看看效果：

```
> open rustfmt.toml
─────────┬──────
 edition │ 2018
─────────┴──────
```

现在，用我们希望支持的下一个版本更新 edition：

```
> open rustfmt.toml | update edition 2021
─────────┬──────
 edition │ 2021
─────────┴──────
```

### 增加值

Nu 支持多个能帮助我们处理数字和版本号的命令如 `inc` 。

```
> open rustfmt.toml
─────────┬──────
 edition │ 2018
─────────┴──────
> open rustfmt.toml | inc edition
─────────┬──────
 edition │ 2019
─────────┴──────
```

由于 "edition" 中的值是一个数字，我们可以使用 `inc` 来更新它。`inc` 也可以很好地对版本号进行处理：

```
> open Cargo.toml | get package.version
0.1.3
> open Cargo.toml | inc package.version --minor | get package.version
0.2.0
```

当处理版本时，我们可以使用使用一些标识来说明要增加哪位版本号：

- **--major** - 增加主版本号（0.1.3 -> 1.0.0）
- **--minor** - 增加次版本号（0.1.3 -> 0.2.0）
- **--patch** - 增加补丁版本号（0.1.3 -> 0.1.4）
