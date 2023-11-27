# Reedline，Nu 的行编辑器

Nushell 的行编辑器 [Reedline](https://github.com/nushell/reedline) 是一个跨平台的行读取器，它被设计为模块化且颇具灵活性的。该引擎的作用是负责控制命令历史，验证，自动补全，提示以及屏幕绘制。

## 配置

### 编辑模式

Reedline 允许你使用两种模式来编辑文本：vi 和 emacs。如果没有指定，默认的编辑模式是 emacs 模式。若要自行设置喜欢的模式，你可以修改配置文件为相应模式。比如：

```nu
  $env.config = {
    ...
    edit_mode: emacs
    ...
  }
```

#### 默认键盘绑定

每种编辑模式都有相应的 vi 或 emacs 文本编辑的常用快捷键设置。

Emacs 和 Vi 快捷键绑定

| 快捷键      | 事件                  |
| ----------- | --------------------- |
| Esc         | Esc                   |
| Backspace   | 退格                  |
| End         | 移至行尾              |
| End         | 补全历史提示          |
| Home        | 移至行首              |
| Ctr + c     | 取消当前行            |
| Ctr + l     | 清除屏幕              |
| Ctr + r     | 搜索历史              |
| Ctr + Right | Complete history word |
| Ctr + Right | 右移一个词            |
| Ctr + Left  | 左移一个词            |
| Up          | 菜单上移              |
| Up          | 上移                  |
| Down        | 菜单下移              |
| Down        | 下移                  |
| Left        | 菜单左移              |
| Left        | 左移                  |
| Right       | 完成历史提示          |
| Right       | 菜单右移              |
| Right       | 右移                  |
| Ctr + b     | 菜单左移              |
| Ctr + b     | 左移                  |
| Ctr + f     | 完成历史提示          |
| Ctr + f     | 菜单右移              |
| Ctr + f     | 右移                  |
| Ctr + p     | 菜单上移              |
| Ctr + p     | 上移                  |
| Ctr + n     | 菜单下移              |
| Ctr + n     | 下移                  |

Vi 普通键绑定

| 快捷键  | 事件       |
| ------- | ---------- |
| Ctr + c | 取消当前行 |
| Ctr + l | 清除屏幕   |
| Up      | 菜单上移   |
| Up      | 上移       |
| Down    | 菜单下移   |
| Down    | 下移       |
| Left    | 菜单左移   |
| Left    | 左移       |
| Right   | 菜单右移   |
| Right   | 右移       |

除了之前的键盘绑定，在正常 Vi 模式下，你可以使用经典的 Vi 快捷键来进行移动或者执行相应的动作。可用的组合的选项是：

Vi 正常移动快捷键

| 快捷键 | 移动                 |
| ------ | -------------------- |
| w      | 前移一个单词         |
| d      | 移动到行尾           |
| 0      | 移动到行首           |
| $      | 移动到行尾           |
| f      | 行内向右查找字符     |
| t      | 行内右移到指定字符前 |
| F      | 行内向左查找字符     |
| T      | 行内左移到指定字符前 |

Vi 正常操作快捷键

| 快捷键 | 操作               |
| ------ | ------------------ |
| d      | 删除               |
| p      | 在光标之后粘贴     |
| P      | 在光标之前粘贴     |
| h      | 左移               |
| l      | 右移               |
| j      | 下移               |
| k      | 上移               |
| w      | 右移一个单词       |
| b      | 左移一个单词       |
| i      | 在光标前插入       |
| a      | 在光标后插入       |
| 0      | 移到行首           |
| ^      | 移到行首           |
| $      | 移到行尾           |
| u      | 撤销               |
| c      | 修改               |
| x      | 删除字符           |
| s      | 搜索历史           |
| D      | 删除当前位置到行尾 |
| A      | 在当前行最后插入   |

### 命令历史

如前所述，Reedline 管理并存储所有被编辑并发送给 Nushell 的命令。要配置 Reedline 可以存储的最大记录数，你需要在配置文件中调整这个值：

```nu
  $env.config = {
    ...
    max_history_size: 1000
    ...
  }
```

### 定制你的提示

Reedline 的提示语也是高度可定制的。为了构建你的完美提示符，你可以在配置文件中定义下面的环境变量：

```nu
# Use nushell functions to define your right and left prompt
def create_left_prompt [] {
    let path_segment = ($env.PWD)

    $path_segment
}

def create_right_prompt [] {
    let time_segment = ([
        (date now | format date '%m/%d/%Y %r')
    ] | str join)

    $time_segment
}

$env.PROMPT_COMMAND = { create_left_prompt }
$env.PROMPT_COMMAND_RIGHT = { create_right_prompt }
```

::: tip
你并非必须要用 Nushell 的函数来定义环境变量，也可以使用简单的字符串来定义它们。
:::

你也可以通过修改以下环境变量来定制行编辑器的提示符：

```nu
$env.PROMPT_INDICATOR = "〉"
$env.PROMPT_INDICATOR_VI_INSERT = ": "
$env.PROMPT_INDICATOR_VI_NORMAL = "〉"
$env.PROMPT_MULTILINE_INDICATOR = "::: "
```

::: tip
提示符是环境变量，它代表了提示的状态
:::

## 按键绑定

Reedline 按键绑定是一个强大的结构，它允许你建立一连串的事件，而且这些事件可以通过特定的按键组合来触发。

例如，我们假设你想把补全菜单绑定到 `Ctrl + t` 这组快捷键上（默认是`tab`）。你可以添加下面的条目到你的配置文件：

```nu
  $env.config = {
    ...

    keybindings: [
      {
        name: completion_menu
        modifier: control
        keycode: char_t
        mode: emacs
        event: { send: menu name: completion_menu }
      }
    ]

    ...
  }
```

在加载这个新的 `config.nu` 之后，你的新键盘绑定（`Ctrl + t`）将打开命令自动补全。

每个按键绑定都需要以下元素：

- name: 为你的绑定键取一个独特的名字，以便于在`$config.keybindings`中引用
- modifier: 绑定键的修饰符。选项有：
  - none
  - control
  - alt
  - shift
  - control | alt
  - control | alt | shift
- keycode: 这代表要按下的键
- mode: emacs, vi_insert, vi_normal (一个单独的字符串或一个列表，例如： [`vi_insert` `vi_normal`])
- event: 键盘绑定要发送的事件的类型。选项包括：
  - send
  - edit
  - until

::: tip
所有可用的修饰键、键码和事件都可以通过`keybindings list`命令找到。
:::

::: tip
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

上述第一个按键绑定例子遵循第一种情况，只有一个事件被发送到引擎。

后一个按键绑定的例子是向引擎发送一系列的事件。它首先清除提示，插入一个字符串，然后输入该值。

```nu
  $env.config = {
    ...

    keybindings: [
    {
      name: change_dir_with_fzf
      modifier: CONTROL
      keycode: Char_t
      mode: emacs
      event:[
          { edit: Clear }
          { edit: InsertString,
            value: "cd (ls | where type == dir | each { |it| $it.name} | str join (char nl) | fzf | decode utf-8 | str trim)"

          }
          { send: Enter }
        ]
    }

    ...
  }
```

上面按键绑定的缺点是，插入的文本将被验证处理并保存在历史记录中，这使得按键绑定的执行速度有点慢，而且会用相同的命令来填充命令历史。出于这个原因，可以采用 `ExecuteHostCommand` 类型的事件。下一个例子以更简单的方式做了与前一个相同的事情，发送了一个单一的事件给引擎：

```nu
  $env.config = {
    ...

    keybindings: [
    {
      name: change_dir_with_fzf
      modifier: CONTROL
      keycode: Char_y
      mode: emacs
      event: {
        send: ExecuteHostCommand,
        cmd: "cd (ls | where type == dir | each { |it| $it.name} | str join (char nl) | fzf | decode utf-8 | str trim)"
      }
    }
  ]

    ...
  }
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

::: tip
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
        send: ExecuteHostCommand
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
        edit: InsertString
        value: "MY NEW STRING"
      }
    ...
```

或者说你想向右移动，直到第一个`S`：

```nu
    ...
      event: {
        edit: MoveRightUntil
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
  $env.config = {
    ...

    keybindings: [
      {
        name: completion_menu
        modifier: control
        keycode: char_t
        mode: emacs
        event: {
          until: [
            { send: menu name: completion_menu }
            { send: MenuNext }
          ]
        }
      }
    ]

    ...
  }
```

上面的按键绑定将首先尝试打开一个补全菜单。如果菜单没有激活，它将激活它并发送一个成功信号。如果再次按下按键绑定，因为已经有一个激活的菜单，那么它将发送的下一个事件是`MenuNext`，这意味着它将把选择器移动到菜单的下一个元素。

正如你所看到的，`until`关键字允许我们为同一个键盘绑定定义两个事件。在写这篇文章的时候，只有菜单事件允许这种类型的分层。其他非菜单事件类型将总是返回一个成功值，这意味着`until`事件在到达第一个命令时就会停止。

例如，下一个按键绑定将总是发送一个`down`，因为该事件总是成功的。

```nu
  $env.config = {
    ...

    keybindings: [
      {
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
      }
    ]

    ...
  }
```

### 移除一个默认的按键绑定

如果你想删除某个默认的按键绑定，而不打算使用不同的动作来替代它，你可以设置`event: null`。

例如，在所有的编辑模式下，禁用 `Ctrl + l` 清除屏幕：

```nu
  $env.config = {
    ...

    keybindings: [
      {
        modifier: control
        keycode: char_l
        mode: [emacs, vi_normal, vi_insert]
        event: null
      }
    ]

    ...
  }

```

### 排查键盘绑定问题

你的终端环境可能并不总是以你期望的方式将你的组合键冒泡到 Nushell 上。
你可以使用`keybindings listen`命令来确定 Nushell 是否真的收到了某些按键，以及如何收到的。

## 菜单

感谢 Reedline，Nushell 的菜单可以帮助你完成日常的 Shell 脚本操作。接下来我们介绍一下在使用 Nushell 时一直可用的默认菜单。

### 帮助菜单

帮助菜单的存在是为了方便你过渡到 Nushell。假设你正在组建一个惊人的管道，然后你忘记了反转一个字符串的内部命令。你可以用`ctr+q`来激活帮助菜单，而不是删除你的管道。一旦激活，只需输入你要找的命令的关键词，菜单就会显示与你的输入相匹配的命令，而匹配的依据就是命令的名称或描述。

要浏览菜单，你可以用`tab`选择下一个元素，你可以按左键或右键滚动描述，你甚至可以在行中粘贴可用的命令例子。

帮助菜单可以通过修改以下参数进行配置：

```nu
  $env.config = {
    ...

    menus = [
      ...
      {
        name: help_menu
        only_buffer_difference: true # Search is done on the text written after activating the menu
        marker: "? "                 # Indicator that appears with the menu is active
        type: {
            layout: description      # Type of menu
            columns: 4               # Number of columns where the options are displayed
            col_width: 20            # Optional value. If missing all the screen width is used to calculate column width
            col_padding: 2           # Padding between columns
            selection_rows: 4        # Number of rows allowed to display found options
            description_rows: 10     # Number of rows allowed to display command description
        }
        style: {
            text: green                   # Text style
            selected_text: green_reverse  # Text style for selected option
            description_text: yellow      # Text style for description
        }
      }
      ...
    ]
    ...
```

### 补全菜单

补全菜单是一个上下文敏感的菜单，它将根据提示的状态给出建议。这些建议的范围包括从路径建议到替代命令。在编写命令时，你可以激活该菜单以查看内部命令的可用选项。另外，如果你已经为外部命令定义了你的自定义补全方式，这些补全提示也会出现在菜单中。

默认情况下，补全菜单是通过按`tab`访问的，它可以通过修改配置对象中的这些值来进行配置：

```nu
  $env.config = {
    ...

    menus = [
      ...
      {
        name: completion_menu
        only_buffer_difference: false # Search is done on the text written after activating the menu
        marker: "| "                  # Indicator that appears with the menu is active
        type: {
            layout: columnar          # Type of menu
            columns: 4                # Number of columns where the options are displayed
            col_width: 20             # Optional value. If missing all the screen width is used to calculate column width
            col_padding: 2            # Padding between columns
        }
        style: {
            text: green                   # Text style
            selected_text: green_reverse  # Text style for selected option
            description_text: yellow      # Text style for description
        }
      }
      ...
    ]
    ...
```

通过修改这些参数，你可以根据自己的喜好定制你的菜单布局。

### 历史菜单

历史菜单是访问编辑器命令历史的一个便捷方法。当激活菜单时(默认为`Ctrl+x`)，命令的历史会以时间倒序显示，这使得选择前一个命令变得非常容易。

历史菜单可以通过修改配置对象中的这些值进行配置：

```nu
  $env.config = {
    ...

    menus = [
      ...
      {
        name: help_menu
        only_buffer_difference: true # Search is done on the text written after activating the menu
        marker: "? "                 # Indicator that appears with the menu is active
        type: {
            layout: list             # Type of menu
            page_size: 10            # Number of entries that will presented when activating the menu
        }
        style: {
            text: green                   # Text style
            selected_text: green_reverse  # Text style for selected option
            description_text: yellow      # Text style for description
        }
      }
      ...
    ]
    ...
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

为了添加一个满足你需求的新菜单，你可以使用其中一个默认的布局作为模板。Nushell 中可用的模板有列式、列表式或描述式。

列式菜单将以列的方式向你显示数据，并根据你的列中显示的文本大小调整列数。

列表类型的菜单将总是以列表的形式显示建议，你可以通过使用`!`加数字的组合来选择值。

描述类型将给你更多的空间来显示一些值的描述，以及可以插入到缓冲区的额外信息。

假设我们想创建一个菜单，用于显示在你的会话中创建的所有变量，我们将把它称为`vars_menu`。这个菜单将使用一个列表布局 (layout: list)。为了搜索值，我们希望只使用菜单激活后输入的东西(only_buffer_difference: true)。

满足这些所需的菜单将看起来像这样：

```nu
  $env.config = {
    ...

    menus = [
      ...
      {
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
            $nu.scope.vars
            | where name =~ $buffer
            | sort-by name
            | each { |it| {value: $it.name description: $it.type} }
        }
      }
      ...
    ]
    ...
```

正如你所看到的，新的菜单与之前描述的`history_menu`是相同的，唯一的区别是新的字段叫`source`。`source`字段是 Nushell 所定义的，它包含了你想在菜单中显示的值。对于这个菜单，我们从`$nu.scope.vars`中提取数据，然后用它来创建记录并填充菜单。

记录所需的结构如下：

```nu
{
  value:       # The value that will be inserted in the buffer
  description: # Optional. Description that will be display with the selected value
  span: {      # Optional. Span indicating what section of the string will be replaced by the value
    start:
    end:
  }
  extra: [string] # Optional. A list of strings that will be displayed with the selected value. Only works with a description menu
}
```

为了让菜单显示一些东西，至少`value`字段必须存在于结果记录中。

为了使菜单具有交互性，这两个变量在块中可用：`$buffer`和`$position`。`$buffer`包含菜单捕获的值，当选项`only_buffer_difference`为真时，`$buffer`是菜单被激活后输入的文本。如果`only_buffer_difference`是假的，`$buffer`是行中所有的字符串。`$position`变量可以用来根据你对菜单的设想创建替换范围。`$position`的值会随着`only_buffer_difference`是真还是假而改变。当为真时，`$position`是在菜单激活后插入文本的字符串的起始位置；当值为 false 时，`$position`表示实际的光标位置。

利用这些信息，你可以设计你的菜单来呈现你所需要的信息，并在需要的位置替换该值。之后，玩转你的菜单唯一额外需要做的事情是定义一个按键绑定，并用于激活你的全新菜单。

### 菜单按键绑定

如果你想改变两个菜单的默认激活方式，可以通过定义新的按键绑定来实现。例如，接下来的两个按键绑定设置分别将`Ctrl+t`和`Ctrl+y`定义为触发自动补全和历史菜单：

```nu
  $env.config = {
    ...

    keybindings: [
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

    ...
  }
```
