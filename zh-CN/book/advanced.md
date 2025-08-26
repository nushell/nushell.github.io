# （并不那么）高级的功能

虽然“高级”这个标题可能听起来令人生畏，你可能会想跳过本章，但实际上，一些最有趣和最强大的功能可以在这里找到。

除了内置命令，Nushell 还有一个[标准库](standard_library.md)。

Nushell 操作的是 _结构化数据_。
你可以说 Nushell 是一个“数据优先”的 shell 和编程语言。
为了进一步探索以数据为中心的方向，Nushell 包含了一个功能齐全的数据帧处理引擎，使用 [Polars](https://github.com/pola-rs/polars) 作为后端。
如果你想直接在 shell 中高效地处理大量数据，请务必查看[数据帧文档](dataframes.md)。

Nushell 中的值包含一些额外的[元数据](metadata.md)。
例如，这些元数据可以用来[创建自定义错误](creating_errors.md)。

由于 Nushell 严格的作用域规则，[并行迭代集合](parallelism.md)非常容易，这可以帮助你通过只输入几个字符来加速长时间运行的脚本。

你可以使用 [`explore`](/commands/docs/explore.md) 命令[交互式地探索数据](explore.md)。

最后，你可以使用[插件](plugins.md)来扩展 Nushell 的功能。
几乎任何东西都可以成为插件，只要它以 Nushell 理解的协议与 Nushell 通信。
