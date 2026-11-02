# 运算符

Nushell 支持以下运算符，用于常见的数学、逻辑和字符串操作：

| 运算符             | 说明                                             |
| ------------------ | ------------------------------------------------ |
| `+`                | 加                                               |
| `-`                | 减                                               |
| `*`                | 乘                                               |
| `/`                | 除                                               |
| `//`               | 向下取整除法                                     |
| `mod`              | 取模                                             |
| `**`               | 幂运算                                           |
| `==`               | 等于                                             |
| `!=`               | 不等于                                           |
| `<`                | 小于                                             |
| `<=`               | 小于等于                                         |
| `>`                | 大于                                             |
| `>=`               | 大于等于                                         |
| `=~` 或 `like`     | 正则匹配 / 字符串包含另一个                      |
| `!~` 或 `not-like` | 反向正则匹配 / 字符串*不*包含另一个              |
| `in`               | 值在列表中、字符串的子串、或记录中的键           |
| `not-in`           | 值不在列表中、不是子串、或不是记录中的键         |
| `has`              | 列表含有该值、字符串包含另一个、或记录含有该键   |
| `not-has`          | 列表不含该值、字符串不包含另一个、或记录缺少该键 |
| `not`              | 逻辑非                                           |
| `and`              | 两个布尔表达式的与（短路求值）                   |
| `or`               | 两个布尔表达式的或（短路求值）                   |
| `xor`              | 两个布尔表达式的异或                             |
| `bit-or`           | 按位或                                           |
| `bit-xor`          | 按位异或                                         |
| `bit-and`          | 按位与                                           |
| `bit-shl`          | 按位左移                                         |
| `bit-shr`          | 按位右移                                         |
| `starts-with`      | 字符串以某内容开始                               |
| `not-starts-with`  | 字符串不以某内容开始                             |
| `ends-with`        | 字符串以某内容结尾                               |
| `not-ends-with`    | 字符串不以某内容结尾                             |
| `++`               | 连接两个列表、两个字符串或两个二进制值           |


括号可用于分组，以指定求值顺序，也可用于调用命令并在表达式中使用其结果。

## 运算顺序

要了解运算的优先级，可以运行命令：`help operators | sort-by precedence -r`。

按优先级从高到低排列，各运算如下：

- 括号（`()`）
- 幂运算（`**`）
- 乘（`*`）、除（`/`）、整数/向下取整除法（`//`）和取模（`mod`）
- 加（`+`）和减（`-`）
- 位移（`bit-shl`、`bit-shr`）
- 比较运算（`==`、`!=`、`<`、`>`、`<=`、`>=`）、成员判断（`in`、`not-in`、`has`、`not-has`、`starts-with`、`not-starts-with`、`ends-with`、`not-ends-with`）、正则匹配（`=~`、`!~`、`like`、`not-like`）和连接（`++`）
- 按位与（`bit-and`）
- 按位异或（`bit-xor`）
- 按位或（`bit-or`）
- 逻辑非（`not`）
- 逻辑与（`and`）
- 逻辑异或（`xor`）
- 逻辑或（`or`）
- 赋值运算

```nu
3 * (1 + 2)
# => 9
```

## 类型

并非所有运算都适用于所有数据类型。
如果你尝试对不兼容的数据类型执行运算，会看到一条错误信息，它会解释哪里出了问题：
```nu
"spam" - 1
# => Error: nu::parser::operator_unsupported_type
# =>
# =>   × The '-' operator does not work on values of type 'string'.
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ "spam" - 1
# =>    · ───┬── ┬
# =>    ·    │   ╰── does not support 'string'
# =>    ·    ╰── string
# =>    ╰────
```

这些规则有时可能显得有点严格，但另一方面，意外副作用也会更少。

例如，`++` 只能连接两个**同类**的值：两个列表、两个字符串或两个二进制值。要向列表中添加单个元素，请把该元素包成列表，或使用 [`append`](/commands/docs/append.md)：

```nu
[1 2] ++ 3
# => Error: nu::parser::operator_unsupported_type
# =>
# =>   × The '++' operator does not work on values of type 'int'.
# =>    ╭─[repl_entry #2:1:7]
# =>  1 │ [1 2] ++ 3
# =>    ·       ─┬ ┬
# =>    ·        │ ╰── int
# =>    ·        ╰── does not support 'int'
# =>    ╰────
# =>   help: if you meant to append a value to a list or a record to a table, use the `append` command or wrap the value in a list. For example: `$list ++ $value` should be `$list ++ [$value]` or `$list
# =>         | append $value`.

[1 2] ++ [3]
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => ╰───┴───╯
```

## 正则表达式 / 字符串包含运算符

`=~` 和 `!~` 运算符提供了一种便捷的方式来计算[正则表达式](https://cheatography.com/davechild/cheat-sheets/regular-expressions/)。你并不需要懂正则表达式才能使用它们——它们也是检查一个字符串是否包含另一个字符串的简便方法。

- `string =~ pattern`：如果 `string` 中包含匹配 `pattern` 的内容则返回 **true**，否则返回 **false**。
- `string !~ pattern`：如果 `string` 中包含匹配 `pattern` 的内容则返回 **false**，否则返回 **true**。

例如：

```nu
"foobarbaz" =~ "bar" # returns true
"foobarbaz" !~ "bar" # returns false
ls | where name =~ ^nu # returns all files whose names start with "nu"
```

这两个运算符都使用 [Rust regex crate 的 `is_match()` 函数](https://docs.rs/regex/latest/regex/struct.Regex.html#method.is_match)。

## 大小写敏感性

运算符作用于字符串时通常是区分大小写的。有几种方法可以进行不区分大小写的操作：

1. 在正则表达式运算符中，指定 `(?i)` 不区分大小写模式修饰符：

```nu
"FOO" =~ "foo" # returns false
"FOO" =~ "(?i)foo" # returns true
```

2. 使用 [`str contains`](/commands/docs/str_contains.md) 命令的 `--ignore-case` 标志：

```nu
"FOO" | str contains --ignore-case "foo"
```

3. 比较前先用 [`str lowercase`](/commands/docs/str_lowercase.md) 把字符串转换成小写：

```nu
("FOO" | str lowercase) == ("Foo" | str lowercase)
```

## 展开运算符

Nushell 有一个用于展开列表和记录的展开运算符（`...`）。
如果你用过 JavaScript，可能对它并不陌生。有些语言用 `*` 作为它们的展开运算符。
它可以在需要多个值或多个键值对的地方展开列表或记录。

有三个地方可以使用展开运算符：

- [在列表字面量中](#在列表字面量中)
- [在记录字面量中](#在记录字面量中)
- [在命令调用中](#在命令调用中)

### 在列表字面量中

假设你有多个列表想要拼接在一起，但你同时
还想在中间插入一些单独的值。这可以用 `append` 和 `prepend` 完成，但展开
运算符能让你更轻松地做到。

```nu
let dogs = [Spot, Teddy, Tommy]
let cats = ["Mr. Humphrey Montgomery", Kitten]
[
  ...$dogs
  Polly
  ...($cats | each { |elt| $"($elt) \(cat\)" })
  ...[Porky Bessie]
  ...Nemo
]
# => ╭───┬───────────────────────────────╮
# => │ 0 │ Spot                          │
# => │ 1 │ Teddy                         │
# => │ 2 │ Tommy                         │
# => │ 3 │ Polly                         │
# => │ 4 │ Mr. Humphrey Montgomery (cat) │
# => │ 5 │ Kitten (cat)                  │
# => │ 6 │ Porky                         │
# => │ 7 │ Bessie                        │
# => │ 8 │ ...Nemo                       │
# => ╰───┴───────────────────────────────╯
```

下面是用 `append` 写的等价版本：
```nu
$dogs |
  append Polly |
  append ($cats | each { |elt| $"($elt) \(cat\)" }) |
  append [Porky Bessie] |
  append ...Nemo
```

请注意，每次调用 `append` 都会创建一个新列表，也就是说在第二个例子里
会多创建 3 个不必要的中间列表。使用展开运算符则不会如此，
所以如果你要反复拼接大量大型列表，使用 `...` 可能会有
（非常轻微的）性能优势。

你可能已经注意到，上面结果列表的最后一项是 `"...Nemo"`。这是因为在列表字面量内部，
它只能用于展开列表，而不能用于展开字符串。因此，在列表字面量内部，
它只能用在变量（`...$foo`）、子表达式（`...(foo)`）和列表字面量（`...[foo]`）之前。

如果 `...` 与后面的表达式之间有空白，它也不会被
识别为展开运算符：

```nu
[ ... [] ]
# => ╭───┬────────────────╮
# => │ 0 │ ...            │
# => │ 1 │ [list 0 items] │
# => ╰───┴────────────────╯
```

这主要是为了让 `...` 在 `mv ... $dir` 这样的命令中不会被误认为是展开运算符。

### 在记录字面量中

假设你有一个包含若干配置信息的记录，你
想往这个记录里添加更多字段：

```nu
let settings = { path: /tmp, limit: 5 }
```

你可以用展开运算符创建一个新记录，它包含 `$settings` 的所有字段再加上一些新内容。
你可以在单个记录字面量中展开多个记录。

```nu
{
  ...$settings,
  users: [alice bob],
  ...{ url: example.com },
  ...(sys mem)
}
# => ╭────────────┬───────────────╮
# => │ path       │ /tmp          │
# => │ limit      │ 5             │
# => │            │ ╭───┬───────╮ │
# => │ users      │ │ 0 │ alice │ │
# => │            │ │ 1 │ bob   │ │
# => │            │ ╰───┴───────╯ │
# => │ url        │ example.com   │
# => │ total      │ 8.3 GB        │
# => │ free       │ 2.6 GB        │
# => │ used       │ 5.7 GB        │
# => │ available  │ 2.6 GB        │
# => │ swap total │ 2.1 GB        │
# => │ swap free  │ 18.0 MB       │
# => │ swap used  │ 2.1 GB        │
# => ╰────────────┴───────────────╯
```

与列表类似，在记录字面量内部，展开运算符也只能用在变量（`...$foo`）、
子表达式（`...(foo)`）和记录字面量（`...{foo:bar}`）之前。同样，`...`
与后面的表达式之间不能有空白，否则它不会被识别为展开运算符。

### 在命令调用中

你也可以把参数展开传给命令。列表可以展开传给具有剩余位置参数的命令
或外部命令，而记录可以展开传给
[命名标志](#将记录展开为标志)。

下面是一个具有剩余位置参数的自定义命令示例：

```nu
def foo [ --flag req opt? ...args ] {
  { flag: $flag, req: $req, opt: $opt, args: $args } | to nuon
}
```

它有一个标志（`--flag`）、一个必需的位置参数（`req`）、一个可选的位置参数
（`opt?`）和剩余位置参数（`args`）。

如果你有一个参数列表要传给 `args`，可以像
[在列表字面量中](#在列表字面量中)展开列表那样展开它。同样的规则适用：展开运算符只能
用在变量、子表达式和列表字面量之前，且中间不能有空白。

```nu
foo "bar" "baz" ...[1 2 3] # With ..., the numbers are treated as separate arguments
# => {flag: false, req: bar, opt: baz, args: [1, 2, 3]}
foo "bar" "baz" [1 2 3] # Without ..., [1 2 3] is treated as a single argument
# => {flag: false, req: bar, opt: baz, args: [[1, 2, 3]]}
```

一个更有用的用法是：另一个命令也有剩余位置参数，
你想让它把参数转发给 `foo`：

```nu
def bar [ ...args ] { foo --flag "bar" "baz" ...$args }
bar 1 2 3
# => {flag: true, req: bar, opt: baz, args: [1, 2, 3]}
```

你可以在单次调用中展开多个列表，也可以在中间插入单独的参数：

```nu
foo "bar" "baz" 1 ...[2 3] 4 5 ...(6..9 | take 2) last
# => {flag: false, req: bar, opt: baz, args: [1, 2, 3, 4, 5, 6, 7, last]}
```

标志/命名参数可以放在展开的参数之后，就像它们可以放在常规剩余参数之后一样：

```nu
foo "bar" "baz" 1 ...[2 3] --flag 4
# => {flag: true, req: bar, opt: baz, args: [1, 2, 3, 4]}
```

如果展开的参数出现在可选位置参数之前，那么该可选参数
被视为省略：

```nu
foo "bar" ...[1 2] "not opt" # The null means no argument was given for opt
# => {flag: false, req: bar, opt: null, args: [1, 2, "not opt"]}
```

#### 将记录展开为标志

可以把一个记录展开到命令调用中，用来传递命名标志。每个字段名就是一个标志名（不带前导的 `--`），
它的值就是该标志的值。对于 `--flag` 这样的开关，传 `true` 会启用它，而 `false` 或 `null` 则不启用。
这对内置命令和自定义命令都适用：

```nu
foo ...{ flag: true } "bar"
# => {flag: true, req: bar, opt: null, args: []}

let sort_options = { reverse: true }
[3 1 2] | sort ...$sort_options
# => ╭───┬───╮
# => │ 0 │ 3 │
# => │ 1 │ 2 │
# => │ 2 │ 1 │
# => ╰───┴───╯
```

字段的值会按标志的类型进行校验，如果某个字段匹配不上命令的任何标志，就会报错。
更多示例（包括需要取值的标志如何处理 `null`）参见
[自定义命令](custom_commands.md#从记录传递标志)。
