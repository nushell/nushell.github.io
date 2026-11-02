# `where` 和 `filter`

[`where`](/commands/docs/where.md) 保留列表或表格中条件为 `true` 的项或行，丢弃其余部分。条件有两种写法：

- **行条件**：直接写在 `where` 后面的表达式，例如 `size > 1kb`；
- **闭包**：接收每个项并返回 `bool`，可以内联书写，也可以存在变量里。

`filter` 是闭包形式的老名字。它自 0.105 起已弃用；请改用 `where`。

另见：《Nushell 之书》中的[处理表格](../../../book/working_with_tables.md)和
[处理列表](../../../book/working_with_lists.md)，以及 [`$it`](../../../book/special_variables.md#it)。

## 行条件

在行条件中，运算符左侧的裸词是当前行的一列（它是单元格路径，所以 `info.size` 也能用），
而 `$it` 是当前整行或整个列表项：

```nu
let files = [
  [name size type];
  [README.md 2kb file]
  [src 0b dir]
  [build.rs 12kb file]
  [notes.txt 300b file]
]
$files | where type == file and size > 1kb
# => ╭───┬───────────┬─────────┬──────╮
# => │ # │   name    │  size   │ type │
# => ├───┼───────────┼─────────┼──────┤
# => │ 0 │ README.md │  2.0 kB │ file │
# => │ 1 │ build.rs  │ 12.0 kB │ file │
# => ╰───┴───────────┴─────────┴──────╯
```

```nu
[1 2 3 4 5] | where $it > 2
# => ╭───┬───╮
# => │ 0 │ 3 │
# => │ 1 │ 4 │
# => │ 2 │ 5 │
# => ╰───┴───╯
```

可以使用任何运算符，条件之间可以用 `and`、`or` 和 `not` 组合。用 `$it` 可以写出跨多列的表达式：

```nu
[[name]; [alpha] [beta] [gamma]] | where name in [beta gamma]
# => ╭───┬───────╮
# => │ # │ name  │
# => ├───┼───────┤
# => │ 0 │ beta  │
# => │ 1 │ gamma │
# => ╰───┴───────╯
```

```nu
[[a b]; [1 2] [3 4]] | where ($it.a + $it.b) > 4
# => ╭───┬───┬───╮
# => │ # │ a │ b │
# => ├───┼───┼───┤
# => │ 0 │ 3 │ 4 │
# => ╰───┴───┴───╯
```

`and`、`or`、`xor` 两侧，或 `not` 之后的裸词同样也是列名，所以一个 `bool` 列可以单独作为条件使用：

```nu
[{name: a, done: true, urgent: true} {name: b, done: false, urgent: true} {name: c, done: false, urgent: false}] | where not done and urgent
# => ╭───┬──────┬───────┬────────╮
# => │ # │ name │ done  │ urgent │
# => ├───┼──────┼───────┼────────┤
# => │ 0 │ b    │ false │ true   │
# => ╰───┴──────┴───────┴────────╯
```

外层作用域中的变量可以用在两侧：`let limit = 2; $list | where $it > $limit`。

行条件是语法，不是值。它不能存进变量；要存请用闭包。

## 闭包

闭包通过参数与 `$in` 接收到该项：

```nu
[1 2 3 4 5] | where {|n| $n mod 2 == 1 }
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 3 │
# => │ 2 │ 5 │
# => ╰───┴───╯
```

存在变量里的闭包可以传给 `where`。这正是 `filter` 过去所覆盖的用法：

```nu
let is_odd = {|n| $n mod 2 == 1 }
[1 2 3 4 5] | where $is_odd
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 3 │
# => │ 2 │ 5 │
# => ╰───┴───╯
```

## 语言说明

1. `where` 作用于列表和表格（包括流），而不作用于单个记录：

   ```nu
   {a: 1} | where a == 1
   # => Error: nu::parser::input_type_mismatch
   # =>
   # =>   × Command does not support record<a: int> input.
   # =>    ╭─[repl_entry #1:1:10]
   # =>  1 │ {a: 1} | where a == 1
   # =>    ·          ──┬──
   # =>    ·            ╰── command doesn't support record<a: int> input
   # =>    ╰────
   ```

1. 如果某些行缺少该列，条件会因 `column_not_found` 而失败。用 `?` 把该成员变成可选的，
   这样缺失的值会变成 `null`：

   ```nu
   [{a: 1} {b: 2}] | where a? == 1
   # => ╭───┬───╮
   # => │ # │ a │
   # => ├───┼───┤
   # => │ 0 │ 1 │
   # => ╰───┴───╯
   ```

1. 只有条件**恰好**为 `true` 的行才会被保留。

1. 行条件不限于 `where`。[`any`](/commands/docs/any.md)、[`all`](/commands/docs/all.md)、
   [`take while`](/commands/docs/take_while.md)、[`take until`](/commands/docs/take_until.md)、
   [`skip while`](/commands/docs/skip_while.md)、[`skip until`](/commands/docs/skip_until.md) 和
   [`chunk-by`](/commands/docs/chunk-by.md) 也接受行条件，同时也接受闭包：

   ```nu
   [1 2 3 4 1] | take while $it < 3
   # => ╭───┬───╮
   # => │ 0 │ 1 │
   # => │ 1 │ 2 │
   # => ╰───┴───╯
   ```

   ```nu
   [9 8 7 6] | enumerate | any item == index * 2
   # => true
   ```

1. `filter` 仍然可用，但解析器会打印一条弃用警告：

   ```nu
   [1 2 3] | filter {|x| $x > 1}
   # => Warning: nu::parser::deprecated
   # =>
   # =>   ⚠ Command deprecated.
   # =>    ╭─[repl_entry #1:1:11]
   # =>  1 │ [1 2 3] | filter {|x| $x > 1}
   # =>    ·           ─────────┬─────────
   # =>    ·                    ╰── filter was deprecated in 0.105.0 and will be removed in a future release.
   # =>    ╰────
   # =>   help: `where` command can be used instead, as it can now read the predicate closure from a variable
   # =>
   # => ╭───┬───╮
   # => │ 0 │ 2 │
   # => │ 1 │ 3 │
   # => ╰───┴───╯
   ```
