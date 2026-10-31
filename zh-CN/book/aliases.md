# 别名

Nushell 中的别名提供了一种简单的命令调用替换方式（包括外部命令和内部命令）。这让你可以为一个较长的命令（包括其默认参数）创建一个简写名称。

例如，我们来创建一个名为 `ll` 的别名，它会展开为 `ls -l`。

```nu
alias ll = ls -l
```

现在我们可以调用这个别名：

```nu
ll
```

一旦我们这样做了，就如同我们输入了 `ls -l` 一样。这也允许我们传入标志或位置参数。例如，我们现在还可以这样写：

```nu
ll -a
```

得到的就相当于输入了 `ls -l -a`。

## 为父命令设置别名

别名也可以指向一个带有子命令的命令，例如 `math` 或 `str`。这样这些子命令也可以通过该别名使用：

```nu
alias m = math
[1 2 3 4] | m sum
# => 10
```

这对拥有许多子命令的插件尤其方便。例如，在执行 `alias pl = polars` 之后，你就可以写 `pl into-df`、`pl select` 和 `pl collect`。

## 列出所有已加载的别名

你可以在 `scope aliases` 和 `help aliases` 中看到可用的别名。

对某个别名运行 `help` 会显示它展开成什么，随后是被别名指向的那个命令的帮助。例如，为一个小的自定义命令设置别名：

```nu
# Say hello to someone
def greet [name: string] { $"Hello, ($name)!" }
alias hi = greet
help hi
# => Alias for `greet`
# =>
# => Alias: hi
# =>
# => Expansion:
# =>   greet
# =>
# => Say hello to someone
# =>
# => Usage:
# =>   > greet <name>
# =>
# => Flags:
# =>   -h, --help: Display the help message for this command
# =>
# => Command Type:
# =>   > custom
# =>
# => Parameters:
# =>   name <string>
# =>
# => Input/output types:
# =>   ╭───┬───────┬────────╮
# =>   │ # │ input │ output │
# =>   ├───┼───────┼────────┤
# =>   │ 0 │ any   │ any    │
# =>   ╰───┴───────┴────────╯
```

当别名指向一个子命令时，对父命令运行 `help` 会以别名自身的名称列出该别名，紧跟在它所运行的子命令之后：

```nu
# Manage notes
def notes [] {}
# Add a note
def "notes add" [text: string] {}
# List notes
def "notes list" [] {}
alias nl = notes list
help notes
# => Manage notes
# =>
# => Usage:
# =>   > notes
# =>
# => Subcommands:
# =>   notes add (custom) - Add a note
# =>   notes list (custom) - List notes
# =>   nl (alias) - Alias for `notes list`
# =>
# => Flags:
# =>   -h, --help: Display the help message for this command
# =>
# => Command Type:
# =>   > custom
# =>
# => Input/output types:
# =>   ╭───┬───────┬────────╮
# =>   │ # │ input │ output │
# =>   ├───┼───────┼────────┤
# =>   │ 0 │ any   │ any    │
# =>   ╰───┴───────┴────────╯
```

内置命令也同样如此：在执行 `alias st = str trim` 之后，`help str` 会在 `str trim` 之后紧跟着列出 `st (alias)`。隐藏命令和别名不会被列出。

## 持久化

要使别名持久生效，必须把它们添加到你的 _config.nu_ 文件中：运行 `config nu` 打开编辑器并插入它们，然后重启 nushell。
例如，对于上面的 `ll` 别名，你可以在 _config.nu_ 的任意位置添加 `alias ll = ls -l`。

```nu
$env.config = {
    # main configuration
}

alias ll = ls -l

# some other config and script loading
```

## 在别名中使用管道

请注意，`alias uuidgen = uuidgen | tr A-F a-f`（让 mac 上的 uuidgen 表现得像 linux 上一样）是行不通的。
解决方案是定义一个不带参数的命令，通过 `^` 调用系统程序 `uuidgen`。

```nu
def uuidgen [] { ^uuidgen | tr A-F a-f }
```

更多信息请参阅本书的[自定义命令](custom_commands.md)部分。

或者一个更符合 Nushell 风格的内部命令示例

```nu
def lsg [] { ls | sort-by type name -i | grid -c | str trim }
```

以网格形式显示所有列出的文件和文件夹。

## 使用别名替换现有命令

::: warning 谨慎！
替换命令时，最好先“备份”该命令，以避免递归错误。
:::

::: tip 注意
诸如 `if`、`for` 或 `let` 这样的解析器关键字无法被替换。把其中一个用作别名（或自定义命令）的名称会导致 `nu::parser::name_is_keyword` 错误。
:::

如何备份像 `ls` 这样的命令：

```nu
alias core-ls = ls    # This will create a new alias core-ls for ls
```

现在即使 `ls` 本身已经被替换，你也可以在 nu 编程中把 `core-ls` 当作 `ls` 来使用。

你需要使用别名的原因是：与 `def` 不同，别名是位置相关的。所以，在重新定义旧命令之前，你需要先用别名“备份”它。
如果你不备份命令，而是用 `def` 替换命令，就会得到递归错误。

```nu
def ls [] { ls }; ls    # Do *NOT* do this! This will throw a recursion error
# => Error: nu::shell::recursion_limit_reached
# =>
# =>   × Recursion limit (50) reached
# =>    ╭─[repl_entry #1:1:11]
# =>  1 │ def ls [] { ls }; ls    # Do *NOT* do this! This will throw a recursion error
# =>    ·           ───┬──
# =>    ·              ╰── This called itself too many times
# =>    ╰────
```

推荐的替换现有命令的方式是遮蔽该命令，并在新定义中用
`%` 符号调用原始的内置命令。`%ls` 始终运行内置的 `ls`，即使它被
自定义命令或别名遮蔽，也不会产生递归。
下面是一个遮蔽 `ls` 命令的例子。

```nu
# List the filenames, sizes, and modification times of items in a directory.
def ls [
    --all (-a),         # Show hidden files
    --long (-l),        # Get all available columns for each entry (slower; columns are platform-dependent)
    --short-names (-s), # Only print the file names, and not the path
    --full-paths (-f),  # display paths as absolute paths
    --du (-d),          # Display the apparent directory size ("disk usage") in place of the directory metadata size
    --directory (-D),   # List the specified directory itself instead of its contents
    --mime-type (-m),   # Show mime-type in type column instead of 'file' (based on filenames only; files' contents are not examined)
    --threads (-t),     # Use multiple threads to list contents. Output will be non-deterministic.
    ...pattern: glob,   # The glob pattern to use.
]: [ nothing -> table ] {
    let pattern = if ($pattern | is-empty) { [ '.' ] } else { $pattern }
    (%ls
        --all=$all
        --long=$long
        --short-names=$short_names
        --full-paths=$full_paths
        --du=$du
        --directory=$directory
        --mime-type=$mime_type
        --threads=$threads
        ...$pattern
    ) | sort-by type name -i
}
```

你也可以在提示符下输入 `%ls`，以便在它被遮蔽时运行内置的 `ls`。

在 `%` 符号出现之前，函数体改为调用一个备份别名，例如用 `alias ls-builtin = ls` 创建的 `ls-builtin`。这种做法现在仍然有效，但前提是该别名是在 `ls` 仍指向内置命令时创建的。

有关 `%` 符号的更多内容，请参阅[遮蔽内置命令](custom_commands.md#遮蔽内置命令)。
