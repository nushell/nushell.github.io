# 自定义命令

Nu 具备组合长管道的能力使你对数据和系统有很强的控制力，但它的代价是需要大量的键盘输入。不过理想情况下，你可以保存精心设计的管道以便反复使用。

这就是自定义命令(Custom Commands)的作用。

下面看一个自定义命令的例子：

```nu
def greet [name] {
  echo "hello" $name
}
```

在这个定义中，我们定义了`greet`命令，它需要一个参数`name`。在这个参数后面是自定义命令运行时将执行的代码块。当被调用时，自定义命令将把传递给`name`的值设置为`$name`变量，该变量在块内是可用的。

要运行上述命令，我们可以像调用内置命令一样调用它：

```nu
greet "world"
```

当我们这样做的时候，就会得到输出，如同我们使用内置命令一样：

```
───┬───────
 0 │ hello
 1 │ world
───┴───────
```

::: tip
`echo`将其参数分别返回给管道。如果你想用它来生成一个单一的字符串，请在管道中添加` | str join`：

```nu
def greet [name] {
  echo "hello " $name | str join
}

greet nushell
```

返回 `hello nushell`
:::

## 命令名称

在 Nushell 中，命令名是一串字符或一个带引号的字符串。下面是一些有效命令名的例子：`greet`, `get-size`, `mycommand123`, `"mycommand"`, `😊`, 和`123`。

_注意：在 Nushell 中，通常的做法是用`-`来分隔命令的多个单词，以提高可读性。_ 例如，使用 `get-size` 而不是 `getsize` 或者 `get_size`。

## 子命令

你也可以使用空格来定义命令的子命令(Subcommand)。例如，如果我们想给`str`添加一个新的子命令，可以通过命名我们的子命令以 "str" 开头来做到。比如：

```nu
def "str mycommand" [] {
  echo hello
}
```

现在我们可以像调用`str`的内置子命令一样调用我们的自定义命令：

```nu
str mycommand
```

## 参数类型

在定义自定义命令时，你可以为每个参数命名并选择性地设置其类型。例如，你可以把上面的内容写成：

```nu
def greet [name: string] {
  echo "hello " $name | str join
}
```

参数的类型是可选的。Nushell 支持不添加类型，此时会把参数类型当作`any`。如果你在参数上标注了一个类型，Nushell 将在你调用函数的时候检查该类型。

例如，假设你需要输入一个`int`类型：

```nu
def greet [name: int] {
  echo "hello " $name | str join
}

greet world
```

如果我们尝试运行上述内容，Nushell 会告诉我们，类型不匹配：

```
error: Type Error
  ┌─ shell:6:7
  │
5 │ greet world
  │       ^^^^^ Expected int, found world
```

这可以帮助指导你的用户只使用支持的类型来调用你所定义的命令。

目前可以支持的类型是（从 0.65.0 版本开始）：

- `any`
- `block`
- `cell-path`
- `duration`
- `path`
- `expr`
- `filesize`
- `glob`
- `int`
- `math`
- `number`
- `operator`
- `range`
- `cond`
- `bool`
- `signature`
- `string`
- `variable`
- `record`
- `list`
- `table`
- `error`

## 具有默认值的参数

若要使一个参数成为可选的，并具有默认值，你可以在命令定义中指定该默认值：

```nu
def greet [name = "nushell"] {
  echo "hello " $name | str join
}
```

你可以在没有参数的情况下调用这个命令，也可以指定一个值来覆盖默认值：

```nu
greet
# => hello nushell
greet world
# => hello world
```

你也可以将默认值与[类型要求](#参数类型)相结合：

```nu
def congratulate [age: int = 18] {
  echo "Happy birthday! Wow you are " $age " years old now!" | str join
}
```

如果你想检查一个可选参数是否存在，而不是仅仅依赖一个默认值，请使用[可选位置参数](#可选位置参数)代替。

## 可选位置参数

默认情况下，位置参数(Positional Parameters)是必须的。如果没有传递位置参数，我们将遇到一个报错：

```
  × Missing required positional argument.
   ╭─[entry #23:1:1]
 1 │ greet
   ·      ▲
   ·      ╰── missing name
   ╰────
  help: Usage: greet <name>
```

我们可以在一个位置参数的名字后面加上一个问号（`?`），将其标记为可选参数。比如：

```nu
def greet [name?: string] {
  echo "hello" $name | str join
}

greet
```

使一个位置参数成为可选参数并不改变它在命令体中被访问的名称。如上例所示，尽管参数列表中有`?`的后缀，但它仍然以`$name`的形式被访问。

当一个可选参数没有被传递，它在命令体中的值等于`null`和`$nothing`。我们可以利用这一点来对没有传递参数的情况进行处理：

```nu
def greet [name?: string] {
  if ($name == null) {
    echo "hello, I don't know your name!"
  } else {
    echo "hello " $name | str join
  }
}

greet
```

如果你只是想在参数缺失时设置一个默认值，那么使用[默认值](#具有默认值的参数)来代替就更简单了。

如果必需的和可选的位置参数一起使用，那么必需的参数必须先出现在定义中。

## 标志

除了传递位置参数之外, 你还可以通过为自定义命令定义标志(Flags)来传递命名参数。

比如：

```nu
def greet [
  name: string
  --age: int
] {
  echo $name $age
}
```

在上面的`greet`定义中，我们定义了`name`位置参数以及`age`标志。这允许`greet`的调用者也可以选择传递`age`参数。

你可以用以下方法调用上述内容：

```nu
greet world --age 10
```

或者：

```nu
greet --age 10 world
```

或者甚至完全不使用标志：

```nu
greet world
```

标志也可以指定一个缩写版本，这允许你传递一个更简单的标志，如同传递一个更容易阅读的全写标志那样。

让我们扩展前面的例子，为`age`添加一个缩写标志：

```nu
def greet [
  name: string
  --age (-a): int
] {
  echo $name $age
}
```

_注意：_ 标志是以其全称命名的，所以上面的例子的命令体内需要使用`$age`而不是`$a`。

现在，我们可以使用缩写标志来调用这个新的定义：

```nu
greet -a 10 hello
```

标志也可以作为基本开关使用，这意味着它们的存在或不存在被当作定义的参数。延伸前面的例子：

```nu
def greet [
  name: string
  --age (-a): int
  --twice
] {
  if $twice {
    echo $name $name $age $age
  } else {
    echo $name $age
  }
}
```

而这个定义可以通过如下方式调用：

```nu
greet -a 10 --twice hello
```

或者只是没有开关标志：

```nu
greet -a 10 hello
```

## 剩余参数

在某些情况下, 你可能想定义一个需要任意数量的位置参数的命令。我们可以用一个剩余参数(Rest Parameter)来实现这一点，通过下面的`...`语法：

```nu
def greet [...name: string] {
  print "hello all:"
  for $n in $name {
    echo $n
  }
}

greet earth mars jupiter venus
```

我们可以使用任意数量的参数来调用上述`greet`命令的定义，包括完全没有参数，所有的参数都将被收集到`$name`列表中。

剩余参数可以和位置参数一起使用：

```nu
def greet [vip: string, ...name: string] {
  print $"hello to our VIP ($vip)"
  print "and hello to everybody else:"
  for $n in $name {
    echo $n
  }
}

#     $vip          $name
#     ---- ------------------------
greet moon earth mars jupiter venus
```

## 为命令添加文档

为了更好地帮助用户使用你的自定义命令，也可以为其添加额外的命令和参数描述。

以我们之前的例子为例：

```nu
def greet [
  name: string
  --age (-a): int
] {
  echo $name $age
}
```

一旦定义完毕，我们可以运行`help greet`来获得该命令的帮助信息：

```
Usage:
  > greet <name> {flags}

Parameters:
  <name>

Flags:
  -h, --help: Display this help message
  -a, --age <integer>
```

你可以看到我们定义的参数和标志，以及所有命令都会得到的`-h`帮助标志。

为了改进这个帮助，我们可以在定义中加入描述，这些描述将在帮助中显示出来：

```nu
# A greeting command that can greet the caller
def greet [
  name: string      # The name of the person to greet
  --age (-a): int   # The age of the person
] {
  echo $name $age
}
```

我们给定义和参数添加的注释会作为描述出现在命令的`help`中。

现在，如果我们运行`help greet`，就会得到一些更友好的帮助文本：

```
A greeting command that can greet the caller

Usage:
  > greet <name> {flags}

Parameters:
  <name> The name of the person to greet

Flags:
  -h, --help: Display this help message
  -a, --age <integer>: The age of the person
```

## 管道输出

自定义命令会像内置命令一样流式输出。例如，假设我们想重构这个管道：

```nu
ls | get name
```

让我们把[`ls`](/commands/docs/ls.md)移到我们编写的命令中：

```nu
def my-ls [] { ls }
```

我们就可以像使用[`ls`](/commands/docs/ls.md)一样使用这个命令的输出：

```nu
my-ls | get name
───┬───────────────────────
 0 │ myscript.nu
 1 │ myscript2.nu
 2 │ welcome_to_nushell.md
───┴───────────────────────
```

这让我们可以很容易地创建自定义命令并处理它们的输出。注意，我们不像其他语言那样使用返回语句，取而代之的是我们创建管道，而其输出数据流可以连接到其他管道。

## 管道输入

如同其他命令一样，自定义命令也可以从管道中获取输入，这个输入会自动传递给自定义命令所使用的代码块。

让我们创建一个把所有接收值都加倍的命令：

```nu
def double [] {
  each { |elt| 2 * $elt }
}
```

现在，如果我们在一个管道中调用上述命令，就可以看到它对输入的处理结果：

```nu
[1 2 3] | double
# => ───┬─────
# =>  0 │ 2
# =>  1 │ 4
# =>  2 │ 6
# => ───┴─────
```

我们还可以使用`$in`变量来存储输入，以便在后面使用：

```nu
def nullify [...cols] {
  let start = $in
  $cols | reduce --fold $start { |col, df|
    $df | upsert $col null
  }
}
```

## 持久化

关于如何持久化自定义命令，以便在你启动 Nushell 时它们是可用的，请参阅 [配置](configuration.md) 部分并添加你的启动脚本。
