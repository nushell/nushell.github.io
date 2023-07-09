# 管道

Nu 的核心设计之一是管道，这个设计思想可以追溯到几十年前 Unix 背后的一些原始理念。正如 Nu 拓展了 Unix 的单一字符串数据类型一样，Nu 也扩展了管道的概念，使其不仅仅包含文本。

## 基础

一个管道由三部分组成：输入、过滤器和输出。

```bash
> open "Cargo.toml" | inc package.version --minor | save "Cargo_new.toml"
```

第一条命令：`open "Cargo.toml"` 是一个输入（有时也称为 "源" 或 "生产者"），它创建或加载数据，并将其送入管道。管道待处理的值正是来自于此输入。像[`ls`](/commands/docs/ls.md)这样的命令也是输入，因为它们从文件系统中获取数据，并通过管道发送以便能被后续使用。

第二个命令：`inc package.version --minor` 是一个过滤器。过滤器获取输入的数据并对其进行处理。它们可能会修改它（如我们例子中的[`inc`](/commands/docs/inc.md)命令），或者在值通过时对其做其他操作，如记录。

最后一条命令：`save "Cargo_new.toml"` 是一个输出（有时称为 "接收者"）。输出从管道中获取输入，并对其进行一些最终操作。在我们的例子中，我们在最后一步把通过管道的内容保存到一个文件中。还有一些其他类型的输出命令可以获取数值并供用户查看。

`$in` 变量可以将管道收集成一个值，允许你将整个流作为一个参数访问，比如：

```shell
> echo 1 2 3 | $in.1 * $in.2
6
```

## 多行管道

如果一个管道对一行来说有些长，你可以把它放在`(`和`)`里，以创建一个子表达式：

```bash
(
    "01/22/2021" |
    parse "{month}/{day}/{year}" |
    get year
)
```

也可以参考 [子表达式](variables_and_subexpressions.html#子表达式)

## 与外部命令交互

Nu 命令之间使用 Nu 的数据类型进行通信（见[数据类型](types_of_data.md)），但 Nu 之外的命令呢？让我们看看一些与外部命令交互的例子：

`internal_command | external_command`

数据将从 `internal_command` 流向 `external_command`。这些数据将被转换为字符串，以便它们可以被发送到外部命令的`stdin`。

`external_command | internal_command`

从外部命令进入 Nu 的数据将以字节的形式流入，Nushell 将尝试自动将其转换为 UTF-8 文本。如果成功，一个文本数据流将被发送到`internal_command`；如果不成功，一个二进制数据流将被发送到`internal_command`。像[`lines`](/commands/docs/lines.md)这样的命令有助于从外部命令接收数据，因为它提供了分离的数据行以供后续使用。

`external_command_1 | external_command_2`

Nu 在两个外部命令之间以与其他 Shell 相同的方式处理数据管道，比如 Bash。`external_command_1`的`stdout`与`external_command_2`的`stdin`相连，这让数据在两个命令之间自然流动。

## 幕后解说

你可能想知道，既然[`ls`](/commands/docs/ls.md)是一个输入而不是一个输出，我们为何能看到一个表格？其实 Nu 使用了另一个叫做[`table`](/commands/docs/table.md)的命令为我们自动添加了这个输出。[`table`](/commands/docs/table.md)命令被附加到任何没有输出的管道上，这使得我们可以看到结果。

实际上，该命令：

```
> ls
```

和以下管道：

```
> ls
```

是一样的。
