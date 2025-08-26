# Nu 基础

本章解释了 Nushell 编程语言的一些基础知识。
阅读完本章后，你应该对如何编写简单的 Nushell 程序有所了解。

Nushell 有一个丰富的类型系统。
你会发现像字符串或整数这样的典型数据类型，以及像单元格路径这样不太典型的数据类型。
此外，Nushell 的一个决定性特征是 _结构化数据_ 的概念，这意味着你可以将类型组织成集合：列表、记录或表格。
与传统的 Unix 方法中命令通过纯文本进行通信不同，Nushell 命令通过这些数据类型进行通信。
以上所有内容都在[数据类型](types_of_data.md)中进行了解释。

[加载数据](loading_data.md)解释了如何将常见的数据格式（如 JSON）读入 _结构化数据_ 。这包括我们自己的 "NUON" 数据格式。

就像 Unix shell 一样，Nushell 命令可以组合成[管道](pipelines.md)来传递和修改数据流。

一些数据类型具有有趣的特性，值得单独介绍：[字符串](working_with_strings.md)、[列表](working_with_lists.md)和[表格](working_with_tables.md)。
除了解释这些特性外，这些部分还展示了如何进行一些常见的操作，例如组合字符串或更新列表中的值。

最后，[命令参考](/commands/)列出了所有内置命令及其简要说明。
请注意，你也可以在 Nushell 中使用 [`help`](/commands/docs/help.md) 命令访问此信息。
