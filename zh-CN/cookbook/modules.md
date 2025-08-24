# 模块的应用

## 将文件转储到目录

传统 shell 中的一个常见模式是将文件转储到目录并自动加载（例如，加载自定义补全）。在 Nushell 中，直接这样做目前还不可能，但仍然可以使用目录模块。

这里我们将创建一个简单的补全模块，其中包含一个专门用于某些 Git 补全的子模块：

1. 创建补全目录

   `mkdir ($nu.default-config-dir | path join completions)`

2. 为其创建一个空的 `mod.nu`

   `touch ($nu.default-config-dir | path join completions mod.nu)`

3. 将以下代码片段放入 `completions` 目录下的 `git.nu` 文件中

   ```nu
   export extern main [
       --version(-v)
       -C: string
       # ... 等等
   ]

   export extern add [
       --verbose(-v)
       --dry-run(-n)
       # ... 等等
   ]

   export extern checkout [
       branch: string@complete-git-branch
   ]

   def complete-git-branch [] {
       # ... 列出 git 分支的代码
   }
   ```

4. 将 `export module git.nu` 添加到 `mod.nu`
5. 在 `env.nu` 中将 `completions` 目录的父目录添加到您的 `NU_LIB_DIRS` 中

   ```nu
   $env.NU_LIB_DIRS = [
       ...
       $nu.default-config-dir
   ]
   ```

6. 在 `config.nu` 中导入补全到 Nushell：

   `use completions *`

现在您已经设置了一个可以放置补全文件的目录，下次启动 Nushell 时应该会有一些 Git 补全。

::: tip 注意
这将使用文件名（在我们的示例中为 `git.nu` 中的 `git`）作为模块名称。这意味着如果定义中包含基本命令名称，某些补全可能无法工作。
例如，如果您在 `git.nu` 中将我们的已知外部命令定义为 `export extern 'git push' []` 等，并遵循其余步骤，您将得到像 `git git push` 等子命令。
您需要调用 `use completions git *` 来获得所需的子命令。因此，使用上面步骤中概述的 `main` 是定义子命令的首选方式。
:::

## 覆层和"虚拟环境"

[覆层](/zh-CN/book/overlays.md)是 **层** 的 **定义** 。我们可以利用它来建立一个临时的虚拟环境，其中包含自定义环境变量，最后再丢弃这些变量。

我们在这个示例中的目标是：

- 从名为 `env.json` 的文件激活一组环境变量
- 在此上下文中工作
- 丢弃环境 - 恢复原始环境

首先，让我们准备一个 `env.json` 用于测试：

```nu
{ A: 1 B: 2 } | save env.json

$env.A = 'zzz'

print $"('A' in $env) ('B' in $env)"
# => true false
```

现在让我们创建一个带有 `load` 命令的 `env` 模块，该命令从 `env.json` 加载环境，并将其用作覆层：

```nu
'export def --env load [] { open env.json | load-env }' | save env.nu

overlay use ./env.nu

overlay list
# => ╭───┬──────╮
# => │ 0 │ zero │
# => │ 1 │ env  │
# => ╰───┴──────╯
```

现在我们加载 `env.json` 文件：

```nu
load

print $"($env.A) ($env.B)"
# => 1 2
```

要隐藏覆层：

```nu
overlay hide env

print $"('A' in $env) ('B' in $env)"
# => true false
```

请注意 - 如[覆层](/zh-CN/book/overlays.md)中所述 - 重新激活覆层将恢复加载的环境变量，
只要 Nushell 会话保持活动状态，就不会创建新的上下文，尽管 `overlay list` 不再列出覆层。

更多相关信息，特别是关于环境变量及其修改的信息，可以在[环境](/zh-CN/book/environment.md)、[模块](/zh-CN/book/modules.md)、[覆层](/zh-CN/book/overlays.md)中找到，
以及相应的命令文档：[`def --env`](/commands/docs/def.md)、[`export def --env`](/commands/docs/export_def.md)、[`load-env`](/commands/docs/load-env.md) 和 [`export-env`](/commands/docs/export-env.md)。

### 复杂的虚拟环境

这种覆盖环境的方法可用于限定更复杂的虚拟环境，包括更改 `PATH` 环境变量，或在环境变量或文件中定义的其他工具设置。

像 conda 或 Python virtualenv 这样的工具管理和隔离环境变量集。
[官方 virtualenv 集成](https://github.com/pypa/virtualenv/blob/main/src/virtualenv/activation/nushell/activate.nu)利用了这些概念。
我们的 nu_scripts 仓库有一个[非官方的 Conda 模块](https://github.com/nushell/nu_scripts/tree/main/modules/virtual_environments)。
