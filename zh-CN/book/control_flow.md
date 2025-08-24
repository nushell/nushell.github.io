# 控制流

Nushell 提供了几个命令来帮助确定不同代码组的执行方式。在编程语言中，这种功能通常被称为*控制流*。

::: tip
需要注意的一点是，本页讨论的所有命令都使用[代码块](/book/types_of_data.html#blocks)。这意味着你可以在其中改变[环境变量](/book/environment.html)和其他[可变变量](/book/variables.html#mutable-variables)。
:::

## 已涵盖内容

下面我们介绍一些与控制流相关的命令，但在开始之前，值得注意的是，在其他章节中已经介绍了一些与控制流相关或可以在相同情况下使用的功能和概念。这些包括：

- [管道](/book/pipelines.html)页面上的管道。
- [数据类型](/book/types_of_data.html)页面上的闭包。
- [使用列表](/book/working_with_lists.html)页面上的迭代命令。例如：
  - [`each`](/commands/docs/each.html)
  - [`where`](/commands/docs/where.html)
  - [`reduce`](/commands/docs/reduce.html)

## 选择（条件）

以下命令根据给定的某些条件执行代码。

::: tip
选择/条件命令是表达式，因此它们返回值，与本页上的其他命令不同。这意味着以下代码是可行的。

```nu
'foo' | if $in == 'foo' { 1 } else { 0 } | $in + 2
# => 3
```

:::

### `if`

[`if`](/commands/docs/if.html) 根据一个或多个条件的结果来评估分支[代码块](/book/types_of_data.html#blocks)，类似于其他编程语言中的 "if" 功能。例如：

```nu
if $x > 0 { 'positive' }
```

当条件为 `true`（`$x` 大于零）时返回 `'positive'`，当条件为 `false`（`$x` 小于或等于零）时返回 `null`。

我们可以在第一个代码块之后为 `if` 添加一个 `else` 分支，当条件为 `false` 时，它会执行并返回 `else` 代码块的结果值。例如：

```nu
if $x > 0 { 'positive' } else { 'non-positive' }
```

这次，当条件为 `true`（`$x` 大于零）时返回 `'positive'`，当条件为 `false`（`$x` 小于或等于零）时返回 `'non-positive'`。

我们还可以像下面这样将多个 `if` 链接在一起：

```nu
if $x > 0 { 'positive' } else if $x == 0 { 'zero' } else { "negative" }
```

当第一个条件为 `true`（`$x` 大于零）时，它将返回 `'positive'`；当第一个条件为 `false` 且下一个条件为 `true`（`$x` 等于零）时，它将返回 `'zero'`；否则，它将返回 `'negative'`（当 `$x` 小于零时）。

### `match`

[`match`](/commands/docs/match.html) 根据给定的值执行多个条件分支之一。你还可以进行一些[模式匹配](/zh-CN/cookbook/pattern_matching.html)来解包列表和记录等复合类型中的值。

[`match`](/commands/docs/match.html) 的基本用法可以像其他语言中常见的 "switch" 语句一样有条件地运行不同的代码。[`match`](/commands/docs/match.html) 检查 `match` 关键字后面的值是否等于每个分支开头 `=>` 前面的值，如果相等，则执行该分支 `=>` 后面的代码。

```nu
match 3 {
    1 => 'one',
    2 => {
        let w = 'w'
        't' + $w + 'o'
    },
    3 => 'three',
    4 => 'four'
}
# => three
```

分支可以返回单个值，或者如第二个分支所示，可以返回[代码块](/book/types_of_data.html#blocks)的结果。

#### 捕获所有分支

你还可以有一个捕获所有条件的分支，用于当给定值不匹配任何其他条件时，方法是让一个分支的匹配值为 `_`。

```nu
let foo = match 7 {
    1 => 'one',
    2 => 'two',
    3 => 'three',
    _ => 'other number'
}
$foo
# => other number
```

（提醒一下，[`match`](/commands/docs/match.html) 是一个表达式，这就是为什么我们可以在这里将结果赋给 `$foo`）。

#### 模式匹配

你可以使用[模式匹配](/zh-CN/cookbook/pattern_matching.html)从列表和记录等类型中“解包”值。然后，你可以将变量赋给你想要解包的部分，并在匹配的表达式中使用它们。

```nu
let foo = { name: 'bar', count: 7 }
match $foo {
    { name: 'bar', count: $it } => ($it + 3),
    { name: _, count: $it } => ($it + 7),
    _ => 1
}
# => 10
```

第二个分支中的 `_` 意味着它匹配任何具有 `name` 和 `count` 字段的记录，而不仅仅是 `name` 为 `'bar'` 的记录。

#### 守卫

你还可以为每个分支添加一个称为“守卫”的附加条件，以确定是否应匹配该分支。为此，在匹配模式之后，在 `=>` 之前放置 `if` 和条件。

```nu
let foo = { name: 'bar', count: 7 }
match $foo {
    { name: 'bar', count: $it } if $it < 5 => ($it + 3),
    { name: 'bar', count: $it } if $it >= 5 => ($it + 7),
    _ => 1
}
# => 14
```

---

你可以在[模式匹配手册页面](https://www.nushell.sh/cookbook/pattern_matching.html)中找到有关 [`match`](/commands/docs/match.html) 的更多详细信息。

## 循环

循环命令允许你多次重复一个代码块。

### 循环和其他迭代命令

循环命令的功能类似于将闭包应用于列表或表中的元素的命令，例如 [`each`](/commands/docs/each.html) 或 [`where`](/commands/docs/where.html)，很多时候你可以用任何一种方法完成同样的事情。例如：

```nu
mut result = []
for $it in [1 2 3] { $result = ($result | append ($it + 1)) }
$result
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 3 │
# => │ 2 │ 4 │
# => ╰───┴───╯


[1 2 3] | each { $in + 1 }
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 3 │
# => │ 2 │ 4 │
# => ╰───┴───╯
```

虽然如果你熟悉其他语言中的循环，可能会倾向于使用循环，但在 Nushell 中，当你能用任何一种方式解决问题时，使用应用闭包的命令被认为是更符合 [Nushell 风格](/book/thinking_in_nu.html)（惯用）的。原因在于使用循环有一个相当大的缺点。

#### 循环的缺点

循环最大的缺点是它们是语句，而 [`each`](/commands/docs/each.html) 是表达式。像 [`each`](/commands/docs/each.html) 这样的表达式总会产生某个输出值，而语句则不会。

这意味着它们不能很好地与不可变变量一起工作，而使用不可变变量被认为是更符合 [Nushell 风格](/book/thinking_in_nu.html#variables-are-immutable)的。在上一节的示例中，如果没有预先声明的可变变量，就不可能使用 [`for`](/commands/docs/each.html) 来获取递增数字的列表，或任何值。

语句在需要某些输出的 Nushell 管道中也无法工作。事实上，如果你尝试这样做，Nushell 会报错：

```nu
[1 2 3] | for x in $in { $x + 1 } | $in ++ [5 6 7]
# => Error: nu::parser::unexpected_keyword
# =>
# =>   × Statement used in pipeline.
# =>    ╭─[entry #5:1:1]
# =>  1 │ [1 2 3] | for x in $in { $x + 1 } | $in ++ [5 6 7]
# =>    ·           ─┬─
# =>    ·            ╰── not allowed in pipeline
# =>    ╰────
# =>   help: 'for' keyword is not allowed in pipeline. Use 'for' by itself, outside of a pipeline.
```

因为 Nushell 非常面向管道，这意味着使用像 [`each`](/commands/docs/each.html) 这样的表达式命令通常比循环语句更自然。

#### 循环的优点

如果循环有这么大的缺点，为什么它们还存在呢？一个原因是，像 [`each`](/commands/docs/each.html) 使用的闭包不能修改周围环境中的可变变量。如果你尝试在闭包中修改可变变量，你会得到一个错误：

```nu
mut foo = []
[1 2 3] | each { $foo = ($foo | append ($in + 1)) }
# => Error: nu::parser::expected_keyword
# =>
# =>   × Capture of mutable variable.
# =>    ╭─[entry #8:1:1]
# =>  1 │ [1 2 3] | each { $foo = ($foo | append ($in + 1)) }
# =>    ·                  ──┬─
# =>    ·                    ╰── capture of mutable variable
# =>    ╰────
```

如果你在闭包中修改环境变量，你可以，但它只会在闭包的作用域内修改它，在其他地方保持不变。然而，循环使用[代码块](/book/types_of_data.html#blocks)，这意味着它们可以在更大的作用域内修改常规的可变变量或环境变量。

```nu
mut result = []
for $it in [1 2 3] { $result = ($result | append ($it + 1)) }
$result
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 3 │
# => │ 2 │ 4 │
# => ╰───┴───╯
```

### `for`

[`for`](/commands/docs/for.html) 循环遍历一个范围或集合，如列表或表。

```nu
for x in [1 2 3] { $x * $x | print }
# => 1
# => 4
# => 9
```

#### 表达式命令替代方案

- [`each`](/commands/docs/each.html)
- [`par-each`](/commands/docs/par-each.html)
- [`where`](/commands/docs/where.html)/[`filter`](/commands/docs/filter.html)
- [`reduce`](/commands/docs/reduce.html)

### `while`

[`while`](/commands/docs/while.html) 循环执行同一个代码块，直到给定的条件为 `false`。

```nu
mut x = 0; while $x < 10 { $x = $x + 1 }; $x
# => 10
```

#### 表达式命令替代方案

"until" 和其他 "while" 命令

- [`take until`](/commands/docs/take_until.html)
- [`take while`](/commands/docs/take_while.html)
- [`skip until`](/commands/docs/skip_until.html)
- [`skip while`](/commands/docs/skip_while.html)

### `loop`

[`loop`](/commands/docs/loop.html) 无限循环一个代码块。你可以使用 [`break`](/commands/docs/break.html)（如下一节所述）来限制它循环的次数。它对于连续运行的脚本也很有用，比如交互式提示符。

```nu
mut x = 0; loop { if $x > 10 { break }; $x = $x + 1 }; $x
# => 11
```

### `break`

[`break`](/commands/docs/break.html) 将停止执行循环中的代码，并恢复在循环之后执行。有效地“跳出”循环。

```nu
for x in 1..10 { if $x > 3 { break }; print $x }
# => 1
# => 2
# => 3
```

### `continue`

[`continue`](/commands/docs/continue.html) 将停止执行当前循环，跳过循环中剩余的代码，并进入下一个循环。如果循环通常会结束，比如 [`for`](/commands/docs/for.html) 已经遍历了所有给定的元素，或者 [`while`](/commands/docs/while.html) 的条件现在为 false，它将不会再次循环，执行将在循环块之后继续。

```nu
mut x = -1; while $x <= 6 { $x = $x + 1; if $x mod 3 == 0 { continue }; print $x }
# => 1
# => 2
# => 4
# => 5
# => 7
```

## 错误

### `error make`

[`error make`](/commands/docs/error_make.html) 创建一个错误，停止代码和任何调用它的代码的执行，直到它被 [`try`](/commands/docs/try.html) 块处理，或者它结束脚本并输出错误消息。此功能与其他语言中的“异常”相同。

```nu
print 'printed'; error make { msg: 'Some error info' }; print 'unprinted'
# => printed
# => Error:   × Some error info
# =>    ╭─[entry #9:1:1]
# =>  1 │ print 'printed'; error make { msg: 'Some error info' }; print 'unprinted'
# =>    ·                  ─────┬────
# =>    ·                       ╰── originates from here
# =>    ╰────
```

传递给它的记录为捕获它的代码或最终的错误消息提供了一些信息。

你可以在[创建自己的错误页面](/book/creating_errors.html)上找到有关 [`error make`](/commands/docs/error_make.html) 和错误概念的更多信息。

### `try`

[`try`](/commands/docs/try.html) 将捕获在 [`try`](/commands/docs/try.html) 的代码块中任何地方创建的错误，并在块之后恢复代码的执行。

```nu
try { error make { msg: 'Some error info' }}; print 'Resuming'
# => Resuming
```

这包括捕获内置错误。

```nu
try { 1 / 0 }; print 'Resuming'
# => Resuming
```

如果发生错误，结果值将是 `nothing`，如果没有发生错误，则为块的返回值。

如果在 [`try`](/commands/docs/try.html) 块之后包含一个 `catch` 块，如果 [`try`](/commands/docs/try.html) 块中发生错误，它将执行 `catch` 块中的代码。

```nu
try { 1 / 0 } catch { 'An error happened!' } | $in ++ ' And now I am resuming.'
# => An error happened! And now I am resuming.
```

如果没有发生错误，它将不会执行 `catch` 块。

`try` 也适用于外部命令：

```nu
try { ^nonexisting }; print 'a'
# => a

^nonexisting; print 'a'
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[entry #3:1:2]
# =>  1 │ ^nonexisting; print 'a'
# =>    ·  ─────┬─────
# =>    ·       ╰── Command `nonexisting` not found
# =>    ╰────
# =>   help: `nonexisting` is neither a Nushell built-in or a known external command
```

## 其他

### `return`

[`return`](/commands/docs/return.html) 提前结束一个闭包或命令，而不运行命令/闭包的其余部分，并返回给定的值。通常不是必需的，因为闭包或命令中的最后一个值也会被返回，但有时它可能很方便。

```nu
def 'positive-check' [it] {
    if $it > 0 {
        return 'positive'
    };

    'non-positive'
}
```

```nu
positive-check 3
# => positive

positive-check (-3)
# => non-positive

let positive_check = {|elt| if $elt > 0 { return 'positive' }; 'non-positive' }

do $positive_check 3
# => positive

do $positive_check (-3)
# => non-positive
```
