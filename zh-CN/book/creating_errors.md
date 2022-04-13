# 创建你自己的错误

使用 [元数据](metadata.md) 信息，你可以创建自己的自定义错误，错误信息由多个部分构成：

- 错误的标题
- 错误信息的标签，其中包括标签的文本和要标注下划线的范围

你可以使用`error make`命令来创建你自己的错误信息。例如，假设你有自己的名为`my-command`的命令，你想给调用者一个错误信息，说明传入的一个参数有问题。

首先，你可以从参数的来源中获取标注范围：

```bash
let span = (metadata $x).span;
```

接下来你可以通过 `error make` 命令来创建一个错误，该命令需要一个可以描述待创建错误的记录作为输入：

```bash
error make {msg: "this is fishy", label: {text: "fish right here", start: $span.start, end: $span.end } }
```

与你的自定义命令放在一起后，它可能看起来像这样：

```bash
def my-command [x] {
    let span = (metadata $x).span;
    error make {
        msg: "this is fishy",
        label: {
            text: "fish right here",
            start: $span.start,
            end: $span.end
        }
    }
}
```

现在当传入一个值调用时，我们会看到一个错误信息返回：

```bash
> my-command 100

Error:
  × this is fishy
   ╭─[entry #5:1:1]
 1 │ my-command 100
   ·            ─┬─
   ·             ╰── fish right here
   ╰────
```
