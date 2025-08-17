# 目录栈

与其他一些Shell类似，Nushell提供了目录栈功能，可以方便地在多个目录之间切换。在Nushell中，此功能是[标准库](./standard_library.md)的一部分，可以通过多种方式访问。

::: note
在Nushell中，"栈"以`list`形式表示，但整体功能与其他Shell类似。
:::

[[toc]]

## `dirs`模块和命令

要使用`dirs`命令及其子命令，首先需要导入模块：

```nu
use std/dirs
```

::: tip
要使此功能在每次启动Nushell时都可用，请将上述命令添加到您的[启动配置](./configuration.md)中。
:::

这将提供以下新命令：

| 命令        | 描述                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------ |
| `dirs`      | 列出栈中的目录                                                                                   |
| `dirs add`  | 添加一个或多个目录到列表中。第一个列出的目录将成为新的活动目录。类似于其他Shell中的`pushd`命令。 |
| `dirs drop` | 从列表中移除当前目录。列表中的前一个目录将成为新的活动目录。类似于其他Shell中的`popd`命令。      |
| `dirs goto` | 根据索引跳转到列表中的目录                                                                       |
| `dirs next` | 将列表中的下一个目录设为活动目录。如果当前活动目录是列表中的最后一个，则循环到列表开头。         |
| `dirs prev` | 将列表中的前一个目录设为活动目录。如果当前活动目录是列表中的第一个，则循环到列表末尾。           |

当我们开始使用`dirs`时，列表中只有一个目录，即活动目录。您仍然可以使用`cd`命令更改此目录。

```nu
cd ~
use std/dirs
dirs
# => ╭───┬────────┬─────────────────────────────────╮
# => │ # │ active │              path               │
# => ├───┼────────┼─────────────────────────────────┤
# => │ 0 │ true   │ /home/myuser                    │
# => ╰───┴────────┴─────────────────────────────────╯

cd ~/src/repo/nushell
dirs
# => ╭───┬────────┬─────────────────────────────────╮
# => │ # │ active │              path               │
# => ├───┼────────┼─────────────────────────────────┤
# => │ 0 │ true   │ /home/myuser/repo/nushell       │
# => ╰───┴────────┴─────────────────────────────────╯
```

注意`cd`只会更改活动目录。

要*添加*当前目录到列表中，使用`dirs add`命令更改到新的活动目录：

```nu
dirs add ../reedline
dirs
# => ╭───┬────────┬──────────────────────────────────╮
# => │ # │ active │               path               │
# => ├───┼────────┼──────────────────────────────────┤
# => │ 0 │ false  │ /home/myuser/src/repo/nushell    │
# => │ 1 │ true   │ /home/myuser/src/repo/reedline   │
# => ╰───┴────────┴──────────────────────────────────╯
```

让我们继续添加几个常用目录到列表中：

```nu
dirs add ../nu_scripts
dirs add ~
dirs
# => ╭───┬────────┬────────────────────────────────────╮
# => │ # │ active │                path                │
# => ├───┼────────┼────────────────────────────────────┤
# => │ 0 │ false  │ /home/myuser/src/repo/nushell      │
# => │ 1 │ false  │ /home/myuser/src/repo/reedline     │
# => │ 2 │ false  │ /home/myuser/src/repo/nu_scripts   │
# => │ 3 │ true   │ /home/myuser                       │
# => ╰───┴────────┴────────────────────────────────────╯
```

现在我们可以使用`dirs next`、`dirs prev`或`dirs goto`轻松切换：

```nu
dirs next
# Active was 3, is now 0
pwd
# => /home/myuser/src/repo/nushell
dirs goto 2
# => /home/myuser/src/repo/nu_scripts
```

当您完成某个目录的工作后，可以使用以下命令将其从列表中移除：

```nu
dirs drop
dirs
# => ╭───┬────────┬──────────────────────────────────╮
# => │ # │ active │               path               │
# => ├───┼────────┼──────────────────────────────────┤
# => │ 0 │ false  │ /home/myuser/src/repo/nushell    │
# => │ 1 │ true   │ /home/myuser/src/repo/reedline   │
# => │ 2 │ false  │ /home/myuser                     │
# => ╰───┴────────┴──────────────────────────────────╯
```

当我们从列表中移除`nu_scripts`时，前一个目录(`reedline`)变为活动目录。

## `shells`别名

一些用户可能更喜欢将此功能视为"Shell中的多个Shell"，每个Shell都有自己的目录。

标准库提供了一组别名，可以替代上述`dirs`命令。

使用以下命令导入它们：

```nu
use std/dirs shells-aliases *
```

内置别名包括：

| 别名     | 描述                               |
| -------- | ---------------------------------- |
| `shells` | 替代`dirs`列出当前"Shell"/目录     |
| `enter`  | 替代`dirs add`进入新的"Shell"/目录 |
| `dexit`  | 替代`dirs drop`退出"Shell"/目录    |
| `g`      | `dirs goto`的别名                  |
| `n`      | `dirs next`的别名                  |
| `p`      | `dirs prev`的别名                  |

当然，您也可以根据需要定义自己的别名。
