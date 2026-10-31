# 自定义补全

自定义补全允许你混合使用 Nushell 的两个功能：自定义命令和补全。有了它们，你就可以创建处理位置参数和标志参数补全的命令。这些自定义补全既适用于[自定义命令](custom_commands.md)，也适用于[已知的外部或 `extern` 命令](externs.md)。

补全的定义分两步：

- 定义一个补全命令（又称补全器），返回可供建议的可能值
- 使用 `<shape>@<completer>` 将补全器附加到另一个命令参数的类型注解（shape）上

下面是一个简单的例子：

```nu
# Completion command
def animals [] { ["cat", "dog", "eel" ] }
# Command to be completed
def my-command [animal: string@animals] { print $animal }
# Show what pressing Tab after `my-command ` would offer
'my-command ' | commandline complete
# => ╭───┬─────╮
# => │ 0 │ cat │
# => │ 1 │ dog │
# => │ 2 │ eel │
# => ╰───┴─────╯
```

第一行定义了一个自定义命令，它返回一个包含三种不同动物的列表。这些就是补全的可能值。

::: tip
要为某个参数禁用补全（例如一个可以接受任意整数的 `int`），请定义一个返回空列表（`[ ]`）的补全器。
:::

在第二行，`string@animals` 告诉 Nushell 两件事——用于类型检查的参数形状，以及为该参数建议可能值的补全器。

要交互式地试用这个补全，输入自定义命令的名称 `my-command`，后跟一个空格，然后按 <kbd>Tab</kbd> 键。这会显示一个包含可能补全的菜单。自定义补全的工作方式与系统中的其他补全相同，你可以输入 `e` 后按 <kbd>Tab</kbd> 键自动补全“eel”。示例的最后一行使用 [`commandline complete`](/commands/docs/commandline_complete.md) 打印同样的建议，无需按 <kbd>Tab</kbd>（参见[测试补全器](#测试补全器)）。

::: tip
当补全菜单显示时，提示符默认会包含 `|` 字符。要更改提示标记，请修改 `$env.config.menus` 列表中 `name` 键为 `completion_menu` 的那条记录的 `marker` 值。另见[补全菜单配置](line_editor.md#补全菜单)。
:::

::: tip
要回退到 Nushell 内置的文件补全，请返回 `null` 而不是建议列表。`null` 表示“我这里没有答案”，于是由下一个补全来源来响应；而空列表表示“没有可补全的内容”。
:::

## 自定义补全选项

如果你想选择补全的过滤和排序方式，也可以返回一个记录而不是列表。补全建议列表应放在该记录的 `completions` 键下。此外，它也可以在 `options` 键下放一个记录，包含以下可选设置：

- `filter` - 设为 `true` 让 Nushell 根据已输入的文本过滤你的补全，设为 `false` 则完全按返回的内容显示。附加到参数上的补全器默认会被过滤。[外部补全器](#外部补全)默认不被过滤，因为它通常会自己做过滤。
- `sort` - 设为 `false` 可以阻止 Nushell 对你的补全排序。默认为 `true`，补全会按 `$env.config.completions.sort` 排序。只有在 Nushell 同时过滤补全时才会排序。
- `case_sensitive` - 设为 `true` 让自定义补全区分大小写匹配，否则设为 `false`。用于覆盖 `$env.config.completions.case_sensitive`。
- `completion_algorithm` - 设为 `prefix`、`substring` 或 `fuzzy`，用于选择补全与已输入文本的匹配方式。用于覆盖 `$env.config.completions.algorithm`。
- `match_description` - 设为 `true` 可让已输入的文本同时匹配每条建议的描述（除其值之外）。插入的补全仍然是建议的值。默认为 `false`。

该记录还可以有一个 `fallback` 键，详见[添加到内置补全](#添加到内置补全)。

下面是一个演示如何设置这些选项的例子：

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

现在，如果你尝试补全 `A`，会得到以下补全：

```nu
'my-command A' | commandline complete
# => ╭───┬─────╮
# => │ 0 │ cat │
# => │ 1 │ rat │
# => │ 2 │ bat │
# => ╰───┴─────╯
```

由于我们把匹配设为不区分大小写，Nushell 会在所有补全建议中找到子串“a”。此外，由于我们设置了 `sort: false`，补全将保持其原始顺序。如果你的补全已按与其文本无关的特定顺序（例如按日期）排好序，这会很有用。

### 匹配描述

自定义补全器可以选择让已输入的文本同时匹配建议的描述（除值之外），方法是在返回的 `options` 记录中设置 `match_description: true`。插入的补全仍然是建议的值。当值是一个不透明的标识符、而描述才是用户可能会输入的内容时，这很有用，例如按人名补全电子邮件地址：

```nu
def "nu-complete users" [] {
    {
        options: {
            match_description: true,
            completion_algorithm: "substring",
        },
        completions: [
            { value: "lk446763@example.com", description: "Lennart Kiil" },
            { value: "ab123456@example.com", description: "Alice Bob" },
        ]
    }
}
def send-to [user: string@"nu-complete users"] { }
'send-to Lennart' | commandline complete
# => ╭───┬──────────────────────╮
# => │ 0 │ lk446763@example.com │
# => ╰───┴──────────────────────╯
```

输入 `Lennart` 并按下 <kbd>Tab</kbd> 键会匹配描述“Lennart Kiil”并插入其值 `lk446763@example.com`，即使所输入的文本并没有出现在该值本身中。

### 添加到内置补全

通常，返回建议的补全器会取代 Nushell 自身对该参数的补全。在返回的记录中设置 `fallback: true`，可以既保留你的建议，又让下一个补全来源（例如文件补全）添加它自己的建议：

```nu
def "nu-complete preset" [] {
    {completions: ["@default"], fallback: true}
}
def build [target: string@"nu-complete preset"] { }
# In a directory containing `docs/`, `src/` and `notes.txt`
'build ' | commandline complete
# => ╭───┬───────────╮
# => │ 0 │ @default  │
# => │ 1 │ docs/     │
# => │ 2 │ notes.txt │
# => │ 3 │ src/      │
# => ╰───┴───────────╯
```

## 模块与自定义补全

由于补全命令并不打算被直接调用，通常把它们定义在模块里。

用一个模块扩展上面的例子：

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

在这个模块中，只有自定义命令 `my-command` 被导出。`animals` 补全没有被导出。这让模块的使用者可以调用该命令，甚至使用自定义补全的逻辑，却无法访问补全命令本身。这带来了更清晰、更易于维护的接口。

::: tip
补全器是在解析时通过 `@` 附加到自定义命令上的。这意味着，要让补全命令的改动生效，公开的自定义命令也必须被重新解析。导入模块可以用一条 `use` 语句同时满足这两个要求。
:::

## 上下文感知的自定义补全

补全器可以向 Nushell 询问补全发生位置的信息。在需要知道之前的参数或标志才能生成准确补全的情况下，这很有用。

补全器通过声明具有以下一个或多个名称（顺序不限）的参数来获取这些信息：

- `token` - 描述光标下文本的记录：它的 `text`、它的 `kind`（`head`、`flag`、`value` 或 `block`），以及它在行中的 `span`。
- `place` - 描述正在补全内容的记录。`kind` 说明光标所处位置的类型（例如 `positional`、`flag-name`、`flag-value` 或 `external-arg`），并在适用时带有 `index` 或 `flag`。`target` 是建议所替换的范围，而 `command` 是正在补全的命令（以单词列表表示），即使在管道之后、闭包内部或通过别名调用也一样。
- `buffer` - 直到光标为止的整个命令行。

把它应用到前面的例子：

```nu
module commands {
    def animals [] {
        ["cat", "dog", "eel" ]
    }

    def animal-names [place: record] {
        match $place.command.1 {
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
use commands *
```

这里，`animal-names` 命令返回相应的名字列表。补全 `my-command dog ` 时，`$place.command` 是 `[my-command, dog, ""]`，所以 `$place.command.1` 就是已经输入的动物。

```nu
'my-command ' | commandline complete
# => ╭───┬─────╮
# => │ 0 │ cat │
# => │ 1 │ dog │
# => │ 2 │ eel │
# => ╰───┴─────╯
'my-command dog ' | commandline complete
# => ╭───┬──────╮
# => │ 0 │ Enzo │
# => │ 1 │ Lulu │
# => ╰───┴──────╯
my-command dog Enzo
# => The dog is named Enzo.
```

要查看补全器在某个位置究竟会收到什么，请使用 `commandline complete --input`：

```nu
def my-command [animal: string, name: string] {}
'ls | my-command dog L' | commandline complete --input
# => ╭────────┬──────────────────────────────────╮
# => │        │ ╭──────┬────────────────╮        │
# => │ token  │ │ text │ L              │        │
# => │        │ │ kind │ value          │        │
# => │        │ │      │ ╭───────┬────╮ │        │
# => │        │ │ span │ │ start │ 20 │ │        │
# => │        │ │      │ │ end   │ 21 │ │        │
# => │        │ │      │ ╰───────┴────╯ │        │
# => │        │ ╰──────┴────────────────╯        │
# => │        │ ╭─────────┬────────────────────╮ │
# => │ place  │ │ cursor  │ 21                 │ │
# => │        │ │         │ ╭───────┬────╮     │ │
# => │        │ │ target  │ │ start │ 20 │     │ │
# => │        │ │         │ │ end   │ 21 │     │ │
# => │        │ │         │ ╰───────┴────╯     │ │
# => │        │ │ kind    │ positional         │ │
# => │        │ │ index   │ 1                  │ │
# => │        │ │ shape   │ string             │ │
# => │        │ │         │ ╭───┬────────────╮ │ │
# => │        │ │ command │ │ 0 │ my-command │ │ │
# => │        │ │         │ │ 1 │ dog        │ │ │
# => │        │ │         │ │ 2 │ L          │ │ │
# => │        │ │         │ ╰───┴────────────╯ │ │
# => │        │ ╰─────────┴────────────────────╯ │
# => │ buffer │ ls | my-command dog L            │
# => ╰────────┴──────────────────────────────────╯
```

::: tip
在补全器内部请使用 `buffer`，而不是调用 `commandline`：`buffer` 始终是被补全的那一行。如果你需要把该行拆分成词法单元，请 `use std/util` 并调用 `util structure $buffer`，它会返回一个 `{text, kind, span}` 表格。
:::

::: warning
较旧的补全器声明为 `[context: string]`（可选地带有第二个 `position: int` 参数），或对外部和命令级补全器声明为 `[spans: list]`。它们仍然会收到旧的值，但 Nushell 会在首次使用时打印一条 `Positional completer input deprecated` 警告。请改用 `buffer`、`place` 或 `token`：`$buffer` 取代旧的 context 字符串，`$place.cursor` 取代位置，`$place.command` 取代 `spans`。
:::

## 自定义补全与 [`extern`](/commands/docs/extern.md)

一个强大的组合是为[已知的 `extern` 命令](externs.md)添加自定义补全。其工作方式与为自定义命令添加自定义补全相同：创建自定义补全，然后用 `@` 把它附加到 `extern` 的某个位置参数或标志参数的类型上。

例如，以下是 [nu_scripts 仓库](https://github.com/nushell/nu_scripts/blob/main/custom-completions/git/git-completions.nu) 中 `git push` 补全的简化版本：

```nu
def "nu-complete git remotes" [] {
    ^git remote | lines
}

def "nu-complete git branches" [] {
    ^git branch --format '%(refname:short)' | lines
}

export extern "git push" [
    remote?: string@"nu-complete git remotes",  # the name of the remote
    ...refs: string@"nu-complete git branches"  # the branch / refspec
    --all                                       # push all refs
    --force(-f)                                 # force updates
]
```

在 git 仓库中，`git push <Tab>` 现在会提供远程的名称，而 `git push origin <Tab>` 会提供本地分支。

自定义补全在本例中的作用与前几个例子相同。上面的例子根据用户当前所处的位置调用两个不同的自定义补全。

## 命令级补全器

除了把补全器附加到每个参数上，你还可以用 [`@complete`](/commands/docs/attr_complete.md) 属性把一个补全器附加到命令的所有参数上。这对接受自由形式参数列表的命令很方便。命令级补全器会为每个参数调用，且 Nushell 不会过滤它返回的内容，所以它通常自己按 `$token.text` 过滤：

```nu
def "nu-complete deploy" [token: record, place: record] {
    let candidates = if ($place.command | length) <= 2 {
        [staging production]
    } else {
        [--dry-run --force]
    }
    $candidates | where $it starts-with $token.text
}

@complete "nu-complete deploy"
def deploy [...args: string] { $args }

'deploy p' | commandline complete
# => ╭───┬────────────╮
# => │ 0 │ production │
# => ╰───┴────────────╯
'deploy staging --d' | commandline complete
# => ╭───┬───────────╮
# => │ 0 │ --dry-run │
# => ╰───┴───────────╯
```

`@complete external` 则改为把命令的参数发送给[外部补全器](#外部补全)。把它用于与被包装的外部命令同名的包装器，这样外部补全器就知道它正在补全哪个命令：

```nu
@complete external
def --wrapped jc [...args] {
    ^jc ...$args | from json
}
```

`def --wrapped` 命令会把它未声明的标志传给它的剩余参数。因此，附加在该剩余参数上的补全器也会为以 `-` 开头的参数调用，其建议会与命令自身的标志一起列出：

```nu
def "nu-complete what" [] { [--verbose --color=always plain] }
def --wrapped what [--local, ...args: string@"nu-complete what"] { $args }

'what --' | commandline complete
# => ╭───┬────────────────╮
# => │ 0 │ --local        │
# => │ 1 │ --color=always │
# => │ 2 │ --verbose      │
# => ╰───┴────────────────╯
```

## 自定义描述与样式

除了返回字符串列表，补全函数也可以返回一个记录列表，其中带有 `value` 字段以及下列可选字段：

- `description` - 菜单中显示在值旁边的文本。
- `style` - 菜单中值的着色方式（见下文）。
- `display_override` - 菜单中显示（并与已输入文本匹配）的文本，用来代替 `value`。插入的文本仍然是 `value`。
- `span` - 一个 `{start, end}` 记录，以字节偏移给出该值所替换的行的一部分。默认情况下，该值替换正在补全的词法单元。
- `extra` - 与所选值一起显示的字符串列表。它只出现在 `description` 菜单中。

样式可以是以下之一：

- 前景色字符串，可以是十六进制代码或颜色名，例如 `yellow`。有效颜色名的列表请见 `ansi --list`。
- 带有 `fg`（前景色）、`bg`（背景色）和 `attr`（如下划线、粗体等属性）字段的记录。该记录与 `ansi --escape` 接受的格式相同。`attr` 字段的可能取值列表请参阅 [`ansi`](/commands/docs/ansi) 命令参考。
- 同样的记录，但转换为 JSON 字符串。

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
使用下面的代码片段：

```nu
def my-command [commit: string@my_commits] {
    print $commit
}
```

... 请注意，即使补全菜单会显示类似下面的内容

```ansi
>_ [36mmy-command[0m <TAB>
[1;31m5c2464[0m  [33mAdd .gitignore[0m
[1;4;48;2;102;7;140;32mf3a377  [0m[33mInitial commit[0m
```

... 只有值（即“5c2464”或“f3a377”）会被用在命令参数中！
:::

## 交互式补全器

补全器通常在后台运行，因此缓慢的补全器永远不会阻塞行编辑器。需要终端的补全器，例如启动 `fzf` 之类的模糊查找器或使用 [`input list`](/commands/docs/input_list.md) 的补全器，必须用 [`@interactive`](/commands/docs/attr_interactive.md) 属性标记。它随后在前台运行并独占终端，它返回的任何内容都会成为补全：

```nu
@interactive
def pick-file [token: record] {
    ls | get name | to text | ^fzf --query $token.text | lines
}

def open-file [path: string@pick-file] {
    open $path
}
```

输入 `open-file ` 并按下 <kbd>Tab</kbd> 会打开 `fzf`，你选择的文件会被插入到命令行中。如果你改为取消选择器（例如按 <kbd>Esc</kbd>），则不会插入任何内容，也不会有菜单保持打开；再次按 <kbd>Tab</kbd> 会重新打开选择器。

## 测试补全器

[`commandline complete`](/commands/docs/commandline_complete.md) 命令对一个字符串运行补全引擎，就像光标位于其末尾一样。这让你可以不按 <kbd>Tab</kbd> 就检查补全器：

- `commandline complete` 返回建议的值。
- `commandline complete --detailed` 以记录形式返回建议，格式与自定义补全器返回的相同。
- `commandline complete --input` 返回补全器会收到的 `{token, place, buffer}` 记录，而不运行任何补全器。
- `commandline complete --type <source>` 只运行 Nushell 的某一个内置补全来源（`directory`、`path`、`glob`、`command`、`variable` 或 `env-var`）。补全器可以用它把 Nushell 自身的建议与它自己的建议结合起来：

```nu
def "nu-complete dirs-or-default" [token: record] {
    ['@default'] ++ ($token.text | commandline complete --type directory)
}
def build [target: string@"nu-complete dirs-or-default"] { }
# In a directory containing `docs/`, `src/` and `notes.txt`
'build ' | commandline complete
# => ╭───┬──────────╮
# => │ 0 │ @default │
# => │ 1 │ docs/    │
# => │ 2 │ src/     │
# => ╰───┴──────────╯
```

## 外部补全

除了只依赖 Nushell 自带的补全器，外部补全器也可以被集成进来。

为此，请在 `config.nu` 中把 `$env.config.completions.external.completer` 设为一个[闭包](types_of_data.md#闭包)。Nushell 会调用它来补全外部命令的参数，即那些不是内置、自定义或 [`extern`](externs.md) 命令的命令。与其它补全器一样，该闭包通过命名其参数来请求 `token`、`place` 或 `buffer`，并且可以返回与自定义补全器相同的值。当闭包返回 `null` 时，Nushell 回退到文件补全。

大多数外部补全器只需要 `$place.command`，即正在补全的命令（以单词列表表示）。例如，输入 `git checkout ma` 并按下 <kbd>Tab</kbd> 会让闭包收到 `[git, checkout, ma]`，而输入 `my-command --arg1 ` 会收到 `[my-command, --arg1, ""]`，其中尚未输入的参数用空字符串表示。别名已经被展开：如果 `gco` 是 `git checkout` 的别名，输入 `gco ma` 同样会得到 `[git, checkout, ma]`。

你可以配置该闭包来运行一个外部补全器，例如 [carapace](https://github.com/carapace-sh/carapace-bin)。下面这个例子会启用 carapace 外部补全：

```nu
$env.config.completions.external.completer = {|place|
    carapace $place.command.0 nushell ...$place.command | from json
}
```

::: tip 注意
`$env.config.completions.external` 中的 `enable` 和 `max_results` 设置控制补全命令名时是否（以及提供多少个）来自你 `PATH` 的外部命令名。它们不影响外部补全器。
:::

要对自定义命令也使用外部补全器，请用 [`@complete external`](#命令级补全器) 标记该命令。

[更多外部补全器的例子可以在 cookbook 中找到](../cookbook/external_completers.md)。
