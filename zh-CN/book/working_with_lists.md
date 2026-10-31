# 处理列表

:::tip
列表等同于表格中的单独一列。你可以把列表看作是一个“没有列名的单列表格”。因此，任何对某一列操作的命令*同样*适用于列表。例如，[`where`](/commands/docs/where.md) 可以用于列表：

```nu
[bell book candle] | where ($it =~ 'b')
# => ╭───┬──────╮
# => │ 0 │ bell │
# => │ 1 │ book │
# => ╰───┴──────╯
```

:::

## 创建列表

列表是有序的值集合。
列表使用方括号创建，其中的值以空格、换行和/或逗号分隔。
例如，`[foo bar baz]` 或 `[foo, bar, baz]`。

::: tip
Nushell 列表与 JSON 数组类似。表示 JSON 数组的同一个 `[ "Item1", "Item2", "Item3" ]` 也可以用来创建 Nushell 列表。
:::

## 更新列表

我们可以在列表流经管道时 [`insert`](/commands/docs/insert.md) 值，例如我们把值 `10` 插入到列表的中间：

```nu
[1, 2, 3, 4] | insert 2 10
# => ╭───┬────╮
# => │ 0 │  1 │
# => │ 1 │  2 │
# => │ 2 │ 10 │
# => │ 3 │  3 │
# => │ 4 │  4 │
# => ╰───┴────╯
```

我们也可以使用 [`update`](/commands/docs/update.md) 把第 2 个元素替换为值 `10`。

```nu
[1, 2, 3, 4] | update 1 10
# => ╭───┬────╮
# => │ 0 │  1 │
# => │ 1 │ 10 │
# => │ 2 │  3 │
# => │ 3 │  4 │
# => ╰───┴────╯
```

## 从列表中移除或添加元素

除了 [`insert`](/commands/docs/insert.md) 和 [`update`](/commands/docs/update.md) 之外，我们还有 [`prepend`](/commands/docs/prepend.md) 和 [`append`](/commands/docs/append.md)。它们分别让你在列表的开头或末尾插入元素。

例如：

```nu
let colors = [yellow green]
let colors = ($colors | prepend red)
let colors = ($colors | append purple)
let colors = ($colors ++ ["blue"])
let colors = (["black"] ++ $colors)
$colors
# => ╭───┬────────╮
# => │ 0 │ black  │
# => │ 1 │ red    │
# => │ 2 │ yellow │
# => │ 3 │ green  │
# => │ 4 │ purple │
# => │ 5 │ blue   │
# => ╰───┴────────╯
```

`append` 也一次接受多个值：

```nu
[yellow green] | append purple blue
# => ╭───┬────────╮
# => │ 0 │ yellow │
# => │ 1 │ green  │
# => │ 2 │ purple │
# => │ 3 │ blue   │
# => ╰───┴────────╯
```

如果你想从列表中移除元素，有很多方法。[`skip`](/commands/docs/skip.md) 允许你跳过输入的前几行，而 [`drop`](/commands/docs/drop.md) 允许你从列表末尾跳过指定编号的行。

```nu
let colors = [red yellow green purple]
let colors = ($colors | skip 1)
let colors = ($colors | drop 2)
$colors
# => ╭───┬────────╮
# => │ 0 │ yellow │
# => ╰───┴────────╯
```

我们还有 [`last`](/commands/docs/last.md) 和 [`first`](/commands/docs/first.md)，它们分别允许你用 [`take`](/commands/docs/take.md) 从列表的末尾或开头取值。

```nu
let colors = [red yellow green purple black magenta]
let colors = ($colors | last 3)
$colors
# => ╭───┬─────────╮
# => │ 0 │ purple  │
# => │ 1 │ black   │
# => │ 2 │ magenta │
# => ╰───┴─────────╯
```

以及从列表的开头取值，

```nu
let colors = [yellow green purple]
let colors = ($colors | first 2)
$colors
# => ╭───┬────────╮
# => │ 0 │ yellow │
# => │ 1 │ green  │
# => ╰───┴────────╯
```

要根据条件而不是数量来取用或跳过元素，请使用 [`take while`](/commands/docs/take_while.md)、[`take until`](/commands/docs/take_until.md)、[`skip while`](/commands/docs/skip_while.md) 或 [`skip until`](/commands/docs/skip_until.md)。与 `where` 一样，它们既接受闭包也接受行条件，其中 `$it` 是当前元素：

```nu
let scores = [7 10 8 6 7]
$scores | take while $it > 6
# => ╭───┬────╮
# => │ 0 │  7 │
# => │ 1 │ 10 │
# => │ 2 │  8 │
# => ╰───┴────╯
$scores | skip until $it < 7
# => ╭───┬───╮
# => │ 0 │ 6 │
# => │ 1 │ 7 │
# => ╰───┴───╯
```

### 使用展开运算符

要把一个或多个列表拼接在一起（也可以在其中穿插值），你还可以使用
[展开运算符](operators.md#扩展运算符)（`...`）：

```nu
let x = [1 2]
[
  ...$x
  3
  ...(4..7 | take 2)
]
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => │ 3 │ 4 │
# => │ 4 │ 5 │
# => ╰───┴───╯
```

## 遍历列表

要遍历列表中的元素，请使用 [`each`](/commands/docs/each.md) 命令，并配合一段 Nu 代码 [闭包](types_of_data.md#闭包)
来指定对每个元素做什么。闭包参数（例如 `{ |elt| print $elt }` 中的 `|elt|`）就是当前的列表
元素，但如果需要，可以使用 [`enumerate`](/commands/docs/enumerate.md) 过滤器来提供 `index` 和 `item` 值。例如：

```nu
let names = [Mark Tami Amanda Jeremy]
$names | each { |elt| $"Hello, ($elt)!" }
# Outputs "Hello, Mark!" and three more similar lines.

$names | enumerate | each { |elt| $"($elt.index + 1) - ($elt.item)" }
# Outputs "1 - Mark", "2 - Tami", etc.
```

[`where`](/commands/docs/where.md) 命令可以用来创建列表的一个子集，即根据条件过滤列表。

下面的例子获取所有名称以“e”结尾的颜色。

```nu
let colors = [red orange yellow green blue purple]
$colors | where ($it | str ends-with 'e')
# The condition passed to `where` must evaluate to a boolean.
# This outputs the list [orange blue purple].
```

在这个例子中，我们只保留大于 `7` 的值。

```nu
let scores = [7 10 8 6 7]
$scores | where $it > 7 # [10 8]
```

[`reduce`](/commands/docs/reduce.md) 命令从一个列表计算出单个值。
它使用一个接受 2 个参数的闭包：当前元素（习惯上命名为 `elt`）和累加器
（习惯上命名为 `acc`）。要为累加器指定初始值，请使用 `--fold`（`-f`）标志。
要让 `elt` 具有 `index` 和 `item` 值，请使用 [`enumerate`](/commands/docs/enumerate.md) 过滤器。
例如：

```nu
let scores = [3 8 4]
$"total = ($scores | reduce { |elt, acc| $acc + $elt })" # total = 15

$"total = ($scores | math sum)" # easier approach, same result

$"product = ($scores | reduce --fold 1 { |elt, acc| $acc * $elt })" # product = 96

$scores | enumerate | reduce --fold 0 { |elt, acc| $acc + $elt.index * $elt.item } # 0*3 + 1*8 + 2*4 = 16
```

## 访问列表

::: tip 注意
以下是一个基本的概述。关于本主题的深入讨论，请参阅[导航与访问结构化数据](./navigating_structured_data.md)一章。
:::

要访问给定索引处的列表元素，请使用 `$name.index` 形式，其中 `$name` 是保存列表的变量。

例如，下面列表中的第二个元素可以用 `$names.1` 访问。

```nu
let names = [Mark Tami Amanda Jeremy]
$names.1 # gives Tami
```

如果索引在某个变量 `$index` 中，我们可以使用 `get` 命令从列表中取出该元素。

```nu
let names = [Mark Tami Amanda Jeremy]
let index = 1
$names | get $index # gives Tami
```

[`length`](/commands/docs/length.md) 命令返回列表中元素的数量。
例如，`[red green blue] | length` 输出 `3`。

[`is-empty`](/commands/docs/is-empty.md) 命令判断字符串、列表或表格是否为空。
它可以按如下方式用于列表：

```nu
let colors = [red green blue]
$colors | is-empty # false

let colors = []
$colors | is-empty # true
```

`in` 和 `not-in` 运算符用于测试某个值是否在列表中。例如：

```nu
let colors = [red green blue]
'blue' in $colors # true
'yellow' in $colors # false
'gold' not-in $colors # true
```

[`any`](/commands/docs/any.md) 命令判断列表中是否有任一元素
满足给定条件。
例如：

```nu
let colors = [red green blue]
# Do any color names end with "e"?
$colors | any {|elt| $elt | str ends-with "e" } # true

# Is the length of any color name less than 3?
$colors | any {|elt| ($elt | str length) < 3 } # false

let scores = [3 8 4]
# Are any scores greater than 7?
$scores | any {|elt| $elt > 7 } # true

# Are any scores odd?
$scores | any {|elt| $elt mod 2 == 1 } # true
```

[`all`](/commands/docs/all.md) 命令判断列表中的每一个元素是否
都满足给定条件。
例如：

```nu
let colors = [red green blue]
# Do all color names end with "e"?
$colors | all {|elt| $elt | str ends-with "e" } # false

# Is the length of all color names greater than or equal to 3?
$colors | all {|elt| ($elt | str length) >= 3 } # true

let scores = [3 8 4]
# Are all scores greater than 7?
$scores | all {|elt| $elt > 7 } # false

# Are all scores even?
$scores | all {|elt| $elt mod 2 == 0 } # false
```

与 `where` 一样，`any` 和 `all` 也接受用行条件代替闭包，用 `$it` 表示当前元素：

```nu
let scores = [3 8 4]
$scores | any $it > 7 # true
$scores | all $it > 2 # true
```

## 集合操作与组合

[`union`](/commands/docs/union.md)、[`intersect`](/commands/docs/intersect.md) 和 [`difference`](/commands/docs/difference.md) 命令把列表当作集合来处理。它们的结果不包含重复项，并且各项保持首次出现的顺序：

```nu
let a = [1 2 3 4]
let b = [3 4 5 6]
$a | union $b
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => │ 3 │ 4 │
# => │ 4 │ 5 │
# => │ 5 │ 6 │
# => ╰───┴───╯
$a | intersect $b
# => ╭───┬───╮
# => │ 0 │ 3 │
# => │ 1 │ 4 │
# => ╰───┴───╯
$a | difference $b
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => ╰───┴───╯
```

[`combinations`](/commands/docs/combinations.md) 返回从列表中选取指定数量项的所有组合方式，[`permutations`](/commands/docs/permutations.md) 返回列表的所有排列顺序。两者都返回“列表的列表”，所以下面的例子把每个内层列表拼接成字符串：

```nu
[red green blue] | combinations 2 | each { str join "+" }
# => ╭───┬────────────╮
# => │ 0 │ red+green  │
# => │ 1 │ red+blue   │
# => │ 2 │ green+blue │
# => ╰───┴────────────╯
[a b c] | permutations | each { str join }
# => ╭───┬─────╮
# => │ 0 │ abc │
# => │ 1 │ bac │
# => │ 2 │ cab │
# => │ 3 │ acb │
# => │ 4 │ bca │
# => │ 5 │ cba │
# => ╰───┴─────╯
```

## 转换列表

[`flatten`](/commands/docs/flatten.md) 命令从现有列表创建一个新列表，
方法是把嵌套列表中的元素加到顶层列表中。
可以多次调用它来展平任意深度的嵌套列表。
例如：

```nu
[1 [2 3] 4 [5 6]] | flatten # [1 2 3 4 5 6]

[[1 2] [3 [4 5 [6 7 8]]]] | flatten | flatten | flatten # [1 2 3 4 5 6 7 8]
```

[`wrap`](/commands/docs/wrap.md) 命令把列表转换为表格。每个列表值都会
被转换为单独的一行，且只有一列：

```nu
let zones = [UTC CET Europe/Moscow Asia/Yekaterinburg]

# Show world clock for selected time zones
$zones | wrap 'Zone' | upsert Time {|row| (date now | date to-timezone $row.Zone | format date '%Y.%m.%d %H:%M')}
```
