# 处理字符串

Nushell 中的字符串用于保存文本数据以便后续使用，其中可以包括文件名、文件路径、列名以及更多。字符串是如此地普遍，以至于 Nushell 提供了几种处理它们的方法，你可以从中选择最合适的。

## 字符串格式一览

| 字符串格式                    | 示例                    | 转义字符        | 说明                                       |
| ----------------------------- | ----------------------- | --------------- | ------------------------------------------ |
| [单引号字符串](#单引号字符串) | `'[^\n]+'`              | 无              | 字符串内不能包含单引号                     |
| [双引号字符串](#双引号字符串) | `"The\nEnd"`            | C风格反斜杠转义 | 所有字面反斜杠都必须转义                   |
| [原始字符串](#原始字符串)     | `r#'Raw string'#`       | 无              | 可以包含单引号                             |
| [裸词字符串](#裸词字符串)     | `ozymandias`            | 无              | 只能包含"单词"字符；不能在命令位置使用     |
| [反引号字符串](#反引号字符串) | <code>\`[^\n]+\`</code> | 无              | 可以包含空格的裸字符串。不能包含任何反引号 |
| [单引号插值](#字符串插值)     | `$'Captain ($name)'`    | 无              | 不能包含任何 `'` 或不匹配的 `()`           |
| [双引号插值](#字符串插值)     | `$"Captain ($name)"`    | C风格反斜杠转义 | 所有字面反斜杠和 `()` 都必须转义           |

## 单引号字符串

Nushell 中最简单的字符串是单引号字符串。这种字符串使用`'`字符来包裹文本。下面是作为单引号字符串的`hello world`示例：

```nu
'hello world'
# => hello world
'The
end'
# => The
# => end
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
- `\0` - 空字符（`NUL`）
- `\a` - 响铃（alert）
- `\b` - 退格字符
- `\e` - 转义字符，用于 ANSI 转义序列
- `\f` - 换页符
- `\r` - 回车符
- `\n` - 换行符 (line feed)
- `\t` - 制表符
- `\xHH` - 单个字节，其中 HH 恰好是 2 位十六进制数字（结果字符串仍必须是有效的 UTF-8）
- `\u{X...}` - 单个 Unicode 字符，其中 X... 为 1 到 6 位十六进制数字（0-9、A-F、a-f）
- `\(`, `\)`, `\{`, `\}`, `\$`, `\^`, `\#`, `\|`, `\~` - 字符本身

未识别的转义序列（例如 `\q`）是解析错误。特殊字符也可以用 [`char`](/commands/docs/char.md) 命令创建，例如在[字符串插值](#字符串插值)中写 `(char nul)`。

## 原始字符串

原始字符串的行为与单引号字符串相同，不同之处在于原始字符串也可以包含单引号。这是可能的，因为原始字符串由起始的`r#'`和结束的`'#`包围。这种语法对Rust用户来说应该很熟悉。

```nu
r#'Raw strings can contain 'quoted' text.'#
# => Raw strings can contain 'quoted' text.
```

可以在原始字符串的开始和结束处添加额外的`#`符号来包围字符串中比`'`符号少一个的相同数量的`#`符号。这可以用来嵌套原始字符串：

```nu
r###'r##'This is an example of a raw string.'##'###
# => r##'This is an example of a raw string.'##
```

## 裸词字符串

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
# =>    ╭─[repl_entry #5:1:1]
# =>  1 │ hello
# =>    · ──┬──
# =>    ·   ╰── Command `hello` not found
# =>    ╰────
# =>   help: `hello` is neither a Nushell built-in or a known external command
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
# =>    ╭─[repl_entry #5:1:1]
# =>  1 │ trueX | describe
# =>    · ──┬──
# =>    ·   ╰── Command `trueX` not found
# =>    ╰────
# =>   help: `trueX` is neither a Nushell built-in or a known external command
```

因此，虽然裸词字符串在非正式的命令行使用中很方便，但当你用 nu 进行更正式的编程时，通常应该使用引号。

## 反引号字符串

裸词字符串本质上不能包含空格或引号。作为替代方案，Nushell还包括使用<code>`</code>字符的反引号字符串。在大多数情况下，这些应该与裸词字符串的操作方式相同。

例如，与裸词一样，表达式第一个位置的反引号字符串将被解释为*命令*或*路径*。
例如：

```nu
# 运行路径中找到的外部 ls 二进制文件
`ls`
```

在提示符下单独输入一个反引号包裹的路径会切换到该目录。例如，如果存在的话，下面这会切换到 "my dir" 子目录：

```nu
`./my dir`
```

而下面这会向上移动一个目录：

```nu
`..`
```

反引号字符串对于将glob与包含空格的文件或目录组合很有用：

```nu
ls `./my dir/*`
```

反引号字符串不能在字符串本身中包含*不匹配的*反引号。例如：

`````nu
echo ````
# => ``
`````

相反，<code>echo \`\`\`</code> 是一个未终止的字符串，会在 CLI 中另起一行。

## 字符串作为外部命令

你可以在任何字符串(包括变量)前面加上`^`符号，让Nushell执行该字符串，就像它是外部命令一样：

```nu
^'C:\Program Files\exiftool.exe'

let foo = 'C:\Program Files\exiftool.exe'
^$foo
```

你也可以使用[`run-external`](/commands/docs/run-external.md)命令来实现此目的。

## 字符串拼接

有多种方法可以在字符串前后添加内容。如果你想在每个字符串的开头添加一些东西，闭包是一个不错的选择：

```nu
['foo', 'bar'] | each {|s| '~/' ++ $s} # ~/foo, ~/bar
['foo', 'bar'] | each {|s| '~/' + $s} # ~/foo, ~/bar
```

你也可以使用正则表达式替换字符串的开头或结尾：

```nu
['foo', 'bar'] | str replace -r '^' '~/' # ~/foo, ~/bar
['foo', 'bar'] | str replace -r '$' '~/' # foo~/, bar~/
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

最后你也可以使用字符串插值，不过它比较复杂，会在下面单独的小节中介绍。

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

双引号插值字符串支持转义括号，因此 `(` 和 `)` 字符可以在字符串中使用，而 Nushell 不会试图计算它们之间出现的内容：

```nu
$"2 + 2 is (2 + 2) \(you guessed it!)"
# => 2 + 2 is 4 (you guessed it!)
```

插值字符串可以在解析时求值，但如果其中包含格式取决于你的配置的值，而你的 `config.nu` 尚未加载，它们将使用默认配置。因此，如果你的 `config.nu` 里有下面这样的内容，即使你的配置指定所有文件大小都用 `MB`，`x` 也会是 `"2.0 kB"`（日期时间同样会使用默认配置）。

```nu
const x = $"(2kb)"
```

## 分割字符串

[`split row`](/commands/docs/split_row.md)命令根据分隔符将一个字符串创建为一个列表。

```nu
"red,green,blue" | split row ","
# => ╭───┬───────╮
# => │ 0 │ red   │
# => │ 1 │ green │
# => │ 2 │ blue  │
# => ╰───┴───────╯
```

[`split column`](/commands/docs/split_column.md)命令根据分隔符将一个字符串创建为一个表格。它会为表格套用通用的列名。

```nu
"red,green,blue" | split column ","
# => ╭───┬─────────┬─────────┬─────────╮
# => │ # │ column0 │ column1 │ column2 │
# => ├───┼─────────┼─────────┼─────────┤
# => │ 0 │ red     │ green   │ blue    │
# => ╰───┴─────────┴─────────┴─────────╯
```

最后，[`split chars`](/commands/docs/split_chars.md)命令将一个字符串分割成一个字符列表。

```nu
'aeiou' | split chars
# => ╭───┬───╮
# => │ 0 │ a │
# => │ 1 │ e │
# => │ 2 │ i │
# => │ 3 │ o │
# => │ 4 │ u │
# => ╰───┴───╯
```

## `str` 命令

许多字符串函数是`str`命令的子命令，你可以使用`help str`来获得一个完整的 `str` 命令列表。

例如，你可以使用 [`str contains`](/commands/docs/str_contains.md) 检查一个字符串是否包含某个特定的子字符串：

```nu
"hello world" | str contains "o wo"
# => true
```

（为了简洁，你可能也更喜欢使用 `=~` 运算符（见下文）。）

### 修剪字符串

你可以用 [`str trim`](/commands/docs/str_trim.md) 命令修剪字符串的两侧。默认情况下，[`str trim`](/commands/docs/str_trim.md) 命令会修剪字符串两边的空白。比如：

```nu
'       My   string   ' | str trim
# => My   string
```

你可以用 `--right` 和 `--left` 选项来指定对哪一边进行修剪（`-r` 和 `-l` 分别是它们的短形式选项）。

要修剪一个特定的字符，使用 `--char <Character>` 或 `-c <Character>` 来指定要修剪的字符。

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
# => o Wor
```

### 字符串填充

通过 [`fill`](/commands/docs/fill.md) 命令，你可以为字符串添加填充。填充会向字符串中添加字符，直到达到某个长度。例如：

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
'Nushell 0.80' | parse '{shell} {version}'
# => ╭───┬─────────┬─────────╮
# => │ # │  shell  │ version │
# => ├───┼─────────┼─────────┤
# => │ 0 │ Nushell │ 0.80    │
# => ╰───┴─────────┴─────────╯
'where all data is structured!' | parse --regex '(?P<subject>\w*\s?\w+) is (?P<adjective>\w+)'
# => ╭───┬──────────┬────────────╮
# => │ # │ subject  │ adjective  │
# => ├───┼──────────┼────────────┤
# => │ 0 │ all data │ structured │
# => ╰───┴──────────┴────────────╯
```

如果已知某个字符串包含逗号分隔、制表符分隔或多空格分隔的数据，你可以使用 [`from csv`](/commands/docs/from_csv.md)、[`from tsv`](/commands/docs/from_tsv.md) 或 [`from ssv`](/commands/docs/from_ssv.md)：

```nu
"acronym,long\nAPL,A Programming Language" | from csv
# => ╭───┬─────────┬────────────────────────╮
# => │ # │ acronym │          long          │
# => ├───┼─────────┼────────────────────────┤
# => │ 0 │ APL     │ A Programming Language │
# => ╰───┴─────────┴────────────────────────╯
"name  duration\nonestop.mid  4:06" | from ssv
# => ╭───┬─────────────┬──────────╮
# => │ # │    name     │ duration │
# => ├───┼─────────────┼──────────┤
# => │ 0 │ onestop.mid │ 4:06     │
# => ╰───┴─────────────┴──────────╯
"rank\tsuit\nJack\tSpades\nAce\tClubs" | from tsv
# => ╭───┬──────┬────────╮
# => │ # │ rank │  suit  │
# => ├───┼──────┼────────┤
# => │ 0 │ Jack │ Spades │
# => │ 1 │ Ace  │ Clubs  │
# => ╰───┴──────┴────────╯
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

`ansi reset` 将着色重置为默认值。

:::: tip
你应该总是用 `ansi reset` 来结束着色的字符串
::::
