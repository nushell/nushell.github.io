# Nushell代码执行原理

在[用Nu的方式思考](./thinking_in_nu.md#think-of-nushell-as-a-compiled-language)中，我们建议你"将Nushell视为编译型语言"，这是因为Nushell代码的处理方式。我们还介绍了一些由于这种处理方式而在Nushell中无法工作的代码示例。

其根本原因是Nushell严格分离了 **_解析和评估_** 阶段，并 **_禁止类似`eval`的功能_** 。在本节中，我们将详细解释这意味着什么、为什么这样做以及其影响。解释尽可能简单，但如果你之前使用过其他编程语言可能会更容易理解。

[[toc]]

## 解释型语言 vs 编译型语言

### 解释型语言

Nushell、Python和Bash(以及许多其他语言)都是"解释型"语言。

让我们从一个简单的"Hello, World!"Nushell程序开始：

```nu
# hello.nu

print "Hello, World!"
```

当然，使用`nu hello.nu`可以按预期运行。用Python或Bash编写的类似程序看起来(和行为)几乎相同。

在"解释型语言"中，代码通常是这样处理的：

```text
源代码 → 解释器 → 结果
```

Nushell遵循这种模式，其"解释器"分为两部分：

1. `源代码 → 解析器 → 中间表示(IR)`
2. `IR → 评估引擎 → 结果`

首先，源代码由解析器分析并转换为中间表示(IR)，在Nushell中这只是一组数据结构。然后，这些数据结构被传递给引擎进行评估并输出结果。

这在解释型语言中也很常见。例如，Python源代码通常在评估前[转换为字节码](https://github.com/python/cpython/blob/main/InternalDocs/interpreter.md)。

### 编译型语言

另一方面是通常"编译"的语言，如C、C++或Rust。例如，这是一个简单的Rust"Hello, World!"：

```rust
// main.rs

fn main() {
    println!("Hello, World!");
}
```

要"运行"这段代码，必须：

1. 编译为[机器码指令](https://en.wikipedia.org/wiki/Machine_code)
2. 将编译结果作为二进制文件存储在磁盘上

前两步通过`rustc main.rs`完成。

3. 然后，要产生结果，需要运行二进制文件(`./main`)，将指令传递给CPU

所以：

1. `源代码 ⇒ 编译器 ⇒ 机器码`
2. `机器码 ⇒ CPU ⇒ 结果`

::: important
你可以看到编译-运行序列与解释器的解析-评估序列没有太大区别。你从源代码开始，将其解析(或编译)为某种状态(例如字节码、IR、机器码)，然后评估(或运行)IR以获得结果。你可以将机器码视为另一种类型的IR，将CPU视为其解释器。

然而，解释型语言和编译型语言之间的一个重大区别是解释型语言通常实现 _`eval`函数_，而编译型语言则没有。这意味着什么？
:::

## 动态语言 vs 静态语言

::: tip 术语说明
一般来说，动态语言和静态语言的区别在于源代码在编译(或解析)阶段与求值/运行时阶段的处理程度：

- _"静态"_ 语言在编译/解析阶段执行更多代码分析(如类型检查、[数据所有权](https://doc.rust-lang.org/stable/book/ch04-00-understanding-ownership.html))

- _"动态"_ 语言在求值/运行时执行更多代码分析，包括对额外代码的`求值函数`调用

就本文讨论而言，静态语言和动态语言的主要区别在于是否具有`求值函数`功能
:::

### 求值函数

大多数动态解释型语言都有`求值函数`。例如[Python的eval](https://docs.python.org/3/library/functions.html#eval)(以及[Python的exec](https://docs.python.org/3/library/functions.html#exec))或[Bash的eval](https://linux.die.net/man/1/bash)。

`求值函数`的参数是 _"源代码中的源代码"_，通常是条件计算或动态生成的。这意味着当解释型语言在解析/求值过程中遇到`求值函数`时，通常会中断正常的求值过程，对`求值函数`的源代码参数启动新的解析/求值过程。

以下是一个简单的Python `eval`示例来说明这个(可能令人困惑的!)概念：

```python:line-numbers
# hello_eval.py

print("Hello, World!")
eval("print('Hello, Eval!')")
```

运行该文件(`python hello_eval.py`)时，你会看到两条消息：_"Hello, World!"_ 和 _"Hello, Eval!"_。具体过程如下：

1. 整个程序被解析
2. (第3行) `print("Hello, World!")` 被求值
3. (第4行) 为了求值 `eval("print('Hello, Eval!')")`：
   1. `print('Hello, Eval!')` 被解析
   2. `print('Hello, Eval!')` 被求值

::: tip 更有趣的示例
考虑 `eval("eval(\"print('Hello, Eval!')\")")` 等等！
:::

请注意，这里使用`求值函数`在执行过程中添加了一个新的"元"步骤。`求值函数`不是单一的解析/求值过程，而是创建了额外的"递归"解析/求值步骤。这意味着Python解释器生成的字节码可以在求值过程中进一步修改。

Nushell不允许这样做。

如上所述，由于在解释过程中没有`求值函数`来修改字节码，解释型语言的解析/求值过程与C++和Rust等编译型语言的编译/运行过程(在高层面上)几乎没有区别。

::: tip 关键点
这就是为什么我们建议你 _"将Nushell视为编译型语言"_。尽管它是一种解释型语言，但由于缺少`求值函数`，它具有传统静态编译型语言的一些特征性优点和限制。
:::

我们将在下一节深入探讨这意味着什么。

## 影响

考虑以下Python示例：

```python:line-numbers
exec("def hello(): print('Hello eval!')")
hello()
```

::: note
本例中使用`exec`而非`eval`，因为它可以执行任何有效的Python代码，而不仅限于`eval`表达式。不过两者的原理相似。
:::

在解释过程中：

1. 整个程序被解析
2. 为了求值第1行：
   1. `def hello(): print('Hello eval!')` 被解析
   2. `def hello(): print('Hello eval!')` 被求值
3. (第2行) `hello()` 被求值

请注意，直到步骤2.2之前，解释器根本不知道存在`hello`函数！这使得动态语言的[静态分析](https://en.wikipedia.org/wiki/Static_program_analysis)变得困难。在这个例子中，仅通过解析(编译)源代码无法检查`hello`函数是否存在。解释器必须求值(运行)代码才能发现它。

- 在静态编译型语言中，缺失的函数保证会在编译时被发现
- 而在动态解释型语言中，这可能会成为*潜在的*运行时错误。如果`求值函数`定义的函数被有条件地调用，可能直到生产环境中满足该条件时才会发现错误

::: important
在Nushell中，只有**两个步骤**：

1. 解析整个源代码
2. 求值整个源代码

这就是完整的解析/求值序列。
:::

::: tip 关键点
通过不允许类似`求值函数`的功能，Nushell防止了这类与`求值函数`相关的错误。在Nushell中，调用不存在的定义保证会在解析时被发现。

此外，解析完成后，我们可以确定字节码(IR)在求值过程中不会改变。这使我们对结果字节码(IR)有深入的了解，能够进行强大可靠的静态分析和IDE集成，这在更动态的语言中可能难以实现。

总的来说，在扩展Nushell程序时，你可以更放心错误会被更早发现。
:::

## Nushell交互式解释器(REPL)

与大多数Shell一样，Nushell有个 _"读取→求值→打印循环"_ ([REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop))，在你不带任何文件参数运行 `nu` 时启动。这通常被认为是 _"命令行"_，但并不完全相同。

::: tip 注意
在本节中，代码块行首的`> `字符表示命令行 **_提示符_** 。例如：

```nu
> 一些代码...
```

以下示例中提示符后的代码通过按<kbd>Enter</kbd>键执行。例如：

```nu
> print "Hello world!"
# => Hello world!

> ls
# => 打印文件和目录...
```

上述表示：

- 在Nushell中(通过`nu`启动)：
  1. 输入`print "Hello world!"`
  2. 按<kbd>Enter</kbd>
  3. Nushell将显示结果
  4. 输入`ls`
  5. 按<kbd>Enter</kbd>
  6. Nushell将显示结果

:::

当你在输入命令行后按<kbd>Enter</kbd>时，Nushell会：

1. **_(读取)_**：读取命令行输入
2. **_(求值)_**：解析命令行输入
3. **_(求值)_**：求值命令行输入
4. **_(求值)_**：将环境(如当前工作目录)合并到Nushell内部状态
5. **_(打印)_**：显示结果(如果非`null`)
6. **_(循环)_**：等待下一个输入

换句话说，每个REPL调用都是独立的解析-求值序列。通过将环境合并回Nushell状态，我们保持了REPL调用之间的连续性。

比较 _"用Nu的方式思考"_ 中的简化版[`cd`示例](./thinking_in_nu.md#example-change-to-a-different-directory-cd-and-source-a-file)：

```nu
cd spam
source-env foo.nu
```

我们看到这不能工作(作为脚本或其他单一表达式)，因为目录将在解析时[`source-env`关键字](/commands/docs/source-env.md)尝试读取文件 _之后_ 被更改。

然而，作为单独的REPL条目运行这些命令可以工作：

```nu
> cd spam
> source-env foo.nu
# 成功运行！
```

要理解原因，让我们分解示例中发生的情况：

1. 读取`cd spam`命令行
2. 解析`cd spam`命令行
3. 求值`cd spam`命令行
4. 将环境(包括当前目录)合并到Nushell状态
5. 读取并解析`source-env foo.nu`
6. 求值`source-env foo.nu`
7. 将环境(包括`foo.nu`的任何更改)合并到Nushell状态

当`source-env`在第5步解析期间尝试打开`foo.nu`时，它可以这样做，因为第3步的目录更改已在第4步合并到Nushell状态中。因此，它在后续的解析/求值周期中可见。

### 多行REPL命令行

请注意，这仅适用于 **_单独_** 的命令行。

在Nushell中，可以使用以下方式将多个命令组合成一个命令行：

- 分号：

  ```nu
  cd spam; source-env foo.nu
  ```

- 换行符：

  ```
  > cd span
    source-env foo.nu
  ```

  注意第二行前没有"提示符"。这种多行命令行通常通过[键绑定](./line_editor.md#keybindings)创建，在按下<kbd>Alt</kbd>+<kbd>Enter</kbd>或<kbd>Shift</kbd>+<kbd>Enter</kbd>时插入换行符。

这两个示例在Nushell REPL中的行为完全相同。整个命令行(两个语句)作为单个读取→求值→打印循环处理。因此，它们会像前面的脚本示例一样失败。

::: tip
多行命令行在Nushell中非常有用，但要注意任何顺序错误的解析器关键字。
:::

## 解析时常量求值

虽然无法在求值阶段添加解析功能同时保持静态语言的优点，但我们可以在解析过程中安全地添加*少量*求值功能。

::: tip 术语说明
在下文中，术语 _"常量"_ 指：

- `const`定义
- 当提供常量输入时输出常量值的任何命令的结果

:::

本质上，**_常量_** 和常量值在解析时是已知的。这与 _变量_ 声明和值形成鲜明对比。

因此，我们可以将常量用作[`source`](/commands/docs/source.md)、[`use`](/commands/docs/use.md)等解析时关键字的安全已知参数。

考虑 _"用Nu的方式思考"_ 中的[这个示例](./thinking_in_nu.md#example-dynamically-creating-a-filename-to-be-sourced)：

```nu
let my_path = "~/nushell-files"
source $"($my_path)/common.nu"
```

如前所述，我们可以改为这样做：

```nu:line-numbers
const my_path = "~/nushell-files"
source $"($my_path)/common.nu"
```

让我们分析这个版本的解析/求值过程：

1. 整个程序被解析为IR：

   1. 第1行：`const`定义被解析。由于它是常量赋值(且`const`也是解析器关键字)，该赋值也可以在此阶段被求值。其名称和值由解析器存储。
   2. 第2行：`source`命令被解析。由于`source`也是解析器关键字，它在此阶段被求值。在本例中，它可以 **_成功_** 解析，因为其参数是 **_已知的_** 并且可以在此点检索。
   3. `~/nushell-files/common.nu`的源代码被解析。如果无效，则会生成错误，否则IR结果将包含在下一阶段的求值中。

2. 整个IR被求值：
   1. 第1行：`const`定义被求值。变量被添加到运行时栈。
   2. 第2行：解析`~/nushell-files/common.nu`的IR结果被求值。

::: important

- `eval`在求值期间添加额外的解析
- 解析时常量则相反，在解析器中添加额外的求值

:::

还需记住，解析期间允许的求值 **_非常有限_** 。它仅限于常规求值允许的一小部分。

例如，以下是不允许的：

```nu
const foo_contents = (open foo.nu)
```

换句话说，只有一小部分命令和表达式可以生成常量值。对于允许的命令：

- 它必须设计为输出常量值
- 其所有输入也必须是常量值、字面量或字面量的复合类型(如记录、列表、表格)

一般来说，这些命令和结果表达式相当简单且 **_没有副作用_** 。否则，解析器很容易进入不可恢复的状态。例如，想象尝试将无限流分配给常量。解析阶段将永远不会完成！

::: tip
你可以使用以下命令查看哪些Nushell命令可以返回常量值：

```nu
help commands | where is_const
```

:::

例如，`path join`命令可以输出常量值。Nushell还在`$nu`常量记录中定义了几个有用的路径。这些可以组合起来创建有用的解析时常量求值，如：

```nu
const my_startup_modules =  $nu.default-config-dir | path join "my-mods"
use $"($my_startup_modules)/my-utils.nu"
```

::: note 补充说明
编译型("静态")语言通常也有在编译时传达某些逻辑的方式。例如：

- C的预处理器
- Rust宏
- [Zig的comptime](https://kristoff.it/blog/what-is-zig-comptime)，这是Nushell解析时常量求值的灵感来源

这样做有两个原因：

1. _提高运行时性能_：编译阶段的逻辑不需要在运行时重复。

   目前这不适用于Nushell，因为解析结果(IR)不会在求值后存储。不过，这已被考虑作为未来的可能功能。

2. 与Nushell的解析时常量求值一样，这些功能有助于(安全地)解决因缺少`求值函数`而导致的限制。

:::

## 结论

Nushell运行在通常由 _"动态"_、*"解释型"*语言(如Python、Bash、Zsh、Fish等)主导的脚本语言领域。Nushell也是 *"解释型"*的，因为代码会立即运行(无需单独的手动编译)。

然而，它并不 _"动态"_，因为它没有`求值函数`构造。在这方面，它与Rust或Zig等 *"静态"*编译型语言有更多共同点。

缺少`求值函数`常常让许多新用户感到惊讶，这也是为什么将Nushell视为编译型静态语言会有所帮助。
