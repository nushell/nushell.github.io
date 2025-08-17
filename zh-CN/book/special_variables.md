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
- `home-path`: 用户的主目录，可以使用简写 `~` 访问
- `data-dir`: Nushell 的数据目录，包括启动时加载的 `./vendor/autoload` 目录和其他用户数据
- `cache-dir`: 用于非必要(缓存)数据的目录
- `vendor-autoload-dirs`: 第三方应用应安装配置文件的目录列表，这些文件将在启动时自动加载
- `user-autoload-dirs`: 用户可以创建额外配置文件的目录列表，这些文件将在启动时自动加载
- `temp-path`: 用户可写的临时文件路径
- `pid`: 当前运行的 Nushell 进程的 PID
- `os-info`: 主机操作系统信息
- `startup-time`: Nushell 启动并处理所有配置文件所花费的时间(持续时间)
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

## `$env`

`$env` 是一个特殊的可变变量，包含当前环境变量。与任何进程一样，初始环境是从启动 `nu` 的父进程继承的。

Nushell 还使用以下几个环境变量用于特定目的：

### `$env.CMD_DURATION_MS`

前一个命令运行所花费的时间(毫秒)。

### `$env.config`

`$env.config` 是 Nushell 中使用的主要配置记录。设置文档见 `config nu --doc`。

### `$env.CURRENT_FILE`

在脚本、模块或源文件中，此变量保存文件的完全限定名称。注意，此信息也可以通过 [`path self`](/zh-CN/commands/docs/path_self.md) 命令作为常量获取。

### `$env.ENV_CONVERSIONS`

允许用户指定如何将某些环境变量转换为 Nushell 类型。参见 [ENV_CONVERSIONS](./configuration.md#env-conversions)。

### `$env.FILE_PWD`

在脚本、模块或源文件中，此变量保存文件所在目录的完全限定名称。注意，此值也可以通过以下方式作为常量获取：

```nu
path self | path dirname
```

### `$env.LAST_EXIT_CODE`

最后一个命令的退出代码，通常用于外部命令 - 相当于 POSIX 中的 `$?`。注意，此信息也会在外部命令的 `try` 表达式的 `catch` 块中可用。例如：

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

使用 `source`、`use` 或 `overlay use` 命令时将搜索的目录列表。另请参阅：

- 下面的 `$NU_LIB_DIRS` 常量
- [模块路径](./modules/using_modules.md#module-path)
- [配置 - `$NU_LIB_DIRS`](./configuration.md#nu-lib-dirs-constant)

### `$env.NU_LOG_LEVEL`

[标准库](/book/standard_library.md)在 `std/log` 中提供日志记录功能。`NU_LOG_LEVEL` 环境变量用于定义自定义命令、模块和脚本使用的日志级别。

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
# => … 更多日志消息，带有对 Nushell 命令 Rust 源文件的引用
#      但没有我们自己的 `log debug` 消息
# => 1
# => 9
# => …
```

### `$env.NU_PLUGIN_DIRS`

使用 `plugin add` 注册插件时将搜索的目录列表。另请参阅：

- [插件搜索路径](./plugins.md#plugin-search-path)

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

- [配置 - 提示符配置](./configuration.md#prompt-configuration)
- `config nu --doc`

### `$env.SHLVL`

`SHLVL` 在大多数 shell 进入新的子 shell 时会递增。它可以用来确定嵌套 shell 的数量。例如，
如果 `$env.SHLVL == 2

## `$in`

`$in` 是一个特殊变量，表示管道中的输入值。当命令通过管道连接时，前一个命令的输出会作为 `$in` 传递给下一个命令。

```nu
ls | where size > 10kb | each {|file| $in.name}
```

## `$it`

`$it` 是 `each` 块中的默认参数变量，当没有显式指定参数名时使用：

```nu
ls | each { echo $it.name }
```

等同于：

```nu
ls | each {|file| echo $file.name }
```

## `$NU_LIB_DIRS`

`$NU_LIB_DIRS` 是一个常量列表，指定 Nushell 查找模块文件的目录。这些目录会在以下情况下被搜索：

1. 使用 `source` 命令加载脚本时
2. 使用 `use` 命令导入模块时
3. 使用 `overlay use` 命令加载覆盖层时

默认包含以下目录：

- Nushell 标准库路径
- `~/.config/nushell` 下的模块目录

可以通过 `$env.NU_LIB_DIRS` 环境变量扩展此列表。

## `$NU_PLUGIN_DIRS`

`$NU_PLUGIN_DIRS` 是一个常量列表，指定 Nushell 查找插件的目录。这些目录会在使用 `plugin add` 命令时被搜索。

默认包含以下目录：

- Nushell 内置插件路径
- `~/.config/nushell` 下的插件目录

可以通过 `$env.NU_PLUGIN_DIRS` 环境变量扩展此列表。
