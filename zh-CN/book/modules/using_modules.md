# 使用模块

[[toc]]

## 概述

终端用户可以通过使用（"导入"）他人编写的模块来为 Nushell 添加新功能。

要导入模块及其定义，我们调用 [`use`](/commands/docs/use.md) 命令：

```nu
use <path/to/module> <members...>
```

例如：

```nu
use std/log
log info "Hello, Modules"
```

:::: tip
上面的例子使用了[标准库](../standard_library.md)，这是 Nushell 内置的模块集合。因为它对所有 Nushell 用户都很容易获得，我们在下面的几个例子中也会用到它。
::::

## 安装模块

安装模块只需把它的文件放到某个目录中即可。这可以通过 `git clone`（或其他版本控制系统）、像 `nupm` 这样的包管理器，或者手动完成。模块的文档应该会给出建议。

## 导入模块

[`use`](/commands/docs/use.md) 关键字之后的任何内容构成一个**导入模式**，它决定了定义如何被导入。

注意上面 `use` 有两个参数：

- 模块的路径
- （可选）要导入的定义

模块的文档通常会告诉你推荐的导入方式。不过，了解有哪些选项可用仍然很有用：

### 模块路径

模块的路径可以是：

- 指向包含 `mod.nu` 文件的目录的绝对路径：

  ::: details 示例

  ```nu
  use ~/nushell/modules/nupm
  ```

  注意模块名（即它的目录）可以以 `/` 结尾（Windows 上是 `\`），但和大多数接受路径的命令（如 `cd`）一样，这完全是可选项。

  :::

- 指向包含 `mod.nu` 文件的目录的相对路径：

  ::: details 示例

  ```nu
  cd ~/nushell/modules
  ```

  然后使用相对 `nupm` 目录中的 `mod.nu`：

  ```nu
  use nupm
  # 或
  use nupm/
  ```

  注意模块名（它的目录）可以以 `/` 结尾（Windows 上是 `\`），但和大多数接受路径的命令（如 `cd`）一样，这完全是可选项。

  `cd` 和 `use` 要写成两条独立的命令行。`use` 在它所在的命令行被解析时就去查找模块，此时同一命令行上的任何 `cd` 都还没有执行。
  :::

  ::: important 重要！从 `$NU_LIB_DIRS` 或 `$env.NU_LIB_DIRS` 导入模块
  通过相对路径导入模块时，Nushell 首先从当前目录搜索。如果在该位置找不到匹配的模块，Nushell 接着会搜索常量 `$NU_LIB_DIRS` 列表中的每个目录，然后是环境变量版本 `$env.NU_LIB_DIRS`。默认情况下，两者都包含你 Nushell 配置目录下的 `scripts` 目录，以及 Nushell 数据目录下的 `completions` 目录。建议把你自己的目录加到常量里。

  这让你可以把模块安装到一个无论当前目录在哪、都能通过相对路径轻松访问的位置。
  :::

- Nushell 模块文件的绝对路径或相对路径。如上所述，Nushell 会在常量 `$NU_LIB_DIRS` 中搜索匹配的相对路径，然后是 `$env.NU_LIB_DIRS`。

  ::: details 示例

  ```nu
  use ~/nushell/modules/my-utils/bulk-rename.nu
  ```

  或者：

  ```nu
  cd ~/nushell/modules
  ```

  ```nu
  use my-utils/bulk-rename.nu
  ```

  :::

- 虚拟目录：

  ::: details 示例
  上面提到的标准库模块存放在一个带有 `std` 目录的虚拟文件系统中。（[候选模块](../standard_library.md#标准库候选模块)位于 `std-rfc` 目录，例如 `use std-rfc/str`。）可以把它看作上面"绝对路径"示例的另一种形式。

  ```nu
  use std/assert
  assert equal 'string1' "string1"
  ```

  :::

- 较少见的是，用 [`module`](/commands/docs/module.md) 命令已经创建的模块名。虽然可以在命令行用这条命令创建模块，但这并不常见也没什么用。相反，这种形式主要由模块作者用来定义子模块。参见[创建模块 - 子模块](./creating_modules.md#子模块)。

### 模块定义

`use` 命令的第二个参数是要导入的定义的可选列表。同样，模块文档应该会给出建议。例如，[标准库章节](../standard_library.md#导入子模块)涵盖了每个子模块的推荐导入方式。

当然，你总是可以选择最适合自己使用场景的形式。

- **把整个模块/子模块作为带子命令的命令导入**

  在上面的一个例子中，我们没有指定定义就导入了 `std/log` 模块：

  ```nu
  use std/log
  log info "Hello, std/log Module"
  ```

  注意这会把 `log` 子模块及其所有*子命令*（如 `log info`、`log error` 等）导入当前作用域。

  把上面这个版本与下一个版本比较，此时命令变成了 `std log info`：

  ```nu
  use std
  std log info "Hello, std Module"
  ```

- **从模块导入全部定义**

  或者，你也可以把定义本身导入当前作用域。例如：

  ```nu
  use std/formats *
  ls | to jsonl
  ```

  注意 `to jsonl` 命令被直接放进当前作用域，而不是作为 `formats` 的子命令。

- **从模块导入一个或多个定义**

  Nushell 也可以选择性地导入模块定义的一个子集。例如：

  ```nu
  use std/math PI
  let radius = 2
  2 * $PI * $radius
  # => 12.566370614359172
  ```

  请记住这些定义可以是：

  - 命令
  - 别名
  - 常量
  - [类型别名](#导入类型别名)
  - 外部命令
  - 其他模块（作为子模块）
  - 环境变量（总是会被导入）

  较少见的是，也可以使用一个导入列表：

  ```nu
  use std/formats [ 'from ndjson' 'to ndjson' ]
  ```

  ::: note 导入子模块
  虽然你可以用 `use <模块> <子模块>` 单独导入某个子模块，但使用这种形式时，整个父模块及其*所有*定义（以及子模块）都会被*解析*。在可能的情况下，把子模块作为*模块*加载会得到更快的代码。例如：

  ```nu
  # 更快，并且导入带有全部子命令的 `help`
  use std/help
  # 更慢，并且只导入 `help` 命令本身，因为
  # 标准库用 `export use` 重新导出了各子模块的命令
  use std help
  ```

  :::

### 子模块

用 `use <模块>` 导入整个模块时，会导入模块自身的定义，但*不会*导入该模块用 `export module` 声明的子模块的命令。（Nushell 0.114 之前的版本会连这些一起导入。）例如，给定下面这个 `greetings.nu` 模块文件：

```nu
# greetings.nu
export def hello [] { "Hello!" }

export module formal {
    export def hello [] { "Good day!" }
}
```

`use greetings.nu` 会导入 `greetings hello`，但不会导入 `greetings formal hello`：

```nu
use greetings.nu
greetings hello
# => Hello!
greetings formal hello
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[repl_entry #3:1:1]
# =>  1 │ greetings formal hello
# =>    · ────┬────
# =>    ·     ╰── Command `greetings` not found
# =>    ╰────
# =>   help: Did you mean `greetings hello`?
```

要使用子模块，请用上面描述过的形式之一显式导入它：

```nu
# 全部定义，包括子模块
use greetings.nu *
formal hello
# => Good day!

# 只有子模块
use greetings.nu formal
formal hello
# => Good day!
```

有些模块会用 `export use` 重新导出子模块的命令，这使它们成为父模块的一部分。这就是为什么上面例子中的 `use std` 仍然能提供 `std log info`。两种形式的区别参见[创建模块 - 子模块](./creating_modules.md#子模块)。

## 导入常量

正如上面 `std/math` 例子所示，有些模块会导出常量定义。导入整个模块时，可以通过一个与模块同名的记录来访问常量：

```nu
# 导入整个模块 - 通过记录访问
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

# 或者导入模块的全部成员
use std/math *
$PI
# => 3.141592653589793
```

## 导入类型别名

模块可以用 `export type` 导出[类型别名](../custom_commands.md#类型别名)。与命令和常量不同，用 `use <模块>` 导入整个模块时并不会导入类型别名，因为它的名字不能以模块名作为前缀。可以按名称导入、用列表导入，或者用 `*` 导入：

```nu
module geo {
    export type Point = record<x: float, y: float>
    export def origin []: nothing -> Point { {x: 0.0, y: 0.0} }
}

use geo [Point origin]
let p: Point = origin
$p | describe
# => record<x: float, y: float>
```

`use geo Point` 和 `use geo *` 同样可行。如果只用 `use geo`，上面的 `Point` 注解会报 `Unknown type` 错误。当另一个模块用 `export use` 重新导出类型别名时，以及用 `overlay use`（不带 `--prefix`）激活模块时，类型别名也会一并带来。

## 隐藏

任何自定义命令或别名，无论是否从模块导入，都可以"隐藏"以恢复之前的定义，方法是使用
[`hide`](/commands/docs/hide.md) 命令。

`hide` 命令也接受导入模式，与 [`use`](/commands/docs/use.md) 类似，但解释方式略有不同。这些模式可以是以下之一：

- 如果名称是自定义命令，`hide` 命令直接隐藏它。
- 如果名称是模块名，它会隐藏所有以该模块名为前缀的导出

例如，对于这个模块：

```nu
module greet {
    export def main [] { "Hello!" }
    export def loud [] { "HELLO!" }
}

use greet
greet
# => Hello!

greet loud
# => HELLO!
```

现在隐藏这个模块：

```nu
hide greet
```

`greet loud` 和 `greet` 本身都不再可用：

```nu
greet loud
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[repl_entry #5:1:1]
# =>  1 │ greet loud
# =>    · ──┬──
# =>    ·   ╰── Command `greet` not found
# =>    ╰────
# =>   help: A command with that name exists in module `greet`. Try importing it with `use`

greet
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[repl_entry #6:1:1]
# =>  1 │ greet
# =>    · ──┬──
# =>    ·   ╰── Command `greet` not found
# =>    ╰────
# =>   help: A command with that name exists in module `greet`. Try importing it with `use`
```

正如你可以 `use` 模块定义的一个子集，你也可以选择性地 `hide` 它们：

```nu
use greet
hide greet main
greet loud
# => HELLO!

greet
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[repl_entry #8:1:1]
# =>  1 │ greet
# =>    · ──┬──
# =>    ·   ╰── Command `greet` not found
# =>    ╰────
# =>   help: A command with that name exists in module `greet`. Try importing it with `use`
```

:::: tip
`main` 在[创建模块](./creating_modules.md#main-导出)中有更详细的介绍，但对终端用户来说，`main` 只是表示"与模块同名的命令"。在这个例子中，`greet` 模块导出了一个 `main` 命令，"伪装"成 `greet` 命令。隐藏 `main` 的效果是隐藏 `greet` 命令，但不隐藏它的子命令。标准库的 `std/assert` 模块也是同样的机制：`assert` 是它的 `main` 命令，`assert equal` 是它的子命令之一。
::::

## 另请参阅

- 想让某个模块始终可用、不必在每个 Nushell 会话里 `use` 它，只需把它的导入（`use`）加到启动配置中。参见[配置](../configuration.md)章节了解具体做法。

- 模块也可以作为[覆盖层](../overlays.md)的一部分使用。
