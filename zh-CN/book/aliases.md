# 别名

Nushell 中的别名提供了一种简单的命令调用替换方式（包括外部和内部命令）。这允许你为一个较长的命令（包括其默认参数）创建一个简写名称。

例如，让我们创建一个名为 `ll` 的别名，它将展开为 `ls -l`。

```nu
alias ll = ls -l
```

我们可以通过别名来调用它：

```nu
ll
```

一旦我们这样做了，就如同我们输入了 `ls -l` 一样。这也允许我们传入标志或位置参数。例如，我们现在也可以这样写：

```nu
ll -a
```

可得到与输入了`ls -l -a`一样的结果。

## 列出所有已加载的别名

你可以在 `scope aliases` 和 `help aliases` 中看到所有可用的别名。

## 持久化

为了使你的别名持久化，它必须被添加到你的 _config.nu_ 文件中。通过运行 `config nu` 打开编辑器并插入它们，然后重新启动 nushell。
例如，对于上面的 `ll` 别名，你可以在 _config.nu_ 的任何地方添加 `alias ll = ls -l`。

```nu
$env.config = {
    # 主要配置
}

alias ll = ls -l

# 其他一些配置和脚本加载
```

## 在别名中使用管道

请注意，`alias uuidgen = uuidgen | tr A-F a-f`（使 mac 上的 uuidgen 行为与 linux 一致）将无法工作。
解决方案是定义一个不带参数的命令，通过 `^` 调用系统程序 `uuidgen`。

```nu
def uuidgen [] { ^uuidgen | tr A-F a-f }
```

更多信息请参阅本书的[自定义命令](custom_commands.md)部分。

或者一个更符合 nushell 风格的内部命令示例：

```nu
def lsg [] { ls | sort-by type name -i | grid -c | str trim }
```

在网格中显示所有列出的文件和文件夹。

## 使用别名替换现有命令

::: warning 警告！
替换命令时，最好先“备份”命令，以避免递归错误。
:::

如何备份像 `ls` 这样的命令：

```nu
alias core-ls = ls    # 这将为 ls 创建一个名为 core-ls 的新别名
```

现在你可以在你的 nu 编程中使用 `core-ls` 作为 `ls`。你将在下面看到如何使用 `core-ls`。

你需要使用别名的原因是，与 `def` 不同，别名是位置相关的。因此，在重新定义旧命令之前，你需要先用别名“备份”它。
如果你不备份命令，而是使用 `def` 替换命令，你将会得到一个递归错误。

```nu
def ls [] { ls }; ls    # *不要*这样做！这会抛出递归错误

#输出:
#Error: nu::shell::recursion_limit_reached
#
#  × Recursion limit (50) reached
#     ╭─[C:\Users\zolodev\AppData\Roaming\nushell\config.nu:807:1]
# 807 │
# 808 │ def ls [] { ls }; ls
#     ·           ───┬──
#     ·              ╰── This called itself too many times
#     ╰────
```

推荐的替换现有命令的方法是遮蔽（shadow）该命令。
这是一个遮蔽 `ls` 命令的例子。

```nu
# 将内置的 ls 命令别名为 ls-builtins
alias ls-builtin = ls

# 列出目录中项目的的文件名、大小和修改时间。
def ls [
    --all (-a),         # 显示隐藏文件
    --long (-l),        # 获取每个条目的所有可用列（较慢；列取决于平台）
    --short-names (-s), # 只打印文件名，不打印路径
    --full-paths (-f),  # 将路径显示为绝对路径
    --du (-d),          # 显示目录的视在大小（“磁盘使用情况”）而不是目录元数据大小
    --directory (-D),   # 列出指定的目录本身而不是其内容
    --mime-type (-m),   # 在类型列中显示 mime-type 而不是 'file'（仅基于文件名；不检查文件内容）
    --threads (-t),     # 使用多个线程列出内容。输出将是不确定的。
    ...pattern: glob,   # 要使用的 glob 模式。
]: [ nothing -> table ] {
    let pattern = if ($pattern | is-empty) { [ '.' ] } else { $pattern }
    (ls-builtin
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
