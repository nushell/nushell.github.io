---
title: 钩子
---

钩子允许你在一些预定义的情况下运行一个代码片段。
它们只在交互式模式下可用（[REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)），如果你用脚本（`nu script.nu`）或命令（`nu -c "echo foo"`）参数运行 Nushell 则不起作用。

目前，我们支持这些类型的钩子：

- `pre_prompt` : 在命令提示显示之前被触发；
- `pre_execution` : 在行输入开始执行前被触发；
- `env_change` : 当环境变量发生变化时被触发；

为了更清晰地阐述，我们可以将 Nushell 的执行周期进行分解。
在 REPL 模式下，评估一行（代码）的步骤如下：

1. 检查 `pre_prompt` 钩子并运行它们；
2. 检查 `env_change` 钩子并运行它们；
3. 显示命令提示符并等待用户输入；
4. 在用户输入东西并按下 "Enter" 健后，检查 `pre_execution` 钩子并运行它们；
5. 解析和评估用户的输入；
6. 返回到第一步；

## 基本钩子

要想使用钩子需要先在 [配置](configuration.md) 中定义它们：

```nu
$env.config = {
    # ...other config...

    hooks: {
        pre_prompt: { print "pre prompt hook" }
        pre_execution: { print "pre exec hook" }
        env_change: {
            PWD: {|before, after| print $"changing directory from ($before) to ($after)" }
        }
    }
}
```

试着把上述内容放到你的配置中，运行 Nushell 并在你的文件系统中切换目录。
当你改变一个目录时，`PWD` 环境变量会发生变化，这个变化会触发钩子，之前和现在的值分别存储在 `before` 和 `after` 变量中。

可以为每个触发器只定义一个钩子，也可以定义一个**钩子列表**，让其依次运行：

```nu
$env.config = {
    ...other config...

    hooks: {
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
}
```

另外，用新的钩子更新现有的配置，而不是从头开始定义整个配置可能更实用：

```nu
$env.config = ($env.config | upsert hooks {
    pre_prompt: ...
    pre_execution: ...
    env_change: {
        PWD: ...
    }
})
```

## 修改环境变量

钩子的一个特点是它们保留了环境。
在钩子**代码块**内定义的环境变量将以类似于 [`def --env`](environment.md#从自定义命令中定义环境变量) 的方式被保留下来。
你可以用下面的例子测试一下：

```nu
> $env.config = ($env.config | upsert hooks {
    pre_prompt: { $env.SPAM = "eggs" }
})

> $env.SPAM
eggs
```

钩子代码块遵循一般的作用域规则，即在块内定义的命令、别名等将在代码块结束后被丢掉。

## 条件钩子

你可能很想做的一件事是，每当你进入一个目录时，就激活一个环境：

```
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
> $env.config = ($env.config | upsert hooks {
    pre_prompt: '$env.SPAM = "eggs"'
})

> $env.SPAM
eggs
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
    let val = ($config | get -i hooks.env_change.PWD)

    if $val == $nothing {
        $val | append {|before, after| print $"changing directory from ($before) to ($after)" }
    } else {
        [
            {|before, after| print $"changing directory from ($before) to ($after)" }
        ]
    }
})
```

### 进入目录时自动激活相应环境

以下代码将在进入一个目录（'/path/to/target/dir'）后寻找 `test-env.nu` 并加载，而在离开该目录的时候移除相关定义（除了 `PWD` 环境变量）：

```nu
$env.config = ($env.config | upsert hooks.env_change.PWD {
    [
        {
            condition: {|_, after|
                ($after == '/path/to/target/dir'
                    and ($after | path join test-env.nu | path exists))
            }
            code: "overlay add test-env.nu"
        }
        {
            condition: {|before, after|
                ('/path/to/target/dir' not-in $after
                    and '/path/to/target/dir' in $before
                    and 'test-env' in (overlay list))
            }
            code: "overlay remove test-env --keep-env [ PWD ]"
        }
    ]
})
```
