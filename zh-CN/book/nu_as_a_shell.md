# Nu 作为 shell

[Nu 基础](nu_fundamentals.md)和[Nu 编程](programming_in_nu.md)这两章主要关注 Nushell 的语言方面。
本章则聚焦于 Nushell 中与 Nushell 解释器（Nushell [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)）相关的部分。
其中一些概念直接属于 Nushell 编程语言的一部分（例如环境变量），而另一些纯粹是为了增强交互体验而实现的（例如钩子），因此在运行脚本等场景下并不存在。

Nushell 的许多参数都可以[配置](configuration.md)。
配置本身存储在一个环境变量中。
此外，Nushell 有几个不同的配置文件会在启动时运行，你可以在其中放置自定义命令、别名等。

任何 shell 的一个重要特性是[环境变量](environment.md)。
在 Nushell 中，环境变量是有作用域的，并且可以是 Nushell 支持的任何类型。
这带来了一些额外的设计考量，因此请参阅链接的章节了解更多细节。

其它章节解释了如何处理[标准输出、标准错误和退出码](stdout_stderr_exit_codes.md)，如何[在存在同名内置命令时运行外部命令](./running_externals.md)，以及如何[配置第三方提示符](3rdpartyprompts.md)以配合 Nushell 使用。

Nushell 的一个有趣特性是[目录栈](directory_stack.md)，它让你可以同时在多个目录中工作。

Nushell 还有自己的行编辑器 [Reedline](line_editor.md)。
通过 Nushell 的配置，可以配置 Reedline 的一些特性，例如提示符、键绑定、历史记录和菜单。

也可以为外部命令定义[自定义签名](externs.md)，这让你能为它们定义[自定义补全](custom_completions.md)（自定义补全也适用于 Nushell 自定义命令）。

[Nu 的配色和主题](coloring_and_theming.md)更详细地介绍了如何配置 Nushell 的外观。

如果你想安排一些命令在后台运行，[后台任务](background_jobs.md)提供了一些简单的指导原则供你遵循。

最后，[钩子](hooks.md)允许你插入 Nushell 代码片段，以便在某些事件发生时运行。
