# 元数据

在使用 Nu 的过程中，你可能会遇到一些幕后工作。 例如，假设你尝试打开 Nu 所支持的文件并再次转换：

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

报错告诉我们，不仅 `from toml` 得到了一个非字符串，而且来源的最初值也不是。这是怎么做到的？

通过 Nu 中的管道流动的值通常具有一组附加信息或元数据 —— 标签。就像商店中商品上的标签一样， 这些标签不会影响数据，但是它们为 Nu 提供了一种改善该数据的使用体验的方法。

让我们再次运行 `open` 命令，但这次，我们将会看到给出的标签：

```
> open Cargo.toml | tags
────────┬───────────────────────────────────────────
 span   │ [row end start]
 anchor │ /home/jonathant/Source/nushell/Cargo.toml
────────┴───────────────────────────────────────────
```

现在，我们在管道中的值上跟踪两位元数据。 你会注意到，我们有提供了加载此数据的位置的锚点。 这可以帮助 Nu 更好地理解如何呈现数据。

这是个范围，让我们看看里面有什么：

```
> open Cargo.toml | tags | get span
───────┬────
 start │ 5
 end   │ 15
───────┴────
```

这里的范围 "start" 和 "end" 表示命令行中的文本位置。 如果你把命令行的输入 "open Cargo.toml" 从 5 开始数，然后数到 15，则会看到它与 "Cargo.toml" 文件名对齐。 这就是我们之前看到的报错知道要加上下划线来强调的内容。
