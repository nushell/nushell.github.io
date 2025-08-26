# 标准库 (预览版)

Nushell 内置了一个用原生 Nu 编写的有用命令的标准库。默认情况下，标准库会在 Nushell 启动时加载到内存中(但不会自动导入)。

[[toc]]

## 概述

标准库目前包含：

- 断言
- 支持补全的替代 `help` 系统
- 额外的 JSON 变体格式
- XML 访问
- 日志记录
- 以及其他功能

要查看标准库中所有可用命令的完整列表，可以运行以下命令：

```nu
nu -c "
  use std
  scope commands
  | where name =~ '^std '
  | select name description extra_description
  | wrap 'Standard Library Commands'
  | table -e
"
```

::: note
上面的 `use std` 命令会加载整个标准库，以便一次性查看所有命令。这通常不是标准的使用方式(更多信息见下文)。该命令在一个单独的 Nu 子 shell 中运行，这样就不会加载到你正在使用的 shell 作用域中。
:::

## 导入标准库

标准库模块和子模块可以通过 [`use`](/commands/docs/use.md) 命令导入，就像其他模块一样。更多信息请参考[使用模块](./modules/using_modules.md)。

在命令行工作时，使用以下方式加载整个标准库会很方便：

```nu
use std *
```

但是，在自定义命令和脚本中应避免这种形式，因为它的加载时间最长。

::: important 使用标准库时的优化启动
请参阅[下面的说明](#optimal-startup)以确保你的配置不会加载整个标准库。
:::

### 导入子模块

标准库的每个子模块都可以单独加载。再次强调，_为了获得最佳性能，只加载代码中需要的子模块_。

关于使用模块的一般信息，请参阅[导入模块](./modules/using_modules.md#importing-modules)。下面是标准库各子模块的推荐导入方式：

#### 1. 使用 `<command> <subcommand>` 形式的子模块

这些子模块通常使用 `use std/<submodule>` 导入(不带通配符/`*`)：

- `use std/assert`: `assert` 及其子命令
- `use std/bench`: 基准测试命令 `bench`
- `use std/dirs`: 目录栈命令 `dirs` 及其子命令
- `use std/input`: `input display` 命令
- `use std/help`: 支持补全和其他功能的替代版 `help` 命令及其子命令
- `use std/iters`: 额外的 `iters` 前缀迭代命令
- `use std/log`: `log <subcommands>` 如 `log warning <msg>`
- `use std/math`: 数学常量如 `$math.E`。这些也可以像下面的形式 #2 那样作为定义导入

#### 2. 直接导入模块的定义(内容)

有些子模块在将其定义(命令、别名、常量等)加载到当前作用域时更容易使用。例如：

```nu
use std/formats *
ls | to jsonl
```

通常使用 `use std/<submodule> *` (**带**通配符/`*`)导入的子模块：

- `use std/dt *`: 处理 `date` 值的额外命令
- `use std/formats *`: 额外的 `to` 和 `from` 格式转换
- `use std/math *`: 不带前缀的数学常量，如 `$E`。注意上面的形式 #1 在阅读和维护代码时可能更易理解
- `use std/xml *`: 处理 XML 数据的额外命令

#### 3. `use std <submodule>`

也可以使用空格分隔的形式导入标准库子模块：

```nu
use std log
use std formats *
```

::: important
如[使用模块](./modules/using_modules.md#module-definitions)中所述，这种形式(像 `use std *` 一样)会先将整个标准库加载到作用域中，然后再导入子模块。相比之下，上面的 #1 和 #2 中的斜杠分隔版本只会导入子模块，因此会快得多。
:::

## 标准库候选模块

`std-rfc` 位于 [nushell 仓库](https://github.com/nushell/nushell/tree/main/crates/nu-std/std-rfc)，作为标准库可能的添加项的暂存区。

如果你有兴趣为标准库添加内容，请通过 PR 提交代码到该仓库的 `std-rfc` 模块。我们也鼓励你安装这个模块并对即将成为候选的命令提供反馈。

::: details 更多详情

标准库的候选命令通常应该：

- 具有广泛的吸引力 - 对大量用户或用例有用
- 编写良好并有清晰的注释，便于未来维护
- 实现带有使用示例的帮助注释
- 包含说明为什么你认为该命令应该成为标准库的一部分。可以将其视为一种"广告"，说服人们尝试该命令并提供反馈，以便将来可以推广

为了使一个命令从 RFC 升级为标准库，它必须满足：

- 获得积极反馈
- 几乎没有(或没有)未解决的问题，当然也没有重大问题
- 有提交 `std` 的 PR 作者。这不一定是命令的原始作者
- 作为 `std` 提交 PR 的一部分包含测试用例

最终，核心团队成员将根据这些标准决定是否以及何时将命令合并到 `std` 中。

当然，如果 `std-rfc` 中的候选命令不再工作或有太多问题，可能会从中移除或禁用。

:::

## 禁用标准库

要禁用标准库，可以这样启动 Nushell：

```nu
nu --no-std-lib
```

在使用 `nu -c` 在子 shell 中运行命令时，这尤其有助于最小化开销。例如：

```nu
nu --no-std-lib -n -c "$nu.startup-time"
# => 1ms 125µs 10ns

nu -n -c "$nu.startup-time"
# => 4ms 889µs 576ns
```

当以这种方式禁用时，你将无法导入标准库、它的任何子模块或使用它的任何命令。

## 在模块中使用 `std/log`

::: warning 重要！
`std/log` 会导出环境变量。要在你自己的模块中使用 `std/log` 模块，请参阅"创建模块"章节中的[这个注意事项](./modules/creating_modules.md#export-env-runs-only-when-the-use-call-is-evaluated)。

:::

## 优化启动时间

如果 Nushell 的启动时间对你的工作流程很重要，请检查 `config.nu`、`env.nu` 和其他可能的[启动配置]([./configuration.md])中对标准库的低效使用。以下命令可以帮助识别问题区域：

```nu
view files
| enumerate | flatten
| where filename !~ '^std'
| where filename !~ '^entry'
| where {|file|
    (view span $file.start $file.end) =~ 'use\W+std[^\/]'
  }
```

编辑这些文件，使用上面[导入子模块](#importing-submodules)部分推荐的语法。

::: note
如果 Nushell 库(例如来自 [nu_scripts 仓库](https://github.com/nushell/nu_scripts))、示例或文档使用了这种语法，请通过 issue 或 PR 报告。在 Nushell 0.99.0 发布后，这些将会逐步更新。

如果第三方模块使用了这种语法，请报告给作者/维护者进行更新。
:::
