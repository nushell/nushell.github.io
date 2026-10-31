# 创建模块

[[toc]]

:::: important
在演练下面的示例时，请在导入每个模块或命令的更新版本之前启动一个新的 shell。这有助于减少此前导入的定义造成的混淆。对于目录形式的模块（`mod.nu` 文件）这也是必需的：在同一个 shell 会话中，Nushell 会一直使用它首次导入的那个模块版本，即使你修改了它的文件。
::::

## 概述

模块（以及下面要讲的子模块）可以用两种方式之一创建：

- 最常见的是创建一个文件，其中包含一系列 `export` 语句，用来声明要从模块导出的定义。
- 对于模块内部的子模块，使用 `module` 命令

:::: tip
虽然可以用 `module` 命令直接在命令行创建模块，但把模块定义存放在文件中以便复用，要有用得多，也常见得多。
::::

模块文件可以是：

- 名为 `mod.nu` 的文件，此时它的**目录**成为模块名
- 任何其他的 `<模块名>.nu` 文件，此时文件名成为模块名

### 简单模块示例

创建一个名为 `inc.nu` 的文件，内容如下：

```nu
export def increment []: int -> int  {
    $in + 1
}
```

这就是一个模块！我们现在可以导入它并使用 `increment` 命令：

```nu
use inc.nu *
5 | increment
# => 6
```

当然，你可以很容易地把这样的文件分发给别人，让他们也能使用这个模块。

## 导出

我们在上面的"模块概述"里简单介绍过模块中可用的定义类型。对终端用户来说这些解释也许已经够用，但模块作者还需要知道**如何**为以下定义创建导出：

- 命令（[`export def`](/commands/docs/export_def.md)）
- 别名（[`export alias`](/commands/docs/export_alias.md)）
- 常量（[`export const`](/commands/docs/export_const.md)）
- 类型别名（[`export type`](/commands/docs/export_type.md)）
- 已知外部命令（[`export extern`](/commands/docs/export_extern.md)）
- 子模块（[`export module`](/commands/docs/export_module.md)）
- 从其他模块导入的符号（[`export use`](/commands/docs/export_use.md)）
- 环境设置（[`export-env`](/commands/docs/export-env.md)）

:::: tip
模块被导入时，只有带 `export` 标记的定义（环境变量则是 `export-env`）才可访问。没有带 `export` 标记的定义只在模块内部可见。在某些语言里，这些会被称为"私有"或"局部"定义。相关示例见下面的[局部定义](#局部定义)。
::::

### `main` 导出

:::: important
导出项不能与模块本身的名称相同。
::::

在上面的[基础示例](#简单模块示例)中，我们有一个名为 `inc` 的模块，里面有一个名为 `increment` 的命令。然而，如果我们把那个文件改名为 `increment.nu`，导入就会失败。

```nu
mv inc.nu increment.nu
```

```nu
use increment.nu *
# => Error: nu::parser::named_as_module
# =>
# =>   × Can't export command named same as the module.
# =>    ╭─[/home/me/modules/increment.nu:1:12]
# =>  1 │ export def increment []: int -> int  {
# =>    ·            ────┬────
# =>    ·                ╰── can't export from module increment
# =>  2 │     $in + 1
# =>    ╰────
# =>   help: Module increment can't export command named the same as the module. Either change the module name, or export `main` command.
```

正如错误信息贴心提示的那样，你只需把导出改名为 `main`，这样它在被导入时就会使用模块的名字。编辑 `increment.nu` 文件：

```nu
export def main []: int -> int {
    $in + 1
}
```

现在它按预期工作了：

```nu
use ./increment.nu
2024 | increment
# => 2025
```

:::: note
`main` 可用于 `export def` 和 `export extern` 两种定义。
::::

:::: tip
`main` 定义在以下情况下会被导入：

- 用 `use <模块>` 或 `use <模块.nu>` 导入整个模块
- 用 `*` 通配符导入模块的全部定义（如 `use <模块> *` 等）
- 用 `use <模块> main`、`use <模块> [main]` 等显式导入 `main` 定义

反过来，以下形式**不会**导入 `main` 定义：

```nu
use <module> <other_definition>
# 或
use <module> [ <other_definitions> ]
```

::::

:::: note
此外，无论是否导出，`main` 在脚本文件中都有特殊行为。详见[脚本](../scripts.md#参数化脚本)章节。
::::

## 模块文件

正如上面概述中简单提到的，模块可以创建为两种形式之一：

1. `<模块名>.nu`："文件形式" - 适用于简单模块
2. `<模块名>/mod.nu`："目录形式" - 适用于组织较大的模块项目，此时子模块可以很自然地映射到主模块的子目录

上面的 `increment.nu` 示例显然是第 (1) 种文件形式。我们试着把它转换成目录形式：

```nu
mkdir increment
mv increment.nu increment/mod.nu
```

```nu
use increment *
41 | increment
# => 42
```

注意，模块被导入后的行为与使用文件形式还是目录形式无关，只有它的路径会变。

:::: note
严格来说，你既可以用上面的目录形式导入，也可以显式地用 `use increment/mod.nu *` 导入，但在使用 `mod.nu` 时更推荐目录简写形式。
::::

## 子命令

正如[自定义命令](../custom_commands.md)中所讲，子命令让我们可以对命令进行逻辑分组。使用模块时，有两种方式可以做到：

1. 和任何自定义命令一样，可以把命令定义为 `"<命令> <子命令>"`，即在引号内使用空格。我们给上面定义的 `increment` 模块添加一个 `increment by` 子命令：

```nu
export def main []: int -> int {
    $in + 1
}

export def "increment by" [amount: int]: int -> int {
    $in + $amount
}
```

然后可以用 `use increment *` 导入，从而同时加载 `increment` 命令和 `increment by` 子命令。

2. 或者，我们也可以简单地用名称 `by` 来定义这个子命令，因为导入整个 `increment` 模块会得到同样的命令：

```nu
export def main []: int -> int {
    $in + 1
}

export def by [amount: int]: int -> int {
    $in + $amount
}
```

这个模块用 `use increment`（不带通配符 `*`）导入，得到的同样是 `increment` 命令和 `increment by` 子命令。

:::: note
下面的示例将继续使用这个版本，所以请注意下面的导入模式已经改为 `use increment`（而不是 `use increment *`）。
::::

## 子模块

子模块是从另一个模块导出的模块。有两种方式可以把子模块添加到模块中：

1. 用 `export module`：导出 (a) 子模块和 (b) 它的定义，作为该子模块的成员
2. 用 `export use`：导出 (a) 子模块和 (b) 它的定义，作为父模块的成员

:::: important
当用户用 `use <模块>`（不带 `*`）导入整个模块时，这个区别就很重要。这种形式只导入模块自身的成员，因此它包含用 `export use` 添加的定义，但**不**包含用 `export module` 添加的子模块的命令。（在 Nushell 0.114 之前，`use <模块>` 也会导入它们。）用户需要通过 `use <模块> *`、`use <模块> <子模块>` 或 `use <模块> [<子模块> ...]` 显式导入子模块来获取它们。参见[使用模块 - 子模块](./using_modules.md#子模块)。
::::

为了演示这个区别，我们来创建一个新的 `my-utils` 模块，把我们上面的 `increment` 示例作为它的子模块。此外，我们还会在它自己的子模块里创建一个新的 `range-into-list` 命令。

1. 为新的 `my-utils` 创建一个目录，并把 `increment.nu` 移进去

   ```nu
   mkdir my-utils
   # 根据需要调整下面这行
   mv increment/mod.nu my-utils/increment.nu
   rm increment
   cd my-utils
   ```

2. 在 `my-utils` 目录中，创建一个包含以下内容的 `range-into-list.nu` 文件：

   ```nu
   export def main []: range -> list {
       # 看起来是有点怪，但下面只是
       # 把区间转换成列表的一种简单写法
       each {||}
   }
   ```

3. 测试一下：

   ```nu
   use range-into-list.nu
   1..5 | range-into-list | describe
   # => list<int> (stream)
   ```

4. 现在我们应该有一个 `my-utils` 目录，其中包含：

   - `increment.nu` 模块
   - `range-into-list.nu` 模块

下面的示例展示如何创建带有子模块的模块。

### 示例：使用 `export module` 的子模块

子模块最常见的定义形式是使用 `export module`。

1. 创建一个名为 `my-utils` 的新模块。因为我们在 `my-utils` 目录中，所以我们会创建一个 `mod.nu` 来定义它。这个版本的 `my-utils/mod.nu` 将包含：

   ```nu
   export module ./increment.nu
   export module ./range-into-list.nu
   ```

2. 现在我们有了一个带两个子模块的 `my-utils` 模块。转到 `my-utils` 的父目录：

   ```nu
   cd ..
   ```

   然后试一下：

   ```nu
   use my-utils *
   5 | increment by 4
   # => 9

   let file_indices = 0..2..<10 | range-into-list
   ls | select ...$file_indices
   # 返回目录中的第 1、3、5、7、9 个文件
   ```

   注意那个 `*`。没有它，`use my-utils` 将什么都不会导入，因为 `my-utils` 里的所有东西都在它两个子模块之一中。`use my-utils increment` 只会导入 `increment` 子模块（`increment` 和 `increment by`）。

在继续下一节之前，运行 `scope modules` 并找找 `my-utils` 模块。注意它自己没有任何命令，只有两个子模块。

### 示例：使用 `export use` 的子模块

或者，我们也可以（重新）导出其他模块中的**定义**。这与第一种形式略有不同：`increment` 和 `range-into-list` 中的命令（以及其他定义，如果有的话）会成为 `my-utils` 模块自身的**成员**。我们可以通过 `scope modules` 命令的输出看到这个区别。

我们把 `my-utils/mod.nu` 改成：

```nu
export use ./increment.nu
export use ./range-into-list.nu
```

在 `my-utils` 的父目录中启动一个新 shell（参见本章开头的提示），然后用与上面相同的命令试一下：

```nu
use my-utils *
5 | increment by 4
# => 9

let file_indices = 0..2..<10 | range-into-list
ls / | sort-by modified | select ...$file_indices
# 返回根目录中的第 1、3、5、7、9 个文件，按修改时间从旧到新
```

再次运行 `scope modules`，注意子模块的所有命令都被重新导出到 `my-utils` 模块中。

因为这些命令现在是 `my-utils` 自身的成员，所以不带 `*` 导入该模块也可以。此时这些命令会成为 `my-utils` 的子命令：

```nu
use my-utils
5 | my-utils increment by 4
# => 9
```

:::: tip
虽然 `export module` 是推荐且最常见的形式，但有一种模块设计场景必须使用 `export use` —— `export use` 可以**选择性地导出**子模块中的定义，而 `export module` 做不到。示例参见[附加示例 - 选择性导出](#从子模块选择性导出)。
::::

:::: note
不带 `export` 的 `module` 只定义一个局部模块，它不会导出子模块。
::::

## 为模块编写文档

与[自定义命令](../custom_commands.md#为你的命令添加文档)一样，模块可以包含能用 `help <模块名>` 查看的文档。这些文档就是模块文件开头的一系列注释行。我们来为 `my-utils` 模块编写文档：

```nu
# 一些实用的辅助函数集合

export use ./increment.nu
export use ./range-into-list.nu
```

现在，在一个新 shell 中查看帮助：

```nu
use my-utils *
help my-utils
# => A collection of helpful utility functions
# =>
# => Module: my-utils
# =>
# => Exported commands:
# =>   increment, increment by, range-into-list
# =>
# => Exported aliases:
# =>
# =>
# => This module does not export environment.
```

另外注意，因为 `increment` 和 `range-into-list` 中的命令是用 `export use ...` 重新导出的，这些命令也会出现在主模块的帮助中。

## 环境变量

模块可以用 [`export-env`](/commands/docs/export-env.md) 定义环境。我们来扩展 `my-utils` 模块，为将来放置模块的一个常用目录导出一个环境变量。这个目录（默认情况下）位于[使用模块 - 模块路径](./using_modules.md#模块路径)中讨论过的 `$NU_LIB_DIRS` 搜索路径中。

```nu
# 一些实用的辅助函数集合

export use ./increment.nu
export use ./range-into-list.nu

export-env {
    $env.NU_MODULES_DIR = ($nu.default-config-dir | path join "scripts")
}
```

当这个模块用 `use` 导入时（同样在一个新 shell 中），[`export-env`](/commands/docs/export-env.md) 代码块中的代码会被运行，其环境会被合并到当前作用域：

```nu
use my-utils
$env.NU_MODULES_DIR
# => /home/me/.config/nushell/scripts
```

:::: tip
和任何不带 `--env` 定义的命令一样，模块中的命令和其他定义都使用它们自己的作用域来存放环境。这使得模块内部的改动不会泄漏到用户的作用域中。把下面这段加到 `my-utils/mod.nu` 的末尾：

```nu
export def examine-config-dir [] {
    # 修改 PWD 环境变量
    cd $nu.default-config-dir
    ls
}
```

运行这个命令会在模块内部**局部地**改变目录，但这些改动不会传播到父作用域。

::::

## 注意事项

### `export-env` 仅在 `use` 调用被求值时运行

:::: note
在创建使用 `std/log` 的模块时，经常会遇到这种情况。
::::

尝试在某个环境内导入另一个模块的环境，可能不会按预期工作。我们来创建一个新的 `go.nu` 模块，它为常用目录创建"快捷方式"。其中之一是上面在 `my-utils` 中定义的 `$env.NU_MODULES_DIR`。

我们可能会这样写：

```nu
# go.nu，位于 my-utils 的父目录
use my-utils

export def --env home [] {
    cd ~
}

export def --env modules [] {
    cd $env.NU_MODULES_DIR
}
```

然后导入它。（第一行会先移除 `$env.NU_MODULES_DIR`，以防它仍然来自上面的示例。）

```nu
hide-env -i NU_MODULES_DIR
use go.nu
go home  # 可用：切换到你的家目录
cd -     # 返回
go modules
# => Error: nu::shell::column_not_found
# =>
# =>   × Cannot find column 'NU_MODULES_DIR'
# =>     ╭─[/home/me/modules/go.nu:9:8]
# =>   8 │ export def --env modules [] {
# =>   9 │     cd $env.NU_MODULES_DIR
# =>     ·        ─────────┬─────────┬
# =>     ·                 │         ╰── value originates here
# =>     ·                 ╰── column 'NU_MODULES_DIR' is missing in one or more values
# =>  10 │ }
# =>     ╰────
# =>   help: If some rows have this column, try using 'NU_MODULES_DIR?' for optional access, or pre-fill using the `default` command
```

这行不通，因为在这种情况下 `my-utils` 并没有被**求值**；它在 `go.nu` 模块被导入时只是被**解析**了。虽然这会把其他导出都带入作用域，但它不会**运行** `export-env` 代码块。

:::: important
正如本章开头提到的，如果 `my-utils`（以及它的 `$env.NU_MODULES_DIR`）仍在上一次导入的作用域中，尝试这样做**不会**按预期失败。这就是为什么上面的示例以 `hide-env` 开头。或者，也可以在一个新的 shell 会话中测试，以看到"正常"的失败。
::::

要把 `my-utils` 导出的环境带入 `go.nu` 模块的作用域，有两种选择：

1. 在需要它的每个命令中导入该模块

   把 `use my-utils` 放在 `go modules` 命令本身中，这样它的 `export-env` 会在该命令被求值时一并被**求值**。例如：

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

2. 在 `go.nu` 模块的 `export-env` 代码块中导入 `my-utils` 的环境

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

   在上面的例子中，`go.nu` 导入了 `my-utils` 两次：

   1. 第一个 `use my-utils` 把模块及其定义（环境除外）导入模块作用域。
   2. 第二个 `use my-utils []` 只把环境导入 `go.nu` 导出的环境代码块。因为 `go.nu` 的 `export-env` 在模块首次导入时就会执行，所以 `use my-utils []` 也会随之被求值。

注意，第一种方法只在 `go modules` 运行时才加载 `my-utils` 的环境。（因为 `go modules` 是用 `--env` 定义的，它设置的环境（包括 `$env.NU_MODULES_DIR`）随后会保留在调用者的作用域中。）而第二种方法则在 `go.nu` 被导入时就立刻把 `my-utils` 的环境重新导出到用户作用域。

### 导出不能与模块同名

模块不能导出其中定义的、与模块本身同名的命令、别名或已知外部命令。对于命令和已知外部命令，请把该定义命名为 `main`，正如上面[`main` 导出](#main-导出)中所讲。同样的限制也适用于按名称声明的子模块，因此在名为 `spam` 的模块中写 `export module spam` 会被拒绝：

```nu
module spam { export module spam { } }
# => Error: nu::parser::named_as_module
# =>
# =>   × Can't export module named same as the module.
# =>    ╭─[repl_entry #1:1:29]
# =>  1 │ module spam { export module spam { } }
# =>    ·                             ──┬─
# =>    ·                               ╰── can't export from module spam
# =>    ╰────
# =>   help: Module spam can't export module named the same as the module. Either change the module name, or export `mod` module.
```

:::: note
`.nu` 文件**可以**与它所在的模块目录同名（例如 `spam/spam.nu`），Nushell 会导入它。不过还是建议使用不同的名字：如果父模块和同名的子模块都导出一个 `main`，这两个定义会解析成同一个命令名，而父模块的 `main` 会静默胜出。
::::

### 解析器关键字不能用作名称

`if`、`match`、`source`、`use` 这类解析器关键字不能用作命令或别名的名称，无论它是否从模块导出。这样的定义会以 `nu::parser::name_is_keyword` 失败。你可以用 `help commands | where command_type == keyword` 列出这些关键字。

以关键字命名的模块同样如此：它不能导出 `main` 命令，因为解析器总是会把这个名字当作关键字来处理：

```nu
module match { export def main [] { "matched" } }
use match
# => Error: nu::parser::keyword_shadow_module_main
# =>
# =>   × Module `match` has a `main` command but `match` is a built-in parser keyword.
# =>    ╭─[repl_entry #1:2:5]
# =>  1 │ module match { export def main [] { "matched" } }
# =>  2 │ use match
# =>    ·     ──┬──
# =>    ·       ╰── `match` is a parser keyword
# =>    ╰────
# =>   help: The `main` command cannot be invoked because `match` is intercepted by the parser. Either rename the module file, or remove `export def main` and use `use match.nu *` to import other
# =>         commands.
```

## Windows 路径语法

:::: important
Windows 上的 Nushell 同时支持正斜杠和反斜杠作为路径分隔符。不过，为了确保它们在所有平台上都能工作，强烈建议在模块中只使用正斜杠 `/`。
::::

## 附加示例

### 局部定义

如上所述，模块中没有 [`export`](/commands/docs/export.md) 关键字的定义只能在该模块的作用域内访问。

为了演示，创建一个新的 `is-alphanumeric.nu` 模块。在这个模块中，我们将创建一个 `str is-alphanumeric` 命令。如果字符串中有任何字符不是字母或数字，它就返回 `false`：

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

注意这个模块里有两个定义 —— `alpha-num-range` 和 `str is-alphanumeric`，但只有后者被导出。

```nu
use is-alphanumeric.nu *
'Word' | str is-alphanumeric
# => true
'Some punctuation?!' | str is-alphanumeric
# => false
'a' in (alpha-num-range)
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[repl_entry #4:1:9]
# =>  1 │ 'a' in (alpha-num-range)
# =>    ·         ───────┬───────
# =>    ·                ╰── Command `alpha-num-range` not found
# =>    ╰────
# =>   help: `alpha-num-range` is neither a Nushell built-in or a known external command
```

### 从子模块选择性导出

:::: note
虽然下面是个很少见的使用场景，但标准库正是用这个技巧
让 `dirs` 命令及其别名可以分别单独使用。
:::

正如上面[子模块](#子模块)一节提到的，只有 `export use` 才能从子模块中选择性地导出定义。

为了演示，我们把上面[注意事项](#注意事项)里的 `go.nu` 模块示例的一个改版加到 `my-utils` 中：

```nu
# go.nu，位于 my-utils 目录中
export def --env home [] {
    cd ~
}

export def --env modules [] {
    cd ($nu.default-config-dir | path join "scripts")
}

export alias h = home
export alias m = modules
```

这个 `go.nu` 相对原始版本有以下改动：

- 它不再依赖 `my-utils` 模块，因为它现在将是 `my-utils` 的子模块
- 它添加了"快捷方式"别名：
  `h`：前往家目录（`go home` 的别名）
  `m`：前往模块目录（`go modules` 的别名）

用户可以只用下面的方式导入这些别名：

```nu
use my-utils/go.nu [h, m]
```

不过，假设我们想让 `go.nu` 成为 `my-utils` 的子模块。当用户导入 `my-utils` 时，他们应该**只**得到这些命令，而不是别名。编辑 `my-utils/mod.nu` 并添加：

```nu
export use ./go.nu [home, modules]
```

这**基本**可行 —— 它选择性地导出了 `home` 和 `modules`，但没有导出别名。不过它是没有 `go` 前缀地导出的。要看到这一点，请在 `my-utils` 的父目录中启动一个新 shell，然后：

```nu
use my-utils *
home  # 可用：切换到你的家目录
cd -  # 返回
go home
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[repl_entry #1:4:1]
# =>  3 │ cd -  # go back
# =>  4 │ go home
# =>    · ─┬
# =>    ·  ╰── Command `go` not found
# =>    ╰────
# =>   help: Did you mean `do`?
```

要把它们导出为 `go home` 和 `go modules`，请对 `my-utils/mod.nu` 做如下修改：

```nu
# 把 `export use ./go.nu [home, modules]` 这一行替换为 ...
export module go {
    export use ./go.nu [home, modules]
}
```

这会在 `my-utils` 中创建一个新的、已导出的子模块 `go`，其中包含为 `go home` 和 `go modules` 选择性（重新）导出的定义。在 `my-utils` 父目录的一个新 shell 中，它按预期工作：

```nu
use my-utils *
go home  # 可用：切换到你的家目录
cd -     # 返回
home
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[repl_entry #1:4:1]
# =>  3 │ cd -     # go back
# =>  4 │ home
# =>    · ──┬─
# =>    ·   ╰── Command `home` not found
# =>    ╰────
# =>   help: Did you mean `go home`?
```
