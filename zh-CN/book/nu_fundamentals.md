# Nu 基础

本章解释 Nushell 编程语言的一些基础知识。
读完本章，你应该对如何编写简单的 Nushell 程序有一个概念。

Nushell 拥有丰富的类型系统。
你会看到典型的数据类型，例如字符串或整数，也会看到不太典型的数据类型，例如单元格路径。
此外，Nushell 的一个决定性特征是*结构化数据*的概念，这意味着你可以把类型组织成集合：列表、记录或表格。
与传统的 Unix 方式（命令通过纯文本通信）相反，Nushell 的命令通过这些数据类型进行通信。
以上全部内容都在[数据类型](types_of_data.md)中有说明。

[加载数据](loading_data.md)解释了如何把常见的数据格式（例如 JSON）读入为*结构化数据*。这包括我们自己的“NUON”数据格式。

就像 Unix shell 一样，Nushell 的命令可以组合成[管道](pipelines.md)，以传递和修改数据流。

有些数据类型具有值得单独成节的有趣特性：[字符串](working_with_strings.md)、[列表](working_with_lists.md)和[表格](working_with_tables.md)。
除了讲解这些特性，这些章节还展示了如何做一些常见的操作，例如组合字符串或更新列表中的值。

最后，[命令参考](/commands/)列出了所有内置命令及其简要说明。
请注意，你也可以在 Nushell 内部使用 [`help`](/commands/docs/help.md) 命令访问这些信息。
