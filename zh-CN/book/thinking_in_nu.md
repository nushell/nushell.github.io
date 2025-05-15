# 以 Nushell 的方式思考

为了帮助你理解并充分利用 Nushell，我们把这部分内容一起放入“以 Nushell 的方式思考”这一节。通过学习 Nushell 的思考方式，并使用它提供的模式，你会在开始时遇到更少的问题，并为接下来的成功做好准备。

那么，用 Nushell 的方式思考是什么意思呢？下面是一些 Nushell 新用户常见的问题。

## Nushell 不是 Bash

Nushell 既是一种编程语言，也是一种 Shell。正因为如此，它有自己的方式来处理文件、目录、网站等等。我们对其进行了建模，以使其与你可能熟悉的其他 Shell 的工作方式接近。其中管道用于将两个命令连接在一起：

```nu
ls | length
```

Nushell 也支持其他常见的功能，例如从之前运行的命令中获取退出代码（Exit Code）。

虽然它确实有这些功能，但 Nushell 并不是 Bash。Bash 的工作方式以及一般的 POSIX 风格，并不是 Nushell 所支持的。例如，在 Bash 中你可以使用：

```shell
echo "hello" > output.txt
```

在 Nushell 中，我们使用 `>` 作为大于运算符，这与 Nushell 的语言特质比较吻合。取而代之的是，你需要用管道将其连接到一个可以保存内容的命令：

```nu
"hello" | save output.txt
```

**以 Nushell 的方式思考：** Nushell 看待数据的方式是，数据在管道中流动，直到它到达用户或由最后的命令处理。你可以简单地输入数据，从字符串到类似 JSON 的列表和记录，然后使用 `|` 将其通过管道发送。Nushell 使用命令来执行工作并生成更多数据。学习这些命令以及何时使用它们有助于你组合使用多种管道。

## 把 Nushell 想象成一种编译型语言

Nushell 设计的一个重要部分，特别是它与许多动态语言不同的地方是，Nushell 将你提供给它的源代码转换成某种可执行产物，然后再去运行它。Nushell 没有 `eval` 功能，因此也不允许你在运行时继续拉入新的源代码。这意味着对于诸如引入文件使其成为你项目的一部分这样的任务，需要知道文件的具体路径，就如同 C++ 或 Rust 等编译语言中的文件引入一样。

例如，下面的代码作为 **[脚本](/zh-CN/book/scripts.md)** 将无法执行（当然，在**交互式模式**里一句句运行是可以的）：

```nu
# compiled.nu
"def abc [] { 1 + 2 }" | save output.nu
sleep 1sec # 延时 1 秒，但是并没有作用，因为是整体编译的。
source "output.nu"
abc
```

```nu
nu compiled.nu
# => Error: nu::parser::sourced_file_not_found
# => 
# =>   × File not found
# =>    ╭─[.../compiled.nu:2:1]
# =>  2 │ sleep 1sec
# =>  3 │ source "output.nu"
# =>    ·        ─────┬─────
# =>    ·             ╰── File not found: output.nu
# =>  4 │ abc
# =>    ╰────
# =>   help: sourced files need to be available before your script is run
```

但是，以 [组](types_of_data.html#组) 的方式在**交互式模式**中运行就又和脚本一样了：

```nu
"def abc [] { 1 + 2 }" | save output.nu; sleep 1sec; source "output.nu"; abc
# => Error: nu::parser::sourced_file_not_found
# => 
# =>   × File not found
# =>    ╭─[entry #1:1:1]
# =>  1 │ "def abc [] { 1 + 2 }" | save output.nu; sleep 1sec; source "output.nu"; abc
# =>    ·                                                             ─────┬─────
# =>    ·                                                                  ╰── File not found: output.nu
# =>    ╰────
# =>   help: sourced files need to be available before your script is run
```

`source` 命令将引入被编译的源码，但前面那行 `save` 命令还没有机会运行。Nushell 运行整个程序块就像运行一个文件一样，而不是一次运行一行。在这个例子中，由于 `output.nu` 文件是在“编译”步骤之后才创建的，因此 `source` 命令在解析时无法从其中读取定义。

另一个常见的问题是试图动态地创建文件名并 `source`，如下：

```nu
source $"($my_path)/common.nu"
```

这就需要求值器（Evaluator）运行并对字符串进行求值（Evaluate），但不幸的是，Nushell 在编译时就需要这些信息。

**以 Nushell 的方式思考：** Nushell 被设计为对你输入的所有源代码使用一个单一的“编译”步骤，这与求值是分开的。这将允许强大的 IDE 支持，准确的错误提示，并成为第三方工具更容易使用的语言，以及在未来甚至可以有更高级的输出，比如能够直接将 Nushell 编译为二进制文件等。

## 变量是不可变的

对于来自其他语言的人来说（Rustaceans 除外），另一个常见的令人惊愕之处是 Nushell 的变量是不可变的（事实上，有些人已经开始称它们为“**常量**”来反映这一点）。接触 Nushell，你需要花一些时间来熟悉更多的函数式风格，因为这往往有助于写出与**不可变的变量**最相容的代码。

你可能想知道为什么 Nushell 使用不可变的变量，在 Nushell 开发的早期，我们决定看看我们能在语言中使用多长时间的以数据为中心的函数式风格。最近，我们在 Nushell 中加入了一个关键的功能，使这些早期的实验显示出其价值：并行性。通过在任何 Nushell 脚本中将 [`each`](/commands/docs/each.md) 切换到 [`par-each`](/commands/docs/par-each.md) ，你就能够在“输入”上并行地运行相应的代码块。这是可能的，因为 Nushell 的设计在很大程度上依赖于不可变性、组合和流水线。

Nushell 的变量是不可变的，但这并不意味着无法表达变化。Nushell 大量使用了 "Shadowing" 技术（变量隐藏）。变量隐藏是指创建一个与之前声明的变量同名的新变量。例如，假设你有一个 `$x` 在当前作用域内，而你想要一个新的 `$x` 并将其加 1：

```nu
let x = $x + 1
```

这个新的 `x` 对任何跟在这一行后面的代码都是可见的。谨慎地使用变量隐藏可以使变量的使用变得更容易，尽管这不是必须的。

循环计数器是可变变量的另一种常见模式，它被内置于大多数迭代命令中，例如，你可以使用 [`each`](/commands/docs/each.md) 上的 `-n` 标志同时获得每个元素的值和索引：

```nu
ls | enumerate | each { |elt| $"Number ($elt.index) is size ($elt.item.size)" }
```

你也可以使用 [`reduce`](/commands/docs/reduce.md) 命令来达到上述目的，其方式与你在循环中修改一个变量相同。例如，如果你想在一个字符串列表中找到最长的字符串，你可以这样做：

```nu
[one, two, three, four, five, six] | reduce {|curr, max|
    if ($curr | str length) > ($max | str length) {
        $curr
    } else {
        $max
    }
}
```

**以 Nushell 的方式思考：** 如果你习惯于使用可变的变量来完成不同的任务，那么你将需要一些时间来学习如何以更加函数式的方式来完成每个任务。Nushell 有一套内置的能力来帮助处理这样的模式，学习它们将帮助你以更加 Nushell 的风格来写代码。由此带来的额外的好处是你可以通过并行运行你的部分代码来加速脚本执行。

## Nushell 的环境是有作用域的

Nushell 从编译型语言中获得了很多设计灵感，其中一个是语言应该避免全局可变状态。Shell 经常通过修改全局变量来更新环境，但 Nushell 避开了这种方法。

在 Nushell 中，代码块可以控制自己的环境，因此对环境的改变是发生在代码块范围内的。

在实践中，这可以让你用更简洁的代码来处理子目录，例如，如果你想在当前目录下构建每个子项目，你可以运行：

```nu
ls | each { |row|
    cd $row.name
    make
}
```

`cd` 命令改变了 `PWD` 环境变量，这个变量的改变只在当前代码块有效，如此即可允许每次迭代都从当前目录开始，进入下一个子目录。

环境变量具有作用域使命令更可预测，更容易阅读，必要时也更容易调试。Nushell 还提供了一些辅助命令，如 [`def --env`](/commands/docs/def.md)、[`load-env`](/commands/docs/load-env.md)，作为对环境变量进行批量更新的辅助方法。

:::tip
这里有一个例外，[`def --env`](/commands/docs/def.md) 允许你创建一个可以修改并保留调用者环境的命令
:::

**以 Nushell 的方式思考：** 在 Nushell 中，没有全局可修改变量的编码最佳实践延伸到了环境变量。使用内置的辅助命令可以让你更容易地处理 Nushell 中的环境变量问题。利用环境变量对代码块具有作用范围这一特性，也可以帮助你写出更简洁的脚本，并与外部命令互动，而不需要在全局环境中添加你不需要的东西。
