# 并行

Nushell 可以并行运行代码。这让你可以用计算机的更多硬件资源来处理流中的元素。

你会通过它们特有的 `par-` 命名注意到这些命令。每一个都对应一个非并行版本，让你先以串行风格轻松编写代码，然后回过头来多加几个字符就能轻松地把串行脚本转换为并行脚本。

## par-each

最常见的并行命令是 [`par-each`](/commands/docs/par-each.md)，它是 [`each`](/commands/docs/each.md) 命令的对应命令。

与 [`each`](/commands/docs/each.md) 一样，[`par-each`](/commands/docs/par-each.md) 对管道中的每个元素在其到达时运行一个块。与 [`each`](/commands/docs/each.md) 不同，[`par-each`](/commands/docs/par-each.md) 会并行执行这些操作。

假设你想统计当前目录下每个子目录中的文件数量。使用 [`each`](/commands/docs/each.md)，你可以这样写：

```nu
ls | where type == dir | each { |row|
    { name: $row.name, len: (ls $row.name | length) }
}
```

我们为每个条目创建一条记录，并填入该目录的名称以及该子目录中的条目数量。

在你的机器上，耗时可能有所不同。在这台机器上，当前目录耗时 21 毫秒。

现在，由于这个操作可以并行运行，让我们把 [`each`](/commands/docs/each.md) 改成 [`par-each`](/commands/docs/par-each.md)，把上面的代码转换为并行：

```nu
ls | where type == dir | par-each { |row|
    { name: $row.name, len: (ls $row.name | length) }
}
```

在这台机器上，现在只需 6 毫秒。差别相当大！

顺便说一下：由于[环境变量是有作用域的](environment.md#作用域)，你可以使用 [`par-each`](/commands/docs/par-each.md) 并行地在多个目录中工作（注意 [`cd`](/commands/docs/cd.md) 命令）：

```nu
ls | where type == dir | par-each { |row|
    { name: $row.name, len: (cd $row.name; ls | length) }
}
```

你会注意到，如果你查看结果，它们每次运行的返回顺序都不同（取决于你系统上的硬件线程数）。随着任务完成，我们会得到正确的结果；如果我们想让结果按特定顺序排列，可能需要添加额外的步骤。例如，对于上面的例子，我们可能想按“name”字段对结果排序。这让我们脚本的 [`each`](/commands/docs/each.md) 和 [`par-each`](/commands/docs/par-each.md) 版本都能给出相同的结果。

另外，`par-each --keep-order`（`-k`）会按输入的顺序返回结果：

```nu
1..5 | par-each --keep-order {|x| $x * 2 }
# => ╭───┬────╮
# => │ 0 │  2 │
# => │ 1 │  4 │
# => │ 2 │  6 │
# => │ 3 │  8 │
# => │ 4 │ 10 │
# => ╰───┴────╯
```

你也可以用 `--threads`（`-t`）限制 `par-each` 使用的线程数。

要在你继续使用 shell 的同时让命令在后台运行，请参阅[后台任务](background_jobs.md)。
