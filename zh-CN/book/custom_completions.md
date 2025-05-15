# 自定义补全

自定义补全允许你混合使用 Nushell 的两个功能：自定义命令和补全。有了它们，你就能够创建支持对位置参数和标志(Flags)参数进行自动补全的命令。这些自定义补全既适用于自定义命令，也适用于 [已知的外部或`extern`命令](externs.md)。

自定义命令有两个部分：处理补全的命令和使用`@`将此命令附加到另一个命令的类型中。

## 自定义补全例子

我们来看一个例子：

```nu
def animals [] { ["cat", "dog", "eel" ] }
def my-command [animal: string@animals] { print $animal }
my-command
# => cat                 dog                 eel
```

在第一行中，我们创建了一个自定义命令，将返回三个不同动物的列表。这些是我们想在补全中使用的值。一旦我们创建了这个命令，我们就可以用它来为其他自定义命令和 `extern` 提供补全。

在第二行，我们使用`string@animals`。这告诉了 Nushell 两件事：用于类型检查的参数的形状，以及如果用户想在该位置补全输入值，需要使用的自定义完成。

在第三行，我们输入我们的自定义命令的名称`my-command`，然后输入空格，再输入`<tab>`键，就可以触发我们的自动补全功能。自定义补全的工作方式与系统中的其他补全方式相同，比如允许你输入`e`，然后按`<tab>`键，得到 "eel" 自动补全。

## 模块和自定义补全

你可能更喜欢让你的自定义补全远离你的代码的公共 API。为此，你可以将模块和自定义补全结合起来。

让我们把上面的例子放在一个模块中：

```nu
module commands {
    def animals [] {
        ["cat", "dog", "eel" ]
    }

    export def my-command [animal: string@animals] {
        print $animal
    }
}
```

在我们的模块中，我们选择只导出自定义命令`my-command`，而不导出自定义补全`animals`。这使得本模块的用户可以调用命令，甚至使用自定义补全逻辑，而不需要访问自定义补全。这样可以让 API 更干净，同时仍然提供所有相同的好处。

这是可能的，因为使用`@`的自定义补全标签在命令第一次被解析时就被锁定了。

## 自定义补全和 `extern`

一个强大的组合是为 [已知的`extern`命令](externs.md) 添加自定义补全。这些工作方式与向自定义命令添加自定义补全的方式相同：创建自定义补全，然后用`@`附加到 `extern` 的一个位置参数或标志参数的类型中。

如果你仔细看一下默认配置中的例子，你会看到这个：

```nu
export extern "git push" [
    remote?: string@"nu-complete git remotes", # the name of the remote
    refspec?: string@"nu-complete git branches"# the branch / refspec
    ...
]
```

自定义补全在这个例子中的作用与前面的例子中的作用相同。上面的例子根据用户当前所处的位置，调用了两个不同的自定义补全。
