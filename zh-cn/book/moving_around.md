# 在系统中四处移动

早前的 Shell 允许你在系统中四处移动并且运行命令，像 Nu 这样的现代 Shell 同样允许你这么干。让我们看看这些你可能会在与系统交互时用到的命令。

## 观察目录内容

<<< @/snippets/moving_around/ls_example.sh

正如我们在其他章节所看到的， `ls` 用来观察一个路径下的内容。 Nu 将会以一个表的形式返回你可看到的内容。

`ls` 命令通常可以携带一个可选的参数，来改变你希望观察的目标。例如，我们可以列出以 ".md" 结尾的文件：

<<< @/snippets/moving_around/ls_shallow_glob_example.sh

在可选参数 "\*.md" 前的星号 (\*) 有时候也被叫做通配符。它匹配任何东西。你可以将 "\*.md" 认作 "在当前目录下以 .md 结尾的文件"

Nu 也可以很好地使用现代通配符，来允许你访问更深的目录。

<<< @/snippets/moving_around/ls_deep_glob_example.sh

这里我们在寻找任何以 ".md" 结尾的，双星号表示 "任何在当前目录下的子孙目录"。

## 改变当前目录

<<< @/snippets/moving_around/cd_example.sh

为了将当前目录改成另一个，我们使用 `cd` 命令。就像其他 Shell 一样，我们可以使用一个目录名，或者用 `..` 来向上一个目录。

## 文件系统命令

Nu 也提供了可跨平台工作的基本文件系统命令。

我们可以通过 `mv` 命令将文件从一个地方移动到另一个地方：

<<< @/snippets/moving_around/mv_example.sh

我们可以把文件复制到另一个地方：

<<< @/snippets/moving_around/cp_example.sh

也可以移除一个项目：

<<< @/snippets/moving_around/rm_example.sh

这三条命令同样接受与 `ls` 相同的通配符参数。

最后，我们可以通过 `mkdir` 来新建一个目录：

<<< @/snippets/moving_around/mkdir_example.sh
