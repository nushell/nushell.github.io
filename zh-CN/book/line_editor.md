# Reedline，Nu 的行编辑器

Nushell 的行编辑器 [Reedline](https://github.com/nushell/reedline) 是一个跨平台的行读取器，它被设计为模块化且颇具灵活性的。该行编辑器负责控制命令历史、验证、自动补全、提示、屏幕绘制等。

[[toc]]

## 多行编辑

Reedline 允许 Nushell 命令行跨越多行。这可以通过几种方法实现：

1.  当括号表达式打开时按 <kbd>Enter</kbd>。

    例如：

    ```nu
    def my-command [] {
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

    ::: tip 提示
    这些快捷键中的一个或两个可能会被终端应用程序或窗口管理器拦截。例如，Windows Terminal（以及 Windows 上的大多数其他终端应用程序）将 <kbd>Alt</kbd>+<kbd>Enter</kbd> 分配给将终端扩展到全屏。如果你的终端中这两个快捷键都不起作用，你可以为以下事件分配一个不同的快捷键：

    ```nu
    event: { edit: insertnewline }
    ```

    有关更多详细信息，请参阅下面的[按键绑定](#按键绑定)。

    :::

4.  按 <kbd>Ctrl</kbd>+<kbd>O</kbd> 会在你的编辑器中打开当前的命令行。保存生成的文件并退出编辑器将用结果更新命令行。

## 设置编辑模式

Reedline 允许你使用两种模式来编辑文本：Vi 和 Emacs。如果没有指定，默认的编辑模式是 Emacs。若要自行设置喜欢的模式，你可以使用 `edit_mode` 设置。

```nu
$env.config.edit_mode = 'vi'
```

这可以在命令行中更改，也可以保存在 `config.nu` 中。

::: note 提示
Vi 是一个具有“普通”模式和“插入”模式的“模态”编辑器。我们建议在使用 Nushell 中的 Vi 模式之前，通过使用 Vim 或 Neovim 编辑器来熟悉这些模式。每个编辑器都有一个内置的教程，涵盖了模态编辑的基础知识（及更多）。
:::

## 默认键盘绑定

每种编辑模式都有相应的 Vi 或 Emacs 文本编辑的常用快捷键设置。

### Emacs 和 Vi 插入模式快捷键

这些快捷键事件适用于 Emacs 和 Vi 插入模式：

| 快捷键                                | 事件               |
| ------------------------------------- | ------------------ |
| <kbd>Shift</kbd>+<kbd>Enter</kbd>     | 插入换行符         |
| <kbd>Alt</kbd>+<kbd>Enter</kbd>       | 插入换行符         |
| <kbd>Backspace</kbd>                  | 退格               |
| <kbd>End</kbd>                        | 移至行尾           |
| <kbd>End</kbd>                        | 补全历史提示       |
| <kbd>Home</kbd>                       | 移至行首           |
| <kbd>Ctrl</kbd>+<kbd>C</kbd>          | 取消当前行         |
| <kbd>Ctrl</kbd>+<kbd>L</kbd>          | 清除屏幕           |
| <kbd>Ctrl</kbd>+<kbd>R</kbd>          | 搜索历史           |
| <kbd>Ctrl</kbd>+<kbd>→</kbd> (右箭头) | 补全历史单词       |
| <kbd>Ctrl</kbd>+<kbd>→</kbd> (右箭头) | 右移一个词         |
| <kbd>Ctrl</kbd>+<kbd>←</kbd> (左箭头) | 左移一个词         |
| <kbd>↑</kbd> (上箭头)                 | 上移               |
| <kbd>↓</kbd> (下箭头)                 | 下移               |
| <kbd>←</kbd> (左箭头)                 | 左移               |
| <kbd>→</kbd> (右箭头)                 | 右移               |
| <kbd>Ctrl</kbd>+<kbd>P</kbd>          | 上移               |
| <kbd>Ctrl</kbd>+<kbd>N</kbd>          | 下移               |
| <kbd>Ctrl</kbd>+<kbd>B</kbd>          | 左移               |
| <kbd>Ctrl</kbd>+<kbd>F</kbd>          | 右移               |
| <kbd>→</kbd> (右箭头)                 | 完成历史提示       |
| <kbd>Ctrl</kbd>+<kbd>F</kbd>          | 完成历史提示       |
| <kbd>Alt</kbd>+<kbd>F</kbd>           | 完成历史提示一个词 |
| <kbd>Alt</kbd>+<kbd>←</kbd> (左箭头)  | 减少一个历史提示词 |

### Vi 插入模式快捷键

这些快捷键事件仅适用于 Vi 插入模式：

| 快捷键         | 事件               |
| -------------- | ------------------ |
| <kbd>Esc</kbd> | 切换到 Vi 普通模式 |

### Vi 普通模式快捷键

这些快捷键事件仅适用于 Vi 普通模式：

| 快捷键                                | 事件       |
| ------------------------------------- | ---------- |
| <kbd>Ctrl</kbd>+<kbd>C</kbd>          | 取消当前行 |
| <kbd>Ctrl</kbd>+<kbd>L</kbd>          | 清除屏幕   |
| <kbd>↑</kbd> (上箭头)                 | 上移       |
| <kbd>↓</kbd> (下箭头)                 | 下移       |
| <kbd>←</kbd> (左箭头)                 | 左移       |
| <kbd>→</kbd> (右箭头)                 | 右移       |
| <kbd>Ctrl</kbd>+<kbd>→</kbd> (右箭头) | 右移一个词 |
| <kbd>Ctrl</kbd>+<kbd>←</kbd> (左箭头) | 左移一个词 |

### Vi 普通模式移动

与 Vi 一样，许多移动和操作可以在普通模式下与可选的计数结合使用。例如，<kbd>3</kbd><kbd>d</kbd><kbd>w</kbd> 删除接下来的三个单词。

| 快捷键                                 | 移动                         |
| -------------------------------------- | ---------------------------- |
| <kbd>w</kbd>                           | 移动到下一个单词的开头       |
| <kbd>e</kbd>                           | 移动到当前或下一个单词的结尾 |
| <kbd>b</kbd>                           | 移动到当前或上一个单词的开头 |
| <kbd>0</kbd>                           | 移动到行首                   |
| <kbd>$</kbd>                           | 移动到行尾                   |
| <kbd>h</kbd>                           | 左移                         |
| <kbd>l</kbd>                           | 右移                         |
| <kbd>j</kbd>                           | 下移                         |
| <kbd>k</kbd>                           | 上移                         |
| <kbd>f</kbd>+\<char\>                  | 向右移动到 \<char\>          |
| <kbd>t</kbd>+\<char\>                  | 向右移动到 \<char\> 之前     |
| <kbd>Shift</kbd>+<kbd>F</kbd>+\<char\> | 向左移动到 \<char\>          |
| <kbd>Shift</kbd>+<kbd>T</kbd>+\<char\> | 向左移动到 \<char\> 之后     |

### Vi 普通模式操作

这些操作可以与上面的许多[移动](#vi-普通模式移动)结合使用。

| 快捷键                        | 操作                                 |
| ----------------------------- | ------------------------------------ |
| <kbd>d</kbd>                  | 删除                                 |
| <kbd>Shift</kbd>+<kbd>D</kbd> | 删除到行尾                           |
| <kbd>p</kbd>                  | 在当前字符后粘贴                     |
| <kbd>Shift</kbd>+<kbd>P</kbd> | 在当前字符前粘贴                     |
| <kbd>i</kbd>                  | 在当前字符处进入 Vi 插入模式（追加） |
| <kbd>Shift</kbd>+<kbd>I</kbd> | 在行首进入插入模式                   |
| <kbd>a</kbd>                  | 在当前字符后追加                     |
| <kbd>Shift</kbd>+<kbd>A</kbd> | 追加到行尾                           |
| <kbd>0</kbd>                  | 移动到行首                           |
| <kbd>^</kbd>                  | 移动到行首                           |
| <kbd>$</kbd>                  | 移动到行尾                           |
| <kbd>c</kbd>                  | 修改                                 |
| <kbd>r</kbd>                  | 替换                                 |
| <kbd>s</kbd>                  | 替换字符                             |
| <kbd>x</kbd>                  | 删除字符                             |
| <kbd>u</kbd>                  | 撤销                                 |

## 命令历史

如前所述，Reedline 管理并存储所有被编辑并发送给 Nushell 的命令。要配置 Reedline 可以存储的最大记录数，你需要在配置文件中调整这个值：

```nu
$env.config.history.max_size = 1000
```

## 定制提示

Reedline 提示符是使用多个环境变量配置的。有关详细信息，请参阅[提示符配置](./configuration.md#prompt-configuration)。

## 按键绑定

Reedline 按键绑定是一个强大的结构，它允许你建立一连串的事件，而且这些事件可以通过特定的按键组合来触发。

例如，我们假设你想把补全菜单绑定到 `Ctrl + t` 这组快捷键上（默认是`tab`）。你可以添加下面的条目到你的配置文件：

```nu
$env.config.keybindings ++= [{
    name: completion_menu
    modifier: control
    keycode: char_t
    mode: emacs
    event: { send: menu name: completion_menu }
}]
```

在加载这个新的 `config.nu` 之后，你的新键盘绑定（`Ctrl + t`）将打开命令自动补全。

每个按键绑定都需要以下元素：

- name: 为你的绑定键取一个独特的名字，以便于在`$config.keybindings`中引用
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
- mode: emacs, vi_insert, vi_normal (一个单独的字符串或一个列表，例如： [`vi_insert` `vi_normal`])
- event: 键盘绑定要发送的事件的类型。选项包括：
  - send
  - edit
  - until

::: tip 提示
所有可用的修饰键、键码和事件都可以通过`keybindings list`命令找到。
:::

::: tip 提示
添加到 `vi_insert` 模式中的按键绑定将在行编辑器处于插入模式（可以写入文本）时可用，而标有 `vi_normal` 模式的按键绑定将在正常模式下（当光标使用 h、j、k 或 l 移动时）可用。
:::

键盘绑定条目的事件部分是定义要执行的动作的地方。在这个字段，你可以使用一个记录或一个记录列表。比如这样：

```nu
  ...
  event: { send: Enter }
  ...
```

或者

```nu
  ...
  event: [
    { edit: Clear }
    { send: Enter }
  ]
  ...
```

本页中显示的第一个按键绑定示例遵循第一种情况；一个单一的事件被发送到引擎。

下一个按键绑定的例子是向引擎发送一系列的事件。它首先清除提示，插入一个字符串，然后输入该值：

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

上面按键绑定的缺点是，插入的文本将被验证处理并保存在历史记录中，这使得按键绑定的执行速度有点慢，而且会用相同的命令来填充命令历史。出于这个原因，可以采用 `executehostcommand` 类型的事件。下一个例子以更简单的方式做了与前一个相同的事情，发送了一个单一的事件给引擎：

```nu
$env.config.keybindings ++= [{
    name: change_dir_with_fzf
    modifier: CONTROL
    keycode: Char_y
    mode: emacs
    event: {
        send: executehostcommand,
        cmd: "cd (ls | where type == dir | each { |row| $row.name} | str join (char nl) | fzf | decode utf-8 | str trim)"
    }
}]
```

在我们继续之前，你一定已经注意到，编辑和发送的语法发生了变化，因此有必要对它们进行更多的解释。 `send` 是所有可以被引擎处理的 `Reedline` 事件，而 `edit` 是所有可以被引擎处理的 `EditCommands`。

### `send`类型

要找到 `send` 的所有可用选项，你可以使用：

```nu
keybindings list | where type == events
```

而 `send` 事件的语法如下：

```nu
    ...
      event: { send: <NAME OF EVENT FROM LIST> }
    ...
```

::: tip 提示
你可以用大写字母来命名事件的名称，键盘绑定解析器是不区分大小写的。
:::

这条规则有两个例外：`Menu`和`ExecuteHostCommand`。这两个事件需要一个额外的字段来完成，`Menu` 需要有一个菜单的名称才能触发（自动补全菜单或历史命令菜单）：

```nu
    ...
      event: {
        send: menu
        name: completion_menu
      }
    ...
```

而 `ExecuteHostCommand` 需要一个有效的命令，它将被发送到引擎：

```nu
    ...
      event: {
        send: executehostcommand
        cmd: "cd ~"
      }
    ...
```

值得一提的是，在事件列表中，你还会看到`Edit([])`，`Multiple([])`和`UntilFound([])`。这些选项对解析器是不可见的，因为它们是基于键盘绑定的定义来构建的。例如，当你在键盘绑定事件里面定义了一个记录列表时，就会为你建立一个`Multiple([])`事件。`Edit([])`事件与前面提到的`edit`类型相同。`UntilFound([])`事件和前面提到的`until`类型一样。

### `edit`类型

`edit`类型是`Edit([])`事件的简化。`event`类型简化了定义复杂编辑事件的按键绑定。要列出可用的选项，你可以使用下面的命令：

```nu
keybindings list | where type == edits
```

以下是编辑的常用语法：

```nu
    ...
      event: { edit: <NAME OF EDIT FROM LIST> }
    ...
```

列表中带有 `()` 的编辑的语法有一点变化，因为这些编辑需要一个额外的值来进行完全定义。例如，如果我们想在提示符所在的位置插入一个字符串，那么你将不得不使用如下方式：

```nu
    ...
      event: {
        edit: insertstring
        value: "MY NEW STRING"
      }
    ...
```

或者说你想向右移动，直到第一个`S`：

```nu
    ...
      event: {
        edit: moverightuntil
        value: "S"
      }
    ...
```

正如你所看到的，这两种类型将允许你构建你需要的任何类型的按键绑定。

### `until`类型

为了完成这个按键绑定之旅，我们需要讨论事件的`until`类型。正如你到目前为止所看到的，你可以发送一个单一的事件或一个事件列表。而当一个事件列表被发送时，每一个事件都会被处理。

然而，在有些情况下，你可能想把不同的事件分配给同一个键盘绑定。这在 Nushell 菜单中特别有用。例如，假设你仍然想用`Ctrl + t`激活你的补全菜单，但你也想在菜单被激活后用同一个快捷键移动到下一个元素。

对于这些情况，我们有`until`关键字。在`until`事件中列出的事件将被逐一处理，不同的是，一旦一个事件被成功处理，事件处理就会停止。

下一个键盘绑定就是这种情况：

```nu
$env.config.keybindings ++= [{
    name: completion_menu
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

上面的按键绑定将首先尝试打开一个补全菜单。如果菜单没有激活，它将激活它并发送一个成功信号。如果再次按下按键绑定，因为已经有一个激活的菜单，那么它将发送的下一个事件是`MenuNext`，这意味着它将把选择器移动到菜单的下一个元素。

正如你所看到的，`until`关键字允许我们为同一个键盘绑定定义两个事件。在写这篇文章的时候，只有菜单事件允许这种类型的分层。其他非菜单事件类型将总是返回一个成功值，这意味着`until`事件在到达第一个命令时就会停止。

例如，下一个按键绑定将总是发送一个`down`，因为该事件总是成功的。

```nu
$env.config.keybindings ++= [{
    name: completion_menu
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

### 移除一个默认的按键绑定

如果你想删除某个默认的按键绑定，而不打算使用不同的动作来替代它，你可以设置`event: null`。

例如，在所有的编辑模式下，禁用 `Ctrl + l` 清除屏幕：

```nu
$env.config.keybindings ++= [{
    modifier: control
    keycode: char_l
    mode: [emacs, vi_normal, vi_insert]
    event: null
}]
```

### 排查键盘绑定问题

你的终端环境可能并不总是以你期望的方式将你的组合键冒泡到 Nushell 上。
你可以使用`keybindings listen`命令来确定 Nushell 是否真的收到了某些按键，以及如何收到的。

## 菜单

感谢 Reedline，Nushell 的菜单可以帮助你完成日常的 Shell 脚本操作。接下来我们介绍一下在使用 Nushell 时一直可用的默认菜单。

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

::: note 提示
菜单方向行为因菜单类型而异（见下文）。例如，在 `description` 菜单中，“上”和“下”适用于“额外”列表，但在 `list` 菜单中，方向适用于选择。
:::

### 帮助菜单

帮助菜单的存在是为了方便你过渡到 Nushell。假设你正在组建一个惊人的管道，然后你忘记了反转一个字符串的内部命令。你可以用`F1`来激活帮助菜单，而不是删除你的管道。一旦激活，只需输入你要找的命令的关键词，菜单就会显示与你的输入相匹配的命令，而匹配的依据就是命令的名称或描述。

要浏览菜单，你可以用`tab`选择下一个元素，你可以按左键或右键滚动描述，你甚至可以在行中粘贴可用的命令例子。

帮助菜单可以通过修改以下参数进行配置：

```nu
$env.config.menus ++= [{
    name: help_menu
    only_buffer_difference: true # 搜索是在激活菜单后输入的文本上进行的
    marker: "? "                 # 菜单激活时出现的指示符
    type: {
        layout: description      # 菜单类型
        columns: 4               # 显示选项的列数
        col_width: 20            # 可选值。如果缺少，则使用所有屏幕宽度来计算列宽
        col_padding: 2           # 列之间的填充
        selection_rows: 4        # 允许显示找到的选项的行数
        description_rows: 10     # 允许显示命令描述的行数
    }
    style: {
        text: green                   # 文本样式
        selected_text: green_reverse  # 选定选项的文本样式
        description_text: yellow      # 描述的文本样式
    }
}]
```

### 补全菜单

补全菜单是一个上下文敏感的菜单，它将根据提示的状态给出建议。这些建议的范围包括从路径建议到替代命令。在编写命令时，你可以激活该菜单以查看内部命令的可用选项。另外，如果你已经为外部命令定义了你的自定义补全方式，这些补全提示也会出现在菜单中。

默认情况下，补全菜单是通过按`tab`访问的，它可以通过修改配置对象中的这些值来进行配置：

```nu
$env.config.menus ++= [{
    name: completion_menu
    only_buffer_difference: false # 搜索是在激活菜单后输入的文本上进行的
    marker: "| "                  # 菜单激活时出现的指示符
    type: {
        layout: columnar          # 菜单类型
        columns: 4                # 显示选项的列数
        col_width: 20             # 可选值。如果缺少，则使用所有屏幕宽度来计算列宽
        col_padding: 2            # 列之间的填充
    }
    style: {
        text: green                   # 文本样式
        selected_text: green_reverse  # 选定选项的文本样式
        description_text: yellow      # 描述的文本样式
    }
}]
```

通过修改这些参数，你可以根据自己的喜好定制你的菜单布局。

### 历史菜单

历史菜单是访问编辑器命令历史的一个便捷方法。当激活菜单时(默认为`Ctrl+r`)，命令的历史会以时间倒序显示，这使得选择前一个命令变得非常容易。

历史菜单可以通过修改配置对象中的这些值进行配置：

```nu
$env.config.menus ++= [{
    name: history_menu
    only_buffer_difference: true # 搜索是在激活菜单后输入的文本上进行的
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

当历史菜单被激活时，它从历史中拉出`page_size`个记录并在菜单中呈现。如果终端还有空间，当你再次按`Ctrl+x`时，菜单将拉出相同数量的记录，并将它们追加到当前页。如果不可能呈现所有拉出的记录，菜单将创建一个新的页面。可以通过按`Ctrl+z`转到上一页或`Ctrl+x`转到下一页来浏览这些页面。

#### 搜索历史记录

要在你的命令历史中搜索，你可以开始输入你要找的命令的关键词。一旦菜单被激活，你输入的任何内容都会被历史记录中选定的命令所取代。例如，假设你已经输入了以下内容：

```nu
let a = ()
```

你可以把光标放在 `()` 内并激活菜单，你可以通过输入关键词来过滤历史记录，一旦你选择了一个条目，输入的词就会被替换：

```nu
let a = (ls | where size > 10MiB)
```

#### 菜单快速选择

菜单的另一个很好的特性是能够快速选择其中的内容。假设你已经激活了你的菜单，它看起来像这样：

```nu
>
0: ls | where size > 10MiB
1: ls | where size > 20MiB
2: ls | where size > 30MiB
3: ls | where size > 40MiB
```

你可以输入`!3`，然后按回车，而不是按向下键去选择第四个条目。这将在提示位置插入选定的文本，节省你向下滚动菜单的时间。

历史搜索和快速选择可以一起使用。你可以激活菜单，进行快速搜索，然后使用前面的方法进行快速选择。

### 用户定义菜单

如果你发现默认的菜单对你来说是不够的，你需要要创建自己的菜单，Nushell 也可以帮你做到这点。

为了添加一个满足你需求的新菜单，你可以使用其中一个默认的布局作为模板。Nushell 中可用的模板有列式(`columnar`)、列表式(`list`)或描述式(`description`)。

列式菜单将以列的方式向你显示数据，并根据你的列中显示的文本大小调整列数。

列表类型的菜单将总是以列表的形式显示建议，你可以通过使用`!`加数字的组合来选择值。

描述类型将给你更多的空间来显示一些值的描述，以及可以插入到缓冲区的额外信息。

假设我们想创建一个菜单，用于显示在你的会话中创建的所有变量，我们将把它称为`vars_menu`。这个菜单将使用一个列表布局 (layout: list)。为了搜索值，我们希望只使用菜单激活后输入的东西(only_buffer_difference: true)。

满足这些所需的菜单将看起来像这样：

```nu
$env.config.menus ++= [{
    name: vars_menu
    only_buffer_difference: true
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
    source: { |buffer, position|
        scope variables
        | where name =~ $buffer
        | sort-by name
        | each { |row| {value: $row.name description: $row.type} }
    }
}]
```

正如你所看到的，新的菜单与之前描述的`history_menu`是相同的，唯一的区别是新的字段叫`source`。`source`字段是 Nushell 所定义的，它包含了你想在菜单中显示的值。对于这个菜单，我们从`scope variables`中提取数据，然后用它来创建记录并填充菜单。

记录所需的结构如下：

```nu
{
  value:       # 将插入缓冲区的值
  description: # 可选。将与所选值一起显示的描述
  span: {      # 可选。指示将被值替换的字符串部分的范围
    start:
    end:
  }
  extra: [string] # 可选。将与所选值一起显示的字符串列表。仅适用于描述菜单
}
```

为了让菜单显示一些东西，至少`value`字段必须存在于结果记录中。

为了使菜单具有交互性，这两个变量在块中可用：`$buffer`和`$position`。`$buffer`包含菜单捕获的值，当选项`only_buffer_difference`为真时，`$buffer`是菜单被激活后输入的文本。如果`only_buffer_difference`是假的，`$buffer`是行中所有的字符串。`$position`变量可以用来根据你对菜单的设想创建替换范围。`$position`的值会随着`only_buffer_difference`是真还是假而改变。当为真时，`$position`是在菜单激活后插入文本的字符串的起始位置；当值为 false 时，`$position`表示实际的光标位置。

利用这些信息，你可以设计你的菜单来呈现你所需要的信息，并在需要的位置替换该值。之后，玩转你的菜单唯一额外需要做的事情是定义一个按键绑定，并用于激活你的全新菜单。

### 菜单按键绑定

如果你想改变两个菜单的默认激活方式，可以通过定义新的按键绑定来实现。例如，接下来的两个按键绑定设置分别将`Ctrl+t`和`Ctrl+y`定义为触发自动补全和历史菜单：

```nu
$env.config.keybindings ++= [
    {
        name: completion_menu
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
        name: history_menu
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
