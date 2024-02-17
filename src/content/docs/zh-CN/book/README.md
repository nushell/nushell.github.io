# 介绍

你好，欢迎来到 Nushell 项目。这个项目的目标是继承 Unix Shell 中用管道把简单的命令连接在一起的理念，并将其带到更具现代风格的开发中。因此，Nushell 不是一个纯粹的 shell 或编程语言，而是通过将一种丰富的编程语言和功能齐全的 shell 结合到一个软件包中，实现了二者的连接。

Nu 汲取了很多常见领域的灵感：传统 Shell 比如 Bash、基于对象的 Shell 比如 PowerShell、逐步类型化的语言比如 TypeScript、函数式编程、系统编程，等等。但是，Nu 并不试图成为万金油，而是把精力集中在做好这几件事上：

- 作为一个具有现代感的灵活的跨平台 Shell；
- 作为一种现代的编程语言，解决与数据有关的问题；
- 给予清晰的错误信息和干净的 IDE 支持。

了解 Nu 能做什么的最简单的方法是从一些例子开始，所以让我们深入了解一下。

当你运行 [`ls`](/commands/docs/ls.md) 这样的命令时，你会注意到的第一件事是，你得到的不是一个文本块，而是一个结构化的表格：

@[code](@snippets/introduction/ls_example.sh)

该表不仅仅是以不同的方式显示目录，就像电子表格中的表一样，它还允许我们以更加互动的方式来处理数据。

我们要做的第一件事是按大小对我们的表进行排序。要做到这一点，我们将从 [`ls`](/commands/docs/ls.md) 中获取输出，并将其输入到一个可以根据列的内容对表进行排序的命令中：

@[code](@snippets/introduction/ls_sort_by_reverse_example.sh)

你可以看到，为了达到这个目的，我们没有向 [`ls`](/commands/docs/ls.md) 传递命令行参数。取而代之的是，我们使用了 Nu 提供的 [`sort-by`](/commands/docs/sort-by.md) 命令来对 [`ls`](/commands/docs/ls.md) 命令的输出进行排序。为了在顶部看到最大的文件，我们还使用了 [`reverse`](/commands/docs/reverse.md) 命令。

Nu 提供了许多可以对表进行操作的命令，例如，我们可以过滤 [`ls`](/commands/docs/ls.md) 表的内容，使其只显示超过 1 千字节的文件。

@[code](@snippets/introduction/ls_where_example.sh)

就像在 Unix 哲学中一样，能够让命令相互对话给我们提供了在许多不同的组合中对命令进行混搭的方法。我们来看看一个不同的命令：

@[code](@snippets/introduction/ps_example.sh)

如果你使用过 Linux，你可能对 [`ps`](/commands/docs/ps.md) 命令很熟悉。通过它，我们可以得到一个当前系统正在运行的所有进程的列表，它们的状态是什么，以及它们的名字是什么，我们还可以看到这些进程的 CPU 负载。

如果我们想显示那些正在活跃使用 CPU 的进程呢？就像我们之前对 [`ls`](/commands/docs/ls.md) 命令所做的那样，我们也可以利用 [`ps`](/commands/docs/ps.md) 命令返回给我们的表格来做到：

@[code](@snippets/introduction/ps_where_example.sh)

到目前为止，我们一直在使用 [`ls`](/commands/docs/ls.md) 和 [`ps`](/commands/docs/ps.md) 来列出文件和进程。Nu 还提供了其他可以创建有用信息表格的命令。接下来，让我们试一下 [`date`](/commands/docs/date.md) 和 [`sys`](/commands/docs/sys.md)。

运行 [`date now`](/commands/docs/date_now.md) 输出关于当前日期和时间的信息：

@[code](@snippets/introduction/date_example.sh)

为了将获得的日期以表格形式展示，我们可以把它输入到 [`date to-table`](/commands/docs/date_to-table.md) 中：

@[code](@snippets/introduction/date_table_example.sh)

运行 [`sys`](/commands/docs/sys.md) 可以得到 Nu 所运行的系统的信息：

@[code](@snippets/introduction/sys_example.sh)

这与我们之前看到的表格有些不同。[`sys`](/commands/docs/sys.md) 命令输出了一个在单元格中包含结构化表格而非简单值的表格。要查看这些数据，我们需要**获取**（[`get`](/commands/docs/get.md)）待查看的列：

@[code](@snippets/introduction/sys_get_example.sh)

[`get`](/commands/docs/get.md) 命令让我们深入表的某一列内容中。在这里，我们要查看的是 `host` 列，它包含了 Nu 正在运行的主机的信息：操作系统名称、主机名、CPU，以及更多。让我们来获取系统上的用户名：

@[code](@snippets/introduction/sys_get_nested_example.sh)

现在，系统中只有一个名为 jt 的用户。你会注意到，我们可以传递一个列路径（`host.sessions.name` 部分），而不仅仅是简单的列名称。Nu 会接受列路径并输出表中相应的数据。

你可能已经注意到其他一些不同之处：我们没有一个数据表，而只有一个元素：即字符串 `"jt"`。Nu 既能处理数据表，也能处理字符串。字符串是使用 Nu 外部命令的一个重要部分。

让我们看看字符串在 Nu 外部命令里面是如何工作的。我们以之前的例子为例，运行外部的 `echo` 命令（`^` 告诉 Nu 不要使用内置的 [`echo`](/commands/docs/echo.md) 命令）：

@[code](@snippets/introduction/sys_get_external_echo_example.sh)

敏锐的读者可能会发现这看起来和我们之前的非常相似！确实如此，但有一个重要的区别：我们用前面的值调用了 `^echo`。这允许我们把数据从 Nu 中传到外部命令 `echo`（或者 Nu 之外的任何命令，比如 `git`）。

### 获取帮助

任何 Nu 的内置命令的帮助文本都可以通过 [`help`](/commands/docs/help.md) 命令来找到。要查看所有命令，请运行 `help commands` 。你也可以通过执行 `help -f <topic>` 来搜索一个主题：

@[code](@snippets/introduction/help_example.sh)
