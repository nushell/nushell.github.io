# 处理字符串

Nushell 中的字符串用于保存文本数据以便后续使用，其中可以包括文件名、文件路径、列名以及更多。字符串是如此地普遍，以至于 Nushell 提供了几种处理它们的方法，你可以从中选择最合适的。

## 单引号字符串

Nushell 中最简单的字符串是单引号字符串。这种字符串使用`'`字符来包裹文本。下面是作为单引号字符串的`hello world`示例：

```sh
> 'hello world'
hello world
```

单引号字符串不会对它们所给予的文本做任何事情，这使得它们成为容纳广泛文本数据的理想选择。

## 双引号字符串

对于更复杂的字符串，Nushell 也提供双引号字符串。这些字符串使用`"`字符来包裹文本。它们还支持使用`\`字符在文本中转义。

例如，我们可以用转义字符和双引号字符串写出文字 hello，然后换行，再写上 world：

```sh
> "hello\nworld"
hello
world
```

转义字符让你快速添加一个非此难以输入的字符。

Nushell 目前支持以下转义字符：

- `\"` - 双引号
- `\'` - 单引号
- `\\` - 反斜杠
- `\/` - 斜杠
- `\b` - 退格字符
- `\f` - 换页符
- `\r` - 回车符
- `\n` - 换行符 (line feed)
- `\t` - 制表符
- `\u{X...}` - Unicode字符（将X...替换为1到6个十六进制数字）

## 字符串插值

更复杂的字符串用例还需要一种新的字符串形式：字符串插值。这是一种从原始文本和执行表达式的结果中构建文本的方法。字符串插值将这些结果结合在一起，返回一个新的字符串。

字符串插值使用 `$" "` 和 `$' '` 作为包裹插值文本的方式。

例如，假设我们有一个叫做`$name`的变量，我们想问候这个变量中所包含的人：

```sh
> let name = "Alice"
> $"greetings, ($name)"
greetings, Alice
```

通过使用`()`包裹表达式，我们可以运行它们并使用结果来帮助生成字符串。

字符串插值有单引号：`$' '` 和双引号：`$" "` 这两种形式，分别对应于单引号和双引号字符串 —— 单引号字符串插值不支持转义字符，而双引号字符串插值支持。

从 0.61 版开始，字符串插值支持转义小括号，所以`(`和`)`字符可以在一个字符串中使用，而 Nushell 不会试图计算它们之间出现的内容：

```sh
> $"2 + 2 is (2 + 2) \(you guessed it!)"
2 + 2 is 4 (you guessed it!)
```

## 分割字符串

[`split row`](/book/commands/split_row.md)命令从一个基于分隔符的字符串创建一个列表。
例如，`let colors = ("red,green,blue" | split row ",")` 创建列表`[red green blue]`。

[`split column`](/book/commands/split_column.md)命令将从一个基于分隔符的字符串中创建一个表。例如，`let colors = ("red,green,blue" | split column ",")` 创建一个表格，并为每个元素添加一列。

最后, [`split chars`](/book/commands/split_chars.md)命令将一个字符串分割成一个字符列表。

## `str` 命令

许多字符串函数是`str`命令的子命令，你可以使用`help str`来获得一个完整的 `str` 命令列表。

例如, 你可以使用`str contains`来检查一个字符串是否包含某个特定的字符：

```sh
> "hello world" | str contains "w"
true
```

### 修剪字符串

你可以用 [`str trim`](/book/commands/str_trim.md) 命令修剪字符串的两侧。默认情况下，[`str trim`](/book/commands/str_trim.md) 命令会修剪字符串两边的空白。比如：

```sh
> '       My   string   ' | str trim
My   string
```

你可以用 `--right` 和 `--left` 选项来指定对哪一边进行修剪。

要修剪一个特定的字符，使用 `--char <Character>` 来指定要修剪的字符。

下面是一个传入了所有选项的例子：

```sh
> '=== Nu shell ===' | str trim -r -c '='
=== Nu shell
```

### 子字符串

子字符串是一个字符串的切片，它们有起始点和结束点。下面是一个使用子串的例子：

```sh
> 'Hello World!' | str index-of 'o'
4
> 'Hello World!' | str index-of 'r'
8
> 'Hello World!' | str substring '4,8'
o Wo
```

### 字符串填充

使用 [`str lpad`](/book/commands/str_lpad.md) 和 [`str rpad`](/book/commands/str_rpad.md) 命令，你可以给字符串添加填充。填充会给字符串添加字符，直到它达到一定的长度。比如：

```sh
> '1234' | str lpad -l 10 -c '0'
0000001234
> '1234' | str rpad -l 10 -c '0' | str length
10
```

### 反转字符串

反转字符串可以通过 [`str reverse`](/book/commands/str_reverse.md) 命令轻松完成：

```sh
> 'Nushell' | str reverse
llehsuN
> ['Nushell' 'is' 'cool'] | str reverse
╭───┬─────────╮
│ 0 │ llehsuN │
│ 1 │ si      │
│ 2 │ looc    │
╰───┴─────────╯
```

## 解析字符串

通过 [`parse`](/book/commands/parse.md) 命令，你可以将一个字符串解析成若干列。比如：

```sh
> 'Nushell is the best' | parse '{shell} is {type}'
╭───┬─────────┬──────────╮
│ # │  shell  │   type   │
├───┼─────────┼──────────┤
│ 0 │ Nushell │ the best │
╰───┴─────────┴──────────╯
> 'Bash is kinda cringe' | parse --regex '(?P<shell>\w+) is (?P<type>[\w\s]+)'
╭───┬───────┬──────────────╮
│ # │ shell │     type     │
├───┼───────┼──────────────┤
│ 0 │ Bash  │ kinda cringe │
╰───┴───────┴──────────────╯
```

## 字符串转换

有多种方法可以将字符串转换为其他类型或者反之。

### 转换为字符串

1. 使用 [`into string`](/book/commands/into_string.md)。例如：`123 | into string`
2. 通过字符串插值。例如：`$'(123)'`
3. 使用 [`build-string`](/book/commands/build-string.md)。例如：`build-string (123)`

### 字符串转换为其他类型

1. 使用 [`into <type>`](/book/commands/into.md)。例如：`'123' | into int`

## 字符串着色

你可以通过 [`ansi`](/book/commands/ansi.md) 命令给字符串着色。例如：

```sh
> $'(ansi purple_bold)This text is a bold purple!(ansi reset)'
```

`ansi purple_bold` 使文本紫色加粗

`ansi reset` 将着色重置为默认值。(提示: 你应该总是用 `ansi reset` 来结束着色的字符串)
