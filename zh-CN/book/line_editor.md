# Reedline，Nu 的行编辑器

Nushell 的行编辑器 [Reedline](https://github.com/nushell/reedline) 是
跨平台的，被设计为模块化且具有灵活性。行编辑器负责
控制命令历史、验证、补全、提示、
屏幕绘制等。

[[toc]]

## 多行编辑

Reedline 允许 Nushell 命令行跨越多行。这可以通过几种方法实现：

1.  当括号表达式
    打开时按 <kbd>Enter</kbd>。

    例如：

    ```nu
    def my-command [] {
      print "Hello from my-command"
    }
    ```

    在开括号后按 <kbd>Enter</kbd> 将插入一个换行符。这同样适用于打开的（且有效的）`(` 和 `[` 表达式。

    这通常用于创建代码块和闭包（如上所述），也用于列表、记录和表格字面量：

    ```nu
    let file = {
      name: 'repos.sqlite'
      hash: 'b939a3fa4ca011ca1aa3548420e78cee'
      version: '1.4.2'
    }
    ```

    它甚至可以用来将单个命令延续到多行：

    ::: details 示例

    ```nu
    (
      tar
      -cvz
      -f archive.tgz
      --exclude='*.temp'
      --directory=../project/
      ./
    )
    ```

    :::

2.  在行尾有管道符（`|`）时按 <kbd>Enter</kbd>。

    ```nu
    ls                     |
    where name =~ '^[0-9]' | # 尾随管道符后的注释是可以的
    get name               |
    mv ...$in ./backups/
    ```

3.  使用 <kbd>Alt</kbd>+<kbd>Enter</kbd> 或 <kbd>Shift</kbd>+<kbd>Enter</kbd> 手动插入换行符。

    这可以用来创建前一个命令行的更易读的版本：

    ```nu
    ls
    | where name =~ '^[0-9]'  # 以数字开头的文件
    | get name
    | mv ...$in ./backups/
    ```

    ::: tip
    这些按键绑定中的一个或两个可能会被终端应用程序或窗口管理器拦截。例如，Windows Terminal（以及 Windows 上大多数其它终端应用程序）把 <kbd>Alt</kbd>+<kbd>Enter</kbd> 分配给将终端扩展为全屏。如果你的终端中上述两个按键绑定都不起作用，你可以为 `insertnewline` 编辑（`event: { edit: insertnewline }`）分配一个不同的按键绑定。

    参见下面的 [edit 类型](#edit类型) 示例，以及[按键绑定](#按键绑定)了解更多细节。
    :::

4.  按 <kbd>Ctrl</kbd>+<kbd>O</kbd> 会在你的编辑器中打开当前的命令行。保存生成的文件并退出编辑器将用结果更新命令行。

## 设置编辑模式

Reedline 允许你使用三种模式编辑文本 —— Emacs、Vi 和 Helix。如果
未指定，默认模式是 Emacs。要更改模式，请使用
接受 `emacs`、`vi` 或 `helix` 的 `edit_mode` 设置。

```nu
$env.config.edit_mode = 'vi'
```

这可以在命令行中更改，也可以保存在 `config.nu` 中。

::: note
Vi 是一个具有“普通”模式、“插入”模式和“可视”模式的“模态”编辑器。我们建议
在使用 Nushell 中的 Vi 模式之前，先通过使用 Vim 或 Neovim 编辑器
来熟悉这些模式。它们各自都有一个内置教程，涵盖
模态编辑的基础知识（以及更多内容）。

Helix 模式遵循 [Helix 编辑器](https://helix-editor.com/)，它也是模态的，
但采用“选择优先”：你先用移动命令选中文本，然后对所选内容执行操作。
参见下面的[Helix 模式](#helix-模式)。
:::

可以用 `$env.config.cursor_shape` 为每个模式分别设置光标形状，它具有
`emacs`、`vi_insert`、`vi_normal`、`vi_visual`、`helix_normal`、`helix_select` 和 `helix_insert`
这些键。每个键接受 `block`、`underscore`、`line`、`blink_block`、`blink_underscore`、`blink_line` 或
`inherit`（保持终端的光标形状）：

```nu
$env.config.cursor_shape.vi_insert = 'line'
$env.config.cursor_shape.vi_normal = 'block'
```

## 默认按键绑定

三种编辑模式都是在几组共享的按键绑定之上，加上各自独有的按键绑定构成的。下面的表格遵循 Nushell 所带 Reedline 版本的[按键绑定参考](https://github.com/nushell/reedline/blob/main/KEYBINDINGS.md)。运行 [`keybindings default`](/commands/docs/keybindings_default.md) 可以列出每种模式的内置按键绑定。

有些按键是一条*回退链*：Reedline 会依次尝试每一步，并采用第一个适用的结果。表格用“否则”来表示这种情况。例如，<kbd>→</kbd> 会在有历史提示时接受它，否则在已打开的菜单中右移，否则把光标右移一个字符。

### Nushell 添加的按键绑定

Nushell 在 Reedline 的默认绑定之上添加了以下按键绑定。它们定义在 `$env.config.keybindings` 中，因此你可以修改或移除它们；它们在所有编辑模式下都生效：

| 按键                             | 动作                                                                       |
| -------------------------------- | -------------------------------------------------------------------------- |
| <kbd>Tab</kbd>                   | 打开补全菜单，否则选择下一项，否则执行补全                                 |
| <kbd>Shift</kbd>+<kbd>Tab</kbd>  | 在菜单中选择上一项                                                         |
| <kbd>Ctrl</kbd>+<kbd>Space</kbd> | 打开 IDE 风格的补全菜单，否则选择下一项，否则执行补全                      |
| <kbd>Ctrl</kbd>+<kbd>R</kbd>     | 打开历史菜单（它取代了 Reedline 的 <kbd>Ctrl</kbd>+<kbd>R</kbd> 历史搜索） |
| <kbd>Ctrl</kbd>+<kbd>Q</kbd>     | 搜索历史                                                                   |
| <kbd>Ctrl</kbd>+<kbd>X</kbd>     | 显示已打开菜单的下一页                                                     |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd>     | 显示已打开菜单的上一页，否则撤销                                           |
| <kbd>F1</kbd>                    | 打开帮助菜单                                                               |

```nu
$env.config.keybindings | select name modifier keycode
# => ╭───┬────────────────────────────┬──────────┬─────────╮
# => │ # │            name            │ modifier │ keycode │
# => ├───┼────────────────────────────┼──────────┼─────────┤
# => │ 0 │ completion_menu            │ none     │ tab     │
# => │ 1 │ ide_completion_menu        │ control  │ space   │
# => │ 2 │ completion_previous        │ shift    │ backtab │
# => │ 3 │ history_menu               │ control  │ char_r  │
# => │ 4 │ next_page_menu             │ control  │ char_x  │
# => │ 5 │ undo_or_previous_page_menu │ control  │ char_z  │
# => │ 6 │ help_menu                  │ none     │ f1      │
# => │ 7 │ search_history             │ control  │ char_q  │
# => ╰───┴────────────────────────────┴──────────┴─────────╯
```

### 通用按键绑定

以下四组按键绑定在各编辑模式之间共享：

| 集合                  | Emacs | Vi 插入 | Vi 普通 / 可视       | Helix 插入 | Helix 普通 / 选择    |
| --------------------- | ----- | ------- | -------------------- | ---------- | -------------------- |
| [控制](#控制按键绑定) | 是    | 是      | 是                   | 是         | 是                   |
| [导航](#导航按键绑定) | 是    | 是      | 是，在可视模式下改绑 | 是         | 是，在选择模式下改绑 |
| [编辑](#编辑按键绑定) | 是    | 是      | 否                   | 是         | 否                   |
| [选择](#选择按键绑定) | 是    | 是      | 是                   | 是         | 是                   |

没有编辑集合的模式会自行重新绑定 <kbd>Backspace</kbd> 和 <kbd>Delete</kbd>。各模式也可以覆盖某个集合中的单个按键；这些按键会在该模式自己的表格中注明。

#### 控制按键绑定

| 按键                         | 动作                                                          |
| ---------------------------- | ------------------------------------------------------------- |
| <kbd>Esc</kbd>               | 关闭已打开的菜单并清除选择；在 Vi 和 Helix 模式下还会切换模式 |
| <kbd>Ctrl</kbd>+<kbd>C</kbd> | 取消当前输入                                                  |
| <kbd>Ctrl</kbd>+<kbd>D</kbd> | 删除光标下的字符，当行为空时退出 Nushell                      |
| <kbd>Ctrl</kbd>+<kbd>L</kbd> | 清屏，保留当前输入                                            |
| <kbd>Ctrl</kbd>+<kbd>R</kbd> | 搜索历史（Nushell 把这个键改绑为历史菜单，见上文）            |
| <kbd>Ctrl</kbd>+<kbd>O</kbd> | 在你的编辑器中打开当前输入（见 `$env.config.buffer_editor`）  |

#### 导航按键绑定

| 按键                                                            | 动作                                                       |
| --------------------------------------------------------------- | ---------------------------------------------------------- |
| <kbd>↑</kbd>, <kbd>Ctrl</kbd>+<kbd>P</kbd>                      | 在已打开的菜单中上移，否则上移一行，从首行开始回溯历史     |
| <kbd>↓</kbd>, <kbd>Ctrl</kbd>+<kbd>N</kbd>                      | 在已打开的菜单中下移，否则下移一行，从末行开始向前遍历历史 |
| <kbd>←</kbd>                                                    | 在已打开的菜单中左移，否则左移一个字符                     |
| <kbd>→</kbd>                                                    | 接受历史提示，否则在已打开的菜单中右移，否则右移一个字符   |
| <kbd>Ctrl</kbd>+<kbd>←</kbd>                                    | 左移一个词                                                 |
| <kbd>Ctrl</kbd>+<kbd>→</kbd>                                    | 接受历史提示的一个词，否则右移一个词                       |
| <kbd>Home</kbd>, <kbd>Ctrl</kbd>+<kbd>A</kbd>                   | 移到行首                                                   |
| <kbd>End</kbd>, <kbd>Ctrl</kbd>+<kbd>E</kbd>                    | 接受历史提示，否则移到行尾                                 |
| <kbd>Ctrl</kbd>+<kbd>Home</kbd>, <kbd>Alt</kbd>+<kbd>&lt;</kbd> | 移到缓冲区开头                                             |
| <kbd>Ctrl</kbd>+<kbd>End</kbd>, <kbd>Alt</kbd>+<kbd>&gt;</kbd>  | 移到缓冲区末尾                                             |

在使用 Kitty 键盘协议的终端上，<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>,</kbd> 和 <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>.</kbd> 也可以当作 <kbd>Alt</kbd>+<kbd>&lt;</kbd> 和 <kbd>Alt</kbd>+<kbd>&gt;</kbd> 使用。

#### 编辑按键绑定

| 按键                                                               | 动作                             |
| ------------------------------------------------------------------ | -------------------------------- |
| <kbd>Backspace</kbd>, <kbd>Ctrl</kbd>+<kbd>H</kbd>                 | 删除左边的字符                   |
| <kbd>Delete</kbd>                                                  | 删除光标下的字符                 |
| <kbd>Ctrl</kbd>+<kbd>Backspace</kbd>, <kbd>Ctrl</kbd>+<kbd>W</kbd> | 删除左边的词                     |
| <kbd>Ctrl</kbd>+<kbd>Delete</kbd>                                  | 删除右边的词                     |
| <kbd>Shift</kbd>+<kbd>Enter</kbd>, <kbd>Alt</kbd>+<kbd>Enter</kbd> | 插入换行而不运行输入             |
| <kbd>Ctrl</kbd>+<kbd>J</kbd>                                       | 运行输入，若输入不完整则插入换行 |

这些按键都不会填充剪切缓冲区（Emacs 模式把 <kbd>Ctrl</kbd>+<kbd>W</kbd> 改绑为剪切，所以它那里会填充）。当 Nushell 以 `system-clipboard` 特性构建时，这一组还包含 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd>、<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd> 和 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd>，用于通过系统剪贴板剪切、复制和粘贴所选内容。

#### 选择按键绑定

| 按键                                                                                              | 动作                             |
| ------------------------------------------------------------------------------------------------- | -------------------------------- |
| <kbd>Shift</kbd>+<kbd>←</kbd>, <kbd>Shift</kbd>+<kbd>→</kbd>                                      | 将选择范围扩展一个字符           |
| <kbd>Shift</kbd>+<kbd>↑</kbd>, <kbd>Shift</kbd>+<kbd>↓</kbd>                                      | 将选择范围扩展一行               |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>←</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>→</kbd>      | 将选择范围扩展一个词             |
| <kbd>Shift</kbd>+<kbd>Home</kbd>, <kbd>Shift</kbd>+<kbd>End</kbd>                                 | 将选择范围扩展到行首或行尾       |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Home</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>End</kbd> | 将选择范围扩展到缓冲区开头或末尾 |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd>                                                     | 选择整个缓冲区                   |

### Emacs 模式

Emacs 模式是默认模式。它包含全部四个[通用集合](#通用按键绑定)，另外还有：

| 按键                                                             | 动作                                                         |
| ---------------------------------------------------------------- | ------------------------------------------------------------ |
| <kbd>Ctrl</kbd>+<kbd>B</kbd>                                     | 在已打开的菜单中左移，否则左移一个字符                       |
| <kbd>Ctrl</kbd>+<kbd>F</kbd>                                     | 接受历史提示，否则在已打开的菜单中右移，否则右移一个字符     |
| <kbd>Alt</kbd>+<kbd>←</kbd>, <kbd>Alt</kbd>+<kbd>B</kbd>         | 左移一个词                                                   |
| <kbd>Alt</kbd>+<kbd>→</kbd>, <kbd>Alt</kbd>+<kbd>F</kbd>         | 接受历史提示的一个词，否则右移一个词                         |
| <kbd>Enter</kbd>                                                 | 运行输入，若输入不完整则插入换行                             |
| <kbd>Alt</kbd>+<kbd>Backspace</kbd>, <kbd>Alt</kbd>+<kbd>M</kbd> | 删除左边的词                                                 |
| <kbd>Alt</kbd>+<kbd>Delete</kbd>                                 | 删除右边的词                                                 |
| <kbd>Ctrl</kbd>+<kbd>W</kbd>                                     | 剪切左边的词                                                 |
| <kbd>Alt</kbd>+<kbd>D</kbd>                                      | 剪切右边的词                                                 |
| <kbd>Ctrl</kbd>+<kbd>K</kbd>                                     | 剪切到行尾，若已在行尾则与下一行合并                         |
| <kbd>Ctrl</kbd>+<kbd>U</kbd>                                     | 从行首剪切到光标处                                           |
| <kbd>Ctrl</kbd>+<kbd>Y</kbd>                                     | 在光标前粘贴剪切缓冲区                                       |
| <kbd>Ctrl</kbd>+<kbd>T</kbd>                                     | 交换光标两侧的两个字符                                       |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd>                                     | 撤销（Nushell 把这个键改绑为“上一页菜单，否则撤销”，见上文） |
| <kbd>Ctrl</kbd>+<kbd>G</kbd>                                     | 重做                                                         |
| <kbd>Alt</kbd>+<kbd>U</kbd>                                      | 将光标下的词改为大写                                         |
| <kbd>Alt</kbd>+<kbd>L</kbd>                                      | 将光标下的词改为小写                                         |
| <kbd>Alt</kbd>+<kbd>C</kbd>                                      | 将光标下的字符改为首字母大写                                 |

### Vi 模式

Vi 模式从插入模式开始。<kbd>Esc</kbd> 切换到普通模式，<kbd>i</kbd> 及其同类按键返回插入模式，<kbd>v</kbd> 从普通模式进入可视模式。在可视模式下，<kbd>Esc</kbd> 返回普通模式；在普通模式下它取消一条只输入了一半的命令。

操作符会等待一个移动命令，而移动命令决定操作符作用的范围：<kbd>d</kbd> 然后 <kbd>w</kbd> 剪切一个词。计数可以加在移动命令或命令之前，操作符和它的移动命令上的计数会相乘：<kbd>2</kbd><kbd>d</kbd><kbd>3</kbd><kbd>w</kbd> 剪切六个词。

在所有 Vi 模式中，未绑定的 <kbd>Alt</kbd>+\<char\> 组合会被读作 <kbd>Esc</kbd> 后接 \<char\>（readline 和 zsh 的“meta”约定）。例如，在插入模式下 <kbd>Alt</kbd>+<kbd>k</kbd> 会调出上一行。这也是在终端不发送 <kbd>Alt</kbd> 时可以使用它的办法：先按 <kbd>Esc</kbd>，再按那个键。

#### Vi 插入模式

插入模式包含全部四个[通用集合](#通用按键绑定)，另外还有：

| 按键             | 动作                                         |
| ---------------- | -------------------------------------------- |
| <kbd>Enter</kbd> | 运行输入，若输入不完整则插入换行             |
| <kbd>Esc</kbd>   | 切换到普通模式，把光标退回到最后输入的字符上 |

Emacs 的剪切与大小写命令（<kbd>Ctrl</kbd>+<kbd>K</kbd>、<kbd>Ctrl</kbd>+<kbd>U</kbd>、<kbd>Ctrl</kbd>+<kbd>Y</kbd>、<kbd>Ctrl</kbd>+<kbd>T</kbd>、<kbd>Alt</kbd>+<kbd>D</kbd>、<kbd>Alt</kbd>+<kbd>U</kbd>、<kbd>Alt</kbd>+<kbd>L</kbd> 和 <kbd>Alt</kbd>+<kbd>C</kbd>）在插入模式下没有绑定。由于 meta 约定，<kbd>Alt</kbd>+<kbd>u</kbd> 执行撤销，而 <kbd>Alt</kbd>+<kbd>d</kbd> 会退出插入模式并开始一个 <kbd>d</kbd> 操作符。<kbd>Ctrl</kbd>+<kbd>W</kbd> 删除左边的词而不剪切它。

#### Vi 普通模式

普通模式和可视模式拥有控制、导航和选择集合，但没有编辑集合。取而代之的是：

| 按键                 | 动作                                                                       |
| -------------------- | -------------------------------------------------------------------------- |
| <kbd>Backspace</kbd> | 在普通模式下左移一个字符；在可视模式下将选择范围向左扩展一个字符           |
| <kbd>Delete</kbd>    | 在普通模式下删除光标下的字符；在可视模式下像 <kbd>d</kbd> 一样剪切所选内容 |

下列移动命令在普通模式下移动光标。在可视模式下，它们改为扩展选择范围：

| 按键                                       | 移动                                                                          |
| ------------------------------------------ | ----------------------------------------------------------------------------- |
| <kbd>h</kbd>, <kbd>l</kbd>                 | 左移或右移一个字符                                                            |
| <kbd>j</kbd>, <kbd>k</kbd>                 | 下移或上移一行，在缓冲区边缘会遍历历史                                        |
| <kbd>w</kbd>, <kbd>W</kbd>                 | 移到下一个 word 或 WORD 的开头                                                |
| <kbd>e</kbd>, <kbd>E</kbd>                 | 移到下一个 word 或 WORD 的结尾                                                |
| <kbd>b</kbd>, <kbd>B</kbd>                 | 移到上一个 word 或 WORD 的开头                                                |
| <kbd>0</kbd>                               | 移到行首                                                                      |
| <kbd>^</kbd>                               | 移到该行第一个非空白字符                                                      |
| <kbd>$</kbd>                               | 移到行尾                                                                      |
| <kbd>g</kbd><kbd>g</kbd>, <kbd>G</kbd>     | 移到缓冲区开头或末尾                                                          |
| <kbd>f</kbd>\<char\>, <kbd>F</kbd>\<char\> | 移到下一个或上一个 \<char\> 上                                                |
| <kbd>t</kbd>\<char\>, <kbd>T</kbd>\<char\> | 移到下一个或上一个 \<char\> 之前                                              |
| <kbd>;</kbd>, <kbd>,</kbd>                 | 正向或反向重复上一次 <kbd>f</kbd>/<kbd>t</kbd>/<kbd>F</kbd>/<kbd>T</kbd> 搜索 |

WORD 只以空白分隔；word 还以标点分隔。在普通模式下，<kbd>h</kbd>、<kbd>j</kbd>、<kbd>k</kbd> 和 <kbd>l</kbd> 遵循与方向键相同的回退链：已打开的菜单先接管按键，<kbd>l</kbd> 在移动之前先接受历史提示。

普通模式命令：

| 按键                       | 动作                                             |
| -------------------------- | ------------------------------------------------ |
| <kbd>i</kbd>, <kbd>a</kbd> | 在光标前或光标后插入                             |
| <kbd>I</kbd>, <kbd>A</kbd> | 在行首或行尾插入                                 |
| <kbd>o</kbd>, <kbd>O</kbd> | 在下方或上方新开一行并插入                       |
| <kbd>v</kbd>               | 进入[可视模式](#vi-可视模式)                     |
| <kbd>x</kbd>, <kbd>X</kbd> | 剪切光标下或光标前的字符                         |
| <kbd>s</kbd>               | 剪切光标下的字符并插入                           |
| <kbd>r</kbd>\<char\>       | 用 \<char\> 替换光标下的字符                     |
| <kbd>C</kbd>               | 改写到行尾，不填充剪切缓冲区                     |
| <kbd>S</kbd>               | 改写整行                                         |
| <kbd>D</kbd>               | 剪切到行尾                                       |
| <kbd>p</kbd>, <kbd>P</kbd> | 在光标后或光标前粘贴剪切缓冲区                   |
| <kbd>u</kbd>               | 撤销                                             |
| <kbd>~</kbd>               | 切换光标下字符的大小写                           |
| <kbd>.</kbd>               | 重复上一次修改                                   |
| <kbd>?</kbd>               | 搜索历史并切换到插入模式                         |
| <kbd>Enter</kbd>           | 运行输入，若输入不完整则插入换行并切换到插入模式 |

#### Vi 操作符与文本对象

<kbd>d</kbd>、<kbd>c</kbd> 和 <kbd>y</kbd> 接受任意移动命令，并剪切、修改或复制它所覆盖的范围。把操作符按两次则作用于整行：<kbd>d</kbd><kbd>d</kbd>、<kbd>c</kbd><kbd>c</kbd>、<kbd>y</kbd><kbd>y</kbd>。

操作符也可以接受文本对象，用 <kbd>i</kbd> 表示“inside”（内部）或 <kbd>a</kbd> 表示“around”（周围）：

| 对象                       | 选中内容          |
| -------------------------- | ----------------- |
| <kbd>w</kbd>, <kbd>W</kbd> | 一个 word 或 WORD |
| <kbd>b</kbd>               | 包围的括号        |
| <kbd>q</kbd>               | 包围的引号        |

分隔符同样可以作为文本对象：`(`、`)`、`[`、`]`、`{`、`}`、`<`、`>`、`"`、`'`、`` ` `` 和 `$`。一对中的任意一半效果相同，所以 <kbd>d</kbd><kbd>i</kbd><kbd>(</kbd> 与 <kbd>d</kbd><kbd>i</kbd><kbd>)</kbd> 相同。三个操作符都接受 inside 形式；只有 <kbd>d</kbd> 和 <kbd>y</kbd> 接受 around 形式。

#### Vi 可视模式

在普通模式下按 <kbd>v</kbd> 进入可视模式，它会随着你用[移动命令](#vi-普通模式)移动光标而选中文本。可视模式重新绑定了导航集合，使每个按键都像其 Vi 对应按键那样扩展选择范围：方向键遵循 <kbd>h</kbd>/<kbd>j</kbd>/<kbd>k</kbd>/<kbd>l</kbd>，<kbd>Ctrl</kbd>+<kbd>←</kbd>/<kbd>→</kbd> 遵循 <kbd>b</kbd>/<kbd>w</kbd>，<kbd>Home</kbd>/<kbd>End</kbd> 遵循 <kbd>0</kbd>/<kbd>$</kbd>，依此类推。在可视模式下，<kbd>↑</kbd> 和 <kbd>↓</kbd> 不会遍历历史，也不会接受历史提示。

普通模式的命令在可视模式下同样适用，但以下按键例外，它们作用于所选内容：

| 按键                       | 动作                                              |
| -------------------------- | ------------------------------------------------- |
| <kbd>d</kbd>, <kbd>x</kbd> | 剪切所选内容并返回普通模式                        |
| <kbd>X</kbd>               | 剪切所选的行，停留在可视模式                      |
| <kbd>c</kbd>, <kbd>s</kbd> | 改写所选内容并切换到插入模式                      |
| <kbd>y</kbd>               | 复制所选内容并返回普通模式                        |
| <kbd>p</kbd>, <kbd>P</kbd> | 用剪切缓冲区替换所选内容，停留在可视模式          |
| <kbd>u</kbd>, <kbd>U</kbd> | 将所选内容改为小写或大写，然后返回普通模式        |
| <kbd>~</kbd>               | 切换所选内容的大小写，然后返回普通模式            |
| <kbd>o</kbd>, <kbd>O</kbd> | 把光标移到所选范围的另一端                        |
| <kbd>r</kbd>\<char\>       | 把所选的每个字符替换为 \<char\>，然后返回普通模式 |
| <kbd>Esc</kbd>             | 放弃所选内容并返回普通模式                        |

普通模式和可视模式有各自独立的按键绑定表。可视模式的按键绑定使用 `vi_visual` 模式名，而 `vi_normal` 的绑定在可视模式下不适用。

### Helix 模式

设置 `$env.config.edit_mode = 'helix'` 后，行编辑器遵循 [Helix 编辑器](https://docs.helix-editor.com/keymap.html)。移动命令会带着选择范围一起走，而命令作用于所选内容。这里没有操作符待决状态：<kbd>w</kbd> 选中一个词，然后 <kbd>d</kbd> 删除它。

Helix 模式从插入模式开始。<kbd>Esc</kbd> 切换到普通模式，<kbd>i</kbd> 及其同类按键返回插入模式，<kbd>v</kbd> 切换选择模式；在选择模式下，移动命令扩展选择范围而不是替换它。计数可以加在除 <kbd>g</kbd> 之外的任意按键之前。

插入模式包含全部四个[通用集合](#通用按键绑定)，另外还有 <kbd>Enter</kbd>（运行输入，若输入不完整则插入换行）和 <kbd>Esc</kbd>（切换到普通模式）。

普通模式和选择模式拥有控制、导航和选择集合，但没有编辑集合。取而代之的是：

| 按键                        | 动作                                                   |
| --------------------------- | ------------------------------------------------------ |
| <kbd>Backspace</kbd>        | 在普通模式下左移一个字符；在选择模式下向左扩展一个字符 |
| <kbd>Delete</kbd>           | 删除光标下的字符                                       |
| <kbd>Alt</kbd>+<kbd>D</kbd> | 删除所选内容而不复制它                                 |
| <kbd>Alt</kbd>+<kbd>`</kbd> | 将所选文本改为大写                                     |

与 Vi 可视模式一样，选择模式重新绑定了导航集合，使每个按键都像其 Helix 对应按键那样扩展选择范围，并且 <kbd>↑</kbd>/<kbd>↓</kbd> 不会遍历历史。

移动命令：

| 按键                                               | 动作                                                       |
| -------------------------------------------------- | ---------------------------------------------------------- |
| <kbd>h</kbd>, <kbd>l</kbd>                         | 左移 / 右移                                                |
| <kbd>j</kbd>, <kbd>k</kbd>                         | 下移 / 上移（在缓冲区边缘会遍历历史）                      |
| <kbd>w</kbd>, <kbd>b</kbd>, <kbd>e</kbd>           | 移到下一个 word 开头 / 上一个 word 开头 / 下一个 word 结尾 |
| <kbd>W</kbd>, <kbd>B</kbd>, <kbd>E</kbd>           | 移到下一个 WORD 开头 / 上一个 WORD 开头 / 下一个 WORD 结尾 |
| <kbd>f</kbd>\<char\>, <kbd>F</kbd>\<char\>         | 查找下一个 / 上一个 \<char\>                               |
| <kbd>t</kbd>\<char\>, <kbd>T</kbd>\<char\>         | 查找到下一个 / 上一个 \<char\> 之前                        |
| <kbd>g</kbd><kbd>h</kbd>, <kbd>g</kbd><kbd>l</kbd> | 跳到行首 / 行尾                                            |
| <kbd>g</kbd><kbd>s</kbd>                           | 跳到该行第一个非空白字符                                   |
| <kbd>g</kbd><kbd>g</kbd>, <kbd>g</kbd><kbd>e</kbd> | 跳到缓冲区开头 / 末尾                                      |

<kbd>h</kbd>、<kbd>l</kbd> 和 <kbd>g</kbd> 系列移动命令会把选择范围收拢到新位置，而 <kbd>w</kbd>、<kbd>b</kbd>、<kbd>e</kbd>、<kbd>f</kbd> 和 <kbd>t</kbd> 会选中它们经过的文本。

选择：

| 按键           | 动作                                               |
| -------------- | -------------------------------------------------- |
| <kbd>x</kbd>   | 选中当前行；若当前行已被选中，则扩展到下一行       |
| <kbd>%</kbd>   | 选中整个缓冲区                                     |
| <kbd>v</kbd>   | 切换选择模式                                       |
| <kbd>Esc</kbd> | 在普通模式下收拢选择范围；在选择模式下退出选择模式 |

修改：

| 按键                       | 动作                                             |
| -------------------------- | ------------------------------------------------ |
| <kbd>i</kbd>, <kbd>a</kbd> | 在选择范围之前 / 之后插入                        |
| <kbd>I</kbd>, <kbd>A</kbd> | 在该行第一个非空白字符处 / 行尾插入              |
| <kbd>o</kbd>, <kbd>O</kbd> | 在选择范围下方 / 上方新开一行                    |
| <kbd>d</kbd>               | 删除所选内容                                     |
| <kbd>c</kbd>               | 改写所选内容（删除它并进入插入模式）             |
| <kbd>y</kbd>               | 复制所选内容                                     |
| <kbd>p</kbd>, <kbd>P</kbd> | 在选择范围之后 / 之前粘贴                        |
| <kbd>r</kbd>\<char\>       | 用 \<char\> 替换所选内容                         |
| <kbd>~</kbd>               | 切换所选文本的大小写                             |
| <kbd>`</kbd>               | 将所选文本改为小写                               |
| <kbd>u</kbd>, <kbd>U</kbd> | 撤销 / 重做                                      |
| <kbd>Enter</kbd>           | 运行输入，若输入不完整则插入换行并切换到插入模式 |

<kbd>d</kbd>、<kbd>y</kbd> 和 <kbd>p</kbd> 返回普通模式，<kbd>c</kbd> 切换到插入模式。以下 Helix 按键尚不可用：<kbd>;</kbd>、<kbd>,</kbd>、<kbd>J</kbd>、<kbd>G</kbd>、<kbd>X</kbd>、<kbd>&gt;</kbd>、<kbd>&lt;</kbd>、<kbd>/</kbd>、<kbd>n</kbd> 和 <kbd>N</kbd> 搜索命令、匹配模式（<kbd>m</kbd>），以及多光标命令。

Helix 模式的按键绑定使用 `helix_normal`、`helix_select` 和 `helix_insert` 模式名。提示符在 Helix 插入模式下使用 `PROMPT_INDICATOR_VI_INSERT`，在普通模式和选择模式下使用 `PROMPT_INDICATOR_VI_NORMAL`。

::: tip
Vi 可视模式和 Helix 模式中的选择范围由 `$env.config.color_config.selection` 设置样式（默认为反色显示）。`$env.config.color_config.selection_cursor` 设置选择范围内光标所在字符的样式：

```nu
$env.config.color_config.selection = { bg: '#44475a' }
```

:::

## 命令历史

如前所述，Reedline 管理并存储所有被编辑并发送给 Nushell 的命令。要配置 Reedline 应存储的
最大记录数，你需要在配置文件中
调整这个值：

```nu
# 在 config.nu 中
$env.config.history.max_size = 1000
```

::: note
`history.max_size`、`history.file_format`、`history.isolation` 和 `history.path` 这些设置
必须在 `config.nu` 中设置。REPL 启动之后就无法再更改它们。
把 `$env.config.history.path` 设为 `null` 会关闭历史文件。
:::

## 提示

输入时，Reedline 会在光标之后以暗淡的颜色（`$env.config.color_config.hints`）显示一个提示。
默认情况下，提示是历史中最近一条匹配的命令。按 <kbd>→</kbd> 或 <kbd>End</kbd> 接受整个提示，
或按 <kbd>Ctrl</kbd>+<kbd>→</kbd> 接受
其中的一个词。设置 `$env.config.show_hints = false` 可以关闭提示。

要自行计算提示，可以把 `$env.config.hinter.closure` 设为一个闭包。它接收一个记录，其中包含当前的
`line`、光标位置 `pos` 和工作目录 `cwd`，并返回要在光标之后显示的文本，
或返回 `null` 表示没有提示。它也可以返回记录
`{hint: string, next_token: string}`，其中 `next_token` 是
<kbd>Ctrl</kbd>+<kbd>→</kbd> 接受的部分。该闭包在每次按键时都会运行，所以要保持它足够快。

```nu
let snippets = ["git status", "git switch -c", "cargo build --release"]
$env.config.hinter.closure = {|ctx|
    let match = $snippets | where $it starts-with $ctx.line | first
    if ($ctx.line | is-empty) or $match == null {
        null
    } else {
        $match | str substring ($ctx.line | str length)..
    }
}
```

把 `$env.config.hinter.closure = null` 设置一下即可恢复内置的历史提示。

## 定制提示

Reedline 提示符是使用多个环境变量配置的。有关详细信息，请参阅[提示符配置](./configuration.md#提示符配置)。

## 按键绑定

Reedline 按键绑定是一种强大的结构，它让你构建
可以通过特定按键组合触发的事件链。

例如，假设你想把补全菜单映射到
`Ctrl + t` 按键绑定上（默认是 `tab`）。你可以在配置文件中
添加下面这个条目：

```nu
$env.config.keybindings ++= [{
    name: completion_menu_ctrl_t
    modifier: control
    keycode: char_t
    mode: emacs
    event: { send: menu name: completion_menu }
}]
```

加载这个新的 `config.nu` 之后，你的新按键绑定（`Ctrl + t`）
就会打开补全命令。

每个按键绑定都需要以下元素：

- name：按键绑定的唯一名称。给 `$env.config.keybindings` 赋值会按名称把
  新条目合并到已有的绑定中：名称和按键都与已有绑定相同的条目会替换它，
  而复用某个名称但用于不同按键的条目会被添加为另一个绑定，
  并打印一条 `Multiple keybindings share a name` 警告。
  要清空所有按键绑定，请赋值一个空列表（`$env.config.keybindings = []`）。
- modifier: 绑定键的修饰符。选项有：
  - none
  - control
  - alt
  - shift
  - shift_alt
  - alt_shift
  - control_alt
  - alt_control
  - control_shift
  - shift_control
  - control_alt_shift
  - control_shift_alt
- keycode: 这代表要按下的键
- mode：emacs、vi_insert、vi_normal、vi_visual、helix_insert、helix_normal 或
  helix_select（单个字符串或列表，例如 [`vi_insert` `vi_normal`]）
- event: 按键绑定将要发送的事件的类型。
  选项包括：
  - send
  - edit
  - until

::: tip
所有可用的修饰符、键码和事件都可以用
[`keybindings list`](/commands/docs/keybindings_list.md) 命令查看
:::

::: tip
添加到 `vi_insert` 模式的按键绑定会在行编辑器
处于插入模式时（也就是你可以输入文本时）可用，而标有 `vi_normal` 模式的按键绑定
会在普通模式下可用（此时光标
使用 h、j、k 或 l 移动）。
:::

按键绑定条目中的 event 部分用来定义
要执行的动作。在这个字段中，你可以使用一个记录或一个记录列表。
例如，下面这个按键绑定发送单个事件：当你按 <kbd>Alt</kbd>+<kbd>E</kbd> 时，
它会在你的编辑器中打开当前的命令行

```nu
$env.config.keybindings ++= [{
    name: open_editor_alt_e
    modifier: alt
    keycode: char_e
    mode: emacs
    event: { send: OpenEditor }
}]
```

而这一条发送一组事件：当你按 <kbd>Alt</kbd>+<kbd>S</kbd> 时，它把光标移到行首
并在那里插入 `sudo `

```nu
$env.config.keybindings ++= [{
    name: prepend_sudo_alt_s
    modifier: alt
    keycode: char_s
    mode: emacs
    event: [
        { edit: MoveToLineStart }
        { edit: InsertString, value: "sudo " }
    ]
}]
```

本页中显示的第一个按键绑定示例遵循第一种情况；
一个单一的事件被发送到引擎。

下一个按键绑定是向引擎发送一系列事件的示例。它
首先清除提示，插入一个字符串，然后输入该值：

```nu
$env.config.keybindings ++= [{
    name: change_dir_with_fzf
    modifier: CONTROL
    keycode: Char_t
    mode: emacs
    event: [
        { edit: Clear }
        {
          edit: InsertString,
          value: "cd (ls | where type == dir | each { |row| $row.name} | str join (char nl) | fzf | decode utf-8 | str trim)"
        }
        { send: Enter }
    ]
}]
```

上面那个按键绑定的一个缺点是，插入的文本
会被验证器处理并保存到历史记录中，这让按键绑定
有点慢，而且会用同一条命令填满命令历史。
为此，还有 `executehostcommand` 类型的事件。下一个例子
以更简单的方式做了与前一个相同的事情，
向引擎发送单个事件：

```nu
$env.config.keybindings ++= [{
    name: change_dir_with_fzf_host_command
    modifier: CONTROL
    keycode: Char_y
    mode: emacs
    event: {
        send: executehostcommand,
        cmd: "cd (ls | where type == dir | each { |row| $row.name} | str join (char nl) | fzf | decode utf-8 | str trim)"
    }
}]
```

在我们继续之前，你一定已经注意到 edit 和 send
的语法发生了变化，因此有必要多解释一下。
`send` 是所有可以被引擎处理的 `Reedline` 事件，而 `edit`
是所有可以被引擎处理的 `EditCommands`。

### send类型

要找到 `send` 的所有可用选项，你可以使用：

```nu
keybindings list | where type == events
```

`send` 事件的语法是 `event: { send: <NAME OF EVENT FROM LIST> }`。

::: tip
你可以用大写字母来写事件的名称。按键绑定
解析器不区分大小写。
:::

这条规则有三个例外：`Menu`、`ExecuteHostCommand` 和 `SwitchMode`。
这些事件需要一个额外的字段才算完整。`Menu` 需要
要激活的菜单的名称（例如 completion_menu 或 history_menu）

```nu
$env.config.keybindings ++= [{
    name: history_menu_alt_h
    modifier: alt
    keycode: char_h
    mode: emacs
    event: {
        send: menu
        name: history_menu
    }
}]
```

而 `ExecuteHostCommand` 需要一条
将被发送到引擎的有效命令

```nu
$env.config.keybindings ++= [{
    name: go_home_alt_g
    modifier: alt
    keycode: char_g
    mode: emacs
    event: {
        send: executehostcommand
        cmd: "cd ~"
    }
}]
```

而 `SwitchMode` 事件需要要切换到的 `mode`。
它接受与按键绑定的 `mode` 字段相同的模式名（例如 `vi_normal` 或 `helix_normal`）。
下面这个按键绑定用 <kbd>Ctrl</kbd>+<kbd>G</kbd> 离开 Vi 插入模式：

```nu
$env.config.keybindings ++= [{
    name: vi_normal_ctrl_g
    modifier: control
    keycode: char_g
    mode: vi_insert
    event: {
        send: switchmode
        mode: vi_normal
    }
}]
```

`SwitchMode` 事件只能在当前
`edit_mode` 的模式之间切换，因此在 Helix 模式下切换到 `vi_normal` 不会有任何效果。
切换到当前已经处于活动状态的模式同样不会有任何效果。
较旧的 `ViChangeMode`（用 `mode: normal`、`insert` 或 `visual`）
和 `HelixChangeMode`（用 `mode: normal`、`insert` 或 `select`）事件仍然被接受，
其行为与 `SwitchMode` 相同。

值得一提的是，事件列表还显示了 `event: { edit: <edit> }`、
`event: { send: list<event> }` 和 `event: { until: list<event> }`。这些不是
按名称发送的事件。它们表示 `event` 字段可以采用的其它形式：
一条 `edit` 记录（即前面提到的 `edit` 类型）、一个会被依次全部发送的
事件列表，以及后面会提到的 `until` 类型。

### edit类型

`edit` 类型发送 Reedline 的某个编辑命令，这些命令会改变命令行的文本
或移动光标。要列出可用的选项，你可以使用
下面这条命令

```nu
keybindings list | where type == edits
```

`edit` 的常用语法是 `event: { edit: <NAME OF EDIT FROM LIST> }`。
例如，下面这个按键绑定在你按 <kbd>Alt</kbd>+<kbd>N</kbd> 时插入一个换行符，
这在你的终端拦截了 <kbd>Alt</kbd>+<kbd>Enter</kbd>
和 <kbd>Shift</kbd>+<kbd>Enter</kbd> 时很有用

```nu
$env.config.keybindings ++= [{
    name: insert_newline_alt_n
    modifier: alt
    keycode: char_n
    mode: [emacs vi_insert helix_insert]
    event: { edit: insertnewline }
}]
```

列表中有些编辑后面带有额外的字段，例如
`InsertString value: <string>`。这些编辑需要这些额外字段才算完整定义。
例如，如果我们想在光标处插入一个字符串，
那么你将不得不使用

```nu
$env.config.keybindings ++= [{
    name: insert_to_json_alt_j
    modifier: alt
    keycode: char_j
    mode: emacs
    event: {
        edit: insertstring
        value: " | to json"
    }
}]
```

或者你想向右移动到下一个 `|` 之前

```nu
$env.config.keybindings ++= [{
    name: move_to_pipe_alt_p
    modifier: alt
    keycode: char_p
    mode: emacs
    event: {
        edit: moverightuntil
        value: "|"
    }
}]
```

正如你所见，这两种类型让你能够构建出
你需要的任何按键绑定

### until类型

为了完成这次按键绑定之旅，我们需要讨论事件的 `until` 类型。
正如你到目前为止所看到的，你可以发送单个事件或一组事件。
而正如我们所见，当发送一组事件时，
其中每一个都会被处理。

不过，有时你可能想给同一个按键绑定分配
不同的事件。这在处理 Nushell 菜单时尤其有用。例如，假设
你仍然想用 `Ctrl + t` 激活补全菜单，
但你又想在菜单激活之后用同一个按键绑定移动到菜单中的
下一个元素。

对于这些情况，我们提供了 `until` 关键字。until 事件中列出的事件
会被逐个处理，不同之处在于
只要有一个成功，事件处理就会停止。

下面这个按键绑定就代表这种情况。

```nu
$env.config.keybindings ++= [{
    name: completion_menu_ctrl_t
    modifier: control
    keycode: char_t
    mode: emacs
    event: {
        until: [
          { send: menu name: completion_menu }
          { send: menunext }
        ]
    }
}]
```

上面的按键绑定会先尝试打开补全菜单。如果菜单
未激活，它会激活菜单并发送一个成功信号。如果再次按下该按键绑定，
由于此时已有激活的菜单，那么它将发送的下一个事件是 MenuNext，
这意味着它会把选择器移动到菜单中的
下一个元素。

正如你所见，`until` 关键字让我们可以为同一个
按键绑定定义两个事件。
只有当一个事件无事可做时，`until`
才会继续处理下一个。`menu` 事件在菜单已打开时如此，其它菜单事件
（例如 `menunext`）在没有打开菜单时如此，`up` 和 `down` 在没有可移动到的行或历史条目时如此，
`left` 和 `right` 在到达行的两端时如此，历史提示事件在
没有可接受的提示时如此，`SwitchMode` 在无法切换时如此（参见 [send 类型](#send类型)）。
大多数其它事件总是成功，因此 `until` 事件在遇到它们时就会停止。

例如，下面这个按键绑定在有可移动到的行或更新的历史条目时发送 `down`，
只有在没有时才
打开补全菜单

```nu
$env.config.keybindings ++= [{
    name: completion_menu_ctrl_t
    modifier: control
    keycode: char_t
    mode: emacs
    event: {
        until: [
            { send: down }
            { send: menu name: completion_menu }
            { send: menunext }
        ]
    }
}]
```

`SwitchMode` 事件可以让一个按键绑定在多个编辑模式下工作。
下面这个按键绑定用 <kbd>Ctrl</kbd>+<kbd>G</kbd> 在 Vi 和 Helix 模式下都离开插入模式：
在 Vi 模式下第一个事件切换到 `vi_normal`，而在 Helix 模式下
第一个事件无事可做，于是第二个事件切换到 `helix_normal`

```nu
$env.config.keybindings ++= [{
    name: leave_insert_mode
    modifier: control
    keycode: char_g
    mode: [vi_insert helix_insert]
    event: {
        until: [
            { send: SwitchMode, mode: vi_normal }
            { send: SwitchMode, mode: helix_normal }
        ]
    }
}]
```

### 移除一个默认的按键绑定

如果你想删除某个默认的按键绑定，而不打算使用不同的动作来替代它，你可以设置`event: null`。

例如，在所有的编辑模式下，禁用 `Ctrl + l` 清除屏幕：

```nu
$env.config.keybindings ++= [{
    modifier: control
    keycode: char_l
    mode: [emacs, vi_normal, vi_insert, vi_visual, helix_normal, helix_select, helix_insert]
    event: null
}]
```

### 排查键盘绑定问题

你的终端环境可能并不总是以你期望的方式把组合键传递给 Nushell。你可以用 [`keybindings listen`](/commands/docs/keybindings_listen.md) 命令来确定某些按键是否真的被 Nushell 接收到，以及如何接收到的。

## 菜单

得益于 Reedline，Nushell 提供了一些菜单，可以帮助你完成日常的
shell 脚本工作。接下来我们介绍在使用 Nushell 时
始终可用的默认菜单。

菜单在 `$env.config.menus` 中配置。给这个列表赋值会按 `name` 把你的条目
合并到默认菜单中，因此名为 `completion_menu` 的条目会替换默认的补全菜单，
而不是添加第二个菜单；`$env.config.menus = []`
也不会移除默认菜单。

每个菜单都设置了 `input_mode`，它控制菜单搜索的文本：

- `diff` - 只搜索在菜单激活之后输入的文本
- `cursor_prefix` - 从行首到光标处的内容
- `full_buffer` - 整行内容，包括光标之后的文本

它还可以设置 `output_mode`，它控制接受的建议替换掉什么：

- `suggested_span` - 建议所指的那部分行内容（默认值）
- `full_buffer` - 整行内容
- `extend_to_end` - 从建议范围的起点到行尾

较旧的配置使用 `only_buffer_difference` 而不是 `input_mode`。它仍然
有效：`true` 等同于 `input_mode: diff`，`false` 等同于
`input_mode: cursor_prefix`。

默认情况下，在菜单打开时删除文本可能会关闭菜单。设置
`$env.config.completions.persistent_menus = true` 可以在你编辑时保持菜单打开。
此时菜单会改为更新它的建议，只有在你接受某条建议或按
<kbd>Esc</kbd> 或 <kbd>Ctrl</kbd>+<kbd>C</kbd> 时才关闭。

输入的内容超过最后一个匹配项并不会关闭已打开的补全菜单。它会显示
`NO RECORDS FOUND`，并在文本重新匹配到内容时立即重新填充。

### 菜单快捷键

当菜单激活时，一些快捷键会根据上面讨论的[快捷键 `until` 说明符](#until类型)而改变。菜单的通用快捷键是：

| 快捷键                          | 事件           |
| ------------------------------- | -------------- |
| <kbd>Tab</kbd>                  | 选择下一个项目 |
| <kbd>Shift</kbd>+<kbd>Tab</kbd> | 选择上一个项目 |
| <kbd>Enter</kbd>                | 接受选择       |
| <kbd>↑</kbd> (上箭头)           | 菜单上移       |
| <kbd>↓</kbd> (下箭头)           | 菜单下移       |
| <kbd>←</kbd> (左箭头)           | 菜单左移       |
| <kbd>→</kbd> (右箭头)           | 菜单右移       |
| <kbd>Ctrl</kbd>+<kbd>P</kbd>    | 菜单上移       |
| <kbd>Ctrl</kbd>+<kbd>N</kbd>    | 菜单下移       |
| <kbd>Ctrl</kbd>+<kbd>B</kbd>    | 菜单左移       |
| <kbd>Ctrl</kbd>+<kbd>F</kbd>    | 菜单右移       |

::: note
菜单方向行为因菜单类型而异（见下文）。例如，
在 `description` 菜单中，“上”和“下”作用于“Extra”列表，但在
`list` 菜单中，方向作用于选择。
:::

### 帮助菜单

帮助菜单的存在是为了让你更轻松地过渡到 Nushell。假设你正在
拼装一条非常棒的管道，却忘记了用来反转字符串的那个内部命令。
你不必删掉你的管道，而是可以用 `F1` 激活帮助菜单。
激活之后，只要输入你要找的命令的关键词，
菜单就会显示与你的输入相匹配的命令。
匹配会针对命令的名称或命令的
描述进行。

要在菜单中导航，你可以用 `tab` 选择下一个元素，
可以按左或右来滚动描述，甚至可以把可用的命令示例
粘贴到行中。

帮助菜单可以通过修改以下参数进行配置：

```nu
$env.config.menus ++= [{
    name: help_menu
    input_mode: diff             # 搜索是在激活菜单后输入的文本上进行的
    marker: "? "                 # 菜单激活时出现的指示符
    type: {
        layout: description      # 菜单类型
        columns: 4               # 显示选项的列数
        col_width: 20            # 可选值。如果缺少，则使用所有屏幕宽度来计算列宽
        col_padding: 2           # 列之间的填充
        selection_rows: 4        # 允许显示找到的选项的行数
        description_rows: 20     # 允许显示命令描述的行数
    }
    style: {
        text: green                   # 文本样式
        selected_text: green_reverse  # 选定选项的文本样式
        description_text: yellow      # 描述的文本样式
    }
}]
```

### 补全菜单

补全菜单是一个上下文敏感的菜单，它会根据
提示的状态给出建议。这些建议的范围从路径建议
到命令备选都有。在编写命令时，
你可以激活该菜单来查看某个内部命令的可用标志。此外，
如果你已经为外部命令定义了自己的自定义补全，
它们也会出现在菜单中。

默认情况下，补全菜单通过按 `tab` 访问，它可以通过
修改配置对象中的以下值来配置：

```nu
$env.config.menus ++= [{
    name: completion_menu
    input_mode: cursor_prefix       # 搜索是在从行首到光标的文本上进行的
    marker: "| "                    # 菜单激活时出现的指示符
    type: {
        layout: columnar            # 菜单类型
        columns: 4                  # 显示选项的列数
        col_width: 20               # 可选值。如果缺少，则使用所有屏幕宽度来计算列宽
        col_padding: 2              # 列之间的填充
        tab_traversal: "vertical"   # 按 <Tab> 循环切换选项的方向："horizontal" 或 "vertical"
    }
    style: {
        text: green                   # 文本样式
        selected_text: green_reverse  # 选中项的文本样式
        description_text: yellow      # 描述的文本样式
        match_text: { attr: u }       # 匹配部分的样式
        selected_match_text: { attr: ur }    } # 选中项匹配部分的样式
}]
```

通过修改这些参数，你可以按照自己的喜好
定制菜单的布局。

### IDE 补全菜单

ide_completion_menu 的工作方式与 completion_menu 大体相同，但具有 IDE 的外观和风格。

```nu
{
  name: ide_completion_menu
  input_mode: cursor_prefix
  marker: "| "
  type: {
    layout: ide
    min_completion_width: 0,
    max_completion_width: 50,
    max_completion_height: 10, # will be limited by the available lines in the terminal
    padding: 0,
    border: true,
    cursor_offset: 0,
    description_mode: "prefer_right"
    min_description_width: 15
    max_description_width: 50
    max_description_height: 10
    description_offset: 1
    # If true, the cursor pos will be corrected, so the suggestions match up with the typed text
    #
    # C:\> str
    #      str join
    #      str trim
    #      str split
    correct_cursor_pos: false
  }
  style: {
    text: green
    selected_text: { attr: r }
    description_text: yellow
    match_text: { attr: u }
    selected_match_text: { attr: ur }
  }
}
```

### 历史菜单

历史菜单是访问编辑器命令历史的便捷方式。当激活该菜单时
（默认为 `Ctrl+r`），命令历史会以时间倒序呈现，
这让选择之前的命令变得非常容易。

历史菜单可以通过修改配置对象中的这些值进行配置：

```nu
$env.config.menus ++= [{
    name: history_menu
    input_mode: diff             # 搜索是在激活菜单后输入的文本上进行的
    marker: "? "                 # 菜单激活时出现的指示符
    type: {
        layout: list             # 菜单类型
        page_size: 10            # 激活菜单时将呈现的条目数
    }
    style: {
        text: green                   # 文本样式
        selected_text: green_reverse  # 选定选项的文本样式
        description_text: yellow      # 描述的文本样式
    }
}]
```

当历史菜单被激活时，它会从历史中取出 `page_size` 条记录
并在菜单中呈现。如果终端还有空间，当你再次按下 `Ctrl+x` 时，
菜单会取出同样数量的记录并把它们追加到当前页。
如果无法呈现所有取出的记录，菜单会创建一个新页面。
可以按 `Ctrl+z` 转到上一页或 `Ctrl+x` 转到下一页
来浏览这些页面。

#### 搜索历史记录

要在历史中搜索，你可以开始输入你要找的命令的关键词。
一旦菜单被激活，你输入的任何内容都会被历史中
选中的命令替换掉。例如，假设你已经输入了
下面这行：

```nu
let a = ()
```

你可以把光标放在 `()` 内并激活菜单。你可以通过输入关键词
来过滤历史记录，一旦你选中某个条目，
输入的词就会被替换掉：

```nu
let a = (ls | where size > 10MiB)
```

#### 菜单快速选择

菜单的另一个不错的特性是可以从中快速选择某项。
假设你已经激活了菜单，它看起来像这样：

```text
>
0: ls | where size > 10MiB
1: ls | where size > 20MiB
2: ls | where size > 30MiB
3: ls | where size > 40MiB
```

除了按向下键选中第四个条目，你还可以输入 `!3`
并按回车。这会把选中的文本插入到提示符所在的位置，
省去你向下滚动菜单的时间。

历史搜索和快速选择可以一起使用。你可以激活菜单，
做一次快速搜索，然后用上面的快速选择
方式进行选择。

### 用户定义菜单

如果你发现默认菜单不够用，需要创建自己的菜单，Nushell 可以
帮助你做到这一点。

为了添加一个满足你需求的新菜单，你可以使用某个默认
布局作为模板。Nushell 中可用的模板有 columnar、list 或
description。

columnar 菜单会以分栏的方式显示数据，并根据列中显示的
文本大小调整列数。

list 类型的菜单始终以列表形式显示建议，让你可以用
`!` 加数字的组合来选择值。

description 类型会给你更多空间来显示某些值的
描述，以及可以插入缓冲区的额外信息。

假设我们想创建一个菜单，显示你在会话期间创建的
所有变量，我们把它命名为 `vars_menu`。这个菜单将使用
a list 布局（`layout: list`）。为了搜索值，我们只想使用菜单激活之后
输入的内容
（`input_mode: diff`）。

考虑到这些，所需的菜单看起来像这样

```nu
$env.config.menus ++= [{
    name: vars_menu
    input_mode: diff
    marker: "# "
    type: {
        layout: list
        page_size: 10
    }
    style: {
        text: green
        selected_text: green_reverse
        description_text: yellow
    }
    source: { |token|
        scope variables
        | where ($it.name | str contains $token.text)
        | sort-by name
        | each { |row| {value: $row.name description: $row.type} }
    }
}]
```

正如你所见，这个新菜单与前面描述的 `history_menu`
完全相同。唯一很大的区别是一个名为 `source` 的新字段。
`source` 字段是一个闭包，它返回你想在菜单中显示的值。
对于这个菜单，我们从 `scope variables` 中提取数据，并
用它来创建用于填充菜单的记录。

记录所需的结构如下

```nu
{
  value: "$foo"                 # The value that will be inserted in the buffer
  description: "int"            # Optional. Description that will be displayed with the selected value
  display_override: "foo (int)" # Optional. Text shown in the menu in place of the value
  style: green                  # Optional. Color of the value in the menu
  span: { start: 5, end: 7 }    # Optional. Byte range of the line that the value replaces
  extra: ["first", "second"]    # Optional. A list of strings that will be displayed with the selected value. Only works with a description menu
}
```

要让菜单显示内容，返回的记录中至少要有 `value` 字段。
source 也可以返回一个纯字符串列表，或
返回 `null` 表示不显示任何内容。它可以返回与
[自定义补全器](custom_completions.md)相同的值，只是 `{completions, options}` 记录中的
`options` 会被忽略。

为了让菜单具有交互性，`source` 闭包接收与
[自定义补全器](custom_completions.md#上下文感知的自定义补全)相同的输入。
它通过命名参数来获取它们：

- `token` - 光标下的 token，形如 `{text, kind, span}`。上面的 `vars_menu`
  根据 `$token.text` 过滤，因此在激活菜单后输入 `foo` 会显示
  `$foo` 和 `$food`。
- `place` - 正在补全的内容。`$place.cursor` 是光标位置，而 `$place.target` 是默认情况下建议替换的
  那部分行内容。
- `buffer` - 光标之前的整行内容，与菜单的 `input_mode` 无关。

::: warning
在 Nushell 0.116 之前，菜单 source 写作 `{|buffer, position| ... }`，并且
在使用 `only_buffer_difference: true` 时，`$buffer` 只包含在菜单激活之后
输入的文本。现在声明 `buffer` 的 source 总是接收光标之前的
整行内容，而声明 `position` 的 source 仍然接收
光标位置，但会打印一条弃用警告。请使用 `$token.text` 获取正在补全的文本，
用 `$place.cursor` 获取光标位置。
:::

利用这些信息，你可以设计自己的菜单来呈现你需要的
信息，并在你需要的位置替换该值。要让菜单为你所用，唯一还需要
做的就是定义一个按键绑定来激活你的全新菜单。例如，用 <kbd>Alt</kbd>+<kbd>O</kbd>
打开它：

```nu
$env.config.keybindings ++= [{
    name: vars_menu
    modifier: alt
    keycode: char_o
    mode: [emacs, vi_normal, vi_insert]
    event: { send: menu name: vars_menu }
}]
```

### 菜单按键绑定

如果你想改变两个菜单的默认激活方式，可以通过定义新的按键绑定来改变它。
例如，下面这两个按键绑定分别把补全菜单和历史菜单
分配给 `Ctrl+t` 和 `Ctrl+y`

```nu
$env.config.keybindings ++= [
    {
        name: completion_menu_ctrl_t_vi
        modifier: control
        keycode: char_t
        mode: [vi_insert vi_normal]
        event: {
            until: [
                { send: menu name: completion_menu }
                { send: menupagenext }
            ]
        }
    }
    {
        name: history_menu_ctrl_y_vi
        modifier: control
        keycode: char_y
        mode: [vi_insert vi_normal]
        event: {
            until: [
                { send: menu name: history_menu }
                { send: menupagenext }
            ]
        }
    }
]
```

## 缩写

Reedline 的缩写是一种便捷的方式，可以把一条命令扩展成另一条
通常更长和/或更复杂的命令。它与
`alias` 类似，但有两个主要区别：（1）存入历史的是扩展后的命令，
（2）扩展后的命令在使用之前还可以编辑。

缩写会在 `space` 或 `enter` 时展开，你可以像这样
把它们添加到配置中

```nu
$env.config.abbreviations = {
    ll: "ls -l"
    gs: "git status"
    ptop: "ps | compact cpu | sort-by cpu -r | first 15"
}
```

你可以用 [`abbr list`](/commands/docs/abbr_list.md) 查看当前生效的缩写：

```nu
abbr list
# => ╭───┬──────┬──────────────────────────────────────────────╮
# => │ # │ name │                  expansion                   │
# => ├───┼──────┼──────────────────────────────────────────────┤
# => │ 0 │ gs   │ git status                                   │
# => │ 1 │ ll   │ ls -l                                        │
# => │ 2 │ ptop │ ps | compact cpu | sort-by cpu -r | first 15 │
# => ╰───┴──────┴──────────────────────────────────────────────╯
```
