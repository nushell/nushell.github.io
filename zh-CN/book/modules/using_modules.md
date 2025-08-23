# 使用模块

[[toc]]

## 概述

终端用户可以通过("导入")他人编写的模块来为Nushell添加新功能。

要导入模块及其定义，我们使用[`use`](/zh-CN/commands/docs/use.md)命令：

```nu
use <路径/到/模块> <成员...>
```

例如：

```nu
use std/log
log info "你好哇，模块"
```

::: tip
上面的例子使用了[标准库](../standard_library.md)，这是Nushell内置的模块集合。因为它对所有Nushell用户都可用，我们也会在下面的几个例子中使用它。
:::

## 安装模块

安装模块只需将其文件放在目录中即可。可以通过`git clone`(或其他版本控制系统)、像`nupm`这样的包管理器或手动完成。模块的文档应提供相关建议。

## 导入模块

[`use`](/zh-CN/commands/docs/use.md)关键字之后的任何内容形成一个**导入模式**，控制如何导入定义。

注意上面的`use`有两个参数：

- 模块的路径
- (可选)要导入的定义

模块文档通常会告诉你推荐的导入方式。不过，了解可用的选项仍然很有用：

### 模块路径

模块路径可以是：

- 包含`mod.nu`文件的绝对路径：

  ::: details 示例

  ```nu
  use ~/nushell/modules/nupm
  ```

  注意模块名(即其目录)可以以`/`结尾(Windows上是`\`)，但像大多数接受路径的命令(如`cd`)一样，这完全是可选的。

  :::

- 包含`mod.nu`文件的相对路径：

  ::: details 示例

  ```nu
  # cd然后使用相对nupm目录中的mod.nu
  cd ~/nushell/modules
  use nupm
  # 或
  use nupm/
  ```

  注意模块名(其目录)可以以`/`结尾(Windows上是`\`)，但像大多数接受路径的命令(如`cd`)一样，这完全是可选的。
  :::

  ::: important 重要提示！从`$env.NU_LIB_DIRS`导入模块
  通过相对路径导入模块时，Nushell首先从当前目录搜索。如果在该位置找不到匹配的模块，Nushell会搜索`$env.NU_LIB_DIRS`列表中的每个目录。

  这允许你将模块安装到一个位置，无论当前目录如何，都可以通过相对路径轻松访问。
  :::

- Nushell模块文件的绝对或相对路径。如上所述，Nushell会在`$env.NU_LIB_DIRS`中搜索匹配的相对路径。

  ::: details 示例

  ```nu
  use ~/nushell/modules/std-rfc/bulk-rename.nu
  # 或
  cd ~/nushell/modules
  use std-rfc/bulk-rename.nu
  ```

  :::

- 虚拟目录：

  ::: details 示例
  上面提到的标准库模块存储在一个带有`std`目录的虚拟文件系统中。可以将其视为上面"绝对路径"示例的替代形式。

  ```nu
  use std/assert
  assert equal 'string1' "string1"
  ```

  :::

- 不太常见的是，使用[`module`](/zh-CN/commands/docs/module.md)命令创建的模块名称。虽然可以在命令行使用此命令创建模块，但这并不常见或有用。相反，这种形式主要由模块作者用来定义子模块。参见[创建模块 - 子模块](./creating_modules.md#子模块)。

### 模块定义

`use`命令的第二个参数是要导入的定义的可选列表。同样，模块文档应提供建议。例如，[标准库章节](../standard_library.md#导入子模块)涵盖了每个子模块的推荐导入。

当然，你总是可以选择最适合你使用场景的形式。

- **将整个模块/子模块作为带有子命令的命令导入**

  在上面的一个例子中，我们在没有指定定义的情况下导入了`std/log`模块：

  ```nu
  use std/log
  log info "Hello, std/log Module"
  ```

  注意这将导入`log`子模块及其所有*子命令*(如`log info`、`log error`等)到当前作用域。

  将上面的例子与下一个版本比较，命令变成了`std log info`：

  ```nu
  use std
  std log info "Hello, std Module"
  ```

- **从模块导入所有定义**

  或者，你可以将定义本身导入当前作用域。例如：

  ```nu
  use std/formats *
  ls | to jsonl
  ```

  注意`to jsonl`命令如何直接放在当前作用域中，而不是作为`formats`的子命令。

- **从模块导入一个或多个定义**

  Nushell还可以选择性地导入模块定义的子集。例如：

  ```nu
  use std/math PI
  let circle = 2 * $PI * $radius
  ```

  记住定义可以是：

  - 命令
  - 别名
  - 常量
  - 外部命令
  - 其他模块(作为子模块)
  - 环境变量(总是导入)

  不太常见的是，也可以使用导入列表：

  ```nu
  use std/formats [ 'from ndjson' 'to ndjson' ]
  ```

  ::: note 导入子模块
  虽然你可以使用`use <模块> </子模块>`(例如`use std help`)单独导入子模块，但使用这种形式时，整个父模块及其*所有*定义(以及子模块)都将被*解析*。如果可能，将子模块作为*模块*加载会得到更快的代码。例如：

  ```nu
  # 更快
  use std/help
  ```

  :::

## 导入常量

如上面`std/math`示例所示，一些模块可能导出常量定义。导入整个模块时，可以通过与模块同名的记录访问常量：

```nu
# 导入整个模块 - 记录访问
use std/math
$math.PI
# => 3.141592653589793

$math
# => ╭───────┬──────╮
# => │ GAMMA │ 0.58 │
# => │ E     │ 2.72 │
# => │ PI    │ 3.14 │
# => │ TAU   │ 6.28 │
# => │ PHI   │ 1.62 │
# => ╰───────┴──────╯

# 或导入模块的所有成员
use std/math *
$PI
# => 3.141592653589793
```

## 隐藏

任何自定义命令或别名，无论是从模块导入的还是不是，都可以使用[`hide`](/zh-CN/commands/docs/hide.md)命令"隐藏"以恢复之前的定义。

`hide`命令也接受导入模式，类似于[`use`](/zh-CN/commands/docs/use.md)，但解释略有不同。这些模式可以是以下之一：

- 如果名称是自定义命令，`hide`命令直接隐藏它。
- 如果名称是模块名，它会隐藏所有以模块名作为前缀的导出

例如，使用`std/assert`：

```nu
use std/assert
assert equal 1 2
# => Assertion failed
assert true
# => Assertion passes

hide assert
assert equal 1 1
# => Error:
# => help: A command with that name exists in module `assert`. Try importing it with `use`

assert true
# => Error:
# => help: A command with that name exists in module `assert`. Try importing it with `use`
```

就像你可以`use`模块定义的一个子集一样，你也可以选择性地`hide`它们：

```nu
use std/assert
hide assert main
assert equal 1 1
# => assertion passes

assert true
# => Error:
# => help: A command with that name exists in module `assert`. Try importing it with `use`
```

::: tip
`main`在[创建模块](./creating_modules.md#main-导出)中有更详细的介绍，但对于终端用户来说，`main`只是表示"与模块同名的命令"。在这种情况下，`assert`模块导出一个`main`命令，"伪装"成`assert`命令。隐藏`main`的效果是隐藏`assert`命令，但不隐藏其子命令。
:::

## 另请参阅

- 要使模块始终可用而不必在每个Nushell会话中`use`它，只需将其导入(`use`)添加到启动配置中。参见[配置](../configuration.md)章节了解如何操作。

- 模块也可以作为[覆盖层](../overlays.md)的一部分使用。
