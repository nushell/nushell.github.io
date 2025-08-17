# 自定义补全

自定义补全允许你混合使用 Nushell 的两个功能：自定义命令和补全。有了它们，你就能够创建支持对位置参数和标志(Flags)参数进行自动补全的命令。这些自定义补全既适用于[自定义命令](custom_commands.md)，也适用于 [已知的外部或`extern`命令](externs.md)。

补全分两步定义：

- 定义一个返回建议值的补全命令（又称 completer）
- 使用 `<shape>@<completer>` 将补全器附加到另一个命令参数的类型注解（shape）上

下面是一个简单的例子：

```nu
# 补全命令
def animals [] { ["cat", "dog", "eel" ] }
# 待补全的命令
def my-command [animal: string@animals] { print $animal }
my-command
# => cat                 dog                 eel
```

第一行定义了一个自定义命令，它返回一个包含三种不同动物的列表。这些是补全中要使用的可能值。

::: tip
要抑制参数的补全（例如，一个可以接受任何整数的 `int`），可以定义一个返回空列表 (`[ ]`) 的补全器。
:::

在第二行，`string@animals` 告诉 Nushell 两件事——用于类型检查的参数的形状，以及如果用户想在该位置补全输入值，需要使用的补全器。

第三行是补全的演示。输入自定义命令的名称 `my-command`，然后是一个空格，再按 <kbd>Tab</kbd> 键。这将显示一个包含可能补全的菜单。自定义补全的工作方式与系统中的其他补全相同，允许你输入 `e` 然后按 <kbd>Tab</kbd> 键自动补全 "eel"。

::: tip
当补全菜单显示时，提示符默认会包含 `|` 字符。要更改提示标记，请在 `$env.config.menus` 列表的 `completion_menu` 记录中修改 `marker` 的值。另请参阅[补全菜单配置](/book/line_editor.md#completion-menu)。
:::

::: tip
要回退到 Nushell 内置的文件补全，请返回 `null` 而不是建议列表。
:::

## 自定义补全选项

如果你想选择如何过滤和排序你的补全，你也可以返回一个记录而不是列表。补全建议列表应位于此记录的 `completions` 键下。可选地，它还可以在 `options` 键下包含一个记录，其中包含以下可选设置：

- `sort` - 将此设置为 `false` 以阻止 Nushell 对你的补全进行排序。默认情况下，此值为 `true`，并且补全根据 `$env.config.completions.sort` 进行排序。
- `case_sensitive` - 设置为 `true` 以使自定义补全区分大小写匹配，否则为 `false`。用于覆盖 `$env.config.completions.case_sensitive`。
- `completion_algorithm` - 将此设置为 `prefix`、`substring` 或 `fuzzy` 以选择你的补全如何与键入的文本匹配。用于覆盖 `$env.config.completions.algorithm`。

这是一个演示如何设置这些选项的示例：

```nu
def animals [] {
    {
        options: {
            case_sensitive: false,
            completion_algorithm: substring,
            sort: false,
        },
        completions: [cat, rat, bat]
    }
}
def my-command [animal: string@animals] { print $animal }
```

现在，如果你尝试补全 `A`，你会得到以下补全：

```nu
>| my-command A
cat                 rat                 bat
```

因为我们使匹配不区分大小写，Nushell 将在所有补全建议中找到子字符串 "a"。此外，因为我们设置了 `sort: false`，补全将保持其原始顺序。如果你的补全已经按与文本无关的特定顺序排序（例如按日期），这将非常有用。

## 模块和自定义补全

由于补全命令不应直接调用，因此通常在模块中定义它们。

用模块扩展上面的例子：

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

在此模块中，只导出了自定义命令 `my-command`。`animals` 补全未导出。这使得此模块的用户可以调用该命令，甚至使用自定义补全逻辑，而无需访问补全命令本身。这会产生更清晰、更易于维护的 API。

::: tip
补全器在解析时使用 `@` 附加到自定义命令。这意味着，为了使对补全命令的更改生效，公共自定义命令也必须重新解析。导入模块通过单个 `use` 语句同时满足这两个要求。
:::

## 上下文感知的自定义补全

可以将上下文传递给补全命令。这在需要知道先前的参数或标志以生成准确补全的情况下很有用。

将此概念应用于前面的示例：

```nu
module commands {
    def animals [] {
        ["cat", "dog", "eel" ]
    }

    def animal-names [context: string] {
        match ($context | split words | last) {
            cat => ["Missy", "Phoebe"]
            dog => ["Lulu", "Enzo"]
            eel => ["Eww", "Slippy"]
        }
    }

    export def my-command [
        animal: string@animals
        name: string@animal-names
    ] {
        print $"The ($animal) is named ($name)."
    }
}
```

在这里，命令 `animal-names` 返回适当的名称列表。`$context` 是一个字符串，其值是到目前为止已键入的命令行。

```nu
>| my-command
cat                 dog                 eel
>| my-command dog
Lulu                Enzo
>my-command dog enzo
The dog is named Enzo
```

在第二行，按 <kbd>tab</kbd> 键后，参数 `"my-command dog"` 作为上下文传递给 `animal-names` 补全器。

::: tip
补全器还可以使用以下方式获取命令行上的当前光标位置：

```nu
def completer [context:string, position:int] {}
```

:::

## 自定义补全和 [`extern`](/zh-CN/commands/docs/extern.md)

一个强大的组合是为 [已知的`extern`命令](externs.md) 添加自定义补全。这些工作方式与向自定义命令添加自定义补全的方式相同：通过创建自定义补全，然后用`@`附加到 `extern` 的一个位置参数或标志参数的类型中。

如果你仔细看一下默认配置中的例子，你会看到这个：

```nu
export extern "git push" [
    remote?: string@"nu-complete git remotes",  # the name of the remote
    refspec?: string@"nu-complete git branches" # the branch / refspec
    ...
]
```

自定义补全在这个例子中的作用与前面的例子中的作用相同。上面的例子根据用户当前所处的位置，调用了两个不同的自定义补全。

## 自定义描述和样式

作为返回字符串列表的替代方法，补全函数还可以返回一个记录列表，其中包含一个 `value` 字段以及可选的 `description` 和 `style` 字段。样式可以是以下之一：

- 一个带有前景色的字符串，可以是十六进制代码或颜色名称，例如 `yellow`。有关有效颜色名称的列表，请参阅 `ansi --list`。
- 一个包含 `fg`（前景色）、`bg`（背景色）和 `attr`（属性，如带下划线和粗体）字段的记录。此记录的格式与 `ansi --escape` 接受的格式相同。有关 `attr` 字段的可能值列表，请参阅 [`ansi`](/zh-CN/commands/docs/ansi) 命令参考。
- 相同的记录，但转换为 JSON 字符串。

```nu
def my_commits [] {
    [
        { value: "5c2464", description: "Add .gitignore", style: red },
        # "attr: ub" => underlined and bolded
        { value: "f3a377", description: "Initial commit", style: { fg: green, bg: "#66078c", attr: ub } }
    ]
}
```

::: tip 注意
使用以下代码段：

```nu
def my-command [commit: string@my_commits] {
    print $commit
}
```

... 请注意，即使补全菜单会向你显示类似

```ansi
>_ [36mmy-command[0m <TAB>
[1;31m5c2464[0m  [33mAdd .gitignore[0m
[1;4;48;2;102;7;140;32mf3a377  [0m[33mInitial commit[0m
```

... 的内容，也只有值（即 "5c2464" 或 "f3a377"）将用于命令参数！
:::

## 外部补全

也可以集成外部补全器，而不是仅仅依赖于 Nushell 的补全器。

为此，请将 `config.nu` 中的 `external_completer` 字段设置为一个[闭包](types_of_data.md#closures)，如果未找到 Nushell 补全，则将对其进行求值。

```nu
$env.config.completions.external = {
    enable: true
    max_results: 100
    completer: $completer
}
```

你可以配置闭包以运行外部补全器，例如 [carapace](https://github.com/rsteube/carapace-bin)。

外部补全器是一个函数，它接受当前命令作为字符串列表，并输出一个带有 `value` 和 `description` 键的记录列表，就像自定义补全函数一样。当闭包返回 `null` 时，它默认为文件补全。

::: tip 注意
此闭包将接受当前命令作为列表。例如，键入 `my-command --arg1 <tab>` 将接收 `[my-command --arg1 " "]`。
:::

此示例将启用 carapace 外部补全：

```nu
let carapace_completer = {|spans|
    carapace $spans.0 nushell ...$spans | from json
}
```

[更多外部补全器的示例可以在 cookbook 中找到](../cookbook/external_completers.md)。
