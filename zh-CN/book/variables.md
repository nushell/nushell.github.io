# 变量

Nushell 的值可以使用 `let`、`const` 或 `mut` 关键字赋给命名变量。
创建变量后，我们可以使用 `$` 后跟其名称来引用它。

## 变量类型

### 不可变变量

不可变变量在声明后不能更改其值。它们使用 `let` 关键字声明，

```nu
let val = 42
$val
# => 42
$val = 100
# => Error: nu::shell::assignment_requires_mutable_variable
# =>
# =>   × Assignment to an immutable variable.
# =>    ╭─[entry #10:1:1]
# =>  1 │ $val = 100
# =>    · ──┬─
# =>    ·   ╰── needs to be a mutable variable
# =>    ╰────
```

然而，不可变变量可以被“遮蔽”。遮蔽意味着它们被重新声明，并且它们的初始值在同一作用域内不能再使用。

```nu
let val = 42                   # 声明一个变量
do { let val = 101;  $val }    # 在内部作用域中，遮蔽该变量
# => 101
$val                           # 在外部作用域中，变量保持不变
# => 42
let val = $val + 1             # 现在，在外部作用域中，遮蔽原始变量
$val                           # 在外部作用域中，变量现在被遮蔽，并且
# => 43                               # 其原始值不再可用。
```

### 可变变量

可变变量允许通过赋值来更改其值。这些变量使用 `mut` 关键字声明。

```nu
mut val = 42
$val += 27
$val
# => 69
```

有几个与可变变量一起使用的赋值运算符

| 运算符 | 描述                                 |
| ------ | ------------------------------------ |
| `=`    | 为变量赋一个新值                     |
| `+=`   | 将一个值加到变量上，并使和成为其新值 |
| `-=`   | 从变量中减去一个值，并使差成为其新值 |
| `*=`   | 将变量乘以一个值，并使积成为其新值   |
| `/=`   | 将变量除以一个值，并使商成为其新值   |
| `++=`  | 将列表或值附加到变量                 |

::: tip 注意

1. `+=`、`-=`、`*=` 和 `/=` 仅在其根操作预期工作的上下文中有效。例如，`+=` 使用加法，因此不能用于加法通常会失败的上下文
2. `++=` 要求变量**或**参数是列表。

:::

#### 关于可变性的更多信息

闭包和嵌套的 `def` 不能从其环境中捕获可变变量。例如

```nu
# 计算列表中元素数量的朴素方法
mut x = 0

[1 2 3] | each { $x += 1 }   # 错误：$x 在闭包中被捕获
```

要为此类行为使用可变变量，鼓励你使用循环

### 常量变量

常量变量是一个不可变变量，可以在解析时完全求值。这对于需要在解析时知道参数值的命令很有用，例如 [`source`](/commands/docs/source.md)、[`use`](/commands/docs/use.md) 和 [`plugin use`](/commands/docs/plugin_use.md)。有关更深入的解释，请参阅 [Nushell 代码如何运行](how_nushell_code_gets_run.md)。它们使用 `const` 关键字声明

```nu
const script_file = 'path/to/script.nu'
source $script_file
```

## 在可变和不可变变量之间进行选择

在大多数用例中，尽量使用不可变变量。

你可能想知道为什么 Nushell 默认使用不可变变量。在 Nushell 开发的最初几年，可变变量并不是一种语言特性。在 Nushell 开发的早期，我们决定看看在语言中使用更注重数据、函数式风格能走多远。当 Nushell 引入并行性时，这个实验显示了其价值。通过在任何 Nushell 脚本中从 [`each`](/commands/docs/each.md) 切换到 [`par-each`](/commands/docs/par-each.md)，你可以在输入上并行运行相应的代码块。这是可能的，因为 Nushell 的设计严重依赖于不可变性、组合和流水线。

在 Nushell 中，许多（如果不是大多数）可变变量的用例都有一个函数式解决方案，该解决方案：

- 只使用不可变变量，因此...
- 具有更好的性能
- 支持流式处理
- 可以支持其他功能，例如上面提到的 `par-each`

例如，循环计数器是可变变量的常见模式，并且内置于大多数迭代命令中。例如，你可以使用 [`each`](/commands/docs/each.md) 和 [`enumerate`](/commands/docs/enumerate.md) 来获取每个项目及其索引：

```nu
ls | enumerate | each { |elt| $"Item #($elt.index) is size ($elt.item.size)" }
# => ╭───┬───────────────────────────╮
# => │ 0 │ Item #0 is size 812 B     │
# => │ 1 │ Item #1 is size 3.4 KiB   │
# => │ 2 │ Item #2 is size 11.0 KiB  │
# => │ 3 │ ...                       │
# => │ 4 │ Item #18 is size 17.8 KiB │
# => │ 5 │ Item #19 is size 482 B    │
# => │ 6 │ Item #20 is size 4.0 KiB  │
# => ╰───┴───────────────────────────╯
```

你还可以使用 [`reduce`](/commands/docs/reduce.md) 命令以与在循环中改变变量相同的方式工作。例如，如果你想在字符串列表中找到最长的字符串，你可以这样做：

```nu
[one, two, three, four, five, six] | reduce {|current_item, max|
  if ($current_item | str length) > ($max | str length) {
      $current_item
  } else {
      $max
  }
}

three
```

虽然 `reduce` 处理列表，但 [`generate`](/commands/docs/generate.md) 命令可以与任意源一起使用，例如外部 REST API，也无需可变变量。这是一个示例，它每小时检索一次本地天气数据，并从该数据生成一个连续的列表。`each` 命令可用于在每个新列表项可用时使用它。

```nu
generate {|weather_station|
  let res = try {
    http get -ef $'https://api.weather.gov/stations/($weather_station)/observations/latest'
  } catch {
    null
  }
  sleep 1hr
  match $res {
    null => {
      next: $weather_station
    }
    _ => {
      out: ($res.body? | default '' | from json)
      next: $weather_station
    }
  }
} khot
| each {|weather_report|
    {
      time: ($weather_report.properties.timestamp | into datetime)
      temp: $weather_report.properties.temperature.value
    }
}
```

### 性能考虑

使用带有不可变变量的[过滤器命令](/commands/categories/filters.html)通常比使用带有传统流控制语句（如 `for` 和 `while`）的可变变量性能要好得多。例如：

- 使用 `for` 语句创建包含 50,000 个随机数的列表：

  ```nu
  timeit {
    mut randoms = []
    for _ in 1..50_000 {
      $randoms = ($randoms | append (random int))
    }
  }
  ```

  结果：1分 4秒 191毫秒 135微秒 90纳秒

- 使用 `each` 执行相同的操作：

  ```nu
  timeit {
    let randoms = (1..50_000 | each {random int})
  }
  ```

  结果：19毫秒 314微秒 205纳秒

- 使用 `each` 进行 10,000,000 次迭代：

  ```nu
  timeit {
    let randoms = (1..10_000_000 | each {random int})
  }
  ```

  结果：4秒 233毫秒 865微秒 238纳秒

  与许多过滤器一样，`each` 语句也流式传输其结果，这意味着管道的下一阶段可以继续处理，而无需等待结果被收集到变量中。

  对于可以通过并行化优化的任务，如上所述，`par-each` 可以获得更显着的性能提升。

## 变量名

Nushell 中的变量名对其可以包含的字符有一些限制。特别是，它们不能包含这些字符：

```text
.  [  (  {  +  -  *  ^  /  =  !  <  >  &  |
```

一些脚本声明以 `$` 开头的变量是很常见的。这是允许的，它等同于根本没有 `$`。

```nu
let $var = 42
# 与 `let var = 42` 相同
```
