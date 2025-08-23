# 覆层

覆层(Overlays)作为各种定义（自定义命令、别名、环境变量）的"层"，可以根据需要激活和停用。
它们类似于某些语言中的虚拟环境，如 Python。

_注意：要了解覆层，请确保先查看 [模块](modules.md)，因为覆层是建立在模块之上的。_

## 基础

首先，Nushell 有一个默认的覆层，叫做 `zero`。
你可以用 [`overlay list`](/zh-CN/commands/docs/overlay_list.md) 命令检查哪些覆层是活动的。
你应该可以看到默认的覆层显示在那里。

要创建一个新的覆层，你首先需要一个模块：

```nu
module spam {
    export def foo [] {
        "foo"
    }

    export alias bar = echo "bar"

    export-env {
        load-env { BAZ: "baz" }
    }
}
```

我们将在本章中使用这个模块。每当你看到 `overlay use spam`，就应该知道 `spam` 是指这个模块。

::: tip
该模块可以通过[模块](modules.md)中描述的三种方法中的任何一种来创建：

- "内联"模块（本例中使用）
- 文件
- 目录

:::

要创建覆层，请调用 [`overlay use`](/zh-CN/commands/docs/overlay_use.md)：

```nu
overlay use spam

foo
# => foo

bar
# => bar

$env.BAZ
# => baz

overlay list
# => ───┬──────
# =>  0 │ zero
# =>  1 │ spam
# => ───┴──────
```

它将模块的定义带入当前作用域，并以与 [`use`](/zh-CN/commands/docs/use.md) 命令相同的方式评估 [`export-env`](/zh-CN/commands/docs/export-env.md) 代码块（参见[模块](modules.md#environment-variables)章节）。

::: tip
在下面的章节中，`>` 的提示语前面会有最后一个活动覆层的名称。
`(spam)> some-command` 表示当输入命令时，`spam` 覆层是最后活动的覆层。
:::

## 移除覆层

如果你不再需要叠加定义，请调用 [`overlay hide`](/zh-CN/commands/docs/overlay_hide.md)：

```nu
(spam)> overlay hide spam

(zero)> foo
Error: Can't run executable...

(zero)> overlay list
───┬──────
 0 │ zero
───┴──────
```

覆层也是有作用域的。
任何添加的覆层都会在作用域结束时被移除：

```nu
(zero)> do { overlay use spam; foo }  # 覆层仅在代码块内活动
foo

(zero)> overlay list
───┬──────
 0 │ zero
───┴──────
```

移除覆层的最后一种方法是调用不带参数的 [`overlay hide`](/zh-CN/commands/docs/overlay_hide.md)，它将删除最后一个活动的覆层。

## 覆层是可记录的

任何新的定义（命令、别名、环境变量）都会被记录到最后一个活动的覆层：

```nu
(zero)> overlay use spam

(spam)> def eggs [] { "eggs" }
```

现在，`eggs` 命令属于 `spam` 覆层。
如果我们删除该覆层，我们就不能再调用它：

```nu
(spam)> overlay hide spam

(zero)> eggs
Error: Can't run executable...
```

但是，我们可以把它找回来!

```nu
(zero)> overlay use spam

(spam)> eggs
eggs
```

覆层会记住你所添加的内容，即使你删除了它们，也会储存这些信息。
这可以让你在不同的上下文中反复切换。

::: tip
有时，在添加一个覆层后，你可能不希望自定义对象被添加到其中。
解决的办法是创建一个新的空的覆层，只用来记录自定义的变化：

```nu
(zero)> overlay use spam

(spam)> module scratchpad { }

(spam)> overlay use scratchpad

(scratchpad)> def eggs [] { "eggs" }
```

`eggs` 命令被添加到 `scratchpad` 中，同时保持 `spam` 不变。

为了让上述步骤不那么冗长，你可以使用 [`overlay new`](/zh-CN/commands/docs/overlay_new.md) 命令：

```nu
(zero)> overlay use spam

(spam)> overlay new scratchpad

(scratchpad)> def eggs [] { "eggs" }
```

:::

## 前缀覆层

[`overlay use`](/zh-CN/commands/docs/overlay_use.md) 命令会将模块中的所有命令和别名直接放入当前命名空间。
但是，你可能希望将它们作为子命令保留在模块名称之后。
这就是 `--prefix` 的作用：

```nu
(zero)> module spam {
    export def foo [] { "foo" }
}

(zero)> overlay use --prefix spam

(spam)> spam foo
foo
```

请注意，这不适用于环境变量。

## 重命名覆层

你可以使用 `as` 关键字更改添加的覆层的名称：

```nu
(zero)> module spam { export def foo [] { "foo" } }

(zero)> overlay use spam as eggs

(eggs)> foo
foo

(eggs)> overlay hide eggs

(zero)>
```

如果你有一个通用的脚本名称，例如 virtualenv 的 `activate.nu`，但你希望为你的覆层提供一个更具描述性的名称，这可能很有用。

## 保留定义

有时，你可能想删除一个覆层，但保留所有你添加的自定义定义，而不必在下一个活动覆层中重新定义它们：

```nu
(zero)> overlay use spam

(spam)> def eggs [] { "eggs" }

(spam)> overlay hide --keep-custom spam

(zero)> eggs
eggs
```

`--keep-custom` 标志正是用来做这个的。

也可以使用 `--keep-env` 标志保留在覆层内定义的环境变量列表，但删除其余部分：

```nu
(zero)> module spam {
    export def foo [] { "foo" }
    export-env { $env.FOO = "foo" }
}

(zero)> overlay use spam

(spam)> overlay hide spam --keep-env [ FOO ]

(zero)> foo
Error: Can't run executable...

(zero)> $env.FOO
foo
```

## 覆层顺序

覆层被排成一个堆栈。
如果多个覆层包含相同的定义，比如 `foo`，最后一个活动的覆层将优先。
要把某个覆层放到堆栈的顶部，你可以再次调用 `overlay use`：

```nu
(zero)> def foo [] { "foo-in-zero" }

(zero)> overlay use spam

(spam)> foo
foo

(spam)> overlay use zero

(zero)> foo
foo-in-zero

(zero)> overlay list
───┬──────
 0 │ spam
 1 │ zero
───┴──────
```

现在，`zero` 覆层具有优先权。
