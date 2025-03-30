# 环境

Shell 中的一个常见任务是控制外部应用程序将使用的环境变量。这通常是自动完成的，因为环境被打包，并在外部应用程序启动时提供给它。但有时，我们希望更精确地控制一个应用程序看到的环境变量。

你可以使用`env`命令查看当前环境变量：

```
   #           name                 type                value                 raw
──────────────────────────────────────────────────────────────────────────────────────────
  16   DISPLAY              string               :0                   :0
  17   EDITOR               string               nvim                 nvim
  28   LANG                 string               en_US.UTF-8          en_US.UTF-8
  35   PATH                 list<unknown>        [list 16 items]      /path1:/path2:/...
  36   PROMPT_COMMAND       block                <Block 197>
```

在 Nushell 中，环境变量可以是任何值，并且有任何类型（见`type`列）。
Nushell 中使用的环境变量的实际值在`value`列下。
你可以直接使用`$env`变量查询该值，例如，`$env.PATH | length`。
最后的`raw`列显示了将被发送到外部应用程序的实际值（详见 [环境变量转换](environment.md#环境变量转换) ）。

环境最初是由 Nu 的 [配置文件](configuration.md) 和 Nu 的运行环境创建的。

## 设置环境变量

有几种方法可以设置环境变量：

### $env.VAR 赋值

使用`$env.VAR = "val"`命令是最直接的方法：

```nu
$env.FOO = 'BAR'
```

因此，如果你想扩展`PATH`变量，你可以这样做：

```nu
$env.PATH = ($env.PATH | prepend '/path/you/want/to/add')
```

在这里，我们把指定文件夹前置添加到`PATH`中的现有路径中，所以它将有最高的优先级。
如果你想给它最低的优先级，你可以使用`append`命令。

### [`load-env`](/commands/docs/load-env.md)

如果你有一个以上的环境变量需要设置，你可以使用`load-env`并创建一个键/值对记录(Record)，以用于加载多个环境变量：

```nu
load-env { "BOB": "FOO", "JAY": "BAR" }
```

### 一次性环境变量

这些变量被定义为只在执行代码块的过程中临时有效。
详情请看 [一次性环境变量](environment.md#一次性环境变量) 。

### 调用[`def --env`](/commands/docs/def.md)定义的命令

详情见 [从自定义命令中定义环境](environment.md#从自定义命令中定义环境变量)。

### 使用模块导出

参见 [模块](modules.md#环境变量) 部分了解更多详情。

## 读取环境变量

单个环境变量是记录的一个字段，存储在 `$env` 变量中，可以用 `$env.VARIABLE` 读取：

```nu
$env.FOO
# => BAR
```

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

## 目录切换

Shell 中常见的任务是用[`cd`](/commands/docs/cd.md)命令来改变目录。
在 Nushell 中，调用`cd`等同于设置`PWD`环境变量。
因此，它遵循与其他环境变量相同的规则（例如，作用域）。

## 一次性环境变量

在 Bash 和其他软件的启发下，有一个常用的简便方法，可以设置一次性环境变量：

```nu
FOO=BAR echo $env.FOO
# => BAR
```

你也可以使用[`with-env`](/commands/docs/with-env.md)来更明确地做同样的事情：

```nu
with-env { FOO: BAR } { echo $env.FOO }
# => BAR
```

[`with-env`](/commands/docs/with-env.md)命令将暂时把环境变量设置为给定的值（这里：变量 "FOO" 被赋为 "BAR" 值）。一旦这样做了，[块](types_of_data.html#块) 将在这个新的环境变量设置下运行。

## 永久性环境变量

你也可以在启动时设置环境变量，使它们在 Nushell 运行期间都可用。
要做到这一点，请在 [Nu 配置文件](configuration.md) 中设置一个环境变量。
比如：

```nu
# In config.nu
$env.FOO = 'BAR'
```

## 从自定义命令中定义环境变量

由于作用域规则，在自定义命令中定义的任何环境变量都只存在于该命令的作用域内。
然而，用[`def --env`](/commands/docs/def.md)而不是[`def`](/commands/docs/def.md)定义的命令（它也适用于`export def`，见 [模块](modules.md)）将在调用者一方保留环境设置：

```nu
def --env foo [] {
    $env.FOO = 'BAR'
}

foo

$env.FOO
# => BAR
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

如果我们回头看一下`env`命令，`raw`列显示由`ENV_CONVERSIONS.<name>.to_string`翻译的值，`value`列显示 Nushell 中使用的值（在`FOO`的情况下是`ENV_CONVERSIONS.<name>.from_string`的结果）。
如果这个值不是字符串，并且没有`to_string`的转换，它就不会被传递给外部（见`PROMPT_COMMAND`的`raw`列）。
一个例外是`PATH`（Windows 上的`Path`）。默认情况下，它在启动时将字符串转换为列表，在运行外部程序时，如果没有指定手动转换，则从列表转换为字符串。

_(重要! 环境转换字符串->值发生在 `env.nu` 和 `config.nu` 被运行**之后**。`env.nu` 和 `config.nu` 中的所有环境变量仍然是字符串，除非你手动将它们设置为一些其他的值。)_

## 删除环境变量

只有当一个环境变量被设置在当前作用域中时，你才能通过 [`hide`](/commands/docs/hide.md) 命令“删除”它：

```nu
$env.FOO = 'BAR'
# => ...
hide FOO
```

隐藏也是有作用域的，这既允许你暂时删除一个环境变量，又可以防止你从子作用域内修改父环境：

```nu
$env.FOO = 'BAR'
do {
    hide FOO
    # $env.FOO does not exist
}
$env.FOO
# => BAR
```

关于隐藏的更多细节，请参考 [模块](modules.md#隐藏)
