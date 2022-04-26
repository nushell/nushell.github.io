# 运算符

Nushell 支持以下常见的数学、逻辑和字符串操作的运算符：

| 运算符   | 描述                              |
| -------- | --------------------------------- |
| `+`      | 加                                |
| `-`      | 减                                |
| `*`      | 乘                                |
| `/`      | 除                                |
| `**`     | 指数 (幂)                         |
| `mod`    | 取模                              |
| `==`     | 等于                              |
| `!=`     | 不等于                            |
| `<`      | 小于                              |
| `<=`     | 小于等于                          |
| `>`      | 大于                              |
| `>=`     | 大于等于                          |
| `=~`     | 正则匹配 / 字符串包含另一个字符串 |
| `!~`     | 正则不匹配 / 字符串*不*包含另一个 |
| `in`     | 列表包含值                        |
| `not-in` | 列表不包含值                      |
| `&&`     | 两个布尔值与运算                  |
| `||`     | 两个布尔值或运算                  |

圆括号可用于分组以指定求值顺序，或用于调用命令并在表达式中使用结果。

## 运算符结合顺序

数学运算的结合顺序如下（从最高优先级到最低）：

- 圆括号 (`()`)
- 乘 (`*`) 、 除 (`/`) 和幂 (`**`)
- 加 (`+`) 和减 (`-`)

```
> 3 * (1 + 2)
9
```

## 正则表达式 / 字符串包含运算符

`=~`和`!~`运算符提供了一种更方便的方法来评估 [正则表达式](https://cheatography.com/davechild/cheat-sheets/regular-expressions/)。你不需要知道正则表达式就可以使用它们 —— 它们也是检查一个字符串是否包含另一个的简单方法：

- `string =~ pattern` 如果 `string` 包含 `pattern` 的匹配返回 **true**, 反之返回 **false**；
- `string !~ pattern` 如果 `string` 包含 `pattern` 的匹配返回 **false**, 反之返回 **true**；

例如:

```bash
foobarbaz =~ bar # returns true
foobarbaz !~ bar # returns false
ls | where name =~ ^nu # returns all files whose names start with "nu"
```

两个运算符都使用了 [Rust regex 包的 `is_match()` 函数](https://docs.rs/regex/latest/regex/struct.Regex.html#method.is_match)。

## 大小写敏感性

对字符串进行操作时，运算符通常是区分大小写的。有几种方法可以处理大小写不敏感的场景：

1. 在正则表达式运算符中，指定`(?i)`不区分大小写的模式修饰器：

```bash
"FOO" =~ "foo" # returns false
"FOO" =~ "(?i)foo" # returns true
```

2. 使用[`str contains`](/book/commands/str_contains.md) 命令的`--insensitive`标志：

```bash
"FOO" | str contains --insensitive "foo"
```

3. 在比较前用[`str downcase`](/book/commands/str_downcase.md)将字符串转换为小写：

```bash
("FOO" | str downcase) == ("Foo" | str downcase)
```
