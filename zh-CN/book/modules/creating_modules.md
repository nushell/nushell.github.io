# 创建模块

[[toc]]

::: important
在下面的示例中工作时，建议在导入每个模块或命令的更新版本之前启动一个新的 shell。这将有助于减少由先前导入的定义引起的任何混淆。
:::

## 概述

模块（以及将在下面介绍的子模块）可以通过两种方式创建：

- 最常见的是，通过创建一个包含一系列 `export` 语句的文件来导出要从模块导出的定义。
- 对于模块内的子模块，使用 `module` 命令

::: tip
虽然可以使用 `module` 命令直接在命令行中创建模块，但将模块定义存储在文件中以供重用更有用且更常见。
:::

模块文件可以是：

- 名为 `mod.nu` 的文件，在这种情况下，其*目录*成为模块名
- 任何其他 `<module_name>.nu` 文件，在这种情况下，文件名成为模块名

### 简单模块示例

创建一个名为 `inc.nu` 的文件，内容如下：

```nu
export def increment []: int -> int  {
    $in + 1
}
```

哈！这是一个模块！我们现在可以导入它并使用 `increment` 命令：

```nu
use inc.nu *
5 | increment
# => 6
```

当然，您可以轻松地分发这样的文件，以便其他人也可以使用该模块。

## 导出

我们在上面的模块概述中简要介绍了模块中可用的定义类型。虽然这对于最终用户来说可能已经足够了，但模块作者需要知道*如何*为以下内容创建导出定义：

- 命令 ([`export def`](/commands/docs/export_def.md))
- 别名 ([`export alias`](/commands/docs/export_alias.md))
- 常量 ([`export const`](/commands/docs/export_const.md))
- 已知外部命令 ([`export extern`](/commands/docs/export_extern.md))
- 子模块 ([`export module`](/commands/docs/export_module.md))
- 从其他模块导入的符号 ([`export use`](/commands/docs/export_use.md))
- 环境设置 ([`export-env`](/commands/docs/export-env.md))

::: tip
只有标记为 `export`（或环境变量的 `export-env`）的定义在导入模块时才可访问。未标记为 `export` 的定义仅在模块内部可见。在某些语言中，这些被称为"私有"或"本地"定义。下面的[附加示例](#local-definitions)中有一个示例。
:::

### `main` 导出

::: important
导出不能与模块本身的名称相同。
:::

在上面的[基本示例](#basic-module-example)中，我们有一个名为 `inc` 的模块，其中有一个名为 `increment` 的命令。但是，如果我们将该文件重命名为 `increment.nu`，它将无法导入。

```nu
mv inc.nu increment.nu
use increment.nu *
# => Error: nu::parser::named_as_module
# => ...
# => help: Module increment can't export command named
# => the same as the module. Either change the module
# => name, or export `main` command.
```

就像错误消息中提到的那样，您可以简单地将导出重命名为 `main`，在这种情况下，导入时将采用模块的名称。编辑 `increment.nu` 文件：

```nu
export def main []: int -> int {
    $in + 1
}
```

现在它按预期工作：

```nu
use ./increment.nu
2024 | increment
# => 2025
```

::: note
`main` 可以用于 `export def` 和 `export extern` 定义。
:::

::: tip
在以下情况下导入 `main` 定义：

- 使用 `use <module>` 或 `use <module.nu>` 导入整个模块
- 使用 `*` 通配符导入模块的所有定义（例如，`use <module> *` 等）
- 使用 `use <module> main`、`use <module> [main]` 等显式导入 `main` 定义

相反，以下形式*不*导入 `main` 定义：

```nu
use <module> <other_definition>
# or
use <module> [ <other_definitions> ]
```

:::

::: note
此外，无论是否导出，`main` 在脚本文件中都有特殊行为。有关更多详细信息，请参见[脚本](../scripts.html#parameterizing-scripts)章节。
:::

## 模块文件

如上概述中简要提到的，模块可以通过以下两种方式创建：

1. `<module_name>.nu`："文件形式" - 适用于简单模块
2. `<module_name>/mod.nu`："目录形式" - 适用于组织更大的模块项目，其中子模块可以轻松映射到主模块的子目录

上面的 `increment.nu` 示例显然是（1）文件形式的示例。让我们尝试将其转换为目录形式：

```nu
mkdir increment
mv increment.nu increment/mod.nu

use increment *
41 | increment
# => 42
```

请注意，一旦导入，无论使用文件形式还是目录形式，模块的行为都是相同的；只有其路径发生了变化。

::: note
从技术上讲，您可以使用目录形式或显式使用 `use increment/mod.nu *` 来导入它，但在使用 `mod.nu` 时首选目录简写。
:::

## 子命令

如[自定义命令](../custom_commands.md)中所述，子命令允许我们逻辑地分组命令。使用模块，可以通过两种方式完成此操作：

1. 与任何自定义命令一样，命令可以定义为 `"<command> <subcommand>"`，在引号内使用空格。让我们在上面的 `increment` 模块中添加一个 `increment by` 子命令：

```nu
export def main []: int -> int {
    $in + 1
}

export def "increment by" [amount: int]: int -> int {
    $in + $amount
}
```

然后可以使用 `use increment *` 导入它来加载 `increment` 命令和 `increment by` 子命令。

2. 或者，我们可以简单地使用名称 `by` 来定义子命令，因为导入整个 `increment` 模块将导致相同的命令：

```nu
export def main []: int -> int {
    $in + 1
}

export def by [amount: int]: int -> int {
    $in + $amount
}
```

此模块使用 `use increment`（不带通配符 `*`）导入，并产生相同的 `increment` 命令和 `increment by` 子命令。

::: note
我们将在下面的示例中继续使用此版本，因此请注意导入模式已更改为 `use increment`（而不是 `use increment *`）。
:::

## 子模块

子模块是从另一个模块导出的模块。有两种方法可以将子模块添加到模块中：

1. 使用 `export module`：导出（a）子模块和（b）其子模块的成员
2. 使用 `export use`：导出（a）子模块和（b）其父模块的成员

为了演示差异，让我们创建一个新的 `my-utils` 模块，并将我们的 `increment` 示例作为子模块。此外，我们将在其自己的子模块中创建一个新的 `range-into-list` 命令。

1. 为新 `my-utils` 创建目录，并将 `increment.nu` 移入其中

   ```nu
   mkdir my-utils
   # 根据需要调整以下内容
   mv increment/mod.nu my-utils/increment.nu
   rm increment
   cd my-utils
   ```

2. 在 `my-utils` 目录中，创建一个包含以下内容的 `range-into-list.nu` 文件：

   ```nu
   export def main []: range -> list {
       # 看起来有点奇怪，是的，但以下内容只是
       # 将范围转换为列表的简单方法
       each {||}
   }
   ```

3. 测试它：

```nu
use range-into-list.nu
1..5 | range-into-list | describe
# => list<int> (stream)
```

4. 我们现在应该有一个包含以下内容的 `my-utils` 目录：

   - `increment.nu` 模块
   - `range-into-list.nu` 模块

以下示例展示了如何创建带有子模块的模块。

### 示例：使用 `export module` 的子模块

子模块定义的最常见形式是使用 `export module`。

1. 创建一个名为 `my-utils` 的新模块。由于我们在 `my-utils` 目录中，我们将创建一个 `mod.nu` 来定义它。此版本的 `my-utils/mod.nu` 将包含：

   ```nu
   export module ./increment.nu
   export module ./range-into-list.nu
   ```

2. 我们现在有一个带有两个子模块的 `my-utils` 模块。试试看：

```nu
# 转到 my-utils 的父目录
cd ..
use my-utils *
5 | increment by 4
# => 9

let file_indices = 0..2..<10 | range-into-list
ls | select ...$file_indices
# => Returns the 1st, 3rd, 5th, 7th, and 9th file in the directory
```

在继续下一节之前，运行 `scope modules` 并查找 `my-utils` 模块。请注意，它本身没有命令；只有两个子模块。

### 示例：使用 `export use` 的子模块

或者，我们可以（重新）导出其他模块的*定义*。这与第一种形式略有不同，因为 `increment` 和 `range-into-list` 的命令（以及其他定义，如果存在）成为 `my-utils` 模块本身的成员。我们将能够在 `scope modules` 命令的输出中看到差异。

让我们将 `my-utils/mod.nu` 更改为：

```nu
export use ./increment.nu
export use ./range-into-list.nu
```

使用与上面相同的命令进行尝试：

```nu
# 转到 my-utils 的父目录
cd ..
use my-utils *
5 | increment by 4
# => 9

let file_indices = 0..2..<10 | range-into-list
ls / | sort-by modified | select ...$file_indices
# => Returns the 1st, 3rd, 5th, 7th, and 9th file in the directory, oldest-to-newest
```

再次运行 `scope modules`，请注意子模块的所有命令都重新导出到 `my-utils` 模块中。

::: tip
虽然 `export module` 是推荐且最常见的形式，但在一种模块设计场景中需要 `export use` - `export use` 可用于*选择性导出*子模块中的定义，而 `export module` 无法做到这一点。有关示例，请参见[附加示例 - 子模块的选择性导出](#selective-export-from-a-submodule)。
:::

::: note
没有 `export` 的 `module` 只定义本地模块；它不导出子模块。
:::

## 记录模块文档

与[自定义命令](../custom_commands.md#documenting-your-command)一样，模块可以包含文档，可以使用 `help <module_name>` 查看。文档只是模块文件开头的一系列注释行。让我们记录 `my-utils` 模块：

```nu
# 一组有用的实用函数

export use ./increment.nu
export use ./range-into-list.nu
```

现在查看帮助：

```nu
use my-utils *
help my-utils

# => A collection of helpful utility functions
```

另请注意，由于 `increment` 和 `range-into-list` 的命令使用 `export use ...` 重新导出，这些命令也显示在主模块的帮助中。

## 环境变量

模块可以使用 [`export-env`](/commands/docs/export-env.md) 定义环境。让我们用上面定义的 `$env.NU_MODULES_DIR` 的常见目录扩展我们的 `my-utils` 模块，我们将在未来放置我们的模块。此目录默认位于[使用模块 - 模块路径](./using_modules.md#module-path)中讨论的 `$env.NU_LIB_DIRS` 搜索路径中。

```nu
# 一组有用的实用函数

export use ./increment.nu
export use ./range-into-list.nu

export-env {
    $env.NU_MODULES_DIR = ($nu.default-config-dir | path join "scripts")
}
```

当使用 `use` 导入此模块时，[`export-env`](/commands/docs/export-env.md) 块内的代码将运行，其环境将合并到当前作用域中：

```nu
use my-utils
$env.NU_MODULES_DIR
# => Returns the directory name
cd $env.NU_MODULES_DIR
```

::: tip
与任何没有 `--env` 定义的命令一样，模块中的命令和其他定义使用它们自己的环境作用域。这允许在模块内部进行更改，而不会泄漏到用户的作用域中。在 `my-utils/mod.nu` 的底部添加以下内容：

```nu
export def examine-config-dir [] {
    # 更改 PWD 环境变量
    cd $nu.default-config-dir
    ls
}
```

运行此命令会在模块中*本地*更改目录，但更改不会传播到父作用域。

:::

## 注意事项

### `export-env` 仅在 `use` 调用被*求值*时运行

::: note
这种情况通常在创建使用 `std/log` 的模块时遇到。
:::

在另一个环境中导入模块的环境可能无法按预期工作。让我们创建一个名为 `go.nu` 的新模块，该模块创建到常见目录的"快捷方式"。其中之一将是上面在 `my-utils` 中定义的 `$env.NU_MODULES_DIR`。

我们可能会尝试：

```nu
# go.nu，在 my-utils 的父目录中
use my-utils

export def --env home [] {
    cd ~
}

export def --env modules [] {
    cd $env.NU_MODULES_DIR
}
```

然后导入它：

```nu
use go.nu
go home
# => Works
go modules
# => Error: $env.NU_MODULES_DIR is not found
```

这不起作用，因为在这种情况下的 `my-utils` 没有被*求值*；它仅在导入 `go.nu` 模块时被*解析*。虽然这会将所有其他导出带入作用域，但它不会*运行* `export-env` 块。

::: important
如本章开头所提到的，在 `my-utils`（及其 `$env.NU_MODULES_DIR`）仍然从先前的导入中在作用域内时尝试此操作将不会像预期的那样失败。在新的 shell 会话中进行测试以查看"正常"失败。
:::

为了将 `my-utils` 导出的环境带入 `go.nu` 模块的作用域，有两个选项：

1. 在每个需要它的命令中导入模块

   通过将 `use my-utils` 放在 `go home` 命令本身中，当命令运行时，其 `export-env` 将被*求值*。例如：

   ```nu
   # go.nu
   export def --env home [] {
       cd ~
   }

   export def --env modules [] {
       use my-utils
       cd $env.NU_MODULES_DIR
   }
   ```

2. 在 `go.nu` 模块的 `export-env` 块中导入 `my-utils` 环境

   ```nu
   use my-utils
   export-env {
       use my-utils []
   }

   export def --env home [] {
       cd ~
   }

   export def --env modules [] {
       cd $env.NU_MODULES_DIR
   }
   ```

   在上面的示例中，`go.nu` 两次导入 `my-utils`：

   1. 第一个 `use my-utils` 将模块及其定义（环境除外）导入模块作用域。
   2. 第二个 `use my-utils []` 除了环境外不导入任何内容到 `go.nu` 的导出环境块中。由于 `go.nu` 的 `export-env` 在首次导入模块时执行，因此 `use my-utils []` 也被求值。

请注意，第一种方法将 `my-utils` 环境保留在 `go.nu` 模块的作用域内。另一方面，第二种方法将 `my-utils` 环境重新导出到用户作用域中。

### 模块文件和命令不能以父模块命名

`.nu` 文件不能与其模块目录同名（例如，`spam/spam.nu`），因为这会创建名称被定义两次的歧义条件。这与上面描述的命令不能与其父级同名的情况类似。

## Windows 路径语法

::: important
Windows 上的 Nushell 支持正斜杠和反斜杠作为路径分隔符。但是，为了确保它们在所有平台上都能工作，强烈建议仅在模块中使用正斜杠 `/`。
:::

## 附加示例

### 本地定义

如上所述，没有 [`export`](/commands/docs/export.md) 关键字的模块中的定义仅在模块的作用域内可访问。

为了演示，创建一个新的模块 `is-alphanumeric.nu`。在此模块中，我们将创建一个 `str is-alphanumeric` 命令。如果字符串中的任何字符不是字母数字，则返回 `false`：

```nu
# is-alphanumeric.nu
def alpha-num-range [] {
    [
        ...(seq char 'a' 'z')
        ...(seq char 'A' 'Z')
        ...(seq 0 9 | each { into string })
    ]
}

export def "str is-alphanumeric" []: string -> bool {
    if ($in == '') {
        false
    } else {
        let chars = (split chars)
        $chars | all {|char| $char in (alpha-num-range)}
    }
}
```

请注意，此模块中有两个定义 -- `alpha-num-range` 和 `str is-alphanumeric`，但只有第二个被导出。

```nu
use is-alphanumeric.nu *
'Word' | str is-alphanumeric
# => true
'Some punctuation?!' | str is-alphanumeric
# => false
'a' in (alpha-num-range)
# => Error:
# => help: `alpha-num-range` is neither a Nushell built-in or a known external command
```

### 子模块的选择性导出

::: note
虽然以下是一个罕见的用例，但此技术被标准库用于
分别使 `dirs` 命令及其别名可用。
:::

如上[子模块](#submodules)部分所述，只有 `export use` 可以从子模块中选择性导出定义。

为了演示，让我们将上面[注意事项](#caveats)中的 `go.nu` 模块示例的修改形式添加到 `my-utils`：

```nu
# go.nu，在 my-utils 目录中
export def --env home [] {
    cd ~
}

export def --env modules [] {
    cd ($nu.default-config-dir | path join "scripts")
}

export alias h = home
export alias m = modules
```

此 `go.nu` 包括以下来自原始版本的更改：

- 它不依赖于 `my-utils` 模块，因为它现在将是 `my-utils` 的子模块
- 它添加了"快捷方式"别名：
  `h`：转到主目录（`go home` 的别名）
  `m`：转到模块目录（`go modules` 的别名）

用户可以使用以下方式*仅*导入别名：

```nu
use my-utils/go.nu [h, m]
```

但是，假设我们希望 `go.nu` 成为 `my-utils` 的子模块。当用户导入 `my-utils` 时，他们应该*仅*获得命令，而不是别名。编辑 `my-utils/mod.nu` 并添加：

```nu
export use ./go.nu [home, modules]
```

这*几乎*有效 - 它选择性地导出 `home` 和 `modules`，但不导出别名。但是，它这样做时没有 `go` 前缀。例如：

```nu
use my-utils *
home
# => works
go home
# => Error: command not found
```

要将它们导出为 `go home` 和 `go modules`，请对 `my-utils/mod.nu` 进行以下更改：

```nu
# 将现有的 `export use` 替换为...
export module go {
    export use ./go.nu [home, modules]
}
```

这在 `my-utils` 中创建了一个新的导出子模块 `go`，其中包含 `go home` 和 `go modules` 的选择性（重新）导出定义。

```nu
use my-utils *
# => 如预期：
go home
# => works
home
# => Error: command not found
```
