# 处理字符串

Nushell 中的字符串用于保存文本数据以便后续使用，其中可以包括文件名、文件路径、列名以及更多。字符串是如此地普遍，以至于 Nushell 提供了几种处理它们的方法，你可以从中选择最合适的。

## 字符串格式一览

| 字符串格式                               | 示例                    | 转义字符        | 说明                                       |
| ---------------------------------------- | ----------------------- | --------------- | ------------------------------------------ |
| [单引号字符串](#single-quoted-strings)   | `'[^\n]+'`              | 无              | 字符串内不能包含单引号                     |
| [双引号字符串](#double-quoted-strings)   | `"The\nEnd"`            | C风格反斜杠转义 | 所有字面反斜杠都必须转义                   |
| [原始字符串](#raw-strings)               | `r#'Raw string'#`       | 无              | 可以包含单引号                             |
| [裸词字符串](#bare-word-strings)         | `ozymandias`            | 无              | 只能包含"单词"字符；不能在命令位置使用     |
| [反引号字符串](#backtick-quoted-strings) | <code>\`[^\n]+\`</code> | 无              | 可以包含空格的裸字符串。不能包含任何反引号 |
| [单引号插值](#string-interpolation)      | `$'Captain ($name)'`    | 无              | 不能包含任何 `'` 或不匹配的 `()`           |
| [双引号插值](#string-interpolation)      | `$"Captain ($name)"`    | C风格反斜杠转义 | 所有字面反斜杠和 `()` 都必须转义           |

## 单引号字符串

Nushell 中最简单的字符串是单引号字符串。这种字符串使用`'`字符来包裹文本。下面是作为单引号字符串的`hello world`示例：

```nu
'hello world'
# => hello world
```

单引号字符串不会对它们所给予的文本做任何事情，这使得它们成为容纳广泛文本数据的理想选择。

## 双引号字符串

对于更复杂的字符串，Nushell 也提供双引号字符串。这些字符串使用`"`字符来包裹文本。它们还支持使用`\`字符在文本中转义。

例如，我们可以用转义字符和双引号字符串写出文字 hello，然后换行，再写上 world：

```nu
"hello\nworld"
# => hello
# => world
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
- `\u{X...}` - Unicode 字符, 其中 X...为 1 到 6 位的十六进制数字

## 原始字符串(Raw Strings)

原始字符串的行为与单引号字符串相同，不同之处在于原始字符串也可以包含单引号。这是可能的，因为原始字符串由起始的`r#'`和结束的`'#`包围。这种语法对Rust用户来说应该很熟悉。

```nu
r#'原始字符串可以包含'引号'文本'#
# => 原始字符串可以包含'引号'文本
```

可以在原始字符串的开始和结束处添加额外的`#`符号来包围字符串中比`'`符号少一个的相同数量的`#`符号。这可以用来嵌套原始字符串：

```nu
r###'r##'这是一个原始字符串的例子'##'###
# => r##'这是一个原始字符串的例子'##
```

## 裸词字符串(Bare Word Strings)

像其他shell语言(但与大多数其他编程语言不同)一样，由单个'词'组成的字符串也可以不加任何引号：

```nu
print hello
# => hello
[hello] | describe
# => list<string>
```

但要小心 - 如果在命令行上直接使用裸词(即不在数据结构中或作为命令参数使用)或在圆括号`(` `)`内，它将被解释为外部命令：

```nu
hello
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[entry #5:1:1]
# =>  1 │ hello
# =>    · ──┬──
# =>    ·   ╰── executable was not found
# =>    ╰────
# =>   help: program not found
```

此外，许多裸词在nu中有特殊含义，因此不会被解释为字符串：

```nu
true | describe
# => bool
[true] | describe
# => list<bool>
[trueX] | describe
# => list<string>
trueX | describe
# => Error: nu::shell::external_command
# =>
# =>   × External command failed
# =>    ╭─[entry #5:1:1]
# =>  1 │ trueX | describe
# =>    · ──┬──
# =>    ·   ╰── executable was not found
# =>    ╰────
# =>   help: program not found
```

## 反引号字符串(Backtick-quoted Strings)

裸词字符串本质上不能包含空格或引号。作为替代方案，Nushell还包括使用<code>`</code>字符的反引号字符串。在大多数情况下，这些应该与裸词字符串的操作方式相同。

例如，与裸词一样，表达式第一个位置的反引号字符串将被解释为*命令*或*路径*。例如：

```nu
# 运行路径中找到的外部ls二进制文件
`ls`

# 向上移动一个目录
`..`

# 切换到"my dir"子目录(如果存在)
`./my dir`
```

反引号字符串对于将glob与包含空格的文件或目录组合很有用：

```nu
ls `./my dir/*`
```

反引号字符串不能在字符串本身中包含*不匹配的*反引号。例如：

`````nu
echo ````
``

echo ```
# 未终止的字符串将在CLI中开始新行
`````

## 字符串作为外部命令

你可以在任何字符串(包括变量)前面加上`^`符号，让Nushell执行该字符串，就像它是外部命令一样：

```nu
^'C:\Program Files\exiftool.exe'

let foo = 'C:\Program Files\exiftool.exe'
^$foo
```

你也可以使用[`run-external`](/commands/docs/run-external.md)命令来实现此目的，该命令提供了额外的标志和选项。

## 字符串拼接

有多种方法可以在字符串前后添加内容。如果你想在每个字符串的开头添加一些东西，闭包是一个不错的选择：

```nu
['foo', 'bar'] | each {|s| '~/' ++ $s} # ~/foo, ~/bar
['foo', 'bar'] | each {|s| '~/' + $s} # ~/foo, ~/bar
```

你也可以使用正则表达式替换字符串的开头或结尾：

```nu
['foo', 'bar'] | str replace -r '^' '~/'# ~/foo, ~/bar
['foo', 'bar'] | str replace -r '$' '~/'# foo~/, bar~/
```

如果你想在最后得到一个字符串，那么`str join`是你的朋友：

```nu
"hello" | append "world!" | str join " " # hello world!
```

你也可以使用reduce：

```nu
1..10 | reduce -f "" {|elt, acc| $acc + ($elt | into string) + " + "} # 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 +
```

不过在字符串的情况下，特别是如果你不必对字符串进行操作，使用`str join`通常更容易且更正确(注意上面例子中末尾多余的+)。

## 字符串插值

更复杂的字符串用例还需要一种新的字符串形式：字符串插值。这是一种从原始文本和执行表达式的结果中构建文本的方法。字符串插值将这些结果结合在一起，返回一个新的字符串。

字符串插值使用 `$" "` 和 `$' '` 作为包裹插值文本的方式。

例如，假设我们有一个叫做`$name`的变量，我们想问候这个变量中所包含的人：

```nu
let name = "Alice"
$"greetings, ($name)"
# => greetings, Alice
```

通过使用`()`包裹表达式，我们可以运行它们并使用结果来帮助生成字符串。

字符串插值有单引号：`$' '` 和双引号：`$" "` 这两种形式，分别对应于单引号和双引号字符串 —— 单引号字符串插值不支持转义字符，而双引号字符串插值支持。

从 0.61 版开始，字符串插值支持转义小括号，所以`(`和`)`字符可以在一个字符串中使用，而 Nushell 不会试图计算它们之间出现的内容：

```nu
$"2 + 2 is (2 + 2) \(you guessed it!)"
# => 2 + 2 is 4 (you guessed it!)
```

## 分割字符串

[`split row`](/commands/docs/split_row.md)命令从一个基于分隔符的字符串创建一个列表。
例如，`let colors = ("red,green,blue" | split row ",")` 创建列表`[red green blue]`。

[`split column`](/commands/docs/split_column.md)命令将从一个基于分隔符的字符串中创建一个表。例如，`let colors = ("red,green,blue" | split column ",")` 创建一个表格，并为每个元素添加一列。

最后, [`split chars`](/commands/docs/split_chars.md)命令将一个字符串分割成一个字符列表。

## `str` 命令

许多字符串函数是`str`命令的子命令，你可以使用`help str`来获得一个完整的 `str` 命令列表。

例如, 你可以使用`str contains`来检查一个字符串是否包含某个特定的字符：

```nu
"hello world" | str contains "w"
# => true
```

### 修剪字符串

你可以用 [`str trim`](/commands/docs/str_trim.md) 命令修剪字符串的两侧。默认情况下，[`str trim`](/commands/docs/str_trim.md) 命令会修剪字符串两边的空白。比如：

```nu
'       My   string   ' | str trim
# => My   string
```

你可以用 `--right` 和 `--left` 选项来指定对哪一边进行修剪。

要修剪一个特定的字符，使用 `--char <Character>` 来指定要修剪的字符。

下面是一个传入了所有选项的例子：

```nu
'=== Nu shell ===' | str trim -r -c '='
# => === Nu shell
```

### 子字符串

子字符串是一个字符串的切片，它们有起始点和结束点。下面是一个使用子串的例子：

```nu
'Hello World!' | str index-of 'o'
# => 4
'Hello World!' | str index-of 'r'
# => 8
'Hello World!' | str substring 4..8
# => o Wo
```

### 字符串填充

[`fill`](/commands/docs/fill.md)：

```nu
'1234' | fill -a right -c '0' -w 10
# => 0000001234
'1234' | fill -a left -c '0' -w 10 | str length
# => 10
```

### 反转字符串

反转字符串可以通过 [`str reverse`](/commands/docs/str_reverse.md) 命令轻松完成：

```nu
'Nushell' | str reverse
# => llehsuN
['Nushell' 'is' 'cool'] | str reverse
# => ╭───┬─────────╮
# => │ 0 │ llehsuN │
# => │ 1 │ si      │
# => │ 2 │ looc    │
# => ╰───┴─────────╯
```

## 解析字符串

通过 [`parse`](/commands/docs/parse.md) 命令，你可以将一个字符串解析成若干列。比如：

```nu
'Nushell is the best' | parse '{shell} is {type}'
# => ╭───┬─────────┬──────────╮
# => │ # │  shell  │   type   │
# => ├───┼─────────┼──────────┤
# => │ 0 │ Nushell │ the best │
# => ╰───┴─────────┴──────────╯
'Bash is kinda cringe' | parse --regex '(?P<shell>\w+) is (?P<type>[\w\s]+)'
# => ╭───┬───────┬──────────────╮
# => │ # │ shell │     type     │
# => ├───┼───────┼──────────────┤
# => │ 0 │ Bash  │ kinda cringe │
# => ╰───┴───────┴──────────────╯
```

## 字符串比较

除了标准的`==`和`!=`操作符外，还有一些专门用于比较字符串的操作符。

熟悉Bash和Perl的人会认识这些正则表达式比较操作符：

```nu
'APL' =~ '^\w{0,3}$'
# => true
'FORTRAN' !~ '^\w{0,3}$'
# => true
```

还有两个操作符用于更简单的比较：

```nu
'JavaScript' starts-with 'Java'
# => true
'OCaml' ends-with 'Caml'
# => true
```

## 字符串转换

有多种方法可以将字符串转换为其他类型或者反之。

### 转换为字符串

1. 使用 [`into string`](/commands/docs/into_string.md)。例如：`123 | into string`
2. 通过字符串插值。例如：`$'(123)'`

### 字符串转换为其他类型

1. 使用 [`into <type>`](/commands/docs/into.md)。例如：`'123' | into int`

## 字符串着色

你可以通过 [`ansi`](/commands/docs/ansi.md) 命令给字符串着色。例如：

```nu
$'(ansi purple_bold)This text is a bold purple!(ansi reset)'
```

`ansi purple_bold` 使文本紫色加粗

`ansi reset` 将着色重置为默认值。(提示: 你应该总是用 `ansi reset` 来结束着色的字符串)
