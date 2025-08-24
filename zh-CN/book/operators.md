# 运算符

Nushell 支持以下常见的数学、逻辑和字符串操作的运算符：

| 运算符 | 描述 |
| --- | --- |
| `+` | 加 |
| `-` | 减 |
| `*` | 乘 |
| `/` | 除 |
| `//` | 整除 |
| `mod` | 取模 |
| `**` | 幂运算 |
| `==` | 等于 |
| `!=` | 不等于 |
| `<` | 小于 |
| `<=` | 小于等于 |
| `>` | 大于 |
| `>=` | 大于等于 |
| `=~` 或 `like` | 正则匹配 / 字符串包含另一个 |
| `!~` 或 `not-like` | 正则不匹配 / 字符串*不*包含另一个 |
| `in` | 值在列表中 |
| `not-in` | 值不在列表中 |
| `has` | 列表包含值 |
| `not-has` | 列表不包含值 |
| `not` | 逻辑取反 |
| `and` | 两个布尔值与运算 (短路) |
| `or` | 两个布尔值或运算 (短路) |
| `xor` | 两个布尔值异或运算 |
| `bit-or` | 按位或 |
| `bit-xor` | 按位异或 |
| `bit-and` | 按位与 |
| `bit-shl` | 按位左移 |
| `bit-shr` | 按位右移 |
| `starts-with` | 字符串开始检测 |
| `ends-with` | 字符串结尾检测 |
| `++` | 追加列表 |

圆括号可用于分组以指定求值顺序，或用于调用命令并在表达式中使用结果。

## 运算符结合顺序

要了解操作的优先级，可以运行命令：`help operators | sort-by precedence -r`。

按优先级降序排列，本文详细介绍了以下操作：

- 圆括号 (`()`)
- 幂 (`**`)
- 乘 (`*`) 、 除 (`/`) 、整除 (`//`) 和取模 (`mod`)
- 加 (`+`) 和减 (`-`)
- 位移 (`bit-shl`, `bit-shr`)
- 比较操作 (`==`, `!=`, `<`, `>`, `<=`, `>=`)、成员测试 (`in`, `not-in`, `starts-with`, `ends-with`)、正则匹配 (`=~`, `!~`) 和列表追加 (`++`)
- 按位与 (`bit-and`)
- 按位异或 (`bit-xor`)
- 按位或 (`bit-or`)
- 逻辑与 (`and`)
- 逻辑异或 (`xor`)
- 逻辑或 (`or`)
- 赋值操作
- 逻辑非 (`not`)

```nu
3 * (1 + 2)
# => 9
```

## 类型

并非所有操作都对所有数据类型有意义。
如果你试图对不兼容的数据类型执行操作，你将收到一条错误消息，该消息应解释出了什么问题：
```nu
"spam" - 1
# => Error: nu::parser::unsupported_operation (link)
# =>
# =>   × Types mismatched for operation.
# =>    ╭─[entry #49:1:1]
# =>  1 │ "spam" - 1
# =>    · ───┬── ┬ ┬
# =>    ·    │   │ ╰── int
# =>    ·    │   ╰── doesn't support these values.
# =>    ·    ╰── string
# =>    ╰────
# =>   help: Change string or int to be the right types and try again.
```

规则有时可能感觉有点严格，但另一方面，应该会有更少的意外副作用。

## 正则表达式 / 字符串包含运算符

`=~`和`!~`运算符提供了一种更方便的方法来评估 [正则表达式](https://cheatography.com/davechild/cheat-sheets/regular-expressions/)。你不需要知道正则表达式就可以使用它们 —— 它们也是检查一个字符串是否包含另一个的简单方法：

- `string =~ pattern` 如果 `string` 包含 `pattern` 的匹配返回 **true**, 反之返回 **false**；
- `string !~ pattern` 如果 `string` 包含 `pattern` 的匹配返回 **false**, 反之返回 **true**；

例如:

```nu
foobarbaz =~ bar # returns true
foobarbaz !~ bar # returns false
ls | where name =~ ^nu # returns all files whose names start with "nu"
```

两个运算符都使用了 [Rust regex 包的 `is_match()` 函数](https://docs.rs/regex/latest/regex/struct.Regex.html#method.is_match)。

## 大小写敏感性

对字符串进行操作时，运算符通常是区分大小写的。有几种方法可以处理大小写不敏感的场景：

1. 在正则表达式运算符中，指定`(?i)`不区分大小写的模式修饰器：

```nu
"FOO" =~ "foo" # returns false
"FOO" =~ "(?i)foo" # returns true
```

2. 使用[`str contains`](/commands/docs/str_contains.md) 命令的`--ignore-case`标志：

```nu
"FOO" | str contains --ignore-case "foo"
```

3. 在比较前用[`str downcase`](/commands/docs/str_downcase.md)将字符串转换为小写：

```nu
("FOO" | str downcase) == ("Foo" | str downcase)
```

## 扩展运算符

Nushell 有一个用于解包列表和记录的扩展运算符 (`...`)。如果你以前使用过 JavaScript，你可能对它很熟悉。有些语言使用 `*` 作为它们的扩展/散开运算符。它可以在需要多个值或键值对的地方扩展列表或记录。

你可以在三个地方使用扩展运算符：

- [在列表字面量中](#in-list-literals)
- [在记录字面量中](#in-record-literals)
- [在命令调用中](#in-command-calls)

### 在列表字面量中

假设你有多个列表想要连接在一起，但你也想在其中穿插一些单个值。这可以用 `append` 和 `prepend` 来完成，但扩展运算符可以让你更轻松地做到这一点。

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

以下是使用 `append` 的等效版本：
```nu
$dogs |
  append Polly |
  append ($cats | each { |elt| $"($elt) \(cat\)" }) |
  append [Porky Bessie] |
  append ...Nemo
```

请注意，每次调用 `append` 都会创建一个新列表，这意味着在第二个示例中，创建了 3 个不必要的中间列表。扩展运算符不是这种情况，因此如果你要一遍又一遍地连接大量的大型列表，使用 `...` 可能会有（非常微小的）性能优势。

你可能已经注意到，上面结果列表的最后一项是 `"...Nemo"`。这是因为在列表字面量中，它只能用于扩展列表，而不能用于扩展字符串。因此，在列表字面量中，它只能在变量 (`...$foo`)、子表达式 (`...(foo)`) 和列表字面量 (`...[foo]`) 之前使用。

如果 `...` 和下一个表达式之间有任何空格，`...` 也不会被识别为扩展运算符：

```nu
[ ... [] ]
# => ╭───┬────────────────╮
# => │ 0 │ ...            │
# => │ 1 │ [list 0 items] │
# => ╰───┴────────────────╯
```

这主要是为了避免 `...` 在诸如 `mv ... $dir` 之类的命令中被误认为是扩展运算符。

### 在记录字面量中

假设你有一个包含一些配置信息的记录，并且你想向该记录添加更多字段：

```nu
let config = { path: /tmp, limit: 5 }
```

你可以使用扩展运算符创建一个包含 `$config` 所有字段和一些新字段的新记录。你可以在单个记录字面量中使用多个记录的扩展。

```nu
{
  ...$config,
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

与列表类似，在记录字面量中，扩展运算符只能在变量 (`...$foo`)、子表达式 (`...(foo)`) 和记录字面量 (`...{foo:bar}`) 之前使用。同样，`...` 和下一个表达式之间不能有空格，才能被识别为扩展运算符。

### 在命令调用中

你还可以将参数扩展到命令中，前提是它要么有剩余参数，要么是外部命令。

这是一个具有剩余参数的自定义命令示例：

```nu
def foo [ --flag req opt? ...args ] {
  { flag: $flag, req: $req, opt: $opt, args: $args } | to nuon
}
```

它有一个标志 (`--flag`)、一个必需的位置参数 (`req`)、一个可选的位置参数 (`opt?`) 和一个剩余参数 (`args`)。

如果你有一个要传递给 `args` 的参数列表，你可以像在[列表字面量中](#in-list-literals)扩展列表一样扩展它。规则相同：扩展运算符仅在变量、子表达式和列表字面量之前被识别，并且中间不允许有空格。

```nu
foo "bar" "baz" ...[1 2 3] # 使用 ...，数字被视为单独的参数
# => { flag: false, req: bar, opt: baz, args: [1, 2, 3] }
foo "bar" "baz" [1 2 3] # 不使用 ...，[1 2 3] 被视为单个参数
# => { flag: false, req: bar, opt: baz, args: [[1, 2, 3]] }
```

使用扩展运算符的一种更有用的方法是，如果你有另一个带有剩余参数的命令，并且你希望它将其参数转发给 `foo`：

```nu
def bar [ ...args ] { foo --flag "bar" "baz" ...$args }
bar 1 2 3
# => { flag: true, req: bar, opt: baz, args: [1, 2, 3] }
```

你可以在一次调用中扩展多个列表，也可以穿插单个参数：

```nu
foo "bar" "baz" 1 ...[2 3] 4 5 ...(6..9 | take 2) last
# => { flag: false, req: bar, opt: baz, args: [1, 2, 3, 4, 5, 6, 7, last] }
```

标志/命名参数可以跟在扩展参数之后，就像它们可以跟在常规剩余参数之后一样：

```nu
foo "bar" "baz" 1 ...[2 3] --flag 4
# => { flag: true, req: bar, opt: baz, args: [1, 2, 3, 4] }
```

如果扩展参数在可选位置参数之前，则该可选参数被视为省略：

```nu
foo "bar" ...[1 2] "not opt" # null 表示没有为 opt 提供参数
# => { flag: false, req: bar, opt: null, args: [1, 2, "not opt"] }
