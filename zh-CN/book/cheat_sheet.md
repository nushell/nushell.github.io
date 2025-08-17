# Nushell 备忘单

## 数据类型

将字符串转换为整数：

```nu
"12" | into int
```

将当前日期转换为提供的时区：

```nu
date now | date to-timezone "Europe/London"
```

更新记录的语言，如果未指定，则插入提供的值：

```nu
{'name': 'nu', 'stars': 5, 'language': 'Python'} | upsert language 'Rust'
```

将字符串列表转换为 yaml：

```nu
[one two three] | to yaml
```

打印表格数据：

```nu
[[framework, language]; [Django, Python] [Laravel, PHP]]
```

从表中选择两个命名列并打印它们的值：

```nu
[{name: 'Robert' age: 34 position: 'Designer'}
 {name: 'Margaret' age: 30 position: 'Software Developer'}
 {name: 'Natalie' age: 50 position: 'Accountant'}
] | select name position
```

## 字符串

插值文本：

```nu
let name = "Alice"
$"greetings, ($name)!"
# => greetings, Alice!
```

按逗号分隔符拆分文本并将列表保存到 `string_list` 变量：

```nu
let string_list = "one,two,three" | split row ","
$string_list
# => ╭───┬───────╮
# => │ 0 │ one   │
# => │ 1 │ two   │
# => │ 2 │ three │
# => ╰───┴───────╯
```

检查字符串是否包含子字符串：

```nu
"Hello, world!" | str contains "o, w"
# => true
```

用分隔符连接多个字符串：

```nu
let str_list = [zero one two]
$str_list | str join ','
# => zero,one,two
```

按索引切片文本：

```nu
'Hello World!' | str substring 4..8
# => o Wor
```

将字符串解析为命名列：

```nu
'Nushell 0.80' | parse '{shell} {version}'
# => ╭───┬─────────┬─────────╮
# => │ # │  shell  │ version │
# => ├───┼─────────┼─────────┤
# => │ 0 │ Nushell │ 0.80    │
# => ╰───┴─────────┴─────────╯
```

解析逗号分隔值 (csv)：

```nu
"acronym,long\nAPL,A Programming Language" | from csv
# => ╭───┬─────────┬────────────────────────╮
# => │ # │ acronym │          long          │
# => ├───┼─────────┼────────────────────────┤
# => │ 0 │ APL     │ A Programming Language │
# => ╰───┴─────────┴────────────────────────╯
```

在命令行终端中为文本着色：

```nu
$'(ansi purple_bold)This text is a bold purple!(ansi reset)'
# => This text is a bold purple!
```

## 列表

在索引处插入列表值：

```nu
[foo bar baz] | insert 1 'beeze'
# => ╭───┬───────╮
# => │ 0 │ foo   │
# => │ 1 │ beeze │
# => │ 2 │ bar   │
# => │ 3 │ baz   │
# => ╰───┴───────╯
```

按索引更新列表值：

```nu
[1, 2, 3, 4] | update 1 10
# => ╭───┬────╮
# => │ 0 │  1 │
# => │ 1 │ 10 │
# => │ 2 │  3 │
# => │ 3 │  4 │
# => ╰───┴────╯
```

在列表前添加值：

```nu
let numbers = [1, 2, 3]
$numbers | prepend 0
# => ╭───┬───╮
# => │ 0 │ 0 │
# => │ 1 │ 1 │
# => │ 2 │ 2 │
# => │ 3 │ 3 │
# => ╰───┴───╯
```

在列表后追加值：

```nu
let numbers = [1, 2, 3]
$numbers | append 4
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => │ 3 │ 4 │
# => ╰───┴───╯
```

切片第一个列表值：

```nu
[cammomile marigold rose forget-me-not] | first 2
# => ╭───┬───────────╮
# => │ 0 │ cammomile │
# => │ 1 │ marigold  │
# => ╰───┴───────────╯
```

遍历列表；`elt` 是当前列表值：

```nu
let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
$planets | each { |elt| $"($elt) is a planet of the solar system" }
# => ╭───┬─────────────────────────────────────────╮
# => │ 0 │ Mercury is a planet of the solar system │
# => │ 1 │ Venus is a planet of the solar system   │
# => │ 2 │ Earth is a planet of the solar system   │
# => │ 3 │ Mars is a planet of the solar system    │
# => │ 4 │ Jupiter is a planet of the solar system │
# => │ 5 │ Saturn is a planet of the solar system  │
# => │ 6 │ Uranus is a planet of the solar system  │
# => │ 7 │ Neptune is a planet of the solar system │
# => ╰───┴─────────────────────────────────────────╯
```

带索引和值遍历列表：

```nu
$planets | enumerate | each { |elt| $"($elt.index + 1) - ($elt.item)" }
# => ╭───┬─────────────╮
# => │ 0 │ 1 - Mercury │
# => │ 1 │ 2 - Venus   │
# => │ 2 │ 3 - Earth   │
# => │ 3 │ 4 - Mars    │
# => │ 4 │ 5 - Jupiter │
# => │ 5 │ 6 - Saturn  │
# => │ 6 │ 7 - Uranus  │
# => │ 7 │ 8 - Neptune │
# => ╰───┴─────────────╯
```

将列表归约为单个值；`reduce` 提供对应用于列表中每个元素的累加器的访问：

```nu
let scores = [3 8 4]
$"total = ($scores | reduce { |elt, acc| $acc + $elt })"
# => total = 15
```

带初始值的归约 (`--fold`)：

```nu
let scores = [3 8 4]
$"total = ($scores | reduce --fold 1 { |elt, acc| $acc * $elt })"
# => total = 96
```

访问列表中的第 3 个项目：

```nu
let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
$planets.2
# => Earth
```

检查列表中是否有任何字符串以 `E` 开头：

```nu
let planets = [Mercury Venus Earth Mars Jupiter Saturn Uranus Neptune]
$planets | any {|elt| $elt | str starts-with "E" }
# => true
```

切片满足提供条件的项：

```nu
let cond = {|x| $x < 0 }; [-1 -2 9 1] | take while $cond
# => ╭───┬────╮
# => │ 0 │ -1 │
# => │ 1 │ -2 │
# => ╰───┴────╯
```

## 表格

对表进行排序：

```nu
ls | sort-by size
```

对表进行排序，获取前几行：

```nu
ls | sort-by size | first 5
```

连接具有相同列的两个表：

```nu
let $a = [[first_column second_column third_column]; [foo bar snooze]]
let $b = [[first_column second_column third_column]; [hex seeze feeze]]
$a | append $b
# => ╭───┬──────────────┬───────────────┬──────────────╮
# => │ # │ first_column │ second_column │ third_column │
# => ├───┼──────────────┼───────────────┼──────────────┤
# => │ 0 │ foo          │ bar           │ snooze       │
# => │ 1 │ hex          │ seeze         │ feeze        │
# => ╰───┴──────────────┴───────────────┴──────────────╯
```

删除表的最后一列：

```nu
let teams_scores = [[team score plays]; ['Boston Celtics' 311 3] ['Golden State Warriors', 245 2]]
$teams_scores | drop column
# => ╭───┬───────────────────────┬───────╮
# => │ # │         team          │ score │
# => ├───┼───────────────────────┼───────┤
# => │ 0 │ Boston Celtics        │   311 │
# => │ 1 │ Golden State Warriors │   245 │
# => ╰───┴───────────────────────┴───────╯
```

## 文件和文件系统

使用默认文本编辑器打开文本文件：

```nu
start file.txt
```

将字符串保存到文本文件：

```nu
'lorem ipsum ' | save file.txt
```

将字符串追加到文本文件末尾：

```nu
'dolor sit amet' | save --append file.txt
```

将记录保存到 file.json：

```nu
{ a: 1, b: 2 } | save file.json
```

按文件名递归搜索文件：

```nu
glob **/*.{rs,toml} --depth 2
```

监视文件，每当文件更改时运行命令：

```nu
watch . --glob=**/*.rs {|| cargo test }
```

## 自定义命令

带有字符串类型参数的自定义命令：

```nu
def greet [name: string] {
    $"hello ($name)"
}
```

默认参数设置为 nushell 的自定义命令：

```nu
def greet [name = "nushell"] {
    $"hello ($name)"
}
```

通过为自定义命令定义标志来传递命名参数：

```nu
def greet [
    name: string
    --age: int
] {
    [$name $age]
}

greet world --age 10
```

使用标志作为开关，并为 age 使用简写标志 (-a)：

```nu
def greet [
    name: string
    --age (-a): int
    --twice
] {
    if $twice {
        [$name $age $name $age]
    } else {
        [$name $age]
    }
}
greet -a 10 --twice hello
```

使用 rest 参数接受任意数量的位置参数的自定义命令：

```nu
def greet [...name: string] {
    print "hello all:"
    for $n in $name {
        print $n
    }
}
greet earth mars jupiter venus
# => hello all:
# => earth
# => mars
# => jupiter
# => venus
```

## 变量

不可变变量在声明后不能更改其值：

```nu
let val = 42
print $val
# => 42
```

遮蔽变量（在不同作用域中声明同名变量）：

```nu
let val = 42
do { let val = 101;  $val }
# => 101
$val
# => 42
```

使用 mut 关键字声明可变变量：

```nu
mut val = 42
$val += 27
$val
# => 69
```

闭包和嵌套的 def 不能从其环境中捕获可变变量（会报错）：

```nu
mut x = 0
[1 2 3] | each { $x += 1 }
# => Error: nu::parser::expected_keyword
# =>
# =>   × Capture of mutable variable.
# =>    ╭─[entry #83:1:18]
# =>  1 │ [1 2 3] | each { $x += 1 }
# =>    ·                  ─┬
# =>    ·                   ╰── capture of mutable variable
# =>    ╰────
```

常量变量是不可变的，并且在解析时完全求值：

```nu
const file = 'path/to/file.nu'
source $file
```

如果提供的路径不正确，使用问号运算符 `?` 返回 null 而不是错误：

```nu
let files = (ls)
$files.name?.0?
```

将管道的结果赋给变量：

```nu
let big_files = (ls | where size > 10kb)
$big_files
```

## 模块

使用内联模块：

```nu
module greetings {
    export def hello [name: string] {
        $"hello ($name)!"
    }

    export def hi [where: string] {
        $"hi ($where)!"
    }
}
use greetings hello
hello "world"
```

从文件导入模块并在当前作用域中使用其环境：

```nu
# greetings.nu
export-env {
    $env.MYNAME = "Arthur, King of the Britons"
}
export def hello [] {
    $"hello ($env.MYNAME)"
}

use greetings.nu
$env.MYNAME
# => Arthur, King of the Britons
greetings hello
# => hello Arthur, King of the Britons!
```

在模块中使用 main 命令：

```nu
# greetings.nu
export def hello [name: string] {
    $"hello ($name)!"
}

export def hi [where: string] {
    $"hi ($where)!"
}

export def main [] {
    "greetings and salutations!"
}

use greetings.nu
greetings
# => greetings and salutations!
greetings hello world
# => hello world!
```
