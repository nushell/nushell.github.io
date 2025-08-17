# 管道

Nu 的核心设计之一是管道，这个设计思想可以追溯到几十年前 Unix 背后的一些原始理念。正如 Nu 拓展了 Unix 的单一字符串数据类型一样，Nu 也扩展了管道的概念，使其不仅仅包含文本。

## 基础

一个管道由三部分组成：输入、过滤器和输出。

```nu
open Cargo.toml | update workspace.dependencies.base64 0.24.2 | save Cargo_new.toml
```

第一条命令：`open Cargo.toml` 是一个输入（有时也称为 "源" 或 "生产者"），它创建或加载数据，并将其送入管道。管道待处理的值正是来自于此输入。像[`ls`](/zh-CN/commands/docs/ls.md)这样的命令也是输入，因为它们从文件系统中获取数据，并通过管道发送以便能被后续使用。

第二个命令：`update workspace.dependencies.base64 0.24.2` 是一个过滤器。过滤器获取输入的数据并对其进行处理。它们可能会修改它（如我们例子中的[`update`](/zh-CN/commands/docs/update.md)命令），或者在值通过时对其做其他操作，如记录。

最后一条命令：`save "Cargo_new.toml"` 是一个输出（有时称为 "接收者"）。输出从管道中获取输入，并对其进行一些最终操作。在我们的例子中，我们在最后一步把通过管道的内容保存到一个文件中。还有一些其他类型的输出命令可以获取数值并供用户查看。

`$in` 变量可以将管道收集成一个值，允许你将整个流作为一个参数访问，比如：

```nu
[1 2 3] | $in.1 * $in.2
# => 6
```

## 多行管道

如果一个管道对一行来说有些长，你可以把它放在`(`和`)`里：

```nu
let year = (
    "01/22/2021" |
    parse "{month}/{day}/{year}" |
    get year
)
```

## 分号

看这个例子：

```nu
line1; line2 | line3
```

这里，分号与管道结合使用。当使用分号时，不会产生任何输出数据用于管道。因此，紧跟在分号后面的 `$in` 变量将不起作用。

- 因为 `line1` 后面有分号，所以该命令将运行到完成并在屏幕上显示。
- `line2` | `line3` 是一个正常的管道。它运行，其内容在 `line1` 的内容之后显示。

## 管道输入和特殊的 `$in` 变量

Nu 的大部分可组合性来自于特殊的 `$in` 变量，它保存着当前的管道输入。

`$in` 在以下情况下特别有用：

- 命令或外部参数中
- 过滤器中
- 接受管道输入的自定义命令定义或脚本中

### `$in` 作为命令参数或表达式的一部分

比较下面两个创建以明天日期为名称一部分的目录的命令行。以下是等效的：

使用子表达式：

```nu
mkdir $'((date now) + 1day | format date '%F') Report'
```

或者使用管道：

```nu
date now                    # 1: 今天
| $in + 1day                # 2: 明天
| format date '%F'          # 3: 格式化为 YYYY-MM-DD
| $'($in) Report'           # 4: 格式化目录名
| mkdir $in                 # 5: 创建目录
```

虽然第二种形式对于这个刻意设计的例子可能过于冗长，但你会注意到几个优点：

- 它可以通过简单的 <kbd>↑</kbd> (上箭头) 来重复前一个命令并添加管道的下一个阶段，从而逐步组合。
- 它可以说更具可读性。
- 如果需要，可以对每个步骤进行注释。
- 管道中的每个步骤都可以用 [`inspect` 进行调试](/zh-CN/commands/docs/inspect.html)。

让我们检查上面例子中每一行 `$in` 的内容：

- 在第 2 行，`$in` 指的是第 1 行 `date now` 的结果（一个日期时间值）。
- 在第 4 行，`$in` 指的是第 3 行格式化后的明天日期，并用于插值字符串中。
- 在第 5 行，`$in` 指的是第 4 行插值字符串的结果，例如 '2024-05-14 Report'。

### 过滤器闭包中的管道输入

某些[过滤器命令](/zh-CN/commands/categories/filters.html)可能会修改其闭包的管道输入，以便更方便地访问预期的上下文。例如：

```nu
1..10 | each {$in * 2}
```

`each` 过滤器不是引用整个 10 个数字的范围，而是将 `$in` 修改为引用*当前迭代*的值。

在大多数过滤器中，管道输入及其产生的 `$in` 将与闭包参数相同。对于 `each` 过滤器，以下示例与上面的示例等效：

```nu
1..10 | each {|value| $value * 2}
```

然而，一些过滤器会为其闭包的输入分配一个更方便的值。`update` 过滤器就是一个例子。`update` 命令闭包的管道输入（以及 `$in`）指的是正在更新的*列*，而闭包参数指的是整个记录。因此，以下两个示例也是等效的：

```nu
ls | update name {|file| $file.name | str upcase}
ls | update name {str upcase}
```

对于大多数过滤器，第二个版本将引用整个 `file` 记录（包含 `name`、`type`、`size` 和 `modified` 列）。然而，对于 `update`，它特指正在更新的*列*的内容，在本例中是 `name`。

### 自定义命令定义和脚本中的管道输入

参见：[自定义命令 -> 管道输入](custom_commands.html#pipeline-input)

### `$in` 何时改变（以及何时可以重用）？

- **_规则 1：_** 当在闭包或块中的管道的第一个位置使用时，`$in` 指的是该闭包/块的管道（或过滤器）输入。

  示例：

  ```nushell
  def echo_me [] {
    print $in
  }
  true | echo_me
  # => true
  ```

- **_规则 1.5：_** 这在当前作用域中始终成立。即使在闭包或块的后续行中，当在*任何管道*的第一个位置使用时，`$in` 都是相同的值。

  示例：

  ```nu
  [ a b c ] | each {
    print $in
    print $in
    $in
  }
  ```

  在每次迭代中，所有三个 `$in` 的值都是相同的，所以输出为：

  ```nu
  a
  a
  b
  b
  c
  c
  ╭───┬───╮
  │ 0 │ a │
  │ 1 │ b │
  │ 2 │ c │
  ╰───┴───╯
  ```

- **_规则 2：_** 当在管道中的任何其他位置（而不是第一个位置）使用时，`$in` 指的是前一个表达式的结果：

  示例：

  ```nushell
  4               # 管道输入
  | $in * $in     # 此表达式中 $in 为 4
  | $in / 2       # 此表达式中 $in 现在为 16
  | $in           # $in 现在为 8
  # =>   8
  ```

- **_规则 2.5：_** 在闭包或块内部，规则 2 的使用发生在一个新的作用域（子表达式）中，其中“新”的 `$in` 值是有效的。这意味着规则 1 和规则 2 的使用可以在同一个闭包或块中共存。

  示例：

  ```nushell
  4 | do {
    print $in            # 闭包作用域的 $in 为 4

    let p = (            # 显式子表达式，但无论如何都会创建一个
      $in * $in          # 初始管道位置的 $in 在这里仍然是 4
      | $in / 2          # $in 现在是 16
    )                    # $p 是结果，8 - 子表达式作用域结束

    print $in            # 在闭包作用域，"原始"的 $in 仍然是 4
    print $p
  }
  ```

  所以 3 个 `print` 语句的输出是：

  ```nu
  4
  4
  8
  ```

  同样，即使上面的命令使用更紧凑、隐式的子表达式形式，这也将成立：

  示例：

  ```nushell
  4 | do {
    print $in                       # 闭包作用域的 $in 为 4
    let p = $in * $in | $in / 2     # 隐式 let 子表达式
    print $in                       # 在闭包作用域， $in 仍然是 4
    print $p
  }

  4
  4
  8
  ```

- **_规则 3：_** 当没有输入时使用 `$in`，`$in` 为 null。

  示例：

  ```nushell
  # 输入
  1 | do { $in | describe }
  # =>   int
  "Hello, Nushell" | do { $in | describe }
  # =>   string
  {||} | do { $in | describe }
  # =>   closure

  # 没有输入
  do { $in | describe }
  # =>   nothing
  ```

* **_规则 4：_** 在由分号分隔的多语句行中，`$in` 不能用于捕获前一个*语句*的结果。

  这与没有输入相同：

  ```nushell
  ls / | get name; $in | describe
  # => nothing
  ```

  相反，只需继续管道：

  ```nushell
  ls / | get name | $in | describe
  # => list<string>
  ```

### 多行代码中 `$in` 的最佳实践

虽然可以如上所示重用 `$in`，但在闭包/块的第一行将其值赋给另一个变量通常有助于提高可读性和调试。

示例：

```nu
def "date info" [] {
  let day = $in
  print ($day | format date '%v')
  print $'... was a ($day | format date '%A')'
  print $'... was day ($day | format date '%j') of the year'
}

'2000-01-01' | date info
# =>  1-Jan-2000
# => ... was a Saturday
# => ... was day 001 of the year
```

### `$in` 的可收集性

目前，在管道中的流上使用 `$in` 会产生一个“已收集”的值，这意味着管道在处理 `$in` 之前会“等待”流完成。但是，此行为在将来的版本中不保证。为确保将流收集到单个变量中，请使用 [`collect` 命令](/zh-CN/commands/docs/collect.html)。

同样，当正常的管道输入足够时，请避免使用 `$in`，因为在内部 `$in` 会强制从 `PipelineData` 转换为 `Value`，并且*可能*导致性能下降和/或内存使用增加。

## 与外部命令交互

Nu 命令之间使用 Nu 的数据类型进行通信（见[数据类型](types_of_data.md)），但 Nu 之外的命令呢？让我们看看一些与外部命令交互的例子：

`internal_command | external_command`

数据将从 `internal_command` 流向 `external_command`。这些数据将被转换为字符串，以便它们可以被发送到外部命令的`stdin`。

`external_command | internal_command`

从外部命令进入 Nu 的数据将以字节的形式流入，Nushell 将尝试自动将其转换为 UTF-8 文本。如果成功，一个文本数据流将被发送到`internal_command`；如果不成功，一个二进制数据流将被发送到`internal_command`。像[`lines`](/zh-CN/commands/docs/lines.md)这样的命令有助于从外部命令接收数据，因为它提供了分离的数据行以供后续使用。

`external_command_1 | external_command_2`

Nu 在两个外部命令之间以与其他 Shell 相同的方式处理数据管道，比如 Bash。`external_command_1`的`stdout`与`external_command_2`的`stdin`相连，这让数据在两个命令之间自然流动。

### 命令输入和输出类型

上面的基础部分描述了如何在管道中将命令组合为输入、过滤器或输出。
如何使用命令取决于它们在输入/输出处理方面提供了什么。

你可以使用 [`help <command name>`](/zh-CN/commands/docs/help.md) 来检查命令支持什么，它会显示相关的*输入/输出类型*。

例如，通过 `help first` 我们可以看到 [`first` 命令](/zh-CN/commands/docs/first.md) 支持多种输入和输出类型：

```nu
help first
# => […]
# => Input/output types:
# =>   ╭───┬───────────┬────────╮
# =>   │ # │   input   │ output │
# =>   ├───┼───────────┼────────┤
# =>   │ 0 │ list<any> │ any    │
# =>   │ 1 │ binary    │ binary │
# =>   │ 2 │ range     │ any    │
# =>   ╰───┴───────────┴────────╯

[a b c] | first                                                                                                                                   took 1ms
# => a

1..4 | first                                                                                                                                     took 21ms
# => 1
```

再举一个例子，[`ls` 命令](/zh-CN/commands/docs/ls.md) 支持输出但不支持输入：

```nu
help ls
# => […]
# => Input/output types:
# =>   ╭───┬─────────┬────────╮
# =>   │ # │  input  │ output │
# =>   ├───┼─────────┼────────┤
# =>   │ 0 │ nothing │ table  │
# =>   ╰───┴─────────┴────────╯
```

这意味着，例如，尝试将管道输入到 `ls` (`echo .. | ls`) 会导致意想不到的结果。
输入流被忽略，`ls` 默认列出当前目录。

要将像 `ls` 这样的命令集成到管道中，你必须显式引用输入并将其作为参数传递：

```nu
echo .. | ls $in
```

请注意，这仅在 `$in` 与参数类型匹配时才有效。例如，`[dir1 dir2] | ls $in` 将失败，并显示错误 `can't convert list<string> to string`。

没有默认行为的其他命令可能会以不同的方式失败，并显示明确的错误。

例如，`help sleep` 告诉我们 [`sleep`](/zh-CN/commands/docs/sleep.md) 不支持输入和输出类型：

```nu
help sleep
# => […]
# => Input/output types:
# =>   ╭───┬─────────┬─────────╮
# =>   │ # │  input  │ output  │
# =>   ├───┼─────────┼─────────┤
# =>   │ 0 │ nothing │ nothing │
# =>   ╰───┴─────────┴─────────╯
```

当我们错误地将管道输入到它时，我们不会像上面的 `ls` 示例那样得到意想不到的行为，而是会收到一个错误：

```nu
echo 1sec | sleep
# => Error: nu::parser::missing_positional
# =>
# =>   × Missing required positional argument.
# =>    ╭─[entry #53:1:18]
# =>  1 │ echo 1sec | sleep
# =>    ╰────
# =>   help: Usage: sleep <duration> ...(rest) . Use `--help` for more information.
```

虽然没有固定的规则，但 Nu 通常会尝试复制已建立的命令行为约定，
或者做“感觉正确”的事情。
例如，`sleep` 不支持输入流的行为与 Bash `sleep` 的行为相匹配。

然而，许多命令确实有管道输入/输出，如果 कभी不清楚，请如上所述检查它们的 `help` 文档。

## 渲染显示结果

在交互模式下，当管道结束时，[`display_output` 钩子配置](https://www.nushell.sh/book/hooks.html#changing-how-output-is-displayed) 定义了结果将如何显示。
默认配置使用 [`table` 命令](/zh-CN/commands/docs/table.md) 将结构化数据呈现为可视化表格。

以下示例显示了 `display_output` 钩子如何呈现

- 使用 `table -e` 的展开表格
- 使用 `table` 的未展开表格
- 空闭包 `{||}` 和空字符串 `''` 导致简单输出
- 可以分配 `null` 来清除任何自定义，恢复到默认行为

```nu
$env.config.hooks.display_output = { table -e }
[1,2,3,[4,5,6]]
# => ╭───┬───────────╮
# => │ 0 │         1 │
# => │ 1 │         2 │
# => │ 2 │         3 │
# => │ 3 │ ╭───┬───╮ │
# => │   │ │ 0 │ 4 │ │
# => │   │ │ 1 │ 5 │ │
# => │   │ │ 2 │ 6 │ │
# => │   │ ╰───┴───╯ │
# => ╰───┴───────────╯

$env.config.hooks.display_output = { table }
[1,2,3,[4,5,6]]
# => ╭───┬────────────────╮
# => │ 0 │              1 │
# => │ 1 │              2 │
# => │ 2 │              3 │
# => │ 3 │ [list 3 items] │
# => ╰───┴────────────────╯

$env.config.hooks.display_output = {||}
[1,2,3,[4,5,6]]
# => 1
# => 2
# => 3
# => [4
# => 5
# => 6]

$env.config.hooks.display_output = ''
[1,2,3,[4,5,6]]
# => 1
# => 2
# => 3
# => [4
# => 5
# => 6]

# 清除为默认行为
$env.config.hooks.display_output = null
[1,2,3,[4,5,6]]
# => ╭───┬────────────────╮
# => │ 0 │              1 │
# => │ 1 │              2 │
# => │ 2 │              3 │
# => │ 3 │ [list 3 items] │
# => ╰───┴────────────────╯
```

## 将输出结果传递给外部命令

有时你希望将 Nushell 结构化数据输出到外部命令以进行进一步处理。但是，Nushell 对结构化数据的默认格式化选项可能不是你想要的。
例如，你想在“/usr/share/vim/runtime”下找到一个名为“tutor”的文件并检查其所有权

```nu
ls /usr/share/nvim/runtime/
# => ╭────┬───────────────────────────────────────┬──────┬─────────┬───────────────╮
# => │  # │                 name                  │ type │  size   │   modified    │
# => ├────┼───────────────────────────────────────┼──────┼─────────┼───────────────┤
# => │  0 │ /usr/share/nvim/runtime/autoload      │ dir  │  4.1 KB │ 2 days ago    │
# => ..........
# => ..........
# => ..........
# =>
# => │ 31 │ /usr/share/nvim/runtime/tools         │ dir  │  4.1 KB │ 2 days ago    │
# => │ 32 │ /usr/share/nvim/runtime/tutor         │ dir  │  4.1 KB │ 2 days ago    │
# => ├────┼───────────────────────────────────────┼──────┼─────────┼───────────────┤
# => │  # │                 name                  │ type │  size   │   modified    │
# => ╰────┴───────────────────────────────────────┴──────┴─────────┴───────────────╯
```

你决定使用 `grep` 并将结果通过[管道](https://www.nushell.sh/book/pipelines.html)传递给外部的 `^ls`

```nu
ls /usr/share/nvim/runtime/ | get name | ^grep tutor | ^ls -la $in
# => ls: cannot access ''$'\342\224\202'' 32 '$'\342\224\202'' /usr/share/nvim/runtime/tutor        '$'\342\224\202\n': No such file or directory
```

怎么了？Nushell 在将列表和表格作为文本传递给外部命令之前，会对其进行渲染（通过添加边框字符，如 `╭`,`─`,`┬`,`╮`）。如果这不是你想要的行为，你必须在将数据传递给外部命令之前，显式地将其转换为字符串。例如，你可以使用 [`to text`](/zh-CN/commands/docs/to_text.md) 来实现：

```nu
ls /usr/share/nvim/runtime/ | get name | to text | ^grep tutor | tr -d '\n' | ^ls -la $in
# => total 24
# => drwxr-xr-x@  5 pengs  admin   160 14 Nov 13:12 .
# => drwxr-xr-x@  4 pengs  admin   128 14 Nov 13:42 en
# => -rw-r--r--@  1 pengs  admin  5514 14 Nov 13:42 tutor.tutor
# => -rw-r--r--@  1 pengs  admin  1191 14 Nov 13:42 tutor.tutor.json
```

（实际上，对于这个简单的用法，你只需使用 [`find`](/zh-CN/commands/docs/find.md)）

```nu
ls /usr/share/nvim/runtime/ | get name | find tutor | ansi strip | ^ls -al ...$in
```

## Nushell 中的命令输出

与外部命令不同，Nushell 命令类似于函数。大多数 Nushell 命令不会向 `stdout` 打印任何内容，而只是返回数据。

```nu
do { ls; ls; ls; "What?!" }
```

这意味着上面的代码不会在当前目录下三次显示文件。
实际上，在 shell 中运行此代码只会显示 `"What?!"`，因为这是本例中 `do` 命令返回的值。但是，如果使用系统 `^ls` 命令而不是 `ls`，则确实会三次打印目录，因为 `^ls` 在运行时会打印其结果。

了解何时显示数据对于使用影响命令（如 `table`）显示输出的配置变量非常重要。

```nu
do { $env.config.table.mode = "none"; ls }
```

例如，上面的示例将 `$env.config.table.mode` 配置变量设置为 `none`，这会导致 `table` 命令在没有额外边框的情况下呈现数据。然而，如前所示，该命令实际上等同于

```nu
do { $env.config.table.mode = "none"; ls } | table
```

因为 Nushell `$env` 变量是[作用域的](https://www.nushell.sh/book/environment.html#scoping)，这意味着示例中的 `table` 命令不受 `do` 块内环境修改的影响，数据将不会以应用的配置显示。

如果希望尽早显示数据，可以在作用域内显式应用 `| table`，或使用 `print` 命令。

```nu
do { $env.config.table.mode = "none"; ls | table }
do { $env.config.table.mode = "none"; print (ls) }
```
