# 自定义命令

与任何编程语言一样，你很快就会想要保存较长的管道和表达式，以便在需要时可以轻松地再次调用它们。

这就是自定义命令的作用。

::: tip 注意
自定义命令与许多语言中的函数类似，但在 Nushell 中，自定义命令*本身就是一等公民*。正如你将在下面看到的，它们与内置命令一起包含在帮助系统中，可以成为管道的一部分，会实时进行类型错误解析等等。
:::

[[toc]]

## 创建和运行自定义命令

让我们从一个简单的 `greet` 自定义命令开始：

```nu
def greet [name] {
  $"Hello, ($name)!"
}
```

在这里，我们定义了 `greet` 命令，它接受一个参数 `name`。此参数后面是表示自定义命令运行时将发生什么的块。调用时，自定义命令会将为 `name` 传递的值设置为 `$name` 变量，该变量将在块内可用。

要运行此命令，我们可以像调用内置命令一样调用它：

```nu
greet "World"
# => Hello, World!
```

## 从命令返回值

你可能会注意到上面的示例中没有 `return` 或 `echo` 语句。

像 PowerShell 和 JavaScript（使用箭头函数）等其他一些语言一样，Nushell 具有*隐式返回*的特性，即命令中最后一个表达式的值成为其返回值。

在上面的示例中，只有一个表达式——字符串。此字符串成为命令的返回值。

```nu
greet "World" | describe
# => string
```

当然，一个典型的命令将由多个表达式组成。为了演示，这里有一个包含 3 个表达式的无意义命令：

```nu
def eight [] {
  1 + 1
  2 + 2
  4 + 4
}

eight
# => 8
```

返回值同样只是命令中*最后一个*表达式的结果，即 `4 + 4` (8)。

其他示例：

::: details 提前返回
由于某种情况需要提前退出的命令仍然可以使用 [`return` 语句](/commands/docs/return.md)返回值。

```nu
def process-list [] {
  let input_length = length
  if $input_length > 10_000 {
    print "Input list is too long"
    return null
  }

  $in | each {|i|
    # Process the list
    $i * 4.25
  }
}
```

:::

::: details 抑制返回值
你通常会希望创建一个作为*语句*而不是表达式的自定义命令，并且不返回值。

在这种情况下，你可以使用 `ignore` 关键字：

```nu
def create-three-files [] {
  [ file1 file2 file3 ] | each {|filename|
    touch $filename
  } | ignore
}
```

如果没有管道末尾的 `ignore`，该命令将从 `each` 语句返回一个空列表。

你也可以返回一个 `null` 作为最后一个表达式。或者，在这个人为的例子中，使用一个不返回值的 `for` 语句（见下一个例子）。
:::

::: details 不返回值的语句
Nushell 中的一些关键字是*语句*，不返回值。如果你使用这些语句之一作为自定义命令的最后一个表达式，则*返回值*将为 `null`。在某些情况下，这可能是意料之外的。例如：

```nu
def exponents-of-three [] {
  for x in [ 0 1 2 3 4 5 ] {
    3 ** $x
  }
}
exponents-of-three
```

上面的命令将不显示任何内容，返回值为 `null`，因为 `for` 是一个不返回值的*语句*。

要从输入列表中返回值，请使用诸如 `each` 命令之类的过滤器：

````nu
def exponents-of-three [] {
  [ 0 1 2 3 4 5 ] | each {|x|
    3 ** $x
  }
}

exponents-of-three

# => ╭───┬─────╮
# => │ 0 │   1 │
# => │ 1 │   3 │
# => │ 2 │   9 │
# => │ 3 │  27 │
# => │ 4 │  81 │
# => │ 5 │ 243 │
# => ╰───┴─────╯
:::

::: details Match 表达式
```nu
# 返回当前目录中的一个随机文件
def "random file" [] {
  let files = (ls)
  let num_files = ($files | length)

  match $num_files {
    0 => null  # 对于空目录返回 null
    _ => {
      let random_file = (random int 0..($num_files - 1))
      ($files | get $random_file)
    }
  }
}
````

在这种情况下，最后一个表达式是 `match` 语句，它可以返回：

- 如果目录为空，则返回 `null`
- 否则，返回一个表示随机选择的文件的 `record`

:::

## 自定义命令和管道

与内置命令一样，自定义命令的返回值可以传递到管道中的下一个命令。自定义命令也可以接受管道输入。此外，只要有可能，管道输入和输出都会在可用时进行流式处理。

::: tip 重要！
另请参阅：[管道](./pipelines.md)
:::

### 管道输出

```nu
ls | get name
```

让我们将 [`ls`](/commands/docs/ls.md) 移动到我们编写的命令中：

```nu
def my-ls [] { ls }
```

我们可以像使用 [`ls`](/commands/docs/ls.md) 一样使用此命令的输出。

```nu
my-ls | get name
# => ╭───┬───────────────────────╮
# => │ 0 │ myscript.nu           │
# => │ 1 │ myscript2.nu          │
# => │ 2 │ welcome_to_nushell.md │
# => ╰───┴───────────────────────╯
```

这使我们可以轻松地构建自定义命令并处理其输出。请记住，我们不像其他语言那样使用 return 语句。相反，[隐式返回](#从命令返回值)允许我们构建输出数据流的管道，这些数据流可以连接到其他管道。

::: tip 注意
在这种情况下，`ls` 内容仍然是流式的，即使它在一个单独的命令中。在慢速（例如，网络）文件系统上对长目录运行此命令将会在行可用时返回它们。
:::

### 管道输入

自定义命令也可以从管道中获取输入，就像其他命令一样。此输入会自动传递给自定义命令的块。

让我们创建自己的命令，将接收到的每个值都加倍：

```nu
def double [] {
  each { |num| 2 * $num }
}
```

现在，如果我们在管道中稍后调用上述命令，我们可以看到它对输入的作用：

```nu
[1 2 3] | double
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 4 │
# => │ 2 │ 6 │
# => ╰───┴───╯
```

::: tip 酷！
此命令演示了输入和输出*流式处理*。尝试使用无限输入运行它：

```nu
1.. | each {||} | double
```

即使输入命令尚未结束，`double` 命令仍然可以在值可用时接收和输出它们。

按 <kbd>Ctrl</kbd>+<kbd>C</kbd> 停止命令。
:::

我们还可以使用 [`$in` 变量](pipelines.md#管道输入和特殊的-in-变量)存储输入以供以后使用：

```nu
def nullify [...cols] {
  let start = $in
  $cols | reduce --fold $start { |col, table|
    $table | upsert $col null
  }
}

ls | nullify name size
# => ╭───┬──────┬──────┬──────┬───────────────╮
# => │ # │ name │ type │ size │   modified    │
# => ├───┼──────┼──────┼──────┼───────────────┤
# => │ 0 │      │ file │      │ 8 minutes ago │
# => │ 1 │      │ file │      │ 8 minutes ago │
# => │ 2 │      │ file │      │ 8 minutes ago │
# => ╰───┴──────┴──────┴──────┴───────────────╯
```

## 命名命令

在 Nushell 中，命令名可以是一串字符。以下是一些有效命令名的示例：`greet`、`get-size`、`mycommand123`、`my command`、`命令`，甚至 `😊`。

应避免可能与其他解析器模式混淆的字符串。例如，以下命令名可能无法调用：

- `1`、`"1"` 或 `"1.5"`：Nushell 不允许使用数字作为命令名
- `4MiB` 或 `"4MiB"`：Nushell 不允许使用文件大小作为命令名
- `"number#four"` 或 `"number^four"`：命令名中不允许使用插入符号和哈希符号
- `-a`、`"{foo}"`、`"(bar)"`：将无法调用，因为 Nushell 会将它们解释为标志、闭包或表达式。

虽然像 `"+foo"` 这样的名称可能有效，但最好避免使用，因为解析器规则可能会随着时间的推移而改变。如有疑问，请使命令名尽可能简单。

::: tip
在 Nushell 中，通常的做法是用 `-` 分隔命令的多个单词以提高可读性。例如，使用 `get-size` 而不是 `getsize` 或 `get_size`。
:::

::: tip
因为 `def` 是一个解析器关键字，所以命令名必须在解析时已知。这意味着命令名不能是变量或常量。例如，以下是*不允许*的：

```nu
let name = "foo"
def $name [] { foo }
```

:::

### 子命令

你还可以使用空格定义命令的子命令。例如，如果我们想向 [`str`](/commands/docs/str.md) 添加一个新子命令，我们可以通过以“str ”开头命名我们的子命令来创建它。例如：

```nu
def "str mycommand" [] {
  "hello"
}
```

现在我们可以像调用 [`str`](/commands/docs/str.md) 的内置子命令一样调用我们的自定义命令：

```nu
str mycommand
```

当然，名称中带空格的命令也以同样的方式定义：

```nu
def "custom command" [] {
  "This is a custom command with a space in the name!"
}
```

## 参数

### 多个参数

在 `def` 命令中，参数在 [`list`](./types_of_data.md#列表) 中定义。这意味着多个参数可以用空格、逗号或换行符分隔。

例如，这里是一个接受两个名称的 `greet` 版本。这三个定义中的任何一个都可以工作：

```nu
# 空格
def greet [name1 name2] {
  $"Hello, ($name1) and ($name2)!"
}

# 逗号
def greet [name1, name2] {
  $"Hello, ($name1) and ($name2)!"
}

# 换行符
def greet [
  name1
  name2
] {
  $"Hello, ($name1) and ($name2)!"
}
```

### 必需的位置参数

上面使用的基本参数定义是*位置*的。传递给上面 `greet` 命令的第一个参数被分配给 `name1` 参数（并且，如上所述，是 `$name1` 变量）。第二个参数成为 `name2` 参数和 `$name2` 变量。

默认情况下，位置参数是*必需*的。使用我们之前定义的带有两个必需位置参数的 `greet`：

```nu
def greet [name1, name2] {
  $"Hello, ($name1) and ($name2)!"
}

greet Wei Mei
# => Hello, Wei and Mei!

greet Wei
# => Error: nu::parser::missing_positional
# =>
# =>   × Missing required positional argument.
# =>    ╭─[entry #1:1:10]
# =>  1 │ greet Wei
# =>    ╰────
# =>   help: Usage: greet <name1> <name2> . Use `--help` for more information.
```

::: tip
尝试在此版本的 `greet` 之后键入第三个名称。请注意，解析器会自动检测到错误，并在执行前将第三个参数突出显示为错误。
:::

### 可选的位置参数

我们可以通过在位置参数的名称后加上问号 (`?`) 来将其定义为可选。例如：

```nu
def greet [name?: string] {
  $"Hello, ($name | default 'You')"
}

greet
# => Hello, You
```

::: tip
请注意，用于访问变量的名称不包括 `?`；只有其在命令签名中的定义才包括。
:::

当未传递可选参数时，其在命令主体中的值为 `null`。上面的示例使用 `default` 命令在 `name` 为 `null` 时提供默认值“You”。

你也可以直接比较该值：

```nu
def greet [name?: string] {
  match $name {
    null => "Hello! I don't know your name!"
    _ => $"Hello, ($name)!"
  }
}

greet
# => Hello! I don't know your name!
```

如果必需和可选的位置参数一起使用，则必需的参数必须首先出现在定义中。

#### 带默认值的参数

你还可以为缺少的参数设置默认值。带默认值的参数在调用命令时也是可选的。

```nu
def greet [name = "Nushell"] {
  $"Hello, ($name)!"
}
```

你可以不带参数调用此命令，也可以带一个值来覆盖默认值：

```nu
greet
# => Hello, Nushell!

greet world
# => Hello, World!
```

你还可以将默认值与[类型注解](#参数类型)结合起来：

```nu
def congratulate [age: int = 18] {
  $"Happy birthday! You are ($age) years old now!"
}
```

### 参数类型

对于每个参数，你可以选择性地定义其类型。例如，你可以将基本的 `greet` 命令写成：

```nu
def greet [name: string] {
  $"Hello, ($name)"
}
```

如果参数没有类型注解，Nushell 会将其视为 [`any` 类型](./types_of_data.md#任意类型)。如果你在参数上注解了类型，Nushell 会在你调用函数时检查其类型。

例如，假设你只想接受一个 `int` 而不是 `string`：

```nu
def greet [name: int] {
  $"hello ($name)"
}

greet World
```

如果我们尝试运行上面的代码，Nushell 会告诉我们类型不匹配：

```nu
Error: nu::parser::parse_mismatch

  × Parse mismatch during operation.
   ╭─[entry #1:1:7]
 1 │ greet World
   ·       ──┬──
   ·         ╰── expected int
   ╰────
```

::: tip 酷！
类型检查是解析器的一项功能。在命令行中输入自定义命令时，Nushell 解析器甚至可以实时检测到无效的参数类型，并在执行命令前将其突出显示。

突出显示样式可以使用[主题](https://github.com/nushell/nu_scripts/tree/main/themes)或手动使用 `$env.config.color_config.shape_garbage` 进行更改。
:::

::: details 类型注解列表
大多数类型都可以用作类型注解。此外，还有一些“形状”可以使用。例如：

- `number`: 接受 `int` 或 `float`
- `path`: 一个字符串，其中 `~` 和 `.` 字符具有特殊含义，并将自动扩展为等效的完整路径。有关示例用法，请参阅语言参考指南中的[路径](/lang-guide/chapters/types/other_types/path.md)。
- `directory`: `path`（上文）的子集。使用制表符补全参数时，只会提供目录。扩展方式与 `path` 相同。
- `error`: 可用，但目前没有已知的有效用法。有关更多信息，请参阅语言参考指南中的[错误](/lang-guide/chapters/types/other_types/error.md)。

以下[类型](./types_of_data.md)可用于参数注解：

- `any`
- `binary`
- `bool`
- `cell-path`
- `closure`
- `datetime`
- `duration`
- `filesize`
- `float`
- `glob`
- `int`
- `list`
- `nothing`
- `range`
- `record`
- `string`
- `table`

:::

### 标志

除了位置参数，你还可以定义命名标志。

例如：

```nu
def greet [
  name: string
  --age: int
] {
    {
      name: $name
      age: $age
    }
}
```

在此版本的 `greet` 中，我们定义了 `name` 位置参数以及一个 `age` 标志。位置参数（因为它没有 `?`）是必需的。命名标志是可选的。不带 `--age` 标志调用命令会将 `$age` 设置为 `null`。

`--age` 标志可以放在位置 `name` 之前或之后。示例：

```nu
greet Lucia --age 23
# => ╭──────┬───────╮
# => │ name │ Lucia │
# => │ age  │ 23    │
# => ╰──────┴───────╯

greet --age 39 Ali
# => ╭──────┬─────╮
# => │ name │ Ali │
# => │ age  │ 39  │
# => ╰──────┴─────╯

greet World
# => ╭──────┬───────╮
# => │ name │ World │
# => │ age  │       │
# => ╰──────┴───────╯
```

标志也可以用简写版本定义。这允许你传递一个更简单的标志以及一个更易于阅读的长标志。

让我们扩展前面的示例，为 `age` 值使用一个简写标志：

```nu
def greet [
  name: string
  --age (-a): int
] {
    {
      name: $name
      age: $age
    }
  }
```

::: tip
结果变量始终基于长标志名称。在上面的示例中，变量仍然是 `$age`。`$a` 将无效。
:::

现在，我们可以使用简写标志调用此更新后的定义：

```nu
greet Akosua -a 35
# => ╭──────┬────────╮
# => │ name │ Akosua │
# => │ age  │ 35     │
# => ╰──────┴────────╯
```

标志也可以用作基本开关。存在时，基于开关的变量为 `true`。不存在时，为 `false`。

```nu
def greet [
  name: string
  --caps
] {
    let greeting = $"Hello, ($name)!"
    if $caps {
      $greeting | str upcase
    } else {
      $greeting
    }
}

greet Miguel --caps
# => HELLO, MIGUEL!

greet Chukwuemeka
# => Hello, Chukwuemeka!
```

你还可以将其分配给 `true`/`false` 以启用/禁用该标志：

```nu
greet Giulia --caps=false
# => Hello, Giulia!

greet Hiroshi --caps=true
# => HELLO, HIROSHI!
```

::: tip
请注意以下错误：

```nu
greet Gabriel --caps true
```

键入空格而不是等号会将 `true` 作为位置参数传递，这可能不是期望的结果！

为避免混淆，不允许在标志上注解布尔类型：

```nu
def greet [
    --caps: bool   # 不允许
] { ... }
```

:::

标志可以包含破折号。可以通过在结果变量名中用下划线替换破折号来访问它们：

```nu
def greet [
  name: string
  --all-caps
] {
    let greeting = $"Hello, ($name)!"
    if $all_caps {
      $greeting | str upcase
    } else {
      $greeting
    }
}
```

### 剩余参数

在某些情况下，你可能想定义一个需要任意数量的位置参数的命令。我们可以用一个“剩余”参数来实现这一点，使用下面的 `...` 语法：

```nu
def multi-greet [...names: string] {
  for $name in $names {
    print $"Hello, ($name)!"
  }
}

multi-greet Elin Lars Erik
# => Hello, Elin!
# => Hello, Lars!
# => Hello, Erik!
```

我们可以用任意数量的参数调用上面 `greet` 命令的定义，包括完全没有参数。所有参数都将收集到 `$names` 列表中。

剩余参数可以和位置参数一起使用：

```nu
def vip-greet [vip: string, ...names: string] {
  for $name in $names {
    print $"Hello, ($name)!"
  }

  print $"And a special welcome to our VIP today, ($vip)!"
}

#         $vip          $name
#         ----- -------------------------
vip-greet Rahul Priya Arjun Anjali Vikram
# => Hello, Priya!
# => Hello, Arjun!
# => Hello, Anjali!
# => Hello, Vikram!
# => And a special welcome to our VIP today, Rahul!
```

要将列表传递给剩余参数，你可以使用[展开运算符](/zh-CN/book/operators.md#扩展运算符) (`...`)。使用上面的 `vip-greet` 命令定义：

```nu
let vip = "Tanisha"
let guests = [ Dwayne, Shanice, Jerome ]
vip-greet $vip ...$guests
# => Hello, Dwayne!
# => Hello, Shanice!
# => Hello, Jerome!
# => And a special welcome to our VIP today, Tanisha!
```

### 带包装的外部命令的剩余参数

使用 `def --wrapped` 定义的自定义命令会将任何未知的标志和参数收集到一个剩余参数中，然后可以通过列表展开将其传递给外部命令。这允许自定义命令“包装”和扩展外部命令，同时仍然接受其所有原始参数。例如，外部 `eza` 命令显示目录列表。默认情况下，它显示网格排列：

```nu
eza commands
# => categories  docs  README.md
```

我们可以定义一个新命令 `ezal`，它将始终显示长列表，并添加图标：

```nu
def --wrapped ezal [...rest] {
  eza -l ...$rest
}
```

:::note
你也可以添加 `--icons`。我们在此示例中省略它，只是因为这些图标在本指南中显示效果不佳。
:::

请注意，`--wrapped` 会将任何其他参数强制放入 `rest` 参数中，因此可以使用 `eza` 支持的任何参数调用该命令。这些附加参数将通过列表展开操作 `...$rest` 进行扩展。

```nu
ezal commands
# => drwxr-xr-x   - ntd  7 Feb 11:41 categories
# => drwxr-xr-x   - ntd  7 Feb 11:41 docs
# => .rw-r--r-- 936 ntd 14 Jun  2024 README.md

ezal -d commands
# => drwxr-xr-x - ntd 14 Jun  2024 commands
```

自定义命令可以检查某些参数并相应地更改其行为。例如，当使用 `-G` 选项强制使用网格时，我们可以省略向 `eza` 传递 `-l`：

```nu
def --wrapped ezal [...rest] {
  if '-G' in $rest {
    eza ...$rest
  } else {
    eza -l --icons ...$rest
  }
}

ezal -G commands
# => categories  docs  README.md
```

## 管道输入输出签名

默认情况下，自定义命令接受 [`<any>` 类型](./types_of_data.md#任意类型)作为管道输入，同样可以输出 `<any>` 类型。但自定义命令也可以被赋予明确的签名以缩小允许的类型范围。

例如，[`str stats`](/commands/docs/str_stats.md) 的签名如下所示：

```nu
def "str stats" []: string -> record { }
```

在这里，`string -> record` 定义了命令的*管道输入和输出*的允许类型：

- 它接受一个 `string` 作为管道输入
- 它输出一个 `record`

如果有多个输入/输出类型，它们可以放在括号内并用逗号或换行符分隔，如 [`str join`](/commands/docs/str_join.md) 中所示：

```nu
def "str join" [separator?: string]: [
  list -> string
  string -> string
] { }
```

这表示 `str join` 可以接受 `list<any>` 或 `string` 作为管道输入。在任何一种情况下，它都将输出一个 `string`。

有些命令不接受或不需要数据作为管道输入。在这种情况下，输入类型将是 `<nothing>`。如果命令返回 `null`（例如，[`rm`](/commands/docs/rm.md) 或 [`hide`](/commands/docs/hide.md)），输出类型也是如此：

```nu
def xhide [module: string, members?]: nothing -> nothing { }
```

::: tip 注意
上面的示例被重命名为 `xhide`，以便将其复制到 REPL 不会遮蔽内置的 `hide` 命令。
:::

输入输出签名显示在命令的 `help` 中（包括内置和自定义命令），也可以通过以下方式进行内省：

```nu
help commands | where name == <command_name>
scope commands | where name == <command_name>
```

:::tip 酷！
输入输出签名允许 Nushell 在解析时捕获另外两类错误：

- 尝试从命令返回错误的类型。例如：

  ```nu
  def inc []: int -> int {
    $in + 1
    print "Did it!"
  }

  # => Error: nu::parser::output_type_mismatch
  # =>
  # =>   × Command output doesn't match int.
  # =>    ╭─[entry #1:1:24]
  # =>  1 │ ╭─▶ def inc []: int -> int {
  # =>  2 │ │     $in + 1
  # =>  3 │ │     print "Did it!"
  # =>  4 │ ├─▶ }
  # =>    · ╰──── expected int, but command outputs nothing
  # =>    ╰────
  ```

- 以及尝试将无效类型传递给命令：

  ```nu
  def inc []: int -> int { $in + 1 }
  "Hi" | inc
  # => Error: nu::parser::input_type_mismatch
  # =>
  # =>   × Command does not support string input.
  # =>    ╭─[entry #1:1:8]
  # =>  1 │ "Hi" | inc
  # =>    ·        ─┬─
  # =>    ·         ╰── command doesn't support string input
  # =>    ╰────
  ```

:::

## 为你的命令添加文档

为了更好地帮助用户理解如何使用你的自定义命令，你还可以为它们添加额外的命令和参数描述。

运行 `help vip-greet` 来检查我们上面定义的最新命令：

```text
Usage:
  > vip-greet <vip> ...(names)

Flags:
  -h, --help - Display the help message for this command

Parameters:
  vip <string>
  ...names <string>

Input/output types:
  ╭───┬───────┬────────╮
  │ # │ input │ output │
  ├───┼───────┼────────┤
  │ 0 │ any   │ any    │
  ╰───┴───────┴────────╯
```

::: tip 酷！
你可以看到 Nushell 仅根据我们到目前为止的定义就自动为该命令创建了一些基本帮助。Nushell 还自动向该命令添加了一个 `--help`/`-h` 标志，因此用户也可以使用 `vip-greet --help` 访问帮助。
:::

我们可以通过一些简单的注释来进一步扩展帮助，描述命令及其参数：

```nu
# 问候客人和一位贵宾
#
# 用于生日、毕业派对、
# 退休，以及任何其他庆祝
# 特定人物事件的活动。
def vip-greet [
  vip: string        # 特别嘉宾
   ...names: string  # 其他客人
] {
  for $name in $names {
    print $"Hello, ($name)!"
  }

  print $"And a special welcome to our VIP today, ($vip)!"
}
```

现在再次运行 `help vip-greet` 来看看有什么不同：

```text
问候客人和一位贵宾

用于生日、毕业派对、
退休，以及任何其他庆祝
特定人物事件的活动。

Category: default

This command:
- does not create a scope.
- is not a built-in command.
- is not a subcommand.
- is not part of a plugin.
- is a custom command.
- is not a keyword.

Usage:
  > vip-greet <vip>


Flags:


  -h, --help - Display the help message for this command

Signatures:

  <any> | vip-greet[ <string>] -> <any>

Parameters:

  vip: <string> The special guest
  ...rest: <string> The other guests
```

请注意，`def` 语句前紧接的注释行成为帮助系统中命令的描述。可以使用多行注释。第一行（在空注释行之前）成为帮助的 `description`。此信息在制表符补全命令时也会显示。

其余的注释行成为其在帮助数据中的 `extra_description`。

::: tip
运行：

```nu
scope commands
| where name == 'vip-greet'
| wrap help
```

这将显示 Nushell 创建的帮助*记录*。
:::

参数后面的注释成为它们的描述。对于参数，只允许单行注释。

::: tip 注意
用于参数文档目的的同一行上的 Nushell 注释需要在 `#` 磅号前有一个空格。
:::

## 在自定义命令中更改环境

通常，环境变量定义和更改在块内是*作用域*的（[./environment.html#scoping](./environment.md#作用域)）。这意味着当它们在块结束时超出作用域时，对这些变量的更改将丢失，包括自定义命令的块。

```nu
def foo [] {
    $env.FOO = 'After'
}

$env.FOO = "Before"
foo
$env.FOO
# => Before
```

但是，使用 [`def --env`](/commands/docs/def.md) 或 [`export def --env`](/commands/docs/export_def.md)（对于[模块](modules.md)）定义的命令将在调用方保留环境：

```nu
def --env foo [] {
    $env.FOO = 'After'
}

$env.FOO = "Before"
foo
$env.FOO
# => After
```

### 在自定义命令中更改目录 (cd)

同样，使用 `cd` 命令更改目录会导致 `$env.PWD` 环境变量的更改。这意味着当自定义命令结束时，目录更改（`$env.PWD` 变量）也将被重置。如上所述，解决方案是使用 `def --env` 或 `export def --env`。

```nu
def --env go-home [] {
  cd ~
}

cd /
go-home
pwd
# => Your home directory
```

## 持久化

要使自定义命令在将来的 Nushell 会话中可用，你需要将它们添加到你的启动配置中。你可以将命令定义添加到：

- 直接在你的 `config.nu` 中
- 由你的 `config.nu` 加载的文件中
- 由你的 `config.nu` 导入的[模块](./modules.md)中

有关更多详细信息，请参阅[配置章节](configuration.md)。
