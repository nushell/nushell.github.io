# 用 Nu 的方式思考

Nushell 与众不同！新用户通常会带着来自其他 Shell 或语言的现有"习惯"或思维模式。

新用户最常见的问题通常属于以下主题之一：

[[toc]]

## Nushell 不是 Bash

### 它有时看起来像 Bash

Nushell 既是一种编程语言，也是一个 Shell。因此，它有自己处理文件、目录、网站等的方式。你会发现 Nushell 的某些功能与你熟悉的其他 Shell 类似。例如，管道通过组合两个（或更多）命令来工作，就像在其他 Shell 中一样。

例如，以下命令行在 Unix/Linux 平台上的 Bash 和 Nushell 中都能工作：

```nu
curl -s https://api.github.com/repos/nushell/nushell/contributors | jq -c '.[] | {login,contributions}'
# => 返回 Nushell 的贡献者，按贡献数量排序
```

Nushell 与 Bash（和其他 Shell）有许多其他相似之处和许多共同的命令。

::: tip
Bash 主要是一个运行外部命令的命令解释器。Nushell 提供了许多这些命令作为跨平台的内置命令。

虽然上述命令行在两个 Shell 中都能工作，但在 Nushell 中根本不需要使用 `curl` 和 `jq` 命令。相反，Nushell 有一个内置的 [`http get` 命令](/zh-CN/commands/docs/http_get.md)并原生处理 JSON 数据。例如：

```nu
http get https://api.github.com/repos/nushell/nushell/contributors | select login contributions
```

:::

::: warning 以 Nushell 的方式思考
Nushell 从许多 Shell 和语言中借鉴了概念。你可能会发现 Nushell 的许多功能都很熟悉。
:::

### 但它不是 Bash

然而，正因为如此，有时很容易忘记：一些 Bash（和一般的 POSIX）风格的设计在 Nushell 中就是不起作用。例如，在 Bash 中，通常会这样写：

```sh
# 使用 > 重定向
echo "hello" > output.txt
# 但使用 test 命令进行比较（大于）
test 4 -gt 7
echo $?
# => 1
```

然而，在 Nushell 中，`>` 被用作比较的大于运算符。这更符合现代编程的期望。

```nu
4 > 10
# => false
```

由于 `>` 是一个运算符，Nushell 中重定向到文件是通过一个专门用于保存内容的管道命令 [`save`](/zh-CN/commands/docs/save.md) 来处理的：

```nu
"hello" | save output.txt
```

::: warning 以 Nushell 的方式思考
我们已经在 [从 Bash 迁移](./coming_from_bash.md) 章节中整理了一份常见的 Bash 用法及其在 Nushell 中的实现方式列表。
:::

## 隐式返回

来自其他 Shell 的用户可能非常熟悉 `echo` 命令。Nushell 的 [`echo`](/zh-CN/commands/docs/echo.md) 乍一看可能相同，但它非常不同。

首先，注意以下输出在 Bash 和 Nushell（甚至 PowerShell 和 Fish）中看起来如何相同：

```nu
echo "Hello, World"
# => Hello, World
```

但是，当其他 Shell 将 `Hello, World` 直接发送到标准输出时，Nushell 的 `echo` 只是返回一个值。然后 Nushell 渲染命令（或更技术地说，表达式）的返回值。

更重要的是，Nushell 隐式返回表达式的值。这在许多方面类似于 PowerShell 或 Rust。

::: tip
表达式可以不仅仅是管道。即使是自定义命令（类似于许多语言中的函数，但我们将在 [后面的章节](./custom_commands.md) 中更深入地介绍它们）也会自动隐式返回最后一个值。不需要 `echo` 甚至 [`return` 命令](/zh-CN/commands/docs/return.md)来返回值 —— 它就是自然而然地发生了。
:::

换句话说，字符串 _"Hello, World"_ 和 `echo "Hello, World"` 的输出值是等价的：

```nu
"Hello, World" == (echo "Hello, World")
# => true
```

这是另一个自定义命令定义的例子：

```nu
def latest-file [] {
    ls | sort-by modified | last
}
```

该管道的*输出*（其*“值”*）成为 `latest-file` 自定义命令的*返回值*。

::: warning 以 Nushell 的方式思考
在 Nushell 中，你可能会写 `echo <something>` 的地方，大多数情况下你可以直接写 `<something>`。
:::

## 每个表达式只有一个返回值

理解一个表达式只能返回一个值是很重要的。如果一个表达式中有多个子表达式，只有**最后一个**值会被返回。

一个常见的错误是这样写一个自定义命令定义：

```nu:line-numbers
def latest-file [] {
    echo "Returning the last file"
    ls | sort-by modified | last
}

latest-file
```

新用户可能期望：

- 第 2 行输出 _"Returning the last file"_
- 第 3 行返回/输出文件

然而，请记住 `echo` **返回一个值**。因为只返回最后一个值，所以第 2 行的*值*被丢弃了。只有第 3 行的文件会被返回。

要确保第一行被*显示*，请使用 [`print` 命令](/zh-CN/commands/docs/print.md)：

```nu
def latest-file [] {
    print "Returning last file"
    ls | sort-by modified | last
}
```

再比较一下：

```nu
40; 50; 60
```

::: tip
分号在 Nushell 表达式中与换行符相同。上面的代码与文件或多行命令中的以下内容相同：

```nu
40
50
60
```

或

```nu
echo 40
echo 50
echo 60
```

另见：[多行编辑](./line_editor.md#多行编辑)
:::

在以上所有情况中：

- 第一个值被评估为整数 40，但不会被返回
- 第二个值被评估为整数 50，但不会被返回
- 第三个值被评估为整数 60，并且由于它是最后一个值，它被返回并显示（渲染）。

::: warning 以 Nushell 的方式思考
在调试意外结果时，请注意：

- 子表达式（例如，命令或管道）...
- ...输出一个（非 `null`）值...
- ...而该值没有从父表达式返回。

这些可能是代码中问题的来源。
:::

## 每个命令都返回一个值

有些语言有“语句”的概念，它们不返回值。Nushell 没有。

在 Nushell 中，**每个命令都返回一个值**，即使该值是 `null`（`nothing` 类型）。考虑以下多行表达式：

```nu:line-numbers
let p = 7
print $p
$p * 6
```

1. 第 1 行：整数 7 被赋给 `$p`，但 [`let` 命令](/zh-CN/commands/docs/let.md) 本身的返回值是 `null`。然而，因为它不是表达式中的最后一个值，所以它不会被显示。
2. 第 2 行：`print` 命令本身的返回值是 `null`，但 `print` 命令强制其参数（`$p`，即 7）被*显示*。与第 1 行一样，`null` 返回值被丢弃，因为这不是表达式中的最后一个值。
3. 第 3 行：评估为整数值 42。作为表达式中的最后一个值，这是返回结果，并且也会被显示（渲染）。

::: warning 以 Nushell 的方式思考
熟悉常用命令的输出类型将帮助你理解如何将简单的命令组合在一起以实现复杂的结果。

`help <command>` 将显示 Nushell 中每个命令的签名，包括输出类型。
:::

## 将 Nushell 视为一门编译型语言

在 Nushell 中，运行代码时有两个独立的高级阶段：

1. _阶段 1 (解析器):_ 解析**整个**源代码
2. _阶段 2 (引擎):_ 评估**整个**源代码

将 Nushell 的解析阶段视为[静态](./how_nushell_code_gets_run.md#dynamic-vs-static-languages)语言（如 Rust 或 C++）中的*编译*可能会有所帮助。我们的意思是，所有将在阶段 2 中评估的代码必须在解析阶段**已知且可用**。

::: important
然而，这也意味着 Nushell 目前不支持像*动态*语言（如 Bash 或 Python）中的 `eval` 结构。
:::

### 基于静态解析构建的功能

另一方面，解析的**静态**结果是 Nushell 及其 REPL 的许多功能的关键，例如：

- 准确且富有表现力的错误消息
- 用于更早、更稳健地检测错误条件的语义分析
- IDE 集成
- 类型系统
- 模块系统
- 自动补全
- 自定义命令参数解析
- 语法高亮
- 实时错误高亮
- 分析和调试命令
- (未来) 格式化
- (未来) 保存 IR (中间表示) “编译”结果以加快执行速度

### 限制

Nushell 的静态特性常常让来自具有 `eval` 功能的语言的用户感到困惑。

考虑一个简单的两行文件：

```text
<line1 code>
<line2 code>
```

1. 解析：
   1. 解析第 1 行
   2. 解析第 2 行
2. 如果解析成功，则进行评估：
   1. 评估第 1 行
   2. 评估第 2 行

这有助于说明为什么以下示例不能在 Nushell 中作为单个表达式（例如，脚本）运行：

::: note
以下示例使用 [`source` 命令](/zh-CN/commands/docs/source.md)，但类似的结论也适用于解析 Nushell 源代码的其他命令，例如 [`use`](/zh-CN/commands/docs/use.md)、[`overlay use`](/zh-CN/commands/docs/overlay_use.md)、[`hide`](/zh-CN/commands/docs/hide.md) 或 [`source-env`](/zh-CN/commands/docs/source-env.md)。
:::

#### 示例：动态生成源代码

考虑以下场景：

```nu
"print Hello" | save output.nu
source output.nu
# => Error: nu::parser::sourced_file_not_found
# =>
# =>   × File not found
# =>    ╭─[entry #5:2:8]
# =>  1 │ "print Hello" | save output.nu
# =>  2 │ source output.nu
# =>    ·        ────┬────
# =>    ·            ╰── File not found: output.nu
# =>    ╰────
# =>   help: sourced files need to be available before your script is run
```

这很有问题，因为：

1. 第 1 行被解析但未被评估。换句话说，`output.nu` 不是在解析阶段创建的，而是在评估阶段创建的。
2. 第 2 行被解析。因为 `source` 是一个解析器关键字，所以在解析（阶段 1）期间会尝试解析源文件。但 `output.nu` 甚至还不存在！如果它*确实*存在，那么它甚至可能不是正确的文件！这会导致错误。

::: note
在 **REPL** 中将这两行作为*单独*的行输入将起作用，因为第一行将被解析和评估，然后第二行将被解析和评估。

只有当两者作为单个表达式*一起*解析时才会出现限制，这可能是脚本、块、闭包或其他表达式的一部分。

有关更多解释，请参阅*“Nushell 代码如何运行”*中的 [REPL](./how_nushell_code_gets_run.md#the-nushell-repl) 部分。
:::

#### 示例：动态创建要加载的文件名

另一个来自其他 Shell 的常见场景是尝试动态创建一个将被加载的文件名：

```nu
let my_path = "~/nushell-files"
source $"($my_path)/common.nu"
# => Error:
# =>   × Error: nu::shell::not_a_constant
# =>   │
# =>   │   × Not a constant.
# =>   │    ╭─[entry #6:2:11]
# =>   │  1 │ let my_path = "~/nushell-files"
# =>   │  2 │ source $"($my_path)/common.nu"
# =>   │    ·           ────┬───
# =>   │    ·               ╰── Value is not a parse-time constant
# =>   │    ╰────
# =>   │   help: Only a subset of expressions are allowed constants during parsing. Try using the 'const' command or typing the value literally.
# =>   │
# =>    ╭─[entry #6:2:8]
# =>  1 │ let my_path = "~/nushell-files"
# =>  2 │ source $"($my_path)/common.nu"
# =>    ·        ───────────┬───────────
# =>    ·                   ╰── Encountered error during parse-time evaluation
# =>    ╰────
```

因为 `let` 赋值直到评估时才被解析，所以如果传递一个变量，解析器关键字 `source` 将在解析期间失败。

::: details 比较 Rust 和 C++
想象一下，上面的代码是用典型的编译型语言（如 C++）编写的：

```cpp
#include <string>

std::string my_path("foo");
#include <my_path + "/common.h">
```

或 Rust

```rust
let my_path = "foo";
use format!("{}::common", my_path);
```

如果你曾经用这些语言中的任何一种编写过一个简单的程序，你就会发现这些示例在这些语言中是无效的。与 Nushell 一样，编译型语言要求所有源代码文件都预先准备好并可供编译器使用。
:::

::: tip 另见
然而，正如错误消息中所指出的，如果 `my_path` 可以定义为[常量](/book/variables#constant-variables)，这将起作用，因为常量可以在解析期间解析。

```nu
const my_path = "~/nushell-files"
source $"($my_path)/common.nu"
```

有关更多详细信息，请参阅[解析时常量评估](./how_nushell_code_gets_run.md#parse-time-constant-evaluation)。
:::

#### 示例：切换到不同目录 (`cd`) 并 `source` 一个文件

还有一个例子 —— 切换到不同目录，然后尝试在该目录中 `source` 一个文件。

```nu:line-numbers
if ('spam/foo.nu' | path exists) {
    cd spam
    source-env foo.nu
}
```

根据我们对 Nushell 的解析/评估阶段的了解，看看你是否能发现该示例中的问题。

::: details 解决方案

在第 3 行，在解析期间，`source-env` 尝试解析 `foo.nu`。然而，`cd` 直到评估时才发生。这会导致解析时错误，因为在*当前*目录中找不到该文件。

要解决这个问题，当然，只需使用要加载的文件的完整路径。

```nu
    source-env spam/foo.nu
```

:::

### 总结

::: important
有关本节的更深入解释，请参阅[Nushell 代码如何运行](how_nushell_code_gets_run.md)。
:::

::: warning 以 Nushell 的方式思考
Nushell 被设计为对每个表达式或文件使用单个解析阶段。此解析阶段在评估之前发生，并且与评估分开。虽然这启用了 Nushell 的许多功能，但它也意味着用户需要了解它所带来的限制。
:::

## 变量默认是不可变的

另一个来自其他语言的常见意外是 Nushell 变量默认是不可变的。虽然 Nushell 有可选的可变变量，但 Nushell 的许多命令都基于函数式编程风格，这要求不可变性。

不可变变量也是 Nushell 的 [`par-each` 命令](/zh-CN/commands/docs/par-each.md)的关键，它允许你使用线程并行处理多个值。

有关更多信息，请参阅[不可变变量](variables.html#immutable-variables)和[在可变和不可变变量之间进行选择](variables.html#choosing-between-mutable-and-immutable-variables)。

::: warning 以 Nushell 的方式思考
如果你习惯于依赖可变变量，可能需要一些时间来重新学习如何以更函数化的风格编写代码。Nushell 有许多函数式特性和命令，它们对不可变变量进行操作。学习它们将帮助你以更符合 Nushell 风格的方式编写代码。

一个额外的好处是，通过使用 `par-each` 并行运行部分代码，可以实现性能提升。
:::

## Nushell 的环境是作用域的

Nushell 从编译型语言中借鉴了多种设计理念。其中之一是语言应避免全局可变状态。Shell 通常使用全局突变来更新环境，但 Nushell 试图避免这种方法。

在 Nushell 中，块控制自己的环境。对环境的更改仅限于它们发生的块的作用域。

在实践中，这使你可以（仅举一例）编写更简洁的代码来处理子目录。这是一个在当前目录中构建每个子项目的示例：

```nu
ls | each { |row|
  cd $row.name
  make
}
```

[`cd`](/zh-CN/commands/docs/cd.md) 命令更改 `PWD` 环境变量，但此变量更改不会在块结束时保留。这允许每次迭代从当前目录开始，然后进入下一个子目录。

拥有一个作用域环境使命令更具可预测性、更易于阅读，并且在需要时更容易调试。这也是我们上面讨论的 `par-each` 命令的另一个关键特性。

Nushell 还提供了像 [`load-env`](/zh-CN/commands/docs/load-env.md) 这样的辅助命令，作为一次性加载多个环境更新的便捷方式。

::: tip 另见
[环境 - 作用域](./environment.md#scoping)
:::

::: note
[`def --env`](/zh-CN/commands/docs/def.md) 是此规则的一个例外。它允许你创建一个更改父环境的命令。
:::

::: warning 以 Nushell 的方式思考
使用作用域环境编写更简洁的脚本，并防止不必要或不希望的全局环境突变。
:::
