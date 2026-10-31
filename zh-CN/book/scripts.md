# 脚本

在 Nushell 中，你可以用 Nushell 语言编写并运行脚本。要运行一个脚本，可以把它作为参数传递给 `nu` 命令行程序：

```nu
nu myscript.nu
```

这会在一个新的 Nu 实例中运行脚本直至完成。你也可以使用 [`source`](/commands/docs/source.md) 在**当前**的 Nu 实例中运行脚本：

```nu
source myscript.nu
```

要把脚本用作管道中的一个阶段，请使用 [`run`](/commands/docs/run.md)，参见下文的[管道中的脚本](#管道中的脚本)。

我们来看一个脚本文件的例子：

```nu
# hello.nu
def greet [name] {
  ["hello" $name]
}

greet "world"
```

脚本文件既定义了自定义命令，也包含了主脚本本身，后者会在自定义命令定义完成之后运行。

在上面的例子中，首先 `greet` 由 Nushell 解释器定义，这样我们之后就可以调用这个定义。我们也可以把上面写成：

```nu
greet "world"

def greet [name] {
  ["hello" $name]
}
```

定义并不要求必须出现在脚本中调用它的部分之前，你可以把它们放在你觉得顺手的地方。

请记住，脚本只会显示它最后一条管道的值。在上面第二个版本中，最后一条管道是 `def`，所以 `greet` 仍然会运行，但它的结果不会被显示。要在脚本中的任意位置显示一个值，请使用 [`print`](/commands/docs/print.md)。

## 脚本是如何被处理的

在脚本中，定义先运行。这让我们可以在脚本中调用这些定义。

定义运行之后，我们从脚本文件的顶部开始，依次运行每一组命令。

## 脚本行

为了更好地理解 Nushell 是如何看待代码行的，我们来看一个示例脚本：

```nu
print "a"
"b"; "c" | str uppercase
# => a
# => C
```

当这个脚本运行时，Nushell 会先运行 `print "a"` 直至完成，这会打印出 `a`。接着，Nushell 会按照[“分号”部分](pipelines.md#分号)中的规则运行 `"b"; "c" | str uppercase`：值 `"b"` 被丢弃，而 `"c" | str uppercase` 是一条正常的管道。由于它是脚本的最后一条管道，其结果 `C` 会被显示出来。

## 参数化脚本

脚本文件可以选择性地包含一个特殊的“main”命令。`main` 会在其他任何 Nu 代码之后运行，主要用于让脚本支持位置参数和标志。你可以在脚本名之后传递参数（`nu <script name> <script args>`）。

例如：

```nu
# add_ten.nu
def main [x: int] {
  $x + 10
}
```

```nu
nu add_ten.nu 100
# => 110
```

## 参数类型解释

默认情况下，提供给脚本的参数会被解释为 `Type::Any` 类型，这意味着它们不受特定数据类型的约束，可以在脚本执行期间被动态解释为任何合适的数据类型。

在前面的例子中，`main [x: int]` 表示参数 x 应当具有整数类型。然而，如果参数没有显式指定类型，它们会按其表观数据类型被解析。

例如：

```nu
# implicit_type.nu
def main [x] {
  $"Hello ($x | describe) ($x)"
}
```

```nu
# explicit_type.nu
def main [x: string] {
  $"Hello ($x | describe) ($x)"
}
```

```nu
nu implicit_type.nu +1
# => Hello int 1

nu explicit_type.nu +1
# => Hello string +1
```

要让参数像外部命令那样完全按输入时的原样被接收，可以把参数的类型指定为 `external_arg`，这样 Nushell 就完全不会转换该参数。未加引号的参数会作为 `glob` 值传入（如果你需要字符串，请使用 [`into string`](/commands/docs/into_string.md)）。这对标志和剩余参数同样适用。

```nu
# external_type.nu
def main [x: external_arg] {
  $"Hello ($x | describe) ($x)"
}
```

```nu
nu implicit_type.nu 007
# => Hello int 7

nu external_type.nu 007
# => Hello glob 007
```

与 `string` 不同，`external_arg` 也接受 `true` 这类 Nushell 本来会解析成其他类型的参数：`nu explicit_type.nu true` 会失败并报 `Parse mismatch: expected string`，而 `nu external_type.nu true` 会打印 `Hello glob true`。

## 以连字符开头的参数

Nushell 通常会把以 `-` 开头的参数当作标志来读取。要把这样的值作为位置参数传递，请在它前面加上 `--`。`--` 之后的每个参数都会被当作位置参数，即使它看起来像标志：

```nu
# greet.nu
def main [--upper, name: string] {
  if $upper { $name | str uppercase } else { $name }
}
```

```nu
nu greet.nu -alice
# => Error: nu::parser::unknown_flag
# =>
# =>   × The `greet.nu` command doesn't have flag `-a`.
# =>    ╭─[<commandline>:1:7]
# =>  1 │ main -alice
# =>    ·       ┬
# =>    ·       ╰── unknown flag
# =>    ╰────
# =>   help: Use `--help` to see available flags

nu greet.nu -- -alice
# => -alice

nu greet.nu --upper -- -alice
# => -ALICE
```

## `nu -c` 的参数

传给 `nu --commands`（`-c`）的代码同样可以定义一个 `main` 命令。代码之后的任何参数都会像脚本文件的参数一样传给它。如果代码没有定义 `main`，这些参数会被忽略。

```nu
nu -c 'def main [name: string, --upper] { if $upper { $name | str uppercase } else { $name } }' nushell --upper
# => NUSHELL
```

代码后面的 `--` 作用如上所述，因此它之后的每个参数都会作为位置参数传给 `main`：

```nu
nu -c 'def main [...args] { $args | to nuon }' -- --verbose -x
# => [--verbose, -x]
```

## 子命令

一个脚本可以有多个[子命令](custom_commands.md#子命令)，例如 `run` 或 `build`：

```nu
# myscript.nu
def "main run" [] {
    print "running"
}

def "main build" [] {
    print "building"
}

def main [] {
    print "hello from myscript!"
}
```

然后你就可以在调用脚本时执行它的子命令：

```nu
nu myscript.nu
# => hello from myscript!
nu myscript.nu build
# => building
nu myscript.nu run
# => running
```

与[模块](modules/creating_modules.md#main-导出)不同，`main` **不需要**被导出就能被看到。在上面的例子中，我们的 `main` 命令并不是 `export def`，但运行 `nu myscript.nu` 时它仍然被执行了。如果我们是通过运行 `use myscript.nu` 把 myscript 当作模块来使用，而不是把 `myscript.nu` 当作脚本来运行，那么尝试执行 `myscript` 命令是不会生效的，因为 `myscript` 没有被导出。

需要特别注意的是，你必须定义一个 `main` 命令，`main` 的子命令才能被正确暴露。例如，如果我们只定义了 `run` 和 `build` 子命令，那么运行脚本时它们将无法访问：

```nu
# no_main.nu
def "main run" [] {
    print "running"
}

def "main build" [] {
    print "building"
}
```

```nu
nu no_main.nu build
nu no_main.nu run
```

这两条命令都不会打印任何内容。如果没有 `main` 命令，Nushell 只会运行脚本的顶层代码（这里就是那两个定义），并忽略参数。

这是当前脚本处理方式的一个限制。如果你的脚本只有子命令，可以添加一个空的 `main` 来暴露这些子命令，如下所示：

```nu
def main [] {}
```

## 管道中的脚本

`nu myscript.nu` 会在一个新的 Nushell 进程中运行脚本，而 `source` 是在当前作用域中运行它。要把脚本用作管道中的一个阶段，请改用 [`run`](/commands/docs/run.md)。脚本会接收管道输入，其结果会传给下一个命令。

没有 `main` 命令的脚本会被整体求值，管道输入可以通过 `$in` 获得：

```nu
# shout.nu
str uppercase
```

```nu
"Hello Nushell!" | run shout.nu
# => HELLO NUSHELL!

"Hello Nushell!" | run shout.nu | str camel-case
# => helloNushell
```

这样的脚本没有参数，所以 `run` 会忽略脚本名之后的任何参数。

如果脚本定义了 `main`，`run` 会用管道输入以及脚本名之后给出的参数来调用它：

```nu
# prefix.nu
def main [--prefix(-p): string = ">", --upper(-u)] {
  each {|line|
    let line = if $upper { $line | str uppercase } else { $line }
    $"($prefix) ($line)"
  }
}
```

```nu
[a b] | run prefix.nu --prefix ">>>"
# => ╭───┬───────╮
# => │ 0 │ >>> a │
# => │ 1 │ >>> b │
# => ╰───┴───────╯
```

### `main` 的参数

`run` 会把脚本名之后的参数匹配到 `main` 的参数上，匹配方式与调用 `main` 时相同。标志的值可以跟在 `=` 之后，短标志可以合并，记录展开则按名称设置标志。下面这些调用返回的是同一张表格：

```nu
[a b] | run prefix.nu -u --prefix=">>>"
[a b] | run prefix.nu -up ">>>"
[a b] | run prefix.nu ...{upper: true, prefix: ">>>"}
# => ╭───┬───────╮
# => │ 0 │ >>> A │
# => │ 1 │ >>> B │
# => ╰───┴───────╯
```

`main` 不接受的参数会导致错误。这包括未知的标志、多余的位置参数、缺少值的标志，以及类型不正确的值。

用 `nu` 运行脚本时，会把每个参数转换成其参数所声明的类型，如[参数类型解释](#参数类型解释)所述；`run` 则不会。Nushell 在读取脚本之前就解析了参数，所以即便 `main` 期望的是 `string`，一个裸写的 `23` 也是 `int`。要传递字符串，请给值加上引号：

```nu
[a b] | run prefix.nu --prefix 23
# => Error: nu::shell::cant_convert
# =>
# =>   × Can't convert to string.
# =>    ╭─[repl_entry #1:1:32]
# =>  1 │ [a b] | run prefix.nu --prefix 23
# =>    ·                                ─┬
# =>    ·                                 ╰── can't convert int to string
# =>    ╰────
# =>   help: `run` doesn't convert script arguments; quote the value to pass a
# =>         string

[a b] | run prefix.nu --prefix "23"
# => ╭───┬──────╮
# => │ 0 │ 23 a │
# => │ 1 │ 23 b │
# => ╰───┴──────╯
```

`run` 自身的标志（例如 `--full-reparse`）要放在脚本名之前。脚本名之后的一切都属于 `main`。所以 `run prefix.nu -f` 会把 `-f` 传给并没有这个标志的 `main`，而 `run prefix.nu --help` 显示的是 `main` 的帮助，而不是 `run` 的帮助。

要把以 `-` 开头的值作为位置参数传递，请在它前面加上 `--`，如[以连字符开头的参数](#以连字符开头的参数)所述：

```nu
run greet.nu --upper -- -alice
# => -ALICE
```

像 `...$args` 这样的列表展开会填充 `main` 的剩余参数。其中的元素即使看起来像标志也仍然是值，所以包含 `--upper` 的列表无法打开 `--upper`。要通过变量来设置标志，请改为展开一个记录。

`run` 只调用 `main`，绝不调用它的[子命令](#子命令)。用上一节的 `myscript.nu` 来说，`nu myscript.nu build` 调用的是 `main build`，而 `run myscript.nu build` 则是把 `build` 传给 `main`。那个 `main` 不接受任何参数，因此调用会因多余的位置参数而失败。

### 作用域与重新加载

脚本在自己的作用域中运行，因此它对环境变量所做的修改（例如设置 `$env.FOO` 或调用 `cd`）不会带回调用者。在脚本运行期间，`$env.CURRENT_FILE` 保存脚本的完整路径，`$env.FILE_PWD` 保存它所在的目录。

与 `source` 一样，`run` 是一个解析器关键字：文件名必须是常量，并且会先在当前目录中查找，然后在 `$NU_LIB_DIRS` 中查找。脚本会与调用它的代码一起被解析。如果脚本在此之后还可能发生变化，例如某个循环在你每次保存文件时都会再次调用它，请使用 `--full-reparse`（`-f`）在每次调用时重新加载并重新解析：

```nu
for _ in (watch . --glob=*.nu) { run --full-reparse ./test.nu }
```

如果文件名是 `null`，`run` 什么也不做，并把输入原样传下去。

## Shebang（`#!`）

在 Linux 和 macOS 上，你可以选择使用 [shebang](<https://en.wikipedia.org/wiki/Shebang_(Unix)>) 来告诉操作系统，某个文件应该由 Nu 来解释。例如，在一个名为 `myscript` 的文件中包含以下内容：

```nu
#!/usr/bin/env nu
"Hello World!"
```

```nu
./myscript
# => Hello World!
```

为了让脚本能够访问标准输入，`nu` 应该用 `--stdin` 标志来调用。例如，在一个名为 `stdin-script` 的文件中：

```nu
#!/usr/bin/env -S nu --stdin
def main [] {
  echo $"stdin: ($in)"
}
```

```nu
echo "Hello World!" | ./stdin-script
# => stdin: Hello World!
```
