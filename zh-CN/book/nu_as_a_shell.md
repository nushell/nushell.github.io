# 作为Shell的Nu

[Nu基础](nu_fundamentals.md)和[在Nu中编程](programming_in_nu.md)章节主要关注Nushell的语言特性。本章将重点介绍与Nushell解释器(Nushell [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop))相关的部分。有些概念直接是Nushell编程语言的一部分(如环境变量)，而其他一些则是纯粹为了增强交互体验而实现的(如钩子)，因此在运行脚本等场景下不会出现。

Nushell的许多参数都可以[配置](configuration.md)。配置本身作为环境变量存储。此外，Nushell有几个不同的配置文件，在启动时运行，您可以在其中放置自定义命令、别名等。

任何shell的一个重要特性都是[环境变量](environment.md)。在Nushell中，环境变量有作用域，并且可以具有Nushell支持的任何类型。这带来了一些额外的设计考虑，请参阅链接部分了解更多详情。

其他章节解释了如何处理[标准输出、标准错误和退出码](stdout_stderr_exit_codes.md)，如何[当存在同名内置命令时运行外部命令](./running_externals.md)，以及如何[配置第三方提示符](3rdpartyprompts.md)以与Nushell配合使用。

Nushell的一个有趣特性是[目录栈](directory_stack.md)，它允许您同时在多个目录中工作。

Nushell还有自己的行编辑器[Reedline](line_editor.md)。通过Nushell的配置，可以配置Reedline的一些功能，如提示符、键绑定、历史记录或菜单。

还可以为[外部命令定义自定义签名](externs.md)，这使您可以为它们定义[自定义补全](custom_completions.md)(自定义补全也适用于Nushell自定义命令)。

[Nu中的颜色和主题](coloring_and_theming.md)更详细地介绍了如何配置Nushell的外观。

如果您想在后台运行一些命令，[后台作业](background_jobs.md)提供了简单的指南供您遵循。

最后，[钩子](hooks.md)允许您在特定事件时插入Nushell代码片段运行。
