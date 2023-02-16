# 处理列表

## 创建列表

列表(`List`)是一个有序的值的集合。
你可以用方括号创建一个列表，周围的值用空格和/或逗号隔开 (以方便阅读)。
例如，`[foo bar baz]` 或 `[foo, bar, baz]`。

## 更新列表

当列表数据从管道流入时，你可以向列表中更新(`update`)和插入(`insert`)值，例如，让我们在列表的中间插入值`10`：

```bash
> [1, 2, 3, 4] | insert 2 10
# [1, 2, 10, 3, 4]
```

我们也可以使用`update`将第二个元素的值替换为`10`：

```bash
> [1, 2, 3, 4] | update 1 10
# [1, 10, 3, 4]
```

除了 `update` 和 `insert` 之外，还有 `prepend` 和 `append`，它们分别让你插入到列表的开头或列表的结尾。例如：

```bash
let colors = [yellow green]
let colors = ($colors | prepend red)
let colors = ($colors | append purple)
$colors # [red yellow green purple]
```

## 迭代列表

要遍历一个列表中的元素，可以使用[`each`](/commands/commands/each.md)命令和 [Nu 代码块](types_of_data.html#块) 指定对每一个元素做什么操作。块参数（例如`{ |it| echo $it }`中的`|it|`）通常是当前的列表元素，但如果需要，通过 `--numbered`(`-n`) 标志可以将其改为包含`index`和`item`值的元素。比如：

```bash
let names = [Mark Tami Amanda Jeremy]
$names | each { |it| $"Hello, ($it)!" }
# Outputs "Hello, Mark!" and three more similar lines.

$names | enumerate | each { |it| $"($it.index + 1) - ($it.item)" }
# Outputs "1 - Mark", "2 - Tami", etc.
```

[`where`](/commands/commands/where.md)命令可以用来创建一个列表的子集，高效地根据一个条件过滤列表。

下面的例子得到所有名称以 "e" 结尾的颜色：

```bash
let colors = [red orange yellow green blue purple]
$colors | where ($it | str ends-with 'e')
```

在这个例子中，我们只保留大于`7`的数字：

```bash
# The block passed to where must evaluate to a boolean.
# This outputs the list [orange blue purple].

let scores = [7 10 8 6 7]
$scores | where $it > 7 # [10 8]
```

[`reduce`](/commands/commands/reduce.md)命令从一个列表计算一个单一的值。
它使用了一个代码块，该块有两个参数：当前元素（即 `it`）和一个累加器 (即 `acc`)。如果想要给累加器指定一个初始值，请使用 `--fold` (`-f`) 标志。
若要改变`it`使其具有`index`和`item`两个值，请添加`--numbered`（`-n`）标志。
例如：

```bash
let scores = [3 8 4]
echo "total =" ($scores | reduce { |it, acc| $acc + $it }) # 15

echo "total =" ($scores | math sum) # easier approach, same result

echo "product =" ($scores | reduce --fold 1 { |it, acc| $acc * $it }) # 96

$scores | reduce -n { |it, acc| $acc.item + $it.index * $it.item } # 3 + 1*8 + 2*4 = 19
```

## 访问列表

要访问一个给定索引的列表元素, 可以使用`$name.index`形式, 其中`$name`是持有列表的变量。

例如，下面列表中的第二个元素可以用`$names.1`来访问：

```bash
let names = [Mark Tami Amanda Jeremy]
$names.1 # gives Tami
```

如果索引在某个变量`$index`中，我们可以使用`get`命令从列表中提取该元素：

```bash
let names = [Mark Tami Amanda Jeremy]
let index = 1
$names | get $index # gives Tami
```

[`length`](/commands/commands/length.md)命令返回列表中的元素个数。例如，`[red green blue] | length`输出`3`。

[`is-empty`](/commands/commands/is-empty.md) 命令确定一个字符串、列表或表格是否为空。它可以与列表一起使用，如下所示：

```bash
let colors = [red green blue]
$colors | is-empty # false

let colors = []
$colors | is-empty # true
```

`in` 和 `not-in` 运算符用于测试一个值是否在一个列表中，例如：

```bash
let colors = [red green blue]
'blue' in $colors # true
'yellow' in $colors # false
'gold' not-in $colors # true
```

[`any`](/commands/commands/any.md)命令用于确定一个列表中是否有任意一个元素匹配给定的条件，例如：

```bash
# Do any color names end with "e"?
$colors | any ($it | str ends-with "e") # true

# Is the length of any color name less than 3?
$colors | any ($it | str length) < 3 # false

# Are any scores greater than 7?
$scores | any $it > 7 # true

# Are any scores odd?
$scores | any $it mod 2 == 1 # true
```

[`all`](/commands/commands/all.md)命令确定一个列表中是否所有元素都匹配给定的条件。例如：

```bash
# Do all color names end with "e"?
$colors | all ($it | str ends-with "e") # false

# Is the length of all color names greater than or equal to 3?
$colors | all ($it | str length) >= 3 # true

# Are all scores greater than 7?
$scores | all $it > 7 # false

# Are all scores even?
$scores | all $it mod 2 == 0 # false
```

## 转换列表

[`flatten`](/commands/commands/flatten.md)命令通过将嵌套列表中的元素添加到顶层列表中来从现有的列表创建一个新列表。这条命令可以被多次调用，以使任意嵌套深度的列表变平。例如：

```bash
[1 [2 3] 4 [5 6]] | flatten # [1 2 3 4 5 6]

[[1 2] [3 [4 5 [6 7 8]]]] | flatten | flatten | flatten # [1 2 3 4 5 6 7 8]
```

[`wrap`](/commands/commands/wrap.md)命令将一个列表转换为一个表格。每个列表的值将都会被转换为一个单独的行和列：

```bash
let zones = [UTC CET Europe/Moscow Asia/Yekaterinburg]

# Show world clock for selected time zones
$zones | wrap 'Zone' | upsert Time {|it|
    (
        date now
            | date to-timezone $it.Zone
            | date format '%Y.%m.%d %H:%M'
    )
}
```
