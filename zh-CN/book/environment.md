# 环境

Shell 中的一个常见任务是控制外部应用程序将使用的环境变量。这通常是自动完成的，因为环境被打包，并在外部应用程序启动时提供给它。但有时，我们希望更精确地控制一个应用程序看到的环境变量。

你可以通过 `$env` 变量查看当前的环境变量：

```nu
$env | table -e
# => ╭──────────────────────────────────┬───────────────────────────────────────────╮
# => │                                  │ ╭──────┬────────────────────────────────╮ │
# => │ ENV_CONVERSIONS                  │ │      │ ╭─────────────┬──────────────╮ │ │
# => │                                  │ │ PATH │ │ from_string │ <Closure 32> │ │ │
# => │                                  │ │      │ │ to_string   │ <Closure 34> │ │ │
# => │                                  │ │      │ ╰─────────────┴──────────────╯ │ │
# => │                                  │ │      │ ╭─────────────┬──────────────╮ │ │
# => │                                  │ │ Path │ │ from_string │ <Closure 36> │ │ │
# => │                                  │ │      │ │ to_string   │ <Closure 38> │ │ │
# => │                                  │ │      │ ╰─────────────┴──────────────╯ │ │
# => │                                  │ ╰──────┴────────────────────────────────╯ │
# => │ HOME                             │ /Users/jelle                              │
# => │ LSCOLORS                         │ GxFxCxDxBxegedabagaced                    │
# => | ...                              | ...                                       |
# => ╰──────────────────────────────────┴───────────────────────────────────────────╯
```

在 Nushell 中，环境变量可以是任何值，并且有任何类型。你可以使用 `describe` 命令查看环境变量的类型，例如：`$env.PROMPT_COMMAND | describe`。

要将环境变量发送到外部应用程序，需要将值转换为字符串。有关其工作原理，请参阅[环境变量转换](#环境变量转换)。

环境最初是由 Nu 的[配置文件](configuration.md)和 Nu 的运行环境创建的。

## 设置环境变量

有几种方法可以设置环境变量：

### $env.VAR 赋值

使用 `$env.VAR = "val"` 是最直接的方法：

```nu
$env.FOO = 'BAR'
```

因此，如果你想扩展 Windows 的 `Path` 变量，你可以这样做：

```nu
$env.Path = ($env.Path | prepend 'C:\path\you\want\to\add')
```

在这里，我们把指定文件夹前置添加到`Path`中的现有路径中，所以它将有最高的优先级。
如果你想给它最低的优先级，你可以使用[`append`](/zh-CN/commands/docs/append.md)命令。

### [`load-env`](/zh-CN/commands/docs/load-env.md)

如果你有一个以上的环境变量需要设置，你可以使用[`load-env`](/zh-CN/commands/docs/load-env.md)并创建一个键/值对表格，以用于加载多个环境变量：

```nu
load-env { "BOB": "FOO", "JAY": "BAR" }
```

### 一次性环境变量

这些变量被定义为只在执行代码块的过程中临时有效。
详情请看[一次性环境变量](environment.md#一次性环境变量)。

### 调用[`def --env`](/zh-CN/commands/docs/def.md)定义的命令

详情见[从自定义命令中定义环境](custom_commands.md#changing-the-environment-in-a-custom-command)。

### 使用模块导出

参见[模块](modules.md)部分了解更多详情。

## 读取环境变量

单个环境变量是记录的一个字段，存储在 `$env` 变量中，可以用 `$env.VARIABLE` 读取：

```nu
$env.FOO
# => BAR
```

有时，你可能想访问一个可能未设置的环境变量。考虑使用[问号操作符](types_of_data.md#optional-cell-paths)来避免错误：

```nu
$env.FOO | describe
# => Error: nu::shell::column_not_found
# =>
# =>   × Cannot find column
# =>    ╭─[entry #1:1:1]
# =>  1 │ $env.FOO
# =>    · ──┬─ ─┬─
# =>    ·   │   ╰── cannot find column 'FOO'
# =>    ·   ╰── value originates here
# =>    ╰────

$env.FOO? | describe
# => nothing

$env.FOO? | default "BAR"
# => BAR
```

或者，你可以使用 `in` 来检查环境变量是否存在：

```nu
$env.FOO
# => BAR

if "FOO" in $env {
    echo $env.FOO
}
# => BAR
```

### 大小写敏感性

无论操作系统如何，Nushell 的 `$env` 都是不区分大小写的。尽管 `$env` 的行为很像一个记录，但它的特殊之处在于它在读取或更新时会忽略大小写。这意味着，例如，你可以使用 `$env.PATH`、`$env.Path` 或 `$env.path` 中的任何一个，它们在任何操作系统上都以同样的方式工作。

如果你想以区分大小写的方式读取 `$env`，请使用 `$env | get --sensitive`。

## 作用域

当你设置环境变量时，它将只在当前作用域内可用（变量所在的块和它里面的任何块）。

这里有一个小例子来演示环境变量作用域：

```nu
$env.FOO = "BAR"
do {
    $env.FOO = "BAZ"
    $env.FOO == "BAZ"
}
# => true
$env.FOO == "BAR"
# => true
```

另请参阅：[在自定义命令中更改环境](./custom_commands.html#changing-the-environment-in-a-custom-command)。

## 目录切换

Shell 中常见的任务是用[`cd`](/zh-CN/commands/docs/cd.md)命令来改变目录。
在 Nushell 中，调用`cd`等同于设置`PWD`环境变量。
因此，它遵循与其他环境变量相同的规则（例如，作用域）。

## 一次性环境变量

在 Bash 和其他软件的启发下，有一个常用的简便方法，可以设置一次性环境变量：

```nu
FOO=BAR $env.FOO
# => BAR
```

你也可以使用[`with-env`](/zh-CN/commands/docs/with-env.md)来更明确地做同样的事情：

```nu
with-env { FOO: BAR } { $env.FOO }
# => BAR
```

[`with-env`](/zh-CN/commands/docs/with-env.md)命令将暂时把环境变量设置为给定的值（这里：变量 "FOO" 被赋为 "BAR" 值）。一旦这样做了，[块](types_of_data.html#块) 将在这个新的环境变量设置下运行。

## 永久性环境变量

你也可以在启动时设置环境变量，使它们在 Nushell 运行期间都可用。
要做到这一点，请在 [Nu 配置文件](configuration.md) 中设置一个环境变量。
比如：

```nu
# In config.nu
$env.FOO = 'BAR'
```

## 环境变量转换

你可以通过设置`ENV_CONVERSIONS`环境变量，来在字符串和值之间转换其他环境变量。
例如，[默认环境配置](https://github.com/nushell/nushell/blob/main/crates/nu-utils/src/default_files/default_env.nu)包括将`PATH`（和 Windows 上使用的`Path`）环境变量从一个字符串转换为一个列表。
在 `env.nu` 和 `config.nu` 配置文件加载后，任何在`ENV_CONVERSIONS`内指定的现有环境变量将根据其`from_string`字段被转换为任何类型的值。
外部工具要求环境变量是字符串，因此，任何非字符串的环境变量需要先进行转换：
值->字符串的转换由`ENV_CONVERSIONS`的`to_string`字段设置，每次运行外部命令时都会进行转换。

让我们用一个例子来说明转换的情况。
把以下内容放在你的`config.nu`中：

```nu
$env.ENV_CONVERSIONS = {
    # ... you might have Path and PATH already there, add:
    FOO : {
        from_string: { |s| $s | split row '-' }
        to_string: { |v| $v | str join '-' }
    }
}
```

现在，在一个 Nushell 实例内执行：

```nu
with-env { FOO : 'a-b-c' } { nu }  # runs Nushell with FOO env. var. set to 'a-b-c'

$env.FOO
# =>   0   a
# =>   1   b
# =>   2   c
```

你可以看到`$env.FOO`现在是一个新的 Nushell 实例中的列表，配置已经更新。
你也可以通过以下方式手动测试转换：

```nu
do $env.ENV_CONVERSIONS.FOO.from_string 'a-b-c'
```

现在，为了测试列表->字符串的转换，运行：

```nu
nu -c '$env.FOO'
# => a-b-c
```

因为`nu`是一个外部程序，Nushell 根据`ENV_CONVERSIONS.FOO.to_string`翻译了 `[ a b c ]` 列表，并把它传递给`nu`进程。
用`nu -c`运行命令不会加载配置文件，因此`FOO`的环境转换没有了，它被显示为一个普通的字符串 —— 这样我们可以验证转换是否成功。
你也可以通过`do $env.ENV_CONVERSIONS.FOO.to_string [a b c]`手动运行这个步骤。

_(重要! 环境转换字符串->值发生在 `env.nu` 和 `config.nu` 被运行**之后**。`env.nu` 和 `config.nu` 中的所有环境变量仍然是字符串，除非你手动将它们设置为一些其他的值。)_

## 删除环境变量

只有当一个环境变量被设置在当前作用域中时，你才能通过 [`hide-env`](/zh-CN/commands/docs/hide-env.md) 命令“删除”它：

```nu
$env.FOO = 'BAR'
# => ...
hide-env FOO
```

隐藏也是有作用域的，这既允许你暂时删除一个环境变量，又可以防止你从子作用域内修改父环境：

```nu
$env.FOO = 'BAR'
do {
  hide-env FOO
  # $env.FOO does not exist
}
$env.FOO
# => BAR
```
