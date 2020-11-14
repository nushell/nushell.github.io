# 管道

Nu  的核心设计之一就是管道，这种设计思想可以追溯到几十年前的 Unix 背后的原始哲学。 正如 Nu 从 Unix 的字符串数据类型扩展而来，Nu 还扩展了管道的思想，使其不仅包含文本。

## 基础

一个管道由三个部分组成：输入、过滤器和输出。

```
> open "Cargo.toml" | inc package.version | save "Cargo_new.toml"
```

第一个命令，`open "Cargo.toml"`，是一个输入（有时也被称为源或供应）。它创建或加载输出并提供给一个管道。

第一个命令 `open "Cargo.toml"` 是输入（有时也称为「源」或「生产者」）。 这将创建或加载数据并将其馈送到管道中。 管道具有输入要使用的值，这是来自输入的。 像 `ls` 这样的命令也是输入，因为它们从文件系统中获取数据并通过管道发送数据，以便可以使用它们。

第二个命令 `inc package.version` 是一个过滤器。 过滤器获取给定的数据，并经常对其进行处理。 他们可以更改它（就像在我们的示例中使用 `inc` 命令一样），或者在值通过时可以做其他操作，例如记录。

最后一个命令 `save "Cargo_new.toml"` 是输出（有时称为「接收器」）。 输出从管道获取输入并对其进行一些最终操作。 在我们的示例中，我们将通过管道传输的内容保存到文件中作为最后一步。 其他类型的输出命令可能会使用这些值并为用户查看它们。

## 与外部命令协作

Ni 命令使用 Nu 数据类型来与其他命令协作（查看 [数据类型](types_of_data.md)，但 Nu 之外的命令又如何呢？让我们看看一些与外部命令协作的例子：

`internal_command | external_command`


数据将从 internal_command 流到 external_command 。 该数据应为字符串，以便可以将它们发送到 external_command 的 `stdin`。

`external_command | internal_command`

来自外部命令的数据将被 Nu 收集到一个字符串中，然后将被传递到 internal_command 中。 像 `lines` 这样的命令有助于更轻松地从外部命令中引入数据，并使其易于使用。

`external_command_1 | external_command_2`

Nu像Bash一样，以与其他 Shell 相同的方式处理在两个外部命令之间传递的数据。 external_command_1 的 `stdout` 连接到external_command_2的 `stdin` 。 这使数据在两个命令之间自然流动。

## 幕后

你可能想知道为什么 `ls` 是输入而不是输出的情况下我们是如何看到表的。 Nu 使用另一个名为 `autoview` 的命令自动为我们添加此输出。 `autoview` 命令会附加到没有输出的任何管道中，以使我们能够浏览结果。

事实上，这个命令：

```
> ls
```

和这条管道：

```
> ls | autoview
```

是一样的。
