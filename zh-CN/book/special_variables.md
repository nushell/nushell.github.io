# 特殊变量

Nushell 提供并使用了一系列特殊变量和常量。其中许多在本手册的其他地方已有提及或记录，但本页应包含所有变量以供参考。

[[toc]]

## `$nu`

`$nu` 是一个包含多个有用值的常量记录：

- `default-config-dir`: 存储和读取配置文件的目录
- `config-path`: 主 Nushell 配置文件路径，通常是配置目录中的 `config.nu`
- `env-path`: 可选的环境配置文件，通常是配置目录中的 `env.nu`
- `history-path`: 存储命令历史的文本或 SQLite 文件
- `loginshell-path`: 登录 shell 运行的可选配置文件，通常是配置目录中的 `login.nu`
- `plugin-path`: 插件注册表文件，通常是配置目录中的 `plugin.msgpackz`
- `home-dir`: 用户的主目录，可以使用简写 `~` 访问
- `data-dir`: Nushell 的数据目录，包括启动时加载的 `./vendor/autoload` 目录和其他用户数据
- `cache-dir`: 用于非必要(缓存)数据的目录
- `vendor-autoload-dirs`: 第三方应用应安装配置文件的目录列表，这些文件将在启动时自动加载
- `user-autoload-dirs`: 用户可以创建额外配置文件的目录列表，这些文件将在启动时自动加载
- `temp-dir`: 用户可写的临时文件路径
- `pid`: 当前运行的 Nushell 进程的 PID
- `os-info`: 主机操作系统信息
- `startup-time`: Nushell 启动所花费的时间（一个时间间隔）。计时从 Nushell 自己的 `main` 函数开始，因此操作系统加载 `nu` 可执行文件的时间不计入在内，而 `exec nu` 会重新开始计时。在 REPL 中，该值在第一个提示符就绪后即为最终值，它包括加载配置文件和插件、运行启动钩子以及渲染提示符的时间。使用 `nu -c` 或脚本时，它在命令或脚本开始运行时即为最终值。在此之前（例如正在求值某个配置文件时），它保存的是到目前为止已过去的时间。启动横幅会显示这个值；使用 `banner --no-startup-time` 可以隐藏它。
- `is-interactive`: 布尔值，指示 Nushell 是否作为交互式 shell 启动(`true`)或正在运行脚本或命令字符串。例如：

  ```nu
  $nu.is-interactive
  # => true
  nu -c "$nu.is-interactive"
  # => false

  # 使用 --interactive (-i) 强制交互模式
  nu -i -c "$nu.is-interactive"
  # => true
  ```

  注意：当作为交互式 shell 启动时，会处理启动配置文件。当作为非交互式 shell 启动时，除非通过标志显式调用，否则不会读取任何配置文件。

- `is-login`: 指示 Nushell 是否作为登录 shell 启动
- `history-enabled`: 可以通过 `nu --no-history` 禁用历史记录，此时该常量将为 `false`
- `current-exe`: 当前运行的 `nu` 二进制文件的完整路径。可以与 `path dirname`(也是常量)结合使用来确定二进制文件所在的目录
- `is-lsp`: 当 Nushell 通过 `nu --lsp` 作为语言服务器协议（LSP）服务器启动时为 `true`。
- `is-mcp`: 当 Nushell 通过 `nu --mcp` 作为模型上下文协议（MCP）服务器运行时为 `true`。参见 [MCP 服务器](./mcp.md)。
- `is-dap`: 当 Nushell 通过 `nu --dap` 作为调试适配器协议（DAP）服务器启动时为 `true`。参见[脚本调试](./debugging.md)。

  在这三种模式下，`print` 都会输出到 stderr，以免干扰 stdout 上的协议消息。

## `$env`

`$env` 是一个特殊的可变变量，包含当前环境变量。与任何进程一样，初始环境是从启动 `nu` 的父进程继承的。

Nushell 还使用以下几个环境变量用于特定目的：

### `$env.CMD_DURATION_MS`

前一个命令运行所花费的时间(毫秒)。

### `$env.config`

`$env.config` 是 Nushell 中使用的主要配置记录。设置文档见 `config nu --doc`。

### `$env.CURRENT_FILE`

在脚本、模块或源文件中，此变量保存文件的完全限定名称。注意，此信息也可以通过 [`path self`](/commands/docs/path_self.md) 命令作为常量获取。

### `$env.ENV_CONVERSIONS`

允许用户指定如何将某些环境变量转换为 Nushell 类型。参见 [ENV_CONVERSIONS](./configuration.md#env-conversions)。

### `$env.FILE_PWD`

在脚本、模块或源文件中，此变量保存文件所在目录的完全限定名称。注意，此值也可以在脚本或模块文件中使用 [`path self`](/commands/docs/path_self.md) 作为常量获取：

```nu
const this_dir = path self | path dirname
```

### `$env.LAST_EXIT_CODE`

最后一个命令的退出代码，通常用于外部命令 —— 相当于 POSIX 中的 `$?`。如果管道中有多个外部命令失败，它保存的是最右侧那个失败命令的退出代码（参见[管道 - 管道中失败的外部命令](./pipelines.md#管道中失败的外部命令)）。注意，此信息也会在外部命令的 `try` 表达式的 `catch` 块中可用。例如：

```nu
^ls file-that-does-not-exist e> /dev/null
$env.LAST_EXIT_CODE
# => 2

# 或者
try {
  ^ls file-that-does-not-exist e> /dev/null
} catch {|e|
  print $e.exit_code
}
# => 2
```

### `$env.NU_LIB_DIRS`

::: tip

优先使用 `$NU_LIB_DIRS` 常量（见下文），它在解析时也可用。启动时，`$env.NU_LIB_DIRS` 和 `$NU_LIB_DIRS` 都被设置为同一个列表：从 `NU_LIB_DIRS` 环境变量继承的任何目录，或用 `nu --include-path` 传入的任何目录，然后是默认目录。环境变量在常量之后被搜索。

:::

使用 `source`、`use` 或 `overlay use` 命令时将搜索的目录列表。另请参阅：

- 下面的 `$NU_LIB_DIRS` 常量
- [模块路径](./modules/using_modules.md#模块路径)
- [配置 - `$NU_LIB_DIRS`](./configuration.md#nu-lib-dirs-常量)

### `$env.NU_LOG_LEVEL`

[标准库](./standard_library.md)在 `std/log` 中提供日志记录功能。`NU_LOG_LEVEL` 环境变量用于定义自定义命令、模块和脚本使用的日志级别。

```nu
nu -c '1 | print; use std/log; log debug 1111; 9 | print'
# => 1
# => 9

nu -c '1 | print; use std/log; NU_LOG_LEVEL=debug log debug 1111; 9 | print'
# => 1
# => 2025-07-12T21:27:30.080|DBG|1111
# => 9

nu -c '1 | print; use std/log; $env.NU_LOG_LEVEL = "debug"; log debug 1111; 9 | print'
# => 1
# => 2025-07-12T21:27:57.888|DBG|1111
# => 9
```

注意 `$env.NU_LOG_LEVEL` 与 `nu --log-level` 不同，后者设置内置原生 Rust Nushell 命令的日志级别。它不会影响自定义命令和脚本中使用的 `std/log` 日志记录。

```nu
nu --log-level 'debug' -c '1 | print; use std/log; log debug 1111; 9 | print'
# => … a lot more log messages, with references to the Nushell command Rust source files
#      但没有我们自己的 `log debug` 消息
# => 1
# => 9
# => …
```

### `$env.NU_PLUGIN_DIRS`

使用 `plugin add` 注册插件时将搜索的目录列表。另请参阅：

- [插件搜索路径](./plugins.md#插件搜索路径)

### `$env.NU_VERSION`

当前 Nushell 版本。与 `(version).version` 相同，但作为环境变量，它会被导出并可以被子进程读取。

### `$env.PATH`

执行其他应用程序的搜索路径。它最初作为字符串从父进程继承，但在启动时转换为 Nushell `list` 以便于访问。

在运行子进程之前，它会转换回字符串。

### `$env.PROCESS_PATH`

当执行脚本时，此变量表示脚本的名称和相对路径。与上面的两个变量不同，在源文件或导入模块时它不存在。

注意：也与上面的两个变量不同，返回的是用于调用文件的确切路径(包括符号链接)。

### `$env.PROMPT_*` 和 `$env.TRANSIENT_PROMPT_*`

有许多变量可用于配置出现在每个命令行上的 Nushell 提示符。另请参阅：

- [配置 - 提示符配置](./configuration.md#提示符配置)
- `config nu --doc`

### `$env.SHLVL`

`SHLVL` 在大多数 shell 进入新的子 shell 时会递增。它可以用来确定嵌套 shell 的数量。例如，
如果 `$env.SHLVL == 2`，那么输入 `exit` 应该会让你回到父 shell。

### `$env.XDG_CONFIG_HOME`

可用于可选地覆盖 `$nu.default-config-dir` 的位置。
参见[配置 - 启动变量](./configuration.md#启动变量)。

### `$env.XDG_DATA_HOME`

可用于可选地覆盖 `$nu.data-dir` 的位置。
参见[配置 - 启动变量](./configuration.md#启动变量)。

## `$in`

`$in` 变量表示表达式的管道输入。参见[管道 - 特殊的 `$in` 变量](./pipelines.md#管道输入和特殊的-in-变量)。

## `$it`

`$it` 是一个只在"行条件"中可用的特殊变量——行条件是一种简化字段访问的便捷写法。行条件被 [`where`](/commands/docs/where.md) 接受，也被 [`any`](/commands/docs/any.md)、[`all`](/commands/docs/all.md)、[`take while`](/commands/docs/take_while.md)、[`take until`](/commands/docs/take_until.md)、[`skip while`](/commands/docs/skip_while.md)、[`skip until`](/commands/docs/skip_until.md) 和 [`chunk-by`](/commands/docs/chunk-by.md) 接受。在行条件中，`$it` 是当前项，记录中的列也可以直接按名字引用。更多信息参见 `help where`。

```nu
[1 5 12 3] | where $it > 4
# => ╭───┬────╮
# => │ 0 │  5 │
# => │ 1 │ 12 │
# => ╰───┴────╯
[1 5 12 3] | any $it > 10
# => true
```

## `$ans`

`$ans` 变量保存了 REPL 中最近一次运行命令的信息：它的 `exit_code`、`duration` 和 `command` 文本。

`$ans.last` 保存最近一次的输出，但只有当 `$env.config.max_last_result_size` 被设置为大于零的值时才有效。
默认值是 `0b`，即禁用它（此时 `$ans` 里不会有 `last`）。要启用它，可以在 `config.nu` 里加上类似这样的配置：

```nu
$env.config.max_last_result_size = 1MB
```

注意，只有管道的最后一部分是内部命令时，`$ans.last` 才会更新。外部命令的输出如果通过管道传给 `collect`，也可以被保存。

```nu
fd . | collect
# => bar/
# => foo.txt
$ans
# => ╭───────────┬──────────────────╮
# => │ last      │ bar/             │
# => │           │ foo.txt          │
# => │ exit_code │ 0                │
# => │ duration  │ 18ms 904µs 776ns │
# => │ command   │ fd . | collect   │
# => ╰───────────┴──────────────────╯
```

超过 `max_last_result_size` 的结果会被截断，此时显示 `$ans.last` 会打印一条
`nu::shell::last_result_truncated` 警告。单独运行 `$ans`（或 `$ans.<field>`）会更新
`exit_code`、`duration` 和 `command`，但会保留之前的 `last` 值。
`ans` 是保留名，因此 `let ans = ...` 会报错。

## `$NU_LIB_DIRS`

`$NU_LIB_DIRS` 是 `$env.NU_LIB_DIRS` 的常量版本——使用 `source`、`use` 或 `overlay use` 命令时会被搜索的目录列表。另请参阅：

- [模块路径](./modules/using_modules.md#模块路径)
- [配置 - `$NU_LIB_DIRS`](./configuration.md#nu-lib-dirs-常量)

## `$NU_PLUGIN_DIRS`

`$env.NU_PLUGIN_DIRS` 的常量版本——使用 `plugin add` 注册插件时会被搜索的目录列表。另请参阅：

- [插件搜索路径](./plugins.md#插件搜索路径)
