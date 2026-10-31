# 外部命令

使用外部命令（又名二进制文件或应用程序）是任何 shell 的一个基本功能。Nushell 允许自定义命令利用其许多功能，例如：

- 解析时类型检查
- 自动补全
- 语法高亮

对这些功能的支持是使用 `extern` 关键字提供的，它允许为外部命令定义一个完整的签名。

下面是 `ssh` 命令的一个简短例子：

```nu
module "ssh extern" {
  def complete_none [] { [] }

  def complete_ssh_identity [] {
    ls ~/.ssh/id_*
    | where {|f|
        ($f.name | path parse | get extension) != "pub"
      }
    | get name
  }

  export extern ssh [
    destination?: string@complete_none  # 目标主机
    -p: int                             # 目标端口
    -i: string@complete_ssh_identity    # 身份文件
  ]
}
use "ssh extern" ssh
```

你会注意到这里的语法与定义自定义命令时的 `def` 关键字的语法相似。你可以描述标志、位置参数、类型、补全器等等。

这个实现：

- 将提供 `-p` 和 `-i`（带描述）作为 `ssh -` 的可能补全。
- 将执行解析时类型检查。试图为端口号使用非 `int` 将导致错误（和错误条件的语法高亮）。
- 将根据参数的形状提供解析时语法高亮。
- 将提供 `~/.ssh` 中的任何私钥文件作为 `-i`（身份）标志的补全值。
- 将不为目标主机提供补全。如果没有返回空列表的补全器，Nushell 将尝试使用默认的“File”补全器。

  有关从 SSH 配置文件中检索主机的实现，请参阅 [Nu_scripts 仓库](https://github.com/nushell/nu_scripts/blob/main/custom-completions/ssh/ssh-completions.nu)。

::: tip 提示
用于参数文档目的的 Nushell 注释，如果与参数在同一行，则需要在 ` #` 井号之前加一个空格。
:::

## 格式说明符

位置参数可以用 `?` 设为可选（如上所示）。剩余的（`rest`）参数可以在参数名称前用 `...` 来匹配。例如：

```nu
export extern "git add" [
  ...pathspecs: path
  # …
]
```

## 结构化输出

许多外部命令在你传入某个标志时会输出机器可读的结果，例如 `git status --porcelain` 或 `pip list --format=json`。要从它们那里取数据，就意味着每次都得记住这个标志、以及解析其输出的命令。[`@structured`](/commands/docs/attr_structured.md) 属性把这两样都放进 `extern` 声明里，所以你只需写一次：

```nu
@structured [--porcelain] { lines | parse --regex '^(?<status>..) (?<file>.+)$' }
extern "git status" []
```

`@structured` 接受两个参数：

- 一个参数列表，用于让该命令输出机器可读的结果。列表中的每一项就是一个参数，所以 `[--porcelain]` 会加一个参数，而 `[-o json]` 会加两个，即 `-o` 和 `json`。若某项包含空格或 `|`，请给它加引号，否则 Nushell 会把它拆成若干项。
- 一个把该输出转换为数据的块。这个块以 `$in` 接收命令的输出。

有了这个声明，单独运行 `git status` 时它仍会打印 git 惯常的文本：

```nu
git status
# => On branch main
# => Changes to be committed:
# =>   (use "git restore --staged <file>..." to unstage)
# =>         new file:   INSTALL.md
# =>
# => Changes not staged for commit:
# =>   (use "git add <file>..." to update what will be committed)
# =>   (use "git restore <file>..." to discard changes in working directory)
# =>         modified:   README.md
# =>
# => Untracked files:
# =>   (use "git add <file>..." to include in what will be committed)
# =>         notes.txt
```

把它用管道传给一个 Nushell 命令，Nushell 就会改为运行 `git status --porcelain`，并把输出交给那个块处理。你得到的是一张表格：

```nu
git status | where status =~ M
# => ╭───┬────────┬───────────╮
# => │ # │ status │   file    │
# => ├───┼────────┼───────────┤
# => │ 0 │  M     │ README.md │
# => ╰───┴────────┴───────────╯
```

你不需要用过滤器才能得到表格。当你想要全部数据时，把该命令用管道传给 [`collect`](/commands/docs/collect.md)。它是一个内部命令，因此输出会被解码，而它会原样把输入传下去：

```nu
git status | collect
# => ╭───┬────────┬────────────╮
# => │ # │ status │    file    │
# => ├───┼────────┼────────────┤
# => │ 0 │ A      │ INSTALL.md │
# => │ 1 │  M     │ README.md  │
# => │ 2 │ ??     │ notes.txt  │
# => ╰───┴────────┴────────────╯
```

把输出保存到变量中同样会解码：

```nu
let changes = git status
$changes | get file
# => ╭───┬────────────╮
# => │ 0 │ INSTALL.md │
# => │ 1 │ README.md  │
# => │ 2 │ notes.txt  │
# => ╰───┴────────────╯
```

当命令能输出 JSON 时，那个块只需要 [`from json`](/commands/docs/from_json.md)：

```nu
@structured [--format=json] { from json }
extern "pip list" []

pip list | first 3
# => ╭───┬───────────┬─────────╮
# => │ # │   name    │ version │
# => ├───┼───────────┼─────────┤
# => │ 0 │ contourpy │ 1.4.0   │
# => │ 1 │ cycler    │ 0.12.1  │
# => │ 2 │ fonttools │ 4.66.1  │
# => ╰───┴───────────┴─────────╯
```

### Nushell 何时解码输出

Nushell 依据 extern 的输出流向来决定。当输出由 Nushell 自己使用时，它会加上 `@structured` 的参数并运行那个块：

- 用管道传给内部命令：`git status | where status =~ M`，或者用 `git status | collect` 获取全部数据
- 保存到变量中：`let changes = git status`
- 在子表达式中使用：`(git status).file`

在其它所有情况下，命令都完全按你输入的方式运行。这包括输出流向：

- 终端：`git status`
- 经过 `print`：`git status | print`
- 文件：`git status o> status.txt` 或 `git status | save status.txt`
- 进入 `complete`、`tee` 或 `ignore`：`git status | complete`
- 进入另一个外部命令或 `run-external`：`git status | ^less`
- 与 stderr 进入同一管道：`git status o+e>| str trim`

当 extern 是自定义命令或 `do` 块的最后一条命令时，规则相同。在 `def gs [] { git status }` 之后，运行 `gs` 会打印 git 的文本，而 `gs | length` 返回 `3`，即有变动的文件数。

::: tip
每个内部命令都算数，包括处理文本的命令。`git status | lines` 是把解码后的表格传给 `lines`，而不是 git 的文本。要拿到文本，请用脱字符号调用该命令，这样它总是按原样运行：

```nu
^git status | lines | first 1
# => ╭───┬────────────────╮
# => │ 0 │ On branch main │
# => ╰───┴────────────────╯
```

:::

### 添加你自己的参数

Nushell 会把 `@structured` 的参数放在命令名之后、你输入的所有参数之前。下面这个 extern 为 `git log` 指定了一种容易拆分成列的输出格式：

```nu
@structured ["--format=%h|%an|%s"] { lines | split column "|" hash author subject }
extern "git log" []

git log | where author == "Ana Silva"
# => ╭───┬─────────┬───────────┬──────────────────╮
# => │ # │  hash   │  author   │     subject      │
# => ├───┼─────────┼───────────┼──────────────────┤
# => │ 0 │ 73e9a8f │ Ana Silva │ Print a greeting │
# => │ 1 │ 83c0a31 │ Ana Silva │ Initial commit   │
# => ╰───┴─────────┴───────────┴──────────────────╯
```

`git log -n 2 | where author == "Ana Silva"` 实际运行的是 `git log --format=%h|%an|%s -n 2`。

由于你的参数排在最后，改变输出格式的标志会覆盖 `@structured` 里的那个。这样块就会收到它不是为之编写的输出。这里 `--oneline` 胜出，因此每一行整行都落进了 `hash` 列：

```nu
git log --oneline -n 1 | first
# => ╭──────┬──────────────────────────╮
# => │ hash │ 73e9a8f Print a greeting │
# => ╰──────┴──────────────────────────╯
```

若要使用别的格式，请用脱字符号调用该命令，例如 `^git log --oneline`。

### 关于 `@structured` 的更多内容

- 这个块可以读取 `$env`、常量以及在 `extern` 之前定义的 `let` 变量，就像 `def` 的函数体一样。它不能使用 `mut` 变量。
- `@structured` 只对 `extern` 有效。把它放在 `def` 上会导致解析错误。
- 如果一个 `extern` 有多个 `@structured`，Nushell 使用最后一个。
- 当命令失败时，其错误信息会被打印。接下来发生什么取决于那个块。会读取全部输出的块（例如 `from json`）会以非零退出码的错误中断管道，该错误指向调用处。以流式读取输出的块（例如 `lines`）会把命令打印的内容继续传下去，且不引发错误。

`@structured` 也可以与 `export extern` 配合使用，这样模块就能共享这些声明：

```nu
module git-data {
  @structured [--porcelain] { lines | parse --regex '^(?<status>..) (?<file>.+)$' }
  export extern "git status" []
}
use git-data "git status"
```

## 局限性

目前的`extern`语法有一些限制。在 Nushell 中，标志和位置参数是非常灵活的：标志可以在位置参数之前，也可以与位置参数混合，还可以跟随位置参数。许多外部命令没有这种灵活性。目前还没有一种方法来确保标志和位置参数的特定顺序与外部命令所要求的风格保持一致。

第二个限制是，有些外部命令要求使用`=`来传递标志和值。在 Nushell 中，`=` 是一种方便的可选语法，目前还没有办法强制要求使用它。

此外，通过脱字符号（例如 `^ssh`）调用的外部命令不会被 `extern` 识别。

最后，一些外部命令支持使用单个前导连字符的 `-long` 参数。Nushell `extern` 语法尚不能表示这些参数。
