# （没那么）高级

虽然“高级”这个标题听起来可能令人生畏，你可能会想跳过本章，但事实上，一些最有趣、最强大的特性就在这一章里。

除了内置命令，Nushell 还有一个[标准库](standard_library.md)。

Nushell 操作的是*结构化数据*。
你可以说 Nushell 是一个“数据优先”的 shell 和编程语言。
为了进一步探索以数据为中心的方向，Nushell 内置了一个功能完备的 dataframe 处理引擎，使用 [Polars](https://github.com/pola-rs/polars) 作为后端。
如果你想直接在 shell 中高效处理大量数据，请务必查看 [Dataframes 文档](dataframes.md)。

Nushell 中的值带有一些额外的[元数据](metadata.md)。
这些元数据可以例如用来[创建自定义错误](creating_errors.md)。

得益于 Nushell 严格的作用域规则，[并行遍历集合](parallelism.md)非常容易，只需敲几个字符就能帮你加速长时间运行的脚本。

你可以用 [`explore`](/commands/docs/explore.md) 命令[交互式地探索数据](explore.md)，也可以用 `tui` 系列命令[构建你自己的终端用户界面](tui.md)，例如选择器、对话框和仪表板。

你可以用[插件](plugins.md)扩展 Nushell 的功能。
几乎任何东西都可以成为插件，只要它用 Nushell 能理解的协议与 Nushell 通信。

最后，Nushell 可以作为 [MCP 服务器](mcp.md)运行，这样 AI agent 和其它模型上下文协议客户端就能查询它的命令并运行 Nushell 代码。
