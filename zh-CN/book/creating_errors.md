# 创建你自己的错误

使用 [元数据](metadata.md) 信息，你可以创建自己的自定义错误，错误信息由多个部分构成：

- 错误的标题
- 错误信息的标签，其中包括标签的文本和要标注下划线的范围
- 可选的帮助信息、错误码、URL，以及导致该错误的“内部”错误

你可以使用 [`error make`](/commands/docs/error_make.md) 命令来创建你自己的错误信息。例如，假设你有自己的名为 `my-command` 的命令，你想给调用者一个错误信息，说明传入的一个参数有问题。

首先，你可以从参数的来源中获取标注范围：

```nu
let span = (metadata $x).span;
```

接下来你可以通过 [`error make`](/commands/docs/error_make.md) 命令创建一个错误，该命令需要一个可以描述待创建错误的记录作为输入：

```nu
error make {msg: "this is fishy", label: {text: "fish right here", span: $span } }
```

与你的自定义命令放在一起后，它可能看起来像这样：

```nu
def my-command [x] {
    let span = (metadata $x).span;
    error make {
        msg: "this is fishy",
        label: {
            text: "fish right here",
            span: $span
        }
    }
}
```

现在当传入一个值调用时，我们会看到一个错误信息返回：

```nu
my-command 100
# => Error: nu::shell::error
# =>
# =>   × this is fishy
# =>    ╭─[repl_entry #2:1:12]
# =>  1 │ my-command 100
# =>    ·            ─┬─
# =>    ·             ╰── fish right here
# =>    ╰────
```

如果你只需要一条消息，可以传入一个字符串而不是记录：

```nu
error make "something went wrong"
# => Error: nu::shell::error
# =>
# =>   × something went wrong
# =>    ╭─[repl_entry #3:1:1]
# =>  1 │ error make "something went wrong"
# =>    · ──────────
# =>    ╰────
```

## 多个标签与帮助

要在多处画下划线，请使用 `labels` 并传入一个标签列表，而不是 `label`。每个标签都是一个记录，包含 `span`（一个 `{start, end}` 记录，例如 `metadata` 返回的那种）和可选的 `text`。`help` 消息告诉用户如何解决这个问题：

```nu
def check-range [lo: int, hi: int] {
    if $lo > $hi {
        error make {
            msg: "invalid range"
            labels: [
                {text: "lower bound" span: (metadata $lo).span}
                {text: "is greater than the upper bound" span: (metadata $hi).span}
            ]
            help: "swap the two arguments"
        }
    }
    $lo..$hi
}
```

```nu
check-range 10 1
# => Error: nu::shell::error
# =>
# =>   × invalid range
# =>    ╭─[repl_entry #5:1:13]
# =>  1 │ check-range 10 1
# =>    ·             ─┬ ┬
# =>    ·              │ ╰── is greater than the upper bound
# =>    ·              ╰── lower bound
# =>    ╰────
# =>   help: swap the two arguments
```

运行 `help error make` 可以查看错误还能包含哪些其它字段，例如 `code`、`url`、`inner` 和 `src`（用于指向另一个文件中的标签）。

## 捕获错误

当错误被 [`try`](/commands/docs/try.md) 捕获时，`catch` 闭包会收到一个描述该错误的记录：

```nu
try { check-range 10 1 } catch {|err| $err.msg }
# => invalid range
```

除了 `msg`，这个记录还有 `debug`、`raw` 和 `rendered` 字段，以及一个 `details` 字段，它以结构化数据的形式保存错误的各个部分：

```nu
try { check-range 10 1 } catch {|err| $err.details | reject labels inner }
# => ╭──────┬────────────────────────╮
# => │ msg  │ invalid range          │
# => │ code │                        │
# => │ url  │                        │
# => │ help │ swap the two arguments │
# => ╰──────┴────────────────────────╯
```

::: note
在 Nushell 0.113 及更早版本中，这些信息以 JSON 字符串的形式存在于 `$err.json` 中。请改用 `$err.details`。
:::

## 串联错误

如果你在 `catch` 块中调用 `error make`，被捕获的错误会成为新错误的内部错误，两者都会被报告出来：

```nu
try { check-range 10 1 } catch { error make "could not build the range" }
# => Error: nu::shell::error
# =>
# =>   × could not build the range
# =>    ╭─[repl_entry #8:1:34]
# =>  1 │ try { check-range 10 1 } catch { error make "could not build the range" }
# =>    ·                                  ──────────
# =>    ╰────
# =>
# => Error:
# =>   × invalid range
# =>    ╭─[repl_entry #8:1:19]
# =>  1 │ try { check-range 10 1 } catch { error make "could not build the range" }
# =>    ·                   ─┬ ┬
# =>    ·                    │ ╰── is greater than the upper bound
# =>    ·                    ╰── lower bound
# =>    ╰────
# =>   help: swap the two arguments
```
