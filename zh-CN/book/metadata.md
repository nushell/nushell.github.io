# 元数据

在使用 Nu 的过程中，你可能遇到过这样的情况：你觉得有一些额外的事情在幕后进行。例如，假设你试图打开一个 Nu 支持的文件，但却忘记了它已被 Nu 支持并试图再次转换：

```
> open Cargo.toml | from toml
error: Expected a string from pipeline
- shell:1:18
1 | open Cargo.toml | from toml
  |                   ^^^^^^^^^ requires string input
- shell:1:5
1 | open Cargo.toml | from toml
  |      ---------- object originates from here
```

这个错误信息不仅告诉我们，我们给 `from toml` 的不是一个字符串，还告诉我们这个值最初来自哪里。那么它是如何知道的呢？

在 Nu 中流经管道的值通常有一些额外信息，或元数据，附加在它们身上。这些通常被称为标签，就像商店里商品上的标签一样。这些标签并不影响数据，但它们给了 Nu 一种方法来改善使用这些数据的体验。

让我们再次运行[`open`](/commands/docs/open.md)命令，但这一次，我们将看一下它所反馈的标签：

```
> open Cargo.toml | metadata
────────┬───────────────────────────────────────────
 span   │ {record 2 fields}
────────┴───────────────────────────────────────────
```

目前，我们只追踪值来自何处的起止范围(span)。让我们进一步仔细看看：

```bash
> open Cargo.toml | metadata | get span
───────┬────
 start │ 5
 end   │ 15
───────┴────
```

这里的范围 "start" 和 "end" 指的是下划线将标记在行中的位置。如果你数到 5，然后再数到 15，就会看到它与 "Cargo.toml" 文件名一致。这就是我们之前看到的错误是如何知道在何处标注下划线的。
