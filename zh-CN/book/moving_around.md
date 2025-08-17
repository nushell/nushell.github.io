# 在系统中四处移动

Shell 的一个决定性特征是能够在文件系统中导航和交互。Nushell 当然也不例外。以下是你在与文件系统交互时可能会用到的一些常用命令。

## 查看目录内容

```nu
ls
```

正如在快速入门中看到的，[`ls`](/zh-CN/commands/docs/ls.md) 命令返回目录的内容。Nushell 的 `ls` 将以[表格](types_of_data.html#tables)的形式返回内容。

[`ls`](/zh-CN/commands/docs/ls.md) 命令还需要一个可选的参数，以改变你想查看的内容。例如，我们可以列出以 `.md` 结尾的文件：

```nu
ls *.md
# => ╭───┬────────────────────┬──────┬──────────┬──────────────╮
# => │ # │        name        │ type │   size   │   modified   │
# => ├───┼────────────────────┼──────┼──────────┼──────────────┤
# => │ 0 │ CODE_OF_CONDUCT.md │ file │  3.4 KiB │ 9 months ago │
# => │ 1 │ CONTRIBUTING.md    │ file │ 11.0 KiB │ 5 months ago │
# => │ 2 │ README.md          │ file │ 12.0 KiB │ 6 days ago   │
# => │ 3 │ SECURITY.md        │ file │  2.6 KiB │ 2 months ago │
# => ╰───┴────────────────────┴──────┴──────────┴──────────────╯
```

## 通配符模式 (wildcards)

上述可选参数 `*.md` 中的星号（\*）有时被称为通配符（wildcards）或 Glob，它让我们可以匹配任何东西。你可以把 glob `*.md` 理解为“匹配以 `.md` 结尾的任何文件名”。

最通用的通配符是 `*`，能够匹配所有路径。它经常和其他模式（pattern）组合使用，比如 `*.bak` 和 `temp*`。

Nu 也使用双星号 `**`，它允许你访问更深的目录。比如，`ls **/*` 将递归地罗列当前目录下、所有的非隐藏路径。

```nu
ls **/*.md
# => ╭───┬───────────────────────────────┬──────┬──────────┬──────────────╮
# => │ # │             name              │ type │   size   │   modified   │
# => ├───┼───────────────────────────────┼──────┼──────────┼──────────────┤
# => │ 0 │ CODE_OF_CONDUCT.md            │ file │  3.4 KiB │ 5 months ago │
# => │ 1 │ CONTRIBUTING.md               │ file │ 11.0 KiB │ a month ago  │
# => │ 2 │ README.md                     │ file │ 12.0 KiB │ a month ago  │
# => │ 3 │ SECURITY.md                   │ file │  2.6 KiB │ 5 hours ago  │
# => │ 4 │ benches/README.md             │ file │    249 B │ 2 months ago │
# => │ 5 │ crates/README.md              │ file │    795 B │ 5 months ago │
# => │ 6 │ crates/nu-cli/README.md       │ file │    388 B │ 5 hours ago  │
# => │ 7 │ crates/nu-cmd-base/README.md  │ file │    262 B │ 5 hours ago  │
# => │ 8 │ crates/nu-cmd-extra/README.md │ file │    669 B │ 2 months ago │
# => │ 9 │ crates/nu-cmd-lang/README.md  │ file │  1.5 KiB │ a month ago  │
# => ╰───┴───────────────────────────────┴──────┴──────────┴──────────────╯
```

这里，我们正在寻找任何以 ".md" 结尾的文件。双星号进一步指定了“从这里开始的任何目录中”。

Nushell 的通配符语法不仅支持 `*`，还支持用 `?` 匹配[单个字符和用 `[...]` 匹配字符组](https://docs.rs/nu-glob/latest/nu_glob/struct.Pattern.html)。

通过将 `*`、`?` 和 `[]` 模式包含在单引号、双引号或[原始字符串](working_with_strings.md#raw-strings)中，可以对它们进行转义。例如，要显示名为 `[slug]` 的目录的内容，请使用 `ls "[slug]"` 或 `ls '[slug]'`。

然而，*反引号*引用的字符串不会转义通配符。例如，比较以下场景：

1.  未引用：通配符模式

    一个带有通配符字符的未引用的[裸词字符串](working_with_strings.html#bare-word-strings)被解释为一个通配符模式，所以下面的命令将删除当前目录中所有文件名中包含 `myfile` 的文件：

    ```nu
    rm *myfile*
    ```

2.  引用：带星号的字符串字面量

    当使用单引号或双引号引用，或使用[原始字符串](working_with_strings.html#raw-strings)时，一个带有字面量、转义的星号（或其他通配符字符）的*字符串*被传递给命令。结果不是一个通配符。以下命令将只删除一个字面量名为 `*myfile*`（包括星号）的文件。名称中包含 `myfile` 的其他文件不受影响：

    ```nu
    rm "*myfile*"
    ```

3.  反引号引用：通配符模式

    [反引号引用的字符串](working_with_strings.html#backtick-quoted-strings)中的星号（和其他通配符模式）被解释为一个通配符模式。请注意，这与上面 #1 中的裸词字符串示例的行为相同。

    以下命令与第一个示例一样，删除当前目录中所有文件名中包含 `myfile` 的文件：

    ```nu
    rm `*myfile*`
    ```

::: tip 提示
Nushell 还包括一个专门的 [`glob` 命令](https://www.nushell.sh/commands/docs/glob.html)，支持更复杂的通配符场景。
:::

### 将字符串转换为通配符

上面的引用技术在构造通配符字面量时很有用，但你可能需要以编程方式构造通配符。有几种技术可用于此目的：

1.  `into glob`

    [`into glob` 命令](/zh-CN/commands/docs/into_glob.html)可用于将字符串（和其他类型）转换为通配符。例如：

    ```nu
    # 查找文件名包含当前月份（格式为 YYYY-mm）的文件
    let current_month = (date now | format date '%Y-%m')
    let glob_pattern = ($"*($current_month)*" | into glob)
    ls $glob_pattern
    ```

2.  扩展操作符与 [`glob` 命令](/zh-CN/commands/docs/glob.html)结合使用：

    [`glob` 命令](/zh-CN/commands/docs/glob.html)（注意：与 `into glob` 不同）生成一个与通配符模式匹配的[`列表`](types_of_data.html#lists)文件名。这个列表可以使用[扩展操作符](operators.html#spread-operator)展开并传递给文件系统命令：

    ```nu
    # 查找文件名包含当前月份（格式为 YYYY-mm）的文件
    let current_month = (date now | format date '%Y-%m')
    ls ...(glob $"*($current_month)*")
    ```

3.  通过注解强制 `glob` 类型：

    ```nu
    # 查找文件名包含当前月份（格式为 YYYY-mm）的文件
    let current_month = (date now | format date '%Y-%m')
    let glob_pattern: glob = ($"*($current_month)*")
    ls $glob_pattern
    ```

## 创建目录

与大多数其他 shell 一样，[`mkdir` 命令](/zh-CN/commands/docs/mkdir.md)用于创建新目录。一个细微的区别是，Nushell 的内部 `mkdir` 命令默认情况下像 Unix/Linux 的 `mkdir -p` 一样操作，因为它：

- 会自动创建多个目录级别。例如：

  ```nu
  mkdir modules/my/new_module
  ```

  即使这些目录都不存在，这也会创建所有三个目录。在 Linux/Unix 上，这需要 `mkdir -p`。

- 如果目录已经存在，则不会出错。例如：

  ```nu
  mkdir modules/my/new_module
  mkdir modules/my/new_module
  # => 没有错误
  ```

  ::: tip 提示
  一个常见的错误是，刚接触 Nushell 的人会尝试使用 `mkdir -p <directory>`，就像在原生的 Linux/Unix 版本中一样。然而，这会在 Nushell 中产生一个 `Unknown Flag` 错误。

  只需重复不带 `-p` 的命令即可达到相同的效果。
  :::

## 改变当前目录

```nu
cd cookbook
```

要从当前目录换到一个新目录，我们使用 [`cd`](/zh-CN/commands/docs/cd.md) 命令。

如果 [`cd`](/zh-CN/commands/docs/cd.md) 被省略，只给出一个路径本身，也可以改变当前工作目录：

```nu
cookbook/
```

就像在其他 Shells 中一样，我们可以使用目录的名称，或者如果我们想进入父目录，我们可以使用 `..` 的快捷方式。

你还可以添加额外的点来进入更上层的目录：

```nu
# 切换到父目录
cd ..
# 或者
..
# 上移两层（父目录的父目录）
cd ...
# 或者
...
# 上移三层（父目录的父目录的父目录）
cd ....
# 等等
```

::: tip 提示
多点快捷方式可用于内部 Nushell [文件系统命令](/zh-CN/commands/categories/filesystem.html)以及外部命令。例如，在 Linux/Unix 系统上运行 `^stat ....` 将显示路径被扩展为 `../../..`
:::

你也可以将相对目录级别与目录名结合起来：

```nu
cd ../sibling
```

::: tip 重要提示
用 [`cd`](/zh-CN/commands/docs/cd.md) 改变目录会改变 `PWD` 环境变量。这意味着目录的改变会保留到当前代码块（例如，块或闭包）中。一旦你退出这个代码块，你就会返回到以前的目录。你可以在[环境篇](environment.md)中了解更多关于这方面的信息。
:::

## 文件系统命令

Nu 还提供了一些可以跨平台工作的基本[文件系统命令](/zh-CN/commands/categories/filesystem.html)，例如：

- [`mv`](/zh-CN/commands/docs/mv.md) 用于重命名或将文件或目录移动到新位置
- [`cp`](/zh-CN/commands/docs/cp.md) 用于将项目复制到新位置
- [`rm`](/zh-CN/commands/docs/rm.md) 用于从文件系统中删除项目

::: tip 提示
在 Bash 和许多其他 shell 中，大多数文件系统命令（`cd` 除外）实际上是系统中的独立二进制文件。例如，在 Linux 系统上，`cp` 是 `/usr/bin/cp` 二进制文件。在 Nushell 中，这些命令是内置的。这有几个优点：

- 它们在可能没有二进制版本的平台（例如 Windows）上工作一致。这允许创建跨平台的脚本、模块和自定义命令。
- 它们与 Nushell 更紧密地集成，允许它们理解 Nushell 类型和其他构造。
- 如[快速入门](quick_tour.html)中所述，它们在 Nushell 帮助系统中有文档记录。运行 `help <command>` 或 `<command> --help` 将显示该命令的 Nushell 文档。

虽然通常建议使用 Nushell 内置版本，但也可以访问 Linux 二进制文件。有关详细信息，请参阅[运行外部命令](./running_externals.md)。
:::
