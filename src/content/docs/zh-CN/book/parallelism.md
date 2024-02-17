# 并行

Nushell 现在已经初步支持并行运行代码了，这允许你使用更多的计算机硬件资源来处理一个流的各个元素。

你会注意到这些命令包含其特有的`par-`命名，每一个都对应着一个非并行的版本，这允许你先轻松地以串行的风格写代码，然后再回头用几个额外的字符轻松地将串行脚本转换成并行脚本。

## `par-each`

最常见的并行命令是[`par-each`](/commands/docs/par-each.md)，它是[`each`](/commands/docs/each.md)命令的搭档。

与[`each`](/commands/docs/each.md)一样，[`par-each`](/commands/docs/par-each.md)对管道中流入的元素进行处理，在每个元素上运行一个代码块。与[`each`](/commands/docs/each.md)不同，[`par-each`](/commands/docs/par-each.md)将并行地进行这些操作。

假设你想计算当前目录下每个子目录下的文件数量。使用[`each`](/commands/docs/each.md)你可以这样写。

```nu
> ls | where type == dir | each { |it|
    { name: $it.name, len: (ls $it.name | length) }
}
```

我们为每个条目创建一条记录，并在其中填入目录的名称和该子目录中的文件数。

在你的机器上，时间可能有所不同。对于这台机器的当前目录来说，需要 21 毫秒的时间。

现在，由于这个操作可以并行运行，让我们把上面的操作转换为并行的，把[`each`](/commands/docs/each.md)改为[`par-each`](/commands/docs/par-each.md)：

```nu
> ls | where type == dir | par-each { |it|
    { name: $it.name, len: (ls $it.name | length) }
}
```

在这台机器上，现在它的运行时间为 6 毫秒。这是一个相当大的差异!

顺便提一下：由于 [环境变量是有作用域的](environment.md#作用域)，你可以使用`par-each`在多个目录中并行工作（注意 `cd` 命令）：

```nu
> ls | where type == dir | par-each { |it|
    { name: $it.name, len: (cd $it.name; ls | length) }
}
```

如果你看一下结果，你会注意到，它们每次运行返回的顺序是不同的（这取决于你系统上的硬件线程数量）。随着任务的完成，我们得到了正确的结果，如果我们希望得到结果以特定的顺序出现，我们可能需要添加额外的步骤。例如，对于上述情况，我们可能想按 "name" 字段对结果进行排序。这样，我们的脚本的[`each`](/commands/docs/each.md)和[`par-each`](/commands/docs/par-each.md)版本都能得到相同的结果。
