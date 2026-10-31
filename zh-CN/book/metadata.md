# 元数据

在使用 Nu 的过程中，你可能遇到过这样的情况：你觉得有一些额外的事情在幕后进行。例如，假设你试图打开一个 Nu 支持的文件，却忘记了这一点并试图再次转换：

```nu
open Cargo.toml | from toml
# => Error: nu::shell::only_supports_this_input_type
# =>
# =>   × Input type not supported.
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ open Cargo.toml | from toml
# =>    · ──┬─              ────┬────
# =>    ·   │                   ╰── only string input data is supported
# =>    ·   ╰── input type: record<package: record<name: string, version: string, edition: string>>
# =>    ╰────
```

这个错误信息不仅告诉我们，我们给 [`from toml`](/commands/docs/from_toml.md) 的不是一个字符串，还告诉我们这个值最初来自哪里。那么它是如何知道的呢？

在 Nu 中流经管道的值通常带有一些额外信息，或者说元数据。它们被称为标签，就像商店里商品上的标签一样。这些标签并不影响数据，但它们给了 Nu 一种改善数据处理体验的方式。

让我们再次运行 [`open`](/commands/docs/open.md) 命令，但这一次，我们将看一下它所反馈的标签：

```nu
metadata (open Cargo.toml)
# => ╭──────┬────────────────────╮
# => │      │ ╭───────┬────────╮ │
# => │ span │ │ start │ 169459 │ │
# => │      │ │ end   │ 169463 │ │
# => │      │ ╰───────┴────────╯ │
# => ╰──────┴────────────────────╯
```

每个值都带有一个跨度，它记录了这个值在源代码中的来源位置。让我们仔细看一下：

```nu
metadata (open Cargo.toml) | get span
# => ╭───────┬────────╮
# => │ start │ 169485 │
# => │ end   │ 169489 │
# => ╰───────┴────────╯
```

跨度的“start”和“end”是 Nushell 在当前会话中读取过的所有代码（标准库、你的配置文件，以及你输入的每条命令行）中的字节偏移量，所以这些数字才会这么大。[`view span`](/commands/docs/view_span.md) 命令可以显示某个跨度所指向的代码：

```nu
let span = (metadata (open Cargo.toml)).span
view span $span.start $span.end
# => open
```

这个跨度指向产生该值的 `open` 命令。这就是我们前面看到的错误知道该在哪里画下划线的原因。

当你把一个命令的输出通过管道传给 [`metadata`](/commands/docs/metadata.md)、而不是作为参数传入时，你还可以看到该命令附加在其输出上的元数据。例如，`open` 会记录数据来自哪个文件：

```nu
open Cargo.toml | metadata
# => ╭────────┬───────────────────────────────╮
# => │        │ ╭───────┬────────╮            │
# => │ span   │ │ start │ 169587 │            │
# => │        │ │ end   │ 169591 │            │
# => │        │ ╰───────┴────────╯            │
# => │ source │ /home/user/project/Cargo.toml │
# => ╰────────┴───────────────────────────────╯
```

其它命令会附加其它元数据。例如，[`to json`](/commands/docs/to_json.md) 以及其它 `to` 命令会设置 `content_type`（如 `application/json`），[`ls`](/commands/docs/ls.md) 会把它的 `name` 列标记为包含[路径](#路径列)，而 HTTP 命令会附加 [HTTP 响应](#http-响应元数据)。

这两种形式不能混用。当给 `metadata` 传入一个参数时，它只返回该参数的 `span`，并忽略任何管道输入。这使得它在闭包或块中可以安全使用，因为其中的第一条命令会接收该块的输入：

```nu
[1 2] | each {|x| (metadata $x).span } | to nuon
# => [[start, end]; [170379, 170380], [170381, 170382]]
```

这也意味着 `metadata $in` 只会报告一个跨度。要查看随管道输入而来的元数据，例如 `source` 或 `content_type`，请使用不带参数的 `metadata`。

## 自定义元数据

你可以使用 [`metadata set`](/commands/docs/metadata_set.md) 命令及其可选的闭包参数，把任意元数据附加到管道数据上：

```nu
"data" | metadata set { merge {custom_key: "custom_value"} } | metadata
# => ╭────────────┬────────────────────╮
# => │            │ ╭───────┬────────╮ │
# => │ span       │ │ start │ 169613 │ │
# => │            │ │ end   │ 169619 │ │
# => │            │ ╰───────┴────────╯ │
# => │ custom_key │ custom_value       │
# => ╰────────────┴────────────────────╯
```

## 路径列

列出文件的命令，例如 [`ls`](/commands/docs/ls.md)，会标记出包含路径的列：

```nu
ls | metadata
# => ╭──────────────────────────────┬────────────────────╮
# => │                              │ ╭───────┬────────╮ │
# => │ span                         │ │ start │ 169684 │ │
# => │                              │ │ end   │ 169686 │ │
# => │                              │ ╰───────┴────────╯ │
# => │                              │ ╭───┬──────╮       │
# => │ path_columns                 │ │ 0 │ name │       │
# => │                              │ ╰───┴──────╯       │
# => │                              │ ╭───┬──────╮       │
# => │ table_width_priority_columns │ │ 0 │ name │       │
# => │                              │ ╰───┴──────╯       │
# => ╰──────────────────────────────┴────────────────────╯
```

当 [`table`](/commands/docs/table.md) 显示 `path_columns` 中列出的某一列时，它会根据 `$env.LS_COLORS` 为路径着色，而 `table --icons` 还会为每种文件类型添加一个图标。`table_width_priority_columns` 列表告诉 `table`，当表格对于终端来说过宽时，应该优先把空间分给哪些列。

你也可以用 `metadata set` 在自己的数据上设置这两项：

```nu
[[name size]; [Cargo.toml 1.2kB]]
| metadata set --path-columns [name] --table-width-priority-columns [name]
| metadata
| reject span
# => ╭──────────────────────────────┬──────────────╮
# => │                              │ ╭───┬──────╮ │
# => │ path_columns                 │ │ 0 │ name │ │
# => │                              │ ╰───┴──────╯ │
# => │                              │ ╭───┬──────╮ │
# => │ table_width_priority_columns │ │ 0 │ name │ │
# => │                              │ ╰───┴──────╯ │
# => ╰──────────────────────────────┴──────────────╯
```

## 在管道中使用元数据

[`metadata access`](/commands/docs/metadata_access.md) 会用其输入的元数据运行一个闭包，而数据本身仍可通过 `$in` 获得：

```nu
{foo: bar} | to json --raw | metadata access {|meta| {in: $in, content: $meta.content_type}}
# => ╭─────────┬──────────────────╮
# => │ in      │ {"foo":"bar"}    │
# => │ content │ application/json │
# => ╰─────────┴──────────────────╯
```

## 窥探流

[`peek`](/commands/docs/peek.md) 会把流的前几个元素存进它的元数据里，这样你无需收集整个流就能查看它们：

```nu
seq 1 5 | peek 2 | metadata | get peek
# => ╭────────┬───────────╮
# => │ type   │ list      │
# => │ stream │ true      │
# => │        │ ╭───┬───╮ │
# => │ value  │ │ 0 │ 1 │ │
# => │        │ │ 1 │ 2 │ │
# => │        │ ╰───┴───╯ │
# => ╰────────┴───────────╯
```

## HTTP 响应元数据

所有 HTTP 命令都会附加响应元数据：

```nu
http get https://example.com | metadata | get http_response.status
# => 200
```

关于在流式传输响应体时处理元数据，请参阅 [HTTP 实用手册](../cookbook/http.md)。
