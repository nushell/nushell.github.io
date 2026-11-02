# 控制流

Nushell 提供了几个命令来帮助确定不同代码组的执行方式。在编程语言中，这种功能通常被称为*控制流*。

::: tip
需要注意的一点是，本页讨论的所有命令都使用[代码块](./types_of_data.md#代码块)。这意味着你可以在其中改变[环境变量](./environment.md)和其他[可变变量](./variables.md#可变变量)。例外是 [`try`](#try) 的 `catch` 和 `finally` 部分，它们是闭包。
:::

## 已涵盖内容

下面我们介绍一些与控制流相关的命令，但在开始之前，值得注意的是，在其他章节中已经介绍了一些与控制流相关或可以在相同情况下使用的功能和概念。这些包括：

- [管道](./pipelines.md)页面上的管道。
- [数据类型](./types_of_data.md)页面上的闭包。
- [使用列表](./working_with_lists.md)页面上的迭代命令。例如：
  - [`each`](/commands/docs/each.md)
  - [`where`](/commands/docs/where.md)
  - [`reduce`](/commands/docs/reduce.md)

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

[`if`](/commands/docs/if.md) 根据一个或多个条件的结果来评估分支[代码块](./types_of_data.md#代码块)，类似于其他编程语言中的 "if" 功能。例如：

```nu
let x = 5
if $x > 0 { 'positive' }
# => positive
```

当条件为 `true`（`$x` 大于零）时返回 `'positive'`，当条件为 `false`（`$x` 小于或等于零）时返回 `null`。

我们可以在第一个代码块之后为 `if` 添加一个 `else` 分支，当条件为 `false` 时，它会执行并返回 `else` 代码块的结果值。例如：

```nu
let x = -5
if $x > 0 { 'positive' } else { 'non-positive' }
# => non-positive
```

这次，当条件为 `true`（`$x` 大于零）时返回 `'positive'`，当条件为 `false`（`$x` 小于或等于零）时返回 `'non-positive'`。

我们还可以像下面这样将多个 `if` 链接在一起：

```nu
let x = 0
if $x > 0 { 'positive' } else if $x == 0 { 'zero' } else { "negative" }
# => zero
```

当第一个条件为 `true`（`$x` 大于零）时，它将返回 `'positive'`；当第一个条件为 `false` 且下一个条件为 `true`（`$x` 等于零）时，它将返回 `'zero'`；否则，它将返回 `'negative'`（当 `$x` 小于零时）。

### `match`

[`match`](/commands/docs/match.md) 根据给定的值执行多个条件分支之一。你还可以进行一些[模式匹配](../cookbook/pattern_matching.md)来解包列表和记录等复合类型中的值。

[`match`](/commands/docs/match.md) 的基本用法可以像其他语言中常见的 "switch" 语句一样有条件地运行不同的代码。[`match`](/commands/docs/match.md) 检查 `match` 关键字后面的值是否等于每个分支开头 `=>` 前面的值，如果相等，则执行该分支 `=>` 后面的代码。

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

分支可以返回单个值，或者如第二个分支所示，可以返回[代码块](./types_of_data.md#代码块)的结果。

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

（提醒一下，[`match`](/commands/docs/match.md) 是一个表达式，这就是为什么我们可以在这里将结果赋给 `$foo`）。

#### 模式匹配

你可以使用[模式匹配](../cookbook/pattern_matching.md)从列表和记录等类型中“解包”值。然后，你可以将变量赋给你想要解包的部分，并在匹配的表达式中使用它们。

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

列表的解包方式相同。在列表模式中，`..` 代表任意数量的项，它可以位于开头、中间或末尾。`..$name` 还会把这些项绑定到一个变量：

```nu
let steps = [build test done]
match $steps {
    [] => 'nothing to do',
    [.., 'done'] => 'finished',
    [$current, ..] => $"running ($current)"
}
# => finished
```

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

你可以在[模式匹配手册页面](../cookbook/pattern_matching.md)中找到有关 [`match`](/commands/docs/match.md) 的更多详细信息。

## 循环

循环命令允许你多次重复一个代码块。

### 循环和其他迭代命令

循环命令的功能类似于将闭包应用于列表或表格中的元素的命令，例如 [`each`](/commands/docs/each.md) 或 [`where`](/commands/docs/where.md)，很多时候你可以用任何一种方法完成同样的事情。例如：

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

虽然如果你熟悉其他语言中的循环，可能会倾向于使用循环，但在 Nushell 中，当你能用任何一种方式解决问题时，使用应用闭包的命令被认为是更符合 [Nushell 风格](./thinking_in_nu.md)（惯用）的。原因在于使用循环有一个相当大的缺点。

#### 循环的缺点

循环最大的缺点是它们是语句，而 [`each`](/commands/docs/each.md) 是表达式。像 [`each`](/commands/docs/each.md) 这样的表达式总会产生某个输出值，而语句则不会。

这意味着它们不能很好地与不可变变量一起工作，而使用不可变变量被认为是更符合 [Nushell 风格](./thinking_in_nu.md#变量默认是不可变的)的。在上一节的示例中，如果没有预先声明的可变变量，就不可能使用 [`for`](/commands/docs/for.md) 来获取递增数字的列表，或任何值。

语句在需要某些输出的 Nushell 管道中也无法工作。事实上，如果你尝试这样做，Nushell 会报错：

```nu
[1 2 3] | for x in $in { $x + 1 } | $in ++ [5 6 7]
# => Error: nu::parser::unexpected_keyword
# =>
# =>   × Statement used in pipeline.
# =>    ╭─[repl_entry #1:1:11]
# =>  1 │ [1 2 3] | for x in $in { $x + 1 } | $in ++ [5 6 7]
# =>    ·           ─┬─
# =>    ·            ╰── not allowed in pipeline
# =>    ╰────
# =>   help: 'for' keyword is not allowed in pipeline. Use 'for' by itself, outside of a pipeline.
```

因为 Nushell 非常面向管道，这意味着使用像 [`each`](/commands/docs/each.md) 这样的表达式命令通常比循环语句更自然。

#### 循环的优点

如果循环有这么大的缺点，为什么它们还存在呢？一个原因是，像 [`each`](/commands/docs/each.md) 使用的闭包不能修改周围环境中的可变变量。如果你尝试在闭包中修改可变变量，你会得到一个错误：

```nu
mut foo = []
[1 2 3] | each { $foo = ($foo | append ($in + 1)) }
# => Error: nu::parser::expected_keyword
# =>
# =>   × Capture of mutable variable.
# =>    ╭─[repl_entry #1:2:18]
# =>  1 │ mut foo = []
# =>  2 │ [1 2 3] | each { $foo = ($foo | append ($in + 1)) }
# =>    ·                  ──┬─
# =>    ·                    ╰── capture of mutable variable
# =>    ╰────
```

如果你在闭包中修改环境变量，你可以，但它只会在闭包的作用域内修改它，在其他地方保持不变。然而，循环使用[代码块](./types_of_data.md#代码块)，这意味着它们可以在更大的作用域内修改常规的可变变量或环境变量。

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

另一方面，错误并不是选择其中一个的理由。当传给 `each` 的闭包失败时，Nushell 会报告闭包自身的错误，并在正在处理的输入项上附加一个 `source value` 标签：

```nu
[0] | each { error make { msg: "Custom error" } | default '' }
# => Error: nu::shell::error
# =>
# =>   × Custom error
# =>    ╭─[repl_entry #1:1:2]
# =>  1 │ [0] | each { error make { msg: "Custom error" } | default '' }
# =>    ·  ┬                      ───────────────────────
# =>    ·  ╰── source value
# =>    ╰────
```

`for` 循环报告同样的错误，但没有 `source value` 标签：

```nu
for x in [0] { error make { msg: "Custom error" } }
# => Error: nu::shell::error
# =>
# =>   × Custom error
# =>    ╭─[repl_entry #2:1:27]
# =>  1 │ for x in [0] { error make { msg: "Custom error" } }
# =>    ·                           ───────────────────────
# =>    ╰────
```

### `for`

[`for`](/commands/docs/for.md) 循环遍历一个范围或集合，如列表或表格。

```nu
for x in [1 2 3] { $x * $x | print }
# => 1
# => 4
# => 9
```

#### 表达式命令替代方案

- [`each`](/commands/docs/each.md)
- [`par-each`](/commands/docs/par-each.md)
- [`where`](/commands/docs/where.md)
- [`reduce`](/commands/docs/reduce.md)

### `while`

[`while`](/commands/docs/while.md) 循环执行同一个代码块，直到给定的条件为 `false`。

```nu
mut x = 0; while $x < 10 { $x = $x + 1 }; $x
# => 10
```

#### 表达式命令替代方案

"until" 和其他 "while" 命令

- [`take until`](/commands/docs/take_until.md)
- [`take while`](/commands/docs/take_while.md)
- [`skip until`](/commands/docs/skip_until.md)
- [`skip while`](/commands/docs/skip_while.md)

### `loop`

[`loop`](/commands/docs/loop.md) 无限循环一个代码块。你可以使用 [`break`](/commands/docs/break.md)（如下一节所述）来限制它循环的次数。它对于连续运行的脚本也很有用，比如交互式提示符。

```nu
mut x = 0; loop { if $x > 10 { break }; $x = $x + 1 }; $x
# => 11
```

### `break`

[`break`](/commands/docs/break.md) 将停止执行循环中的代码，并恢复在循环之后执行。有效地“跳出”循环。

```nu
for x in 1..10 { if $x > 3 { break }; print $x }
# => 1
# => 2
# => 3
```

### `continue`

[`continue`](/commands/docs/continue.md) 将停止执行当前循环，跳过循环中剩余的代码，并进入下一个循环。如果循环通常会结束，比如 [`for`](/commands/docs/for.md) 已经遍历了所有给定的元素，或者 [`while`](/commands/docs/while.md) 的条件现在为 false，它将不会再次循环，执行将在循环块之后继续。

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

[`error make`](/commands/docs/error_make.md) 创建一个错误，停止代码和任何调用它的代码的执行，直到它被 [`try`](/commands/docs/try.md) 块处理，或者它结束脚本并输出错误消息。此功能与其他语言中的“异常”相同。

```nu
print 'printed'; error make { msg: 'Some error info' }; print 'unprinted'
# => printed
# => Error: nu::shell::error
# =>
# =>   × Some error info
# =>    ╭─[repl_entry #1:1:29]
# =>  1 │ print 'printed'; error make { msg: 'Some error info' }; print 'unprinted'
# =>    ·                             ──────────────────────────
# =>    ╰────
```

传递给它的记录为捕获它的代码或最终的错误消息提供了一些信息。

你可以在[创建自己的错误页面](./creating_errors.md)上找到有关 [`error make`](/commands/docs/error_make.md) 和错误概念的更多信息。

### `try`

[`try`](/commands/docs/try.md) 将捕获在 [`try`](/commands/docs/try.md) 的代码块中任何地方创建的错误，并在块之后恢复代码的执行。

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

如果在 [`try`](/commands/docs/try.md) 块之后包含一个 `catch` 块，如果 [`try`](/commands/docs/try.md) 块中发生错误，它将执行 `catch` 块中的代码。

```nu
try { 1 / 0 } catch { 'An error happened!' } | $in ++ ' And now I am resuming.'
# => An error happened! And now I am resuming.
```

如果没有发生错误，它将不会执行 `catch` 块。

`catch` 闭包可以接受一个参数，该参数会收到描述错误的记录：

```nu
try { 1 / 0 } catch {|err| $err.msg }
# => Division by zero.
```

`try` 也适用于外部命令：

```nu
try { ^nonexisting }; print 'a'
# => a

^nonexisting; print 'a'
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[repl_entry #2:1:2]
# =>  1 │ ^nonexisting; print 'a'
# =>    ·  ─────┬─────
# =>    ·       ╰── Command `nonexisting` not found
# =>    ╰────
# =>   help: `nonexisting` is neither a Nushell built-in or a known external command
```

#### `finally`

可以在 `try`（带或不带 `catch`）之后加上一个 `finally` 块。无论 `try` 块成功、捕获到错误、
还是错误仍在向上抛出，它都会在 `try` 表达式结束时**总是**运行。这使它成为放置清理代码的好地方：

```nu
try { 1 / 0 } catch { 'caught' } finally { print 'cleaning up' }
# => cleaning up
# => caught
```

当代码通过 `return`、`break`、`continue` 或 [`exit`](/commands/docs/exit.md) 提前离开
`try` 或 `catch` 块时，`finally` 同样会运行。（使用 `exit --abort` 可以在退出时不运行它。）

```nu
def get-answer [] {
  try {
    return 42
  } finally {
    print 'cleaning up'
  }
}

get-answer
# => cleaning up
# => 42
```

整个表达式的值是 `try` 或 `catch` 块的值，`finally` 返回什么都会被丢弃。
`finally` 闭包可以接受一个参数，该参数也可以作为 `$in` 使用。它接收到的是：

- 如果块正常结束，则是 `try` 或 `catch` 块的值；
- 如果发生了错误且没有被 `catch` 处理，则是错误记录；
- 如果块是通过 `return`、`break`、`continue` 或 `exit` 离开的，则是 `nothing`。

```nu
try { 'result' } finally {|v| print $"finally got: ($v)" }
# => finally got: result
# => result
```

没有 `catch` 时，错误不会被抑制。`finally` 会运行，然后错误继续向上传播：

```nu
try { 1 / 0 } finally { print 'cleaning up' }
# => cleaning up
# => Error: nu::shell::division_by_zero
# =>
# =>   × Division by zero.
# =>    ╭─[repl_entry #1:1:9]
# =>  1 │ try { 1 / 0 } finally { print 'cleaning up' }
# =>    ·         ┬
# =>    ·         ╰── division by zero
# =>    ╰────
```

## 其他

### `return`

[`return`](/commands/docs/return.md) 提前结束一个闭包或命令，而不运行命令/闭包的其余部分，并返回给定的值。通常不是必需的，因为闭包或命令中的最后一个值也会被返回，但有时它可能很方便。

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
