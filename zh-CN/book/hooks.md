# 钩子

钩子允许你在一些预定义的情况下运行一个代码片段。
它们只在交互式模式下可用（[REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)），如果你用脚本（`nu script.nu`）或命令（`nu -c "print foo"`）参数运行 Nushell 则不起作用。

目前，我们支持这些类型的钩子：

- `pre_prompt` : 在命令提示显示之前被触发；
- `pre_execution` : 在行输入开始执行前被触发；
- `env_change` : 当环境变量发生变化时被触发；
- `display_output` : 一个代码块，输出会被传递给它
- `command_not_found` : 当一个命令未找到时被触发

为了更清晰地阐述，我们可以将 Nushell 的执行周期进行分解。
在 REPL 模式下，评估一行（代码）的步骤如下：

1. 检查 `pre_prompt` 钩子并运行它们；
2. 检查 `env_change` 钩子并运行它们；
3. 显示命令提示符并等待用户输入；
4. 在用户输入东西并按下 "Enter" 健后，检查 `pre_execution` 钩子并运行它们；
5. 解析和评估用户的输入；
6. 如果一个命令未找到：运行 `command_not_found` 钩子。如果它返回一个字符串，则显示它。
7. 如果 `display_output` 被定义，则用它来打印命令输出。
8. 返回到第一步；

## 基本钩子

要想使用钩子需要先在 [配置](configuration.md) 中定义它们：

```nu
$env.config.hooks = {
    pre_prompt: [{ print "pre prompt hook" }]
    pre_execution: [{ print "pre exec hook" }]
    env_change: {
        PWD: [{|before, after| print $"changing directory from ($before) to ($after)" }]
    }
}
```

试着把上述内容放到你的配置中，运行 Nushell 并在你的文件系统中切换目录。
当你改变一个目录时，`PWD` 环境变量会发生变化，这个变化会触发钩子，之前和现在的值分别存储在 `before` 和 `after` 变量中。

可以为每个触发器只定义一个钩子，也可以定义一个**钩子列表**，让其依次运行：

```nu
$env.config.hooks = {
    pre_prompt: [
        { print "pre prompt hook" }
        { print "pre prompt hook2" }
    ]
    pre_execution: [
        { print "pre exec hook" }
        { print "pre exec hook2" }
    ]
    env_change: {
        PWD: [
            {|before, after| print $"changing directory from ($before) to ($after)" }
            {|before, after| print $"changing directory from ($before) to ($after) 2" }
        ]
    }
}
```

Instead of replacing all hooks, you can append a new hook to existing configuration:

```nu
$env.config.hooks.pre_execution = $env.config.hooks.pre_execution | append { print "pre exec hook3" }
```

## 修改环境变量

钩子的一个特点是它们保留了环境。
在钩子**代码块**内定义的环境变量将以类似于 [`def --env`](environment.md#从自定义命令中定义环境变量) 的方式被保留下来。
你可以用下面的例子测试一下：

```nu
$env.config = ($env.config | upsert hooks {
    pre_prompt: { $env.SPAM = "eggs" }
})

$env.SPAM
# => eggs
```

钩子代码块遵循一般的作用域规则，即在块内定义的命令、别名等将在代码块结束后被丢掉。

## `pre_execution` 钩子

`pre_execution` 钩子可以通过 [`commandline` 命令](/commands/docs/commandline.md) 来检查将要执行的命令。

例如，要打印正在执行的命令：

```nu
$env.config = (
    $env.config
    | upsert hooks.pre_execution [ {||
        $env.repl_commandline = (commandline)
        print $"Command: ($env.repl_commandline)"
    } ]
)

print (1 + 3)
# => Command: print (1 + 3)
# => 4
```

## 条件钩子

你可能很想做的一件事是，每当你进入一个目录时，就激活一个环境：

```nu
$env.config = ($env.config | upsert hooks {
    env_change: {
        PWD: [
            {|before, after|
                if $after == /some/path/to/directory {
                    load-env { SPAM: eggs }
                }
            }
        ]
    }
})
```

这不会起作用，因为该环境只在 `if` 块内有效。
在这种情况下，你可以很容易地将其重写为 `load-env (if $after == ... { ... } else { {} })`，但这种模式是相当常见的，以后我们会看到并非所有的情况都能像这样重写。

为了处理上述问题，我们引入了另一种定义钩子的方式 -- **记录**：

```nu
$env.config = ($env.config | upsert hooks {
    env_change: {
        PWD: [
            {
                condition: {|before, after| $after == /some/path/to/directory }
                code: {|before, after| load-env { SPAM: eggs } }
            }
        ]
    }
})
```

当钩子触发时，它会评估 `condition` 代码块。
如果它返回 `true`，则 `code` 对应代码块将会被评估执行。
如果它返回 `false`，什么也不会发生。
如果它返回别的东西，就会抛出一个错误。
`condition` 字段也可以完全省略，在这种情况下，钩子将总是被评估。

`pre_prompt` 和 `pre_execution` 钩子类型也支持条件钩子，但它们不接受 `before` 和 `after` 参数。

## 字符串钩子

到目前为止，一个钩子被定义为一个只保留环境的代码块，而没有其他东西。
为了能够定义命令或别名，可以将 `code` 字段定义为**一个字符串**。
你可以把它想成是你在 REPL 中输入字符串并点击回车键。
所以，上一节中的钩子也可以写成：

```nu
$env.config = ($env.config | upsert hooks {
    pre_prompt: '$env.SPAM = "eggs"'
})

$env.SPAM
# => eggs
```

这个功能可以用来，例如，根据当前目录有条件地引入定义：

```nu
$env.config = ($env.config | upsert hooks {
    env_change: {
        PWD: [
            {
                condition: {|_, after| $after == /some/path/to/directory }
                code: 'def foo [] { print "foo" }'
            }
            {
                condition: {|before, _| $before == /some/path/to/directory }
                code: 'hide foo'
            }
        ]
    }
})
```

当把钩子定义为字符串时，`$before` 和 `$after` 变量分别被设置为之前和当前的环境变量值，这与前面的例子类似：

```nu
$env.config = ($env.config | upsert hooks {
    env_change: {
        PWD: {
            code: 'print $"changing directory from ($before) to ($after)"'
        }
    }
}
```

## 例子

### 在现有配置中增加一个单一钩子

一个关于 `PWD` 环境变化的例子：

```nu
$env.config = ($env.config | upsert hooks.env_change.PWD {|config|
    let val = ($config | get -o hooks.env_change.PWD)

    if $val == null {
        $val | append {|before, after| print $"changing directory from ($before) to ($after)" }
    } else {
        [
            {|before, after| print $"changing directory from ($before) to ($after)" }
        ]
    }
})
```

### 进入目录时自动激活相应环境

以下代码将在进入一个目录后寻找 `test-env.nu` 并加载：

```nu
$env.config = ($env.config | upsert hooks.env_change.PWD {
    [
        {
            condition: {|_, after|
                ($after == '/path/to/target/dir'
                    and ($after | path join test-env.nu | path exists))
            }
            code: "overlay use test-env.nu"
        }
        {
            condition: {|before, after|
                ('/path/to/target/dir' not-in $after
                    and '/path/to/target/dir' in ($before | default "")
                    and 'test-env' in (overlay list))
            }
            code: "overlay hide test-env --keep-env [ PWD ]"
        }
    ]
})
```

### 过滤或转移命令输出

你可以使用 `display_output` 钩子来重定向命令的输出。
你应该定义一个适用于所有值类型的代码块。
外部命令的输出不会通过 `display_output` 进行过滤。

这个钩子可以在一个单独的窗口中显示输出，也许是富文本 HTML。
下面是实现这个功能的基本思路：

```nu
$env.config = ($env.config | upsert hooks {
    display_output: { to html --partial --no-color | save --raw /tmp/nu-output.html }
})
```

你可以在网页浏览器中打开 `file:///tmp/nu-output.html` 来查看结果。
当然，这不是很方便，除非你使用一个在文件改变时能自动重新加载的浏览器。
除了 [`save`](/commands/docs/save.md) 命令，你通常会自定义这个钩子，将 HTML 输出发送到所需窗口。

### 改变输出的显示方式

你可以通过使用 `display_output` 钩子来改变输出的默认显示行为。
下面是一个例子，如果终端足够宽，它将默认显示行为改为显示1层深度的表格，否则就折叠起来：

```nu
$env.config = ($env.config | upsert hooks {
    display_output: {if (term size).columns >= 100 { table -ed 1 } else { table }}
})
```

### _Arch Linux_ 中的 `command_not_found` 钩子

下面的钩子使用 `pkgfile` 命令，在 _Arch Linux_ 中查找命令属于哪个包。

```nu
$env.config = {
    ...other config...

    hooks: {
        ...other hooks...

        command_not_found: {
            |cmd_name| (
                try {
                    let pkgs = (pkgfile --binaries --verbose $cmd_name)
                    if ($pkgs | is-empty) {
                        return null
                    }
                    (
                        $"(ansi $env.config.color_config.shape_external)($cmd_name)(ansi reset) " +
                        $"may be found in the following packages:\n($pkgs)"
                    )
                }
            )
        }
    }
}
```

### _NixOS_ 中的 `command_not_found` 钩子

NixOS 自带 `command-not-found` 命令。我们只需要把它插入到 nushell 钩子中：

```nu
$env.config.hooks.command_not_found = {
  |command_name|
  print (command-not-found $command_name | str trim)
}
```

### _Windows_ 中的 `command_not_found` 钩子

下面的钩子使用 `ftype` 命令，在 _Windows_ 中查找可能与用户 `alias` 相关的程序路径。

```nu
$env.config = {
    ...other config...

    hooks: {
        ...other hooks...

        command_not_found: {
            |cmd_name| (
                try {
                    let attrs = (
                        ftype | find $cmd_name | to text | lines | reduce -f [] { |line, acc|
                            $line | parse "{type}={path}" | append $acc
                        } | group-by path | transpose key value | each { |row|
                            { path: $row.key, types: ($row.value | get type | str join ", ") }
                        }
                    )
                    let len = ($attrs | length)

                    if $len == 0 {
                        return null
                    } else {
                        return ($attrs | table --collapse)
                    }
                }
            )
        }
    }
}
```
