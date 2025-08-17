# 快速入门

[[toc]]

## Nushell 命令输出 _数据_

了解 Nu 功能的最简单方法就是看一些例子，让我们开始吧。

当你运行像 [`ls`](/zh-CN/commands/docs/ls.md) 这样的命令时，你会注意到的第一件事是，返回的不是一个文本块，而是一个结构化的表格。

```nu:no-line-numbers
ls
# => ╭────┬─────────────────────┬──────┬───────────┬──────────────╮
# => │  # │        name         │ type │   size    │   modified   │
# => ├────┼─────────────────────┼──────┼───────────┼──────────────┤
# => │  0 │ CITATION.cff        │ file │     812 B │ 2 months ago │
# => │  1 │ CODE_OF_CONDUCT.md  │ file │   3.4 KiB │ 9 months ago │
# => │  2 │ CONTRIBUTING.md     │ file │  11.0 KiB │ 5 months ago │
# => │  3 │ Cargo.lock          │ file │ 194.9 KiB │ 15 hours ago │
# => │  4 │ Cargo.toml          │ file │   9.2 KiB │ 15 hours ago │
# => │  5 │ Cross.toml          │ file │     666 B │ 6 months ago │
# => │  6 │ LICENSE             │ file │   1.1 KiB │ 9 months ago │
# => │  7 │ README.md           │ file │  12.0 KiB │ 15 hours ago │
# => ...
```

这个表格不仅仅是漂亮地格式化了输出。就像电子表格一样，它允许我们*交互式地*处理数据。

## 对数据进行操作

接下来，让我们按每个文件的大小对这个表进行排序。为此，我们将获取 [`ls`](/zh-CN/commands/docs/ls.md) 的输出，并将其输入到一个可以根据列中的*值*对表进行排序的命令中。

```nu:no-line-numbers
ls | sort-by size | reverse
# => ╭───┬─────────────────┬──────┬───────────┬──────────────╮
# => │ # │      name       │ type │   size    │   modified   │
# => ├───┼─────────────────┼──────┼───────────┼──────────────┤
# => │ 0 │ Cargo.lock      │ file │ 194.9 KiB │ 15 hours ago │
# => │ 1 │ toolkit.nu      │ file │  20.0 KiB │ 15 hours ago │
# => │ 2 │ README.md       │ file │  12.0 KiB │ 15 hours ago │
# => │ 3 │ CONTRIBUTING.md │ file │  11.0 KiB │ 5 months ago │
# => │ 4 │ ...             │ ...  │ ...       │ ...          │
# => │ 5 │ LICENSE         │ file │   1.1 KiB │ 9 months ago │
# => │ 6 │ CITATION.cff    │ file │     812 B │ 2 months ago │
# => │ 7 │ Cross.toml      │ file │     666 B │ 6 months ago │
# => │ 8 │ typos.toml      │ file │     513 B │ 2 months ago │
# => ╰───┴─────────────────┴──────┴───────────┴──────────────╯
```

请注意，我们没有向 [`ls`](/zh-CN/commands/docs/ls.md) 传递命令行参数或开关。相反，我们使用 Nushell 的内置命令 [`sort-by`](/zh-CN/commands/docs/sort-by.md) 来对 `ls` 命令的*输出*进行排序。然后，为了让最大的文件显示在最上面，我们对 `sort-by` 的*输出*使用了 [`reverse`](/zh-CN/commands/docs/reverse.md)。

::: tip 酷！
如果你仔细比较排序顺序，你可能会发现数据不是按字母顺序排序的，甚至不是按*数值*排序的。相反，由于 `size` 列是 [`filesize` 类型](./types_of_data.md#file-sizes)，Nushell 知道 `1.1 KiB` (kibibytes) 比 `812 B` (bytes) 大。
:::

# 使用 `where` 命令查找数据

Nu 提供了许多可以对前一个命令的结构化输出进行操作的命令。这些在 Nushell 中通常被归类为“过滤器”。

例如，我们可以使用 [`where`](/zh-CN/commands/docs/where.md) 来过滤表格的内容，使其只显示大于 10 KB 的文件：

```nu
ls | where size > 10kb
# => ╭───┬─────────────────┬──────┬───────────┬───────────────╮
# => │ # │      name       │ type │   size    │   modified    │
# => ├───┼─────────────────┼──────┼───────────┼───────────────┤
# => │ 0 │ CONTRIBUTING.md │ file │  11.0 KiB │ 5 months ago  │
# => │ 1 │ Cargo.lock      │ file │ 194.6 KiB │ 2 minutes ago │
# => │ 2 │ README.md       │ file │  12.0 KiB │ 16 hours ago  │
# => │ 3 │ toolkit.nu      │ file │  20.0 KiB │ 16 hours ago  │
# => ╰───┴─────────────────┴──────┴───────────┴───────────────╯
```

## 不仅仅是目录

当然，这并不仅限于 `ls` 命令。Nushell 遵循 Unix 的哲学，即每个命令都只做好一件事，你通常可以期望一个命令的输出成为另一个命令的输入。这使我们能够以许多不同的组合来混合和匹配命令。

让我们看看另一个命令：

```nu:no-line-numbers
ps
# => ╭───┬──────┬──────┬───────────────┬──────────┬──────┬───────────┬─────────╮
# => │ # │ pid  │ ppid │     name      │  status  │ cpu  │    mem    │ virtual │
# => ├───┼──────┼──────┼───────────────┼──────────┼──────┼───────────┼─────────┤
# => │ 0 │    1 │    0 │ init(void)    │ Sleeping │ 0.00 │   1.2 MiB │ 2.2 MiB │
# => │ 1 │    8 │    1 │ init          │ Sleeping │ 0.00 │ 124.0 KiB │ 2.3 MiB │
# => │ 2 │ 6565 │    1 │ SessionLeader │ Sleeping │ 0.00 │ 108.0 KiB │ 2.2 MiB │
# => │ 3 │ 6566 │ 6565 │ Relay(6567)   │ Sleeping │ 0.00 │ 116.0 KiB │ 2.2 MiB │
# => │ 4 │ 6567 │ 6566 │ nu            │ Running  │ 0.00 │  28.4 MiB │ 1.1 GiB │
# => ╰───┴──────┴──────┴───────────────┴──────────┴──────┴───────────┴─────────╯
```

你可能熟悉 Linux/Unix 的 `ps` 命令。它提供了系统中所有当前正在运行的进程及其当前状态的列表。与 `ls` 一样，Nushell 提供了一个跨平台的内置 [`ps` 命令](/zh-CN/commands/docs/ps.md)，它以结构化数据的形式返回结果。

::: note
传统的 Unix `ps` 默认只显示当前进程及其父进程。Nushell 的实现默认显示系统上的所有进程。

通常情况下，在 Nushell 中运行 `ps` 会使用其 **_内部的_** 、跨平台的命令。但是，在 Unix/Linux 平台上，仍然可以通过在命令前加上*脱字符号*来运行 **_外部的_** 、依赖于系统的版本。例如：

```nu
^ps aux  # 运行 Unix ps 命令，以面向用户的形式显示所有进程
```

更多细节请参见[运行外部系统命令](./running_externals.md)。
:::

如果我们只想显示正在活跃运行的进程怎么办？与上面的 `ls` 一样，我们也可以处理 `ps` *输出*的表格：

```nu
ps | where status == Running
# => ╭───┬──────┬──────┬──────┬─────────┬──────┬──────────┬─────────╮
# => │ # │ pid  │ ppid │ name │ status  │ cpu  │   mem    │ virtual │
# => ├───┼──────┼──────┼──────┼─────────┼──────┼──────────┼─────────┤
# => │ 0 │ 6585 │ 6584 │ nu   │ Running │ 0.00 │ 31.9 MiB │ 1.2 GiB │
# => ╰───┴──────┴──────┴──────┴─────────┴──────┴──────────┴─────────╯
```

::: tip
还记得上面 `ls` 命令输出的 `size` 列是 `filesize` 类型吗？在这里，`status` 实际上只是一个字符串，你可以对它使用所有常规的字符串操作和命令，包括（如上所示）`==` 比较。

你可以使用以下命令检查表格列的类型：

```nu
ps | describe
# => table<pid: int, ppid: int, name: string, status: string, cpu: float, mem: filesize, virtual: filesize> (stream)
```

[`describe` 命令](/zh-CN/commands/docs/describe.md)可以用来显示任何命令或表达式的输出类型。

:::

## 管道中的命令参数

有时，命令接受的是*参数*而不是管道*输入*。对于这种情况，Nushell 提供了 [`$in` 变量](./pipelines.md#pipeline-input-and-the-special-in-variable)，让你可以在变量形式中使用前一个命令的输出。例如：

```nu:line-numbers
ls
| sort-by size
| reverse
| first
| get name
| cp $in ~
```

::: tip Nushell 设计说明
只要有可能，Nushell 命令都会被设计为对管道*输入*进行操作。然而，有些命令，比如本例中的 `cp`，有两个（或更多）具有不同含义的参数。在这种情况下，`cp` 需要同时知道要*复制*的路径和*目标*路径。因此，这个命令使用两个*位置参数*会更符合人体工程学。
:::

::: tip
为了可读性，Nushell 命令可以跨越多行。上面的命令与下面这个相同：

```nu
ls | sort-by size | reverse | first | get name | cp $in ~
```

另请参阅：[多行编辑](./line_editor.md#multi-line-editing)
:::

前三行与我们在上面第二个例子中使用的命令相同，所以让我们来看看后三行：

4. [`first` 命令](/zh-CN/commands/docs/first.md)只是从表格中返回第一个值。在这种情况下，这意味着大小最大的文件。如果使用上面第二个例子中的目录列表，那就是 `Cargo.lock` 文件。这个“文件”是表格中的一个 [`record`](./types_of_data.md#records)（记录），它仍然包含 `name`、`type`、`size` 和 `modified` 列/字段。
5. `get name` 从前一个命令返回 `name` 字段的*值*，即 `"Cargo.lock"`（一个字符串）。这也是一个 [`cell-path`](./types_of_data.md#cell-paths)（单元格路径）的简单例子，可用于导航和隔离结构化数据。
6. 最后一行使用 `$in` 变量来引用第 5 行的输出。结果是一个命令，意思是*“将 'Cargo.lock' 复制到主目录”*

::: tip
[`get`](/zh-CN/commands/docs/get.md) 和它的对应命令 [`select`](/zh-CN/commands/docs/select.md) 是 Nushell 中最常用的两个过滤器，但乍一看可能不容易发现它们之间的区别。当你准备好更广泛地使用它们时，请参阅[使用 `get` 和 `select`](./navigating_structured_data.md#using-get-and-select)指南。
:::

## 获取帮助

Nushell 提供了一个广泛的、内置的帮助系统。例如

```nu
# help <command>
help ls
# 或者
ls --help
# 也可以
help operators
help escapes
```

::: tip 酷！
按 <kbd>F1</kbd> 键访问帮助[菜单](./line_editor.md#menus)。在这里搜索 `ps` 命令，但*先不要按 <kbd>Enter</kbd> 键*！

相反，按 <kbd>向下箭头</kbd> 键，你会发现你正在滚动浏览示例部分。高亮一个示例，*然后*按 <kbd>Enter</kbd> 键，该示例将被输入到命令行中，准备运行！

这是探索和学习大量 Nushell 命令的好方法。
:::

帮助系统还有一个“搜索”功能：

```nu
help --find filesize
# 或
help -f filesize
```

现在你可能不会感到惊讶，帮助系统本身就是基于结构化数据的！请注意，`help -f filesize` 的输出是一个表格。

每个命令的帮助都作为一条记录存储，包含：

- 名称
- 类别
- 类型（内置、插件、自定义）
- 接受的参数
- 显示其可接受和输出的数据类型的签名
- 等等

你可以使用以下命令将*所有*命令（外部命令除外）看作一个大表格：

```nu
help commands
```

::: tip
请注意，上面输出的 `params` 和 `input_output` 列是*嵌套*表。Nushell 允许[任意嵌套的数据结构](./navigating_structured_data.md#background)。
:::

## 开始 `explore`(浏览) 这里

`help commands` 的输出很长。你可以把它发送到像 `less` 或 `bat` 这样的分页器中，但 Nushell 包含一个内置的 `explore` 命令，它不仅可以让你滚动，还可以深入到嵌套数据中。试试：

```nu
help commands | explore
```

然后按 <kbd>Enter</kbd> 键访问数据本身。使用箭头键滚动到 `cp` 命令，再到 `params` 列。再次按 <kbd>Enter</kbd> 键可以深入查看 `cp` 命令可用的完整参数列表。

::: note
按一次 <kbd>Esc</kbd> 键从滚动模式返回到视图；再按一次则返回到上一个视图（如果已在顶层视图，则退出）。
:::

::: tip
当然，你可以在 Nushell 中对 _任何_ 结构化数据使用 `explore` 命令。这可能包括来自 Web API 的 JSON 数据、电子表格或 CSV 文件、YAML，或任何可以在 Nushell 中表示为结构化数据的东西。

试试 `$env.config | explore` 玩玩吧！
:::
