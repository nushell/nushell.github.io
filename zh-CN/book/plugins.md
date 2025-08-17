# 插件

Nu 可以通过插件进行扩展。插件的行为与 Nu 的内置命令很相似，另外的好处是它们可以与 Nu 本身分开添加。

::: warning 重要
插件使用 `nu-plugin` 协议与 Nushell 通信。此协议是版本化的，插件必须使用 Nushell 提供的相同 `nu-plugin` 版本。

更新 Nushell 时，请确保也更新你已注册的任何插件。
:::

[[toc]]

## 概述

- 为了使用插件，它需要被：

  - 安装
  - 添加
  - 导入

有两种类型的插件：

- “核心插件”是官方维护的，通常与 Nushell 一起安装，在与 Nushell 可执行文件相同的目录中。
- 第三方插件也可从许多来源获得。

`$NU_LIB_DIRS` 常量或 `$env.NU_LIB_DIRS` 环境变量可用于设置插件的搜索路径。

### 核心插件快速入门

要开始使用 Polars 插件：

1. 大多数包管理器会自动随 Nushell 安装核心插件。然而，一个显著的例外是 `cargo`。如果你使用 `cargo` 安装了 Nushell，请参阅下面的[安装核心插件](#core-plugins)。

2. (推荐) 将插件搜索路径设置为包括 Nushell 及其插件的安装目录。假设核心插件与 Nushell 二进制文件安装在同一目录中，可以将以下内容添加到你的启动配置中：

   ```nu
   const NU_PLUGIN_DIRS = [
     ($nu.current-exe | path dirname)
     ...$NU_PLUGIN_DIRS
   ]
   ```

3. 将插件添加到插件注册表。这只需要做一次。名称是插件*文件*的名称，包括其扩展名：

   ```nu
   # 在 Unix/Linux 平台上：
   plugin add nu_plugin_polars
   # 或者在 Windows 上
   plugin add nu_plugin_polars.exe

   plugin list # 确认它已添加到注册表
   ```

   或者，如果你在第 2 步中没有将二进制目录添加到插件路径，你仍然可以使用绝对路径：

   ```nu
   plugin add ~/.local/share/rust/cargo/bin/nu_plugin_polars
   ```

4. 导入插件（以立即开始使用）或重新启动 Nushell。注册表中的所有插件在 Nushell 启动时都会自动导入：

   ```nu
   # 插件的名称，不带前导的 `nu_plugin` 和任何扩展名
   use polars
   ```

5. 确认插件正在工作：

   ```nu
   ls | polars into-df | describe
   # => NuDataFrame
   ```

## 安装插件

### 核心插件

Nushell 附带了一组官方维护的插件，其中包括：

- `polars`：使用 [Polars 库](https://github.com/pola-rs/polars) 通过 DataFrame 进行极快的列式操作。有关更多详细信息，请参阅[DataFrame 章节](dataframes.html)。
- `formats`：支持多种附加数据格式 - EML、ICS、INI、plist 和 VCF。
- `gstat`：以 Nushell 结构化数据的形式返回 Git 仓库的状态信息。
- `query`：支持查询 SQL、XML、JSON、HTML（通过选择器）和网页元数据。
- `inc`：递增一个值或版本（例如，semver）。此插件既可作为最终用户插件，也可作为如何创建插件的简单开发者示例。

Nushell 还附带了几个插件，作为插件开发人员的示例或工具。其中包括 `nu_plugin_example`、`nu_plugin_custom_values` 和 `nu_plugin_stress_internals`。

核心插件通常与 Nushell 版本一起分发，并且应该已经安装在与 Nushell 可执行文件相同的目录中。如果你的系统上是这种情况，核心插件应该使用正确的 `nu-plugin` 协议版本。如果你的包管理系统分别安装它们，请确保在更新 Nushell 本身时也更新核心插件。

::: tip 使用 Cargo 安装
例如，当使用 `cargo install nu --locked` 直接从 crates.io 安装或升级 Nushell 时，也可以使用 `cargo install nu_plugin_<plugin_name> --locked` 安装或更新该版本的相应核心插件。

要安装所有默认（非开发人员）插件，请在 Nushell 中运行：

```nu
[ nu_plugin_inc
  nu_plugin_polars
  nu_plugin_gstat
  nu_plugin_formats
  nu_plugin_query
] | each { cargo install $in --locked } | ignore
```

:::

### 第三方插件

你可以在 crates.io、在线 Git 仓库、[`awesome-nu`](https://github.com/nushell/awesome-nu/blob/main/plugin_details.md) 和其他来源找到第三方插件。与你在系统上运行的任何第三方代码一样，请确保你信任其来源。

要在你的系统上安装第三方插件，你首先需要确保该插件使用与你的系统相同的 Nu 版本：

- 使用 `version` 命令确认你的 Nushell 版本
- 通过检查其 `Cargo.toml` 文件来确认插件所需的版本

要按名称从 crates.io 安装插件，请运行：

```nu
cargo install nu_plugin_<plugin_name> --locked
```

从仓库（例如 GitHub）安装时，请在克隆的仓库内运行以下命令：

```nu
cargo install --path . --locked
```

这将创建一个可用于添加插件的二进制文件。

::: tip Cargo 安装位置
默认情况下，使用 `cargo install` 安装的二进制文件位于你的主目录下的 `.cargo/bin` 中。
但是，这可能会根据你的系统配置而改变。
:::

## 注册插件

要将插件添加到插件注册表文件，请调用 [`plugin add`](/zh-CN/commands/docs/plugin_add.md) 命令来告诉 Nu 在哪里可以找到它。

::: tip 提示
插件文件名必须以 `nu_plugin_` 开头，Nu 使用此文件名前缀来识别插件。
:::

- Linux 和 macOS：

  ```nu
  plugin add ./my_plugins/nu_plugin_cool
  ```

- Windows：

  ```nu
  plugin add .\my_plugins\nu_plugin_cool.exe
  ```

当 [`plugin add`](/zh-CN/commands/docs/plugin_add.md) 被调用时，Nu：

- 运行插件二进制文件
- 通过[插件协议](/zh-CN/contributor-book/plugin_protocol_reference.md)进行通信，以确保兼容性并获取其支持的所有命令的列表
- 然后将此插件信息保存到插件注册表文件（`$nu.plugin-path`）中，该文件充当缓存

### 导入插件

添加到注册表后，下次启动 `nu` 时，插件将被导入并在该会话中可用。

你也可以通过调用 `plugin use` 在当前会话中立即导入（或重新加载）插件。在这种情况下，使用插件的名称（而不是文件名），不带 `nu_plugin` 前缀：

```nu
plugin use cool
```

没有必要在你的配置文件中添加 `plugin use` 语句。所有先前注册的插件在启动时都会自动加载。

::: tip 提示
`plugin use` 是一个解析器关键字，因此在评估脚本时，它将首先被评估。这意味着虽然你可以在 REPL 的不同行上执行 `plugin add` 然后 `plugin use`，但你不能在单个脚本中执行此操作。如果你需要在没有准备缓存文件的情况下使用特定插件或一组插件运行 `nu`，你可以将 `--plugins` 选项传递给 `nu`，并附带一个插件可执行文件列表：

```nu
nu --plugins '[./my_plugins/nu_plugin_cool]'
```

:::

### 插件搜索路径

Nushell 包括两个可用于设置插件搜索路径的 `list` 变量。这仅适用于使用 `plugin add` 注册插件时，但如果你经常添加和删除插件，这可能是一个很好的快捷方式。

- `const NU_PLUGIN_DIRS`：一个常量，设置后立即生效。但是，作为一个常量，只有某些命令可以与它一起使用。例如，可以像[上面的快速入门](#core-plugin-quickstart)中看到的那样更新它。
- `$env.NU_PLUGIN_DIRS`：一个环境变量，是可变的，可以接受任何更新其列表的命令。但是，对其的更改直到解析*下一个*表达式时才会生效。

### 更新插件

更新插件时，重要的是再次运行 `plugin add`，就像上面一样，从插件加载新的签名，并允许 Nu 将它们重写到插件文件（`$nu.plugin-path`）。然后你可以 `plugin use` 以在当前会话中获取更新的签名。

## 管理插件

已安装的插件使用 [`plugin list`](/zh-CN/commands/docs/plugin_list.md) 显示：

```nu
plugin list
# =>
╭───┬─────────┬────────────┬─────────┬───────────────────────┬───────┬───────────────────────────────╮
│ # │  name   │ is_running │   pid   │       filename        │ shell │           commands            │
├───┼─────────┼────────────┼─────────┼───────────────────────┼───────┼───────────────────────────────┤
│ 0 │ gstat   │ true       │ 1389890 │ .../nu_plugin_gstat   │       │ ╭───┬───────╮                 │
│   │         │            │         │                       │       │ │ 0 │ gstat │                 │
│   │         │            │         │                       │       │ ╰───┴───────╯                 │
│ 1 │ inc     │ false      │         │ .../nu_plugin_inc     │       │ ╭───┬─────╮                   │
│   │         │            │         │                       │       │ │ 0 │ inc │                   │
│   │         │            │         │                       │       │ ╰───┴─────╯                   │
│ 2 │ example │ false      │         │ .../nu_plugin_example │       │ ╭───┬───────────────────────╮ │
│   │         │            │         │                       │       │ │ 0 │ nu-example-1          │ │
│   │         │            │         │                       │       │ │ 1 │ nu-example-2          │ │
│   │         │            │         │                       │       │ │ 2 │ nu-example-3          │ │
│   │         │            │         │                       │       │ │ 3 │ nu-example-config     │ │
│   │         │            │         │                       │       │ │ 4 │ nu-example-disable-gc │ │
│   │         │            │         │                       │       │ ╰───┴───────────────────────╯ │
╰───┴─────────┴────────────┴─────────┴───────────────────────┴───────┴───────────────────────────────╯
```

已安装插件的所有命令在当前作用域中都可用：

```nu
scope commands | where type == "plugin"
```

### 插件生命周期

插件在使用时保持运行，并且在一段时间不活动后默认会自动停止。此行为由[插件垃圾回收器](#plugin-garbage-collector)管理。要手动停止插件，请使用其名称调用 `plugin stop`：

例如，从相应的插件运行 `gstat` 命令，然后检查其 `is_running` 状态：

```nu
gstat
# => gstat output
plugin list | where name == gstat | select name is_running
# =>
╭───┬───────┬────────────╮
│ # │ name  │ is_running │
├───┼───────┼────────────┤
│ 0 │ gstat │ true       │
╰───┴───────┴────────────╯
```

现在手动停止插件，我们可以看到它不再运行：

```nu
plugin stop gstat
plugin list | where name == gstat | select name is_running
# =>
╭───┬───────┬────────────╮
│ # │ name  │ is_running │
├───┼───────┼────────────┤
│ 0 │ gstat │ false      │
╰───┴───────┴────────────╯
```

### 插件垃圾回收器

如上所述，Nu 带有一个插件垃圾回收器，它会在一段时间（默认为 10 秒）不活动后自动停止未使用的插件。此行为是完全可配置的：

```nu
$env.config.plugin_gc = {
    # 未另行指定的插件的设置：
    default: {
        enabled: true # 设置为 false 以永不自动停止插件
        stop_after: 10sec # 插件不活动后等待多长时间才停止它
    }
    # 特定插件的设置，按插件名称
    # （即你在 `plugin list` 中看到的名称）：
    plugins: {
        gstat: {
            stop_after: 1min
        }
        inc: {
            stop_after: 0sec # 尽快停止
        }
        example: {
            enabled: false # 永不自动停止
        }
    }
}
```

有关何时认为插件处于活动状态的信息，请参阅[贡献者手册中的相关部分](/zh-CN/contributor-book/plugins.html#plugin-garbage-collection)。

## 移除插件

要移除插件，请调用 `plugin rm <plugin_name>`。请注意，这是插件名称，而不是文件名。例如，如果你之前添加了插件 `~/.cargo/bin/nu_plugin_gstat`，其名称将是 `gstat`。要移除它：

```nu
plugin rm gstat
```

你可以通过运行 `plugin list` 来确认插件的名称。

运行 `plugin rm` 会从注册表中删除插件，以便下次启动 Nushell 时不会加载它。但是，由插件创建的任何命令在当前 Nushell 会话结束之前仍保留在作用域中。

## 插件开发者

Nu 插件是可执行文件；Nu 在需要时启动它们，并通过 [stdin 和 stdout](https://en.wikipedia.org/wiki/Standard_streams) 或[本地套接字](https://en.wikipedia.org/wiki/Inter-process_communication)与它们通信。Nu 插件可以使用 [JSON](https://www.json.org/) 或 [MessagePack](https://msgpack.org/) 作为其通信编码。

### 示例

Nu 的主仓库包含一些插件的例子，这些例子对学习插件协议的工作方式很有帮助：

- [Rust](https://github.com/nushell/nushell/tree/main/crates/nu_plugin_example)
- [Python](https://github.com/nushell/nushell/blob/main/crates/nu_plugin_python)

### 调试

调试插件的最简单方法是打印到 stderr；插件的标准错误流会通过 Nu 重定向并显示给用户。

#### 跟踪

Nu 插件协议消息流可以使用 [trace_nu_plugin](https://crates.io/crates/trace_nu_plugin/) 进行捕获以用于诊断目的。

::: warning
只要插件与跟踪包装器一起安装，跟踪输出就会累积。可能会产生大文件。完成跟踪后，请务必使用 `plugin rm` 删除插件，并在没有跟踪包装器的情况下重新安装。\*\*
:::

### 开发者帮助

Nu 的插件文档尚在撰写中，如果你对某件事情不确定 [Nu Discord](https://discord.gg/NtAbbGn)上的 #plugins 频道是一个提问的好地方!

### 更多细节

[贡献者手册中的插件章节](/zh-CN/contributor-book/plugins.md)从软件开发人员的角度提供了有关插件工作原理的更多细节。
