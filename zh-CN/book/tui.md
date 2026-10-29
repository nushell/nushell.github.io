# 使用 `tui` 构建终端用户界面

`tui` 命令族允许你直接从 Nushell 管道构建交互式终端用户界面（TUI）和弹出式对话框，而无需编写任何 Rust 代码。你可以组合各种部件（如表格、树形视图、搜索框、预览窗格、菜单、文本输入框和按钮），然后将结果传递给 [`tui run`](/commands/docs/tui_run.md)。当用户退出或做出选择时，`tui run` 会返回一条记录，描述用户选择的内容以及每个部件的状态。

```nu
ls | tui label --titlebar "files" | tui table | tui run
```

仅需上面这一行命令，即可打开一个全屏、可滚动的文件列表。使用方向键（或 `j`/`k`）移动光标，按 `Enter` 返回高亮选中的行，或者按 `q` 或 `Esc` 不做任何选择直接退出。

::: tip `tui` 还是 `explore`？
[`explore`](explore.md) 是一个开箱即用的分页器，用于浏览任意结构化值。而 `tui` 则是一套用于构建专属界面的工具包：文件选择器、确认对话框、历史搜索器、仪表盘或小型表单。两者使用相同的颜色转换规则，因此 Nushell 的样式在两个命令中看起来一致。
:::

`tui run` 始终在终端的备用屏幕（alternate screen）上绘制，因此在 TUI 关闭后，你的 shell 和回滚缓冲区都会完好无损地恢复。[`tui debug`](/commands/docs/tui_debug.md) 会将相同的界面渲染为字符串而非终端画面，这在脚本和自动化测试中非常有用，本页面展示输出的所有示例均基于该命令。

## 命令速览

除了 `tui run` 和 `tui debug` 之外，每个 `tui` 命令都是一个*构建器（builder）*：它向 `tui` 值中添加一个部件，并返回更新后的值。

| 命令                                             | 位置参数            | 重要选项                                                              | 功能说明                                             |
| ------------------------------------------------ | ------------------- | --------------------------------------------------------------------- | ---------------------------------------------------- |
| [`tui label`](/commands/docs/tui_label.md)       | 文本或闭包          | `--titlebar`, `--status`                                              | 静态文本、标题栏或状态栏。闭包可跟随选中行动态求值。 |
| [`tui table`](/commands/docs/tui_table.md)       | 数据源闭包          | `--columns`, `--multi`, `--index`, `--capture-keys`, `--on-select`    | 可导航的表格。标量数据显示为单列 `item`。            |
| [`tui tree`](/commands/docs/tui_tree.md)         | 数据源闭包          | `--walk`, `--column`, `--multi`, `--on-select`                        | 嵌套记录与列表，或目录树遍历。                       |
| [`tui select`](/commands/docs/tui_select.md)     | 元素列表            | `--display`, `--multi`, `--index`, `--on-select`                      | 单选列表，配合 `--multi` 则为复选框列表。            |
| [`tui log`](/commands/docs/tui_log.md)           | 数据源闭包          | `--max-lines`                                                         | 仅追加的日志视图，始终跟随数据流末尾。               |
| [`tui progress`](/commands/docs/tui_progress.md) | 数据源闭包          | `--value`, `--total`, `--label`                                       | 进度条。                                             |
| [`tui preview`](/commands/docs/tui_preview.md)   | 闭包                | `--from`, `--max-bytes`                                               | 显示高亮行的文本：文件内容或由闭包返回的任意内容。   |
| [`tui search`](/commands/docs/tui_search.md)     |                     | `--bind`, `--placeholder`, `--fuzzy`, `--case-sensitive`, `--columns` | 搜索框，可在输入时动态过滤其作用域内的列表。         |
| [`tui textbox`](/commands/docs/tui_textbox.md)   |                     | `--placeholder`, `--value`                                            | 可编辑的文本输入框。                                 |
| [`tui button`](/commands/docs/tui_button.md)     | 标签（label），hook |                                                                       | 激活时运行 hook 或提交其标签。                       |
| [`tui menu`](/commands/docs/tui_menu.md)         | 菜单项列表          |                                                                       | 带有助记快捷键、下拉列表和操作行为的菜单栏。         |
| [`tui split`](/commands/docs/tui_split.md)       | 子部件列表          | `--vertical`, `--sizes`, `--ratio`                                    | 并排（或纵向堆叠）的窗格，带有可拖动的手柄。         |
| [`tui box`](/commands/docs/tui_box.md)           | 标题，子部件        |                                                                       | 带边框和标题的部件分组。                             |
| [`tui tab`](/commands/docs/tui_tab.md)           | 标题，子部件        |                                                                       | 标签页中的一个页面。                                 |
| [`tui bind`](/commands/docs/tui_bind.md)         | 按键，hook          |                                                                       | 在任意位置按下指定按键时触发运行 hook。              |
| [`tui run`](/commands/docs/tui_run.md)           | hook                | `--dialog`, `--size`, `--refresh`, `--no-mouse`                       | 持续运行界面，直至用户提交选择或退出。               |
| [`tui debug`](/commands/docs/tui_debug.md)       | hook                | `--keys`, `--until`, `--size`, `--dialog`                             | 无需终端直接渲染，并报告布局、焦点顺序和页面。       |

此外，所有构建器均支持 `--id`（为部件指定固定的标识符）和 `--focus`（启动时默认聚焦该部件）。数据部件（`label`、`table`、`tree`、`select`、`log` 和 `progress`）还接受 `--data` 和 `--from` 选项，详见[部件的数据来源](#部件的数据来源)。绘制带标题边框的部件（`table`、`tree`、`select`、`log`、`preview`、`search` 和 `textbox`）接受 `--title` 和 `--border`，详见[边框标题](#边框标题)和[边框线型](#边框线型)。`tui box` 和 `tui menu` 同样支持 `--border`。

## 创建你的第一个 TUI

### 检查 `tui` 值

因为构建器仅描述界面，所以在运行之前，你可以查看构建出来的结构：

```nu
tui label --titlebar "App" | tui table | describe
# => tui

tui label --titlebar "App" | tui table | get widgets.type
# => ╭───┬───────╮
# => │ 0 │ label │
# => │ 1 │ table │
# => ╰───┴───────╯
```

每个部件记录都包含 `id`、`type`，对于容器还包含 `children`。其他字段则取决于部件的种类。例如，标签的 `slot` 可以是 `titlebar`（标题栏）、`status`（状态栏）或 `content`（内联文本）；使用 `--title` 或 `--border` 构建的部件则具有 `title` 或 `border` 字段。

### 无终端渲染

`tui debug` 返回一条记录，其 `screen` 字段保存了绘制出的纯文本界面：

```nu
tui label --titlebar "hello" | tui label --status "ready" | tui debug --size [40 6] | get screen
# =>  hello
# =>
# =>
# =>
# =>
# =>  ready  tab:focus  [:page  q:quit
```

状态栏会自动追加可用快捷键的简要提示。默认画布尺寸为 80×24；可通过 `--size [width height]` 进行修改。

### 获取选择结果

将数据行管道传输给 [`tui table`](/commands/docs/tui_table.md) 并运行，按 `Enter` 即可提交当前高亮的行：

```nu
let picked = ls | tui table --columns [name type size] | tui run
if $picked.action == "submit" {
    $picked.selected
}
```

`tui debug --keys` 可以重放按键序列，方便你在脚本或测试中验证交互行为：

```nu
[{name: a}, {name: b}] | tui table | tui debug --keys [down enter] | get selected.name
# => b
```

如果不传递 `--columns`，表格会展示输入数据的所有列。标量列表或范围（range）则展示为单列 `item`：

```nu
1..20 | tui table | tui run
```

## 布局

### 堆叠部件

外层管道中的部件按添加顺序从上到下垂直堆叠。相邻的 [`tui button`](/commands/docs/tui_button.md) 是个例外：它们会在同一行内从左到右水平排布。

```nu
tui label "Delete everything?" | tui button Yes | tui button No | tui debug --size [30 4] | get screen
# => Delete everything?
# =>  [ Yes ]  [ No ]
```

部分部件属于界面的*全局装饰（chrome）*，只能在外层管道中使用：

- `tui label --titlebar`（顶部标题栏）
- `tui label --status`（底部状态栏）
- `tui menu`（菜单栏）
- `tui tab`（标签页）

在容器内部使用上述部件会导致错误。

### 分割窗格

[`tui split`](/commands/docs/tui_split.md) 将其所在区域划分给一组子部件：默认横向并排，添加 `--vertical` 则为纵向堆叠。子部件放在括号内进行构建：

```nu
ls | tui split [ (tui table --columns [name type]) (tui preview) ] | tui run
```

`--sizes` 为每个子部件指定尺寸。未显式指定的项默认为 `1fr`：

| 尺寸                   | 含义                                                  |
| ---------------------- | ----------------------------------------------------- |
| `20`                   | 20 个单元格（字符宽/高）                              |
| `"30%"` 或 `30%`       | 占分割区域的 30%                                      |
| `"1fr"`, `"2fr"`       | 剩余空间的分配比例；`2fr` 所分得的空间是 `1fr` 的两倍 |
| `"min:10"`, `"max:40"` | 至少或最多占用这么多单元格                            |

`--ratio 60` 是 `--sizes [60% 1fr]` 的简写。分割窗格支持嵌套：

```nu
ls
| tui split --sizes [30 1fr] [
    (tui tree --walk)
    (tui split --vertical --ratio 70 [ (tui preview) (tui log) ])
  ]
| tui run
```

每对窗格之间都有一个单元格宽度的拖动手柄。使用鼠标拖动任意手柄，手柄会移动到尽可能贴近鼠标指针的位置（以相邻窗格所允许的极限为准）。若使用键盘，可通过 `Tab` 切换焦点至 split，然后使用方向键（或 `hjkl`）移动第一个分割线。每按一次移动一个单元格；在宽度或高度超过 100 单元格的大分割窗格中，每次移动若干单元格。每个窗格至少保留一个单元格。`tui debug` 在 `values` 字段下报告各窗格的当前尺寸：

```nu
ls | tui split --ratio 60 [ (tui table) (tui preview) ] | tui debug | get values.split-0
# => ╭───┬─────╮
# => │ 0 │ 60% │
# => │ 1 │ 1fr │
# => ╰───┴─────╯
```

如果某个 split 的所有子部件都具有固定高度（按钮、标签、文本输入框和进度条），则不会将其划分为可调节窗格。它会严格按子部件所需的高度渲染，不绘制拖动手柄，也无法通过键盘调整大小。这可用于垂直排列按钮，或将文本框与按钮并排摆放：

```nu
tui split --vertical [ (tui button Yes) (tui button No) ] | tui debug --size [30 4] | get screen
# =>  [ Yes ]
# =>  [ No ]

tui label "name" | tui split [ (tui textbox --id name) (tui button Go) ] | tui debug --size [40 4] | get screen
# => name
# => ┌ input ───────────┐ [ Go ]
# => │▌                 │
# => └──────────────────┘
```

### 分组框

[`tui box`](/commands/docs/tui_box.md) 为其子部件绘制带标题的边框，可放置在任意位置，包括 split 内部：

```nu
ls | tui split [ (tui box "list" [ (tui search) (tui table) ]) (tui preview) ] | tui run
```

### 边框标题

具有边框的部件会在顶部边框中显示其名称，随后在括号中显示当前状态（例如行数）。`--title` 会替换该名称，同时保留状态信息：

```nu
[a b c] | tui table --title letters | tui debug --size [30 6] | get screen
# => ┌ letters (3) ───────────────┐
# => │  item                      │
# => │▶ a                         │
# => │  b                         │
# => │  c                         │
# => └────────────────────────────┘
```

| 部件         | 默认标题                              | 指定 `--title files` 后                   |
| ------------ | ------------------------------------- | ----------------------------------------- |
| table        | `table (12)`, `table (12, 3 checked)` | `files (12)`, `files (12, 3 checked)`     |
| select, tree | `select (4)`, `tree (40)`             | `files (4)`, `files (40)`                 |
| log          | `log`, `log (live)`, `log (paused)`   | `files`, `files (live)`, `files (paused)` |
| search       | `search`, `search (fuzzy)`            | `files`, `files (fuzzy)`                  |
| textbox      | `input`                               | `files`                                   |
| preview      | 预览文件的名称，或 `preview`          | `files (Cargo.toml)` 或 `files`           |

预览部件没有固定的名称，因为其边框会直接显示正在预览的文件名。使用 `--title` 时，指定的标题在前，文件名跟在括号中。搜索框也会将 `--title` 作为占位提示符，除非额外指定了 `--placeholder`。传入空的 `--title` 会报错。

`tui box` 将标题作为其第一个位置参数，而 `tui label --titlebar` 用于设置整个界面顶部的标题栏。

::: tip
`tui label --titlebar` 以前写作 `tui label --title`。旧写法目前仍可使用但会打印弃用警告，并将在 0.118.0 版本中移除。
:::

### 标签页

[`tui tab`](/commands/docs/tui_tab.md) 将一组部件组合为一个独立页面。只要存在至少一个顶层 tab，界面就会显示标签栏：

```nu
ls
| tui tab "table" [ (tui table --columns [name type size]) ]
| tui tab "tree" [ (tui split [ (tui tree --walk) (tui preview) ]) ]
| tui run
```

切换页面的方式有：直接点击标签页、按 `[` 和 `]` 键、按 `Ctrl+Left` 和 `Ctrl+Right`、按 `Ctrl+Tab` 和 `Ctrl+Shift+Tab`，或者直接按数字键（`1` 到 `9`）快速跳转到对应页面。标签页不支持嵌套。

```nu
ls | tui tab "a" [ (tui table) ] | tui tab "b" [ (tui table) ] | tui debug --keys ["2"] | get page
# => 1
```

### 部件标识符

每个部件都会自动分配一个由其类型和序号构成的 ID，例如 `table-0` 或 `search-0`，不同种类的部件分别计数。当两个容器各自包含一个 `table-0` 时，第二个会被自动重编号为 `table-1`：

```nu
tui split [ (tui box "a" [(tui table)]) (tui box "b" [(tui table)]) ] | tui debug | get focus.order
# => ╭───┬─────────╮
# => │ 0 │ table-0 │
# => │ 1 │ table-1 │
# => │ 2 │ split-0 │
# => ╰───┴─────────╯
```

通过显式 `--id` 指定的名称绝不会被自动重编号，两次使用相同的显式 ID 将抛出错误。当其他部件需要引用该部件（例如通过 `--from` 选项），或者你希望从结果记录中通过可预测的名称读取其状态时，请务必使用 `--id` 为其命名。

## 部件的数据来源

每个数据部件按优先级显示以下首个存在的数据：

1. 由其 `--from` 数据源或闭包产生的内容（参见[跟随选中行](#跟随选中行)）。
2. 部件自带的 `--data`，或者在容器子列表中直接通过管道传给它的值，如 `[(ls | tui table)]`。
3. 最近外层封闭容器的数据。
4. 传给最外层管道的数据。

`--data` 不能与 `--from` 或闭包同时使用，因为部件将永远无法展示它。`tui progress --value` 也遵循该规则。

这意味着一条管道可以为所有部件提供数据，也可以让每个窗格拥有独立的数据行：

```nu
ls | tui split [ (tui table) (tui tree) ] | tui run           # 两者均展示 ls 的结果
tui split [ (ps | tui table) (ls | tui table) ] | tui run      # 各自展示独立的数据行
tui split [ (tui table --data (ps)) (tui table --data (ls)) ] | tui run   # 显式书写的等价形式
```

```nu
tui split [ ([1 2] | tui table) ([3] | tui table) ] | tui debug | get widgets.0.children.rows
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 1 │
# => ╰───┴───╯
```

传给子部件的数据必须有能够展示它的部件。如果子列表中的每个部件都自带 `--data`，则管道传入的数据行无处展示，`tui run` 和 `tui debug` 将报错停止：

```nu
tui split [ ([1 2] | tui table --data [a b]) ] | tui debug
# => Error: nu::shell::error
# =>
# =>   × piped data has no widget to show it
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ tui split [ ([1 2] | tui table --data [a b]) ] | tui debug
# =>    · ────┬────
# =>    ·     ╰── no widget in this child can show the data piped into it: each has its own --data, or there are none
# =>    ╰────
```

### 数据流

构建器不会提前读取管道传给它们的数据流。在界面打开后，`tui run` 会在后台线程中读取每个数据流，使新数据到达时能够实时呈现。这包括外部命令输出、范围序列以及较慢的 `each` 管道：

```nu
# 每秒输出一行新内容，直到按 q 退出
1.. | each {|n| sleep 1sec; $"tick ($n)" } | tui log | tui run

# 跟踪持续增长的日志文件
^tail -f app.log | tui label --titlebar "app.log" | tui log | tui run

# 随数据流推进的动态进度条
1..100 | each {|n| sleep 50ms; $n } | tui progress --total 100 | tui run
```

传给子列表内部件的数据流同样是实时的，因此每个窗格都可以跟踪各自的数据源：

```nu
tui split [ (^tail -f app.log | tui log) (ls | tui table) ] | tui run
```

如果在外部命令仍在运行时关闭界面，该外部命令会被终止。

每个数据流大约保留最新的 100,000 行。较早的数据会以每批 12,500 行进行丢弃，因此在两次丢弃之间最多可能会多出 12,499 行数据。`tui log --max-lines` 可以为日志部件调高该上限。

构建器不预读数据流会带来以下几点特性：

- 构建器始终返回 `tui` 值，即使输入是数据流。例如 `1.. | tui table | first` 会报错，而不是返回第一行输入。
- 通过 `let` 保存的 `tui` 值在首次运行时读取数据流。如果流已结束，后续运行会展示相同的数据行；如果界面在流结束前关闭，后续运行将不展示任何数据。
- 当 hook 返回新数据时（参见 [Hook 契约](#hook-契约)），该数据将在后续运行中替换原管道数据，且原数据流不再追加新行。

`tui debug` 会在绘制前读取管道流直到结束（最多等待 5 秒），并像 `tui run` 一样保留最新数据。其结果中的 `live` 字段指明数据流是否仍在产生新行。请勿向其传入无限制的无限数据流。

## 跟随选中行

### 预览窗格

[`tui preview`](/commands/docs/tui_preview.md) 显示列表中高亮选中行的文本。如果不提供闭包，它会读取该行 `name` 列所指定的文件。目录和二进制文件会显示简要提示，且最多读取 `--max-bytes` 字节（默认为 65536 字节）：

```nu
ls | tui split [ (tui table --columns [name type]) (tui preview) ] | tui run
```

键盘方向键保持在表格上，预览内容会随光标移动实时联动。预览跟随获得焦点的列表，或者同容器内最近的列表，或者首个可见的列表。可以使用 `--from <id>` 显式指定要跟随的列表 ID。

**不带参数**的闭包用于转换文件内容文本，内容通过 `$in` 传入闭包。结果中的 ANSI 颜色代码会被正常渲染，因此可以使用 `nu-highlight` 或 `bat` 实现语法高亮：

```nu
ls | tui split [ (tui table) (tui preview { nu-highlight }) ] | tui run
```

**带一个参数**的闭包接收当前高亮选中的行。此时不会从磁盘读取任何文件，而是直接展示闭包返回的内容：

```nu
$env.config.keybindings
| tui split [ (tui table --columns [name modifier keycode]) (tui preview {|row| $row.event | to nuon }) ]
| tui run
```

### 详情视图与说明文字

任何数据部件都可以通过这种方式跟随选中行。使用 `--from <id>` 指定源列表，并通过位置闭包将该列表的高亮行转换为当前部件的数据。这样表格就能作为详情视图使用：

```nu
[{name: a, kids: [1 2]}, {name: b, kids: [3 4 5]}]
| tui split [ (tui table --id src --columns [name]) (tui table --from src {|r| $r.kids }) ]
| tui debug --keys [down] --size [50 7]
| get screen
# => ┌ table (2) ────────────┐│┌ table (3) ───────────┐
# => │  name                 │││  item                │
# => │  a                    │││▶ 3                   │
# => │▶ b                    │││  4                   │
# => │                       │││  5                   │
# => │                       │││                      │
# => └───────────────────────┘│└──────────────────────┘
```

标签部件可以作为高亮行的说明：

```nu
[{name: a, size: 1kb} {name: b, size: 2kb}]
| tui table --columns [name]
| tui label {|row| $"size: ($row.size)" }
| tui debug --keys [down] --size [40 6]
| get screen
# => ┌ table (2) ───────────────────────────┐
# => │  name                                │
# => │  a                                   │
# => │▶ b                                   │
# => └──────────────────────────────────────┘
# => size: 2.0 kB
```

若未指定 `--from`，带有数据源闭包的部件会像预览窗格一样跟随最近的列表。如果当前显示的页面没有表格、树形视图或选择列表，它会跟随其它 [`tui tab`](#标签页) 页面上的列表。若不带闭包，高亮行本身直接成为该部件的数据。数据源闭包仅在高亮行发生变化或窗格大小调整时重新运行。

当闭包无可跟随的目标时，`tui run` 和 `tui debug` 会报错停止：界面完全没有表格、树形视图或选择列表、`--from` 指向不存在或无数据的部件、`--from` 指向部件自身，或者部件之间存在循环跟随。例如，为流式日志附加了闭包却没有任何可跟随的列表：

```nu
1..5 | each {|n| $"tick ($n)"} | tui label --titlebar "ticks" | tui log { $in } | tui run
# => Error: nu::shell::error
# =>
# =>   × nothing for the closure to follow
# =>    ╭─[repl_entry #1:1:65]
# =>  1 │ 1..5 | each {|n| $"tick ($n)"} | tui label --titlebar "ticks" | tui log { $in } | tui run
# =>    ·                                                                 ───┬───
# =>    ·                                                                    ╰── `log-0` runs its closure on the highlighted row of a table, tree, or select, but none can be followed: a widget never follows its own row, or one that follows it. Add one, or drop the closure
# =>    ╰────
```

去掉闭包（改用 `tui log`）即可在管道数据到达时正常展示。

### 让输出适配窗格大小

预览和数据源闭包可以通过环境变量 `$env.TUI_WIDTH` 和 `$env.TUI_HEIGHT` 获取当前窗格的内部可用尺寸：

```nu
[{name: a}]
| tui split [ (tui table) (tui preview {|row| $"w=($env.TUI_WIDTH) h=($env.TUI_HEIGHT)" }) ]
| tui debug --size [60 6]
| get screen
# => ┌ table (1) ─────────────────┐│┌ a ────────────────────────┐
# => │  name                      │││w=27 h=4                   │
# => │▶ a                         │││                           │
# => │                            │││                           │
# => │                            │││                           │
# => └────────────────────────────┘│└───────────────────────────┘
```

这对于根据终端尺寸自适应排版的命令至关重要。例如不加 `-w` 的 [`table`](/commands/docs/table.md) 会使用完整终端宽度，从而在窗格内溢出，此时应传入窗格宽度：

```nu
ps | tui split [ (tui table --columns [pid name]) (tui preview {|p| $p | table -e -w $env.TUI_WIDTH }) ] | tui run
```

## 搜索与筛选

[`tui search`](/commands/docs/tui_search.md) 用于添加搜索框。在输入时，它会实时筛选表格、日志、树形视图和选择列表：

```nu
ls
| tui label --titlebar "files"
| tui search --placeholder "filter" --bind /
| tui table --columns [name type size]
| tui label --status "enter: pick  /: filter  q: quit"
| tui run
```

- 按下 `--bind` 绑定的按键（此处为 `/`）可以从除文本框外的任何位置将焦点切换至搜索框。为搜索框指定 `--focus` 可以在启动时直接聚焦，方便立即键入筛选。
- 按 `Enter` 提交筛选后列表中的高亮行。
- 按 `Esc` 清空当前搜索词；再次按 `Esc` 退出搜索框焦点。在搜索框内输入时，`q` 仅作为普通的字母字符输入。

默认情况下，搜索会对每个字段进行不区分大小写的子字符串匹配。`--fuzzy` 使用与 `input list --fuzzy` 相同的模糊匹配器，`--case-sensitive` 区分大小写，`--columns` 则将匹配范围限制在指定列：

```nu
[{name: alpha}, {name: gamma}]
| tui search --fuzzy --columns [name] --bind /
| tui table
| tui debug --keys "/,type:gm,enter"
| get selected.name
# => gamma
```

### 搜索作用域

搜索框的位置决定了它的筛选范围。在外层管道中，它会筛选所有列表；在 `tui split` 或 `tui box` 内部，它只筛选该容器内的列表，且每个搜索框保留各自独立的搜索词：

```nu
ls
| tui split [
    (tui box "files" [ (tui search --bind /) (tui table --id files) ])   # 仅筛选 `files` 表格
    (tui table --id other)                                               # 绝不被筛选
  ]
| tui run
```

`tui debug` 会在各列表的 `search_scope` 字段中显示其关联的搜索框。

### 按按键组合筛选

使用 `--capture-keys` 选项，当表格获得焦点时，按下的组合键将直接作为筛选查询。包含 reedline 风格 `modifier` 和 `keycode` 字段的数据行可与按键组合匹配，例如 `$env.config.keybindings` 中的 `control` + `char_r` 行即可匹配 `Ctrl+R`：

```nu
[
    {name: "history", modifier: "control", keycode: "char_r", mode: "emacs"}
    {name: "clear", modifier: "control", keycode: "char_l", mode: "emacs"}
]
| tui table --capture-keys
| tui debug --keys "ctrl+r,enter"
| get selected.name
# => history
```

这可以用来快速实现一个快捷键查看器：

```nu
def "keys ui" [] {
    $env.config.keybindings
    | tui label --titlebar "keybindings"
    | tui search --placeholder "type to filter, or focus the list and press a chord" --bind /
    | tui table --capture-keys --columns [name modifier keycode]
    | tui label --status "/: search  chord: filter list  enter: pick  q: quit"
    | tui run
}
```

`Tab`、`Enter`、`Esc`、`q`、`[`、`]` 以及页面数字键仍保持其原有的快捷键功能。

## 列表、树形视图与选择器

### 多行选择

`--multi` 将表格、树形视图或选择列表转换为复选清单。按 `Space` 勾选高亮行，按 `Enter` 提交所有已勾选的行（如果未勾选任何行，则提交当前高亮行）。`--index`（适用于表格和选择列表）可改为提交元素位置索引而非数据行：

```nu
[a b c] | tui table --multi | tui debug --keys [space down space enter] | get selected
# => ╭───┬───╮
# => │ 0 │ a │
# => │ 1 │ b │
# => ╰───┴───╯

[a b c] | tui table --index | tui debug --keys [down enter] | get selected
# => 1
```

### 选择列表

[`tui select`](/commands/docs/tui_select.md) 从其参数、`--data` 或管道输入展示单选列表：

```nu
tui select [small medium large] | tui debug --keys [down enter] | get selected
# => medium
```

`--display` 用于指定每个选项的显示标签：可以是列名或闭包。最终返回的依然是原始元素，与 `input list --display` 表现一致：

```nu
[{n: 1, label: one} {n: 2, label: two}] | tui select --display label | tui debug --keys [down enter] | get selected
# => ╭───────┬─────╮
# => │ n     │ 2   │
# => │ label │ two │
# => ╰───────┴─────╯
```

配合 `--multi`，它会变成复选框列表：

```nu
tui select --multi [a b c] | tui debug --keys [space down] --size [26 5] | get screen
# => ┌ select (3, 1 checked) ─┐
# => │[x] a                   │
# => │[ ] b                   │
# => │[ ] c                   │
# => └────────────────────────┘
```

### 树形视图

[`tui tree`](/commands/docs/tui_tree.md) 用于展示嵌套的记录和列表。顶层键作为根节点，叶子节点显示为 `key: value`。按 `Right`（或 `l`）展开节点，按 `Left`（或 `h`）折叠节点，按 `Enter` 提交选中节点：

```nu
{a: {b: 1, c: 2}, d: [3, 4]} | tui tree | tui debug --keys [right down down down right] --size [30 9] | get screen
# => ┌ tree (6) ──────────────────┐
# => │▾ a                         │
# => │    b: 1                    │
# => │    c: 2                    │
# => │▾ d                         │
# => │    3                       │
# => │    4                       │
# => │                            │
# => └────────────────────────────┘
```

任何记录都会展开为其各个字段，因此 `ls` 输出的数据行展开后会显示 `name`、`type`、`size` 和 `modified`。

添加 `--walk` 后，`type` 为 `dir` 的行会被视为文件夹，展开时会实时从磁盘读取目录内容。相对路径基于当前工作目录解析，`--column` 用于指定路径列（默认为 `name`）：

```nu
ls | tui split [ (tui tree --walk) (tui preview) ] | tui run
```

### 日志视图

[`tui log`](/commands/docs/tui_log.md) 是一个仅追加视图，始终跟随其最新数据末尾。向上滚动（使用方向键、`PageUp`/`PageDown` 或鼠标滚轮）会暂停自动滚动，标题变为 `log (paused)`。滚动回底部或按 `End` 即可恢复自动跟随。`--max-lines`（默认为 10000 行）限制日志最多展示多少行最新数据：

```nu
1..30 | each {|n| $"tick ($n)" } | tui log | tui debug --size [30 6] | get screen
# => ┌ log ───────────────────────┐
# => │tick 27                     │
# => │tick 28                     │
# => │tick 29                     │
# => │tick 30                     │
# => └────────────────────────────┘
```

### 进度条

[`tui progress`](/commands/docs/tui_progress.md) 展示 `--value`，或者从其数据中读取数值：支持单个数字、记录中的 `value` 字段或列表中的最后一个数字。小于等于 1 的值按整体比例解释（例如 0.4 表示 40%）；大于 1 的值则基于 `--total`（默认为 100）计算比例：

```nu
tui progress --value 0.4 --label copying | tui debug --size [40 4] | get screen
# => ██████████████copying 40%

[10 20 30] | tui progress --label done | tui debug --size [30 4] | get screen
# => █████████  done 30%
```

由于默认提取列表中的最后一个数字，因此数字流可以直接驱动进度条动画，例如 `1..100 | each {|n| sleep 50ms; $n } | tui progress --total 100`。配合 `--from` 和闭包，进度条还可以跟随其它部件的高亮行展示对应进度。

## 打造交互式界面

### Hook 契约

响应用户操作的所有闭包均遵循统一的交互契约。这包括 `tui bind`、`tui button`、菜单操作、`--on-select` 以及传递给 `tui run` 或 `tui debug` 的闭包。hook 会同时通过 `$in` 以及声明的第一个形参接收状态记录（与 `tui run` 返回的记录结构相同，详见[结果记录](#结果记录)）。hook 的返回值决定下一步操作：

| hook 返回值                       | 产生效果                                                           |
| --------------------------------- | ------------------------------------------------------------------ |
| 无返回值                          | 不发生任何状态改变                                                 |
| `{action: submit, selected: ...}` | TUI 退出并返回该选择内容                                           |
| `{action: quit}`                  | TUI 直接退出，不返回选择内容                                       |
| 其它任何数据                      | 替换共享数据列表，管道数据流不再追加新行；读取该数据的所有部件重绘 |

如果 hook 抛出错误，错误信息会在状态栏显示为 `error:...`，且 TUI 保持打开状态：

```nu
[a b] | tui table | tui bind x {|| error make {msg: boom} } | tui label --status "ready" | tui debug --keys [x] --size [50 6] | get screen
# => ┌ table (2) ─────────────────────────────────────┐
# => │  item                                          │
# => │▶ a                                             │
# => │  b                                             │
# => └────────────────────────────────────────────────┘
# =>  ready  error:boom  focus:table-0  rows:2  tab:foc
```

### 快捷键绑定

[`tui bind`](/commands/docs/tui_bind.md) 用于在 TUI 内任何位置按下特定按键时触发运行 hook。按键可以是类似 `ctrl+s`、`alt+r`、`f5` 或 `x` 的组合键字符串，或者是 `$env.config.keybindings` 中的 reedline 风格记录：

```nu
ls
| tui table --columns [name type size]
| tui bind ctrl+r {|| ls }                                                  # 重新加载
| tui bind s {|state| {action: submit, selected: $state.selected.name} }    # 仅提交名称
| tui run
```

```nu
[a b] | tui table | tui bind ctrl+r {|| [x y z] } | tui debug --keys ctrl+r | get rows
# => 3

[a b] | tui table | tui bind {modifier: control, keycode: char_q} {|| {action: quit} } | tui debug --keys ctrl+q | get action
# => quit
```

自定义按键绑定的优先级高于内置按键（`Ctrl+C` 除外）。不带修饰键的绑定在搜索框或文本框输入时不会被触发。

### 响应选择变更

在表格、树形视图或选择列表上添加 `--on-select` 可以在光标高亮移动时触发运行 hook。可用于在界面外部执行副作用；请勿在 hook 中执行打印，否则会破坏终端绘制画面：

```nu
ls | tui table --on-select {|s| $s.selected.name | save -f last-picked.txt } | tui run
```

若要在屏幕上展示有关当前选中的信息，应改用[跟随选中行](#跟随选中行)的部件：

```nu
ls | tui table --columns [name] | tui label {|row| $"selected: ($row.name)  ($row.size)" } | tui run
```

### 定时刷新

传递给 `tui run` 的闭包是一个在首帧渲染前运行一次的 hook。添加 `--refresh` 选项后，它会在每个时间间隔重复运行，其输出将替换共享数据列表（原管道数据流随之停止追加）。高亮状态和搜索词均会予以保留；若刷新操作失败，界面会保留上一批正常数据：

```nu
ls | tui table | tui run --refresh 1sec { ls }
```

`tui debug` 在绘制前会执行一次该闭包：

```nu
[{name: old}] | tui table --columns [name] | tui debug { [{name: new}] } --size [30 4] | get screen
# => ┌ table (1) ─────────────────┐
# => │  name                      │
# => │▶ new                       │
# => └────────────────────────────┘
```

### 菜单栏

[`tui menu`](/commands/docs/tui_menu.md) 用于添加菜单栏。每个菜单项可以是字符串，或者形如 `{name, items?, action?}` 的记录。`items` 展开为下拉菜单，`action` 是一个 hook：

```nu
ls
| tui label --titlebar "Files"
| tui menu [
    {name: "&File", items: [
        {name: "&Reload", action: {|| ls }}
        {name: "&Parent", action: {|| ls .. }}
        "&Quit"
    ]}
    {name: "&Sort", items: [
        {name: "by &Name", action: {|| ls | sort-by name }}
        {name: "by &Size", action: {|| ls | sort-by size }}
        {name: "by &Modified", action: {|| ls | sort-by modified }}
    ]}
    "&Help"
  ]
| tui table --columns [name type size modified]
| tui label --status "alt+f: file  alt+s: sort  q: quit"
| tui run
```

- **助记符（Mnemonics）：** 字母前的 `&` 会将该字母设为快捷键并在界面上加下划线标示。若未指定 `&`，则默认使用第一个字母。`Alt+F` 可在除文本框外的任意位置打开 File 菜单。下拉菜单打开后，直接按单个字母即可触发菜单项，例如 `Alt+S` 后按 `N` 即可按名称排序。
- **按键导航：** `Left`/`Right`（或 `h`/`l`）在菜单栏上左右切换。`Down` 或 `Enter` 打开下拉菜单（或直接触发无下拉菜单的项）。`Esc` 关闭下拉菜单。各菜单项亦支持鼠标直接点击。
- **操作（Actions）：** 带有 `action` 的菜单项在激活时会将其作为 hook 运行。
- **提交选择：** 不带 action 的菜单项会提交并关闭 TUI。对于下拉项，`selected` 为 `{menu, item, row}`，其中 `row` 为表格的高亮行，方便对其进行针对性处理；对于没有下拉菜单的顶层菜单项，`selected` 为其名称。

```nu
[{name: x.txt}] | tui menu [{name: "&File", items: ["&Open" "&Quit"]}] | tui table | tui debug --keys "alt+f,o" | get selected | to nuon
# => {menu: File, item: Open, row: {name: "x.txt"}}

[a b] | tui menu [{name: "&File", items: [{name: "&Reload", action: {|| [x y z] }} "&Quit"]}] | tui table | tui debug --keys "alt+f,r" | get rows
# => 3
```

### 表单：文本框与按钮

[`tui textbox`](/commands/docs/tui_textbox.md) 是可编辑字段，[`tui button`](/commands/docs/tui_button.md) 是可获取焦点的操作标签。使用 `Tab` 和 `Shift+Tab` 在它们之间切换焦点：

```nu
tui label --titlebar "rename"
| tui label "new name"
| tui textbox --id name --placeholder "type a name"
| tui button Save {|s| $s.values.name | save name.txt; {action: quit} }
| tui button Cancel {|| {action: quit} }
| tui label --status "tab: next  enter: activate  esc: cancel"
| tui run
```

当文本框获得焦点时，`q` 仅代表输入普通字符，按 `Esc` 离开该输入框。按 `Enter` 提交，输入的文本作为 `selected` 返回。文本亦可通过 ID 在 `values` 中读取，`--value` 可设置初始文本：

```nu
tui textbox --id name | tui debug --keys "type:bob,enter" | select action selected values | to nuon
# => {action: submit, selected: bob, values: {name: bob}}
```

在聚焦的按钮上按 `Enter`、`Space` 或直接鼠标点击即可激活。带 hook 的按钮行为与 `tui bind` 一致；不带 hook 的按钮则直接提交其自身的标签文本，因此两个普通按钮即可构成一个简易确认对话框。在同一行内的多个按钮间可用 `Left`/`Right`（或 `h`/`l`）切换焦点：

```nu
tui label "Delete?" | tui button Yes | tui button No | tui debug --keys [right enter] | get selected
# => No
```

## 运行 TUI

### 弹出式对话框

`tui run --dialog`（`-d`）会在备用屏幕上以居中的浮动小窗口展示该界面。若未指定 `--size`，对话框尺寸约为终端画面的四分之三，且不小于 40×12。拖动标题栏可移动位置，拖动右下角可调整大小，点击 `x` 即可关闭：

```nu
[a b c] | tui label --titlebar "pick" | tui table | tui debug --dialog --size [40 10] | get screen
# => ┌ pick ───────────────────────────── x ┐
# => │ pick                                 │
# => │┌ table (3) ─────────────────────────┐│
# => ││  item                              ││
# => ││▶ a                                 ││
# => ││  b                                 ││
# => ││  c                                 ││
# => ││                                    ││
# => │└────────────────────────────────────┘│
# => └──────────────────────────────────────┘
```

`--no-mouse` 可关闭鼠标捕获，使终端原生的文本划选与复制功能恢复生效。

### 键盘与鼠标操作

| 按键                                                                          | 操作行为                                                                                                                |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `Tab` / `Shift+Tab`                                                           | 切换焦点。当前聚焦的部件呈现 `border_focused` 颜色。焦点优先落在由 `--focus` 指定的部件上，或首个列表、输入框或按钮上。 |
| 文本键入                                                                      | 直接输入到聚焦的搜索框或文本框中。                                                                                      |
| `Enter`                                                                       | 提交聚焦部件的当前选择内容。若在菜单上，则打开下拉项或执行菜单动作。                                                    |
| `Space`                                                                       | 在 `--multi` 列表中勾选高亮行，或激活按钮。                                                                             |
| `Esc`                                                                         | 在搜索框内先清空查询再退出搜索；在文本框内离开当前输入框；在下拉菜单展开时关闭下拉项；其它情况下退出 TUI。              |
| 方向键、`hjkl`、`PageUp`/`PageDown`、`Home`/`End`                             | 在表格、树形视图和选择列表中移动；滚动日志；在菜单项或同一行按钮间移动；移动 split 的首个分割线。                       |
| `Alt+`字母                                                                    | 打开对应助记快捷键的菜单项。                                                                                            |
| `q`（非输入状态下）或 `Ctrl+C`                                                | 退出 TUI。此时 `selected` 为 `null`。                                                                                   |
| `[` / `]`、`Ctrl+Left` / `Ctrl+Right`、`Ctrl+Tab` / `Ctrl+Shift+Tab`、`1`-`9` | 切换标签页面。                                                                                                          |
| 鼠标操作                                                                      | 单击聚焦并选定、滚轮滚动内容、拖拽 split 分隔手柄、单击菜单项与按钮。                                                   |

可聚焦的部件包括：菜单、表格、选择列表、树形视图、日志、搜索框、文本输入框、按钮和 split 分隔手柄。标签、预览窗格、进度条、分组框和标签页本身不可聚焦。

### 结果记录

`tui run` 返回一条记录，所有 hook 接收到的也是相同结构的记录：

| 字段       | 含义                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------ |
| `action`   | `submit`、`quit`，或者（仅在 `tui debug` 且未发生退出/提交时）`render`                           |
| `focused`  | 当前获得焦点的部件 ID                                                                            |
| `selected` | 聚焦部件的选择结果：单行、勾选行列表、索引、树节点、`{menu, item, row}` 记录、输入文本或按钮标签 |
| `page`     | 当前标签页面的索引                                                                               |
| `values`   | 所有部件的状态信息，以 ID 为键                                                                   |
| `rows`     | 共享数据列表的总行数                                                                             |
| `live`     | 数据流是否仍在产生新数据行                                                                       |

`tui debug` 还会额外包含 `screen`（渲染画面）、解析后的 `widgets` 树、`focus`（焦点遍历顺序 `order` 和默认部件 `default`）以及 `pages`。

`values` 中各个部件的取值结构因部件类型而异：

| 部件             | 取值结构                                                             |
| ---------------- | -------------------------------------------------------------------- |
| 搜索框、文本框   | 当前输入的文本                                                       |
| 表格、选择列表   | `{index, row}`（配合 `--multi` 时额外包含 `checked`）                |
| 树形视图         | `{index, path, value}`                                               |
| 日志             | `{rows, follow}`                                                     |
| 预览窗格         | `{title, text}`，其中 `title` 为预览文件的名称，未预览任何内容时为空 |
| 分割窗格 (split) | 窗格尺寸列表                                                         |
| 进度条           | 当前进度数值                                                         |
| 按钮             | 按钮标签文本                                                         |

```nu
[{name: alpha} {name: beta}] | tui search | tui table | tui debug --keys "tab,type:be" | get values | to nuon
# => {"search-0": be, "table-0": {index: 0, row: {name: beta}}}
```

你也可以直接通过赋予部件的 ID 读取其状态：

```nu
tui textbox --id name | tui run | get values.name
```

## 使用 `tui debug` 进行测试

`tui debug --keys` 可以重放一组按键令牌（支持列表或逗号分隔的字符串）并返回结果记录（包含 `screen`）：

| 按键令牌                                                           | 含义                     |
| ------------------------------------------------------------------ | ------------------------ |
| `enter`, `esc`, `tab`, `shift+tab`                                 | 对应控制键               |
| `up`, `down`, `left`, `right`, `home`, `end`, `pageup`, `pagedown` | 移动导航键               |
| `backspace`, `delete`, `space`, `insert`                           | 文本编辑键               |
| `ctrl+c`, `ctrl+r`, `alt+f`, `f1`                                  | 修饰键与功能键           |
| 单个字符（如 `q` 或 `/`）                                          | 输入该字符按键           |
| `type:hello`                                                       | 输入指定字符串           |
| `click:COL,ROW`                                                    | 在指定行列处鼠标左键单击 |
| `drag:COL,ROW`                                                     | 鼠标左键拖拽至指定行列   |
| `scroll-up`, `scroll-down`                                         | 鼠标滚轮滚动             |

在字符串格式中，`click:10,5` 保留其内部逗号。`--until` 可以在其闭包对状态记录返回 `true` 时立即停止重放：

```nu
[a b c d] | tui table | tui debug --keys [down down down] --until {|s| $s.values.table-0.index == 1 } | get values.table-0.index
# => 1
```

`--size` 设置画布尺寸（限制在 16-400 列与 4-200 行之间），`--dialog` 会绘制弹窗外框。这使得 `tui debug` 非常适合用于编写自动化测试：

```nu
use std/assert

def pick-size [] { tui select [small medium large] }

assert equal (pick-size | tui debug --keys [down enter] | get selected) "medium"
assert equal (pick-size | tui debug --keys [esc] | get action) "quit"
```

## 主题定制

主题配色源自 `$env.config.tui`，为界面的各个构成部分提供了独立设置项。除 `border_type` 外，每个键的配置格式与 [`color_config`](coloring_and_theming.md) 完全相同：支持颜色名称、`#RRGGBB` 十六进制代码或 `{fg, bg, attr}` 记录。`border_type` 则是用于选取边框线型的名称（参见[边框线型](#边框线型)）。

| 配置键                        | 绘制对象                                                     | 默认值                                         |
| ----------------------------- | ------------------------------------------------------------ | ---------------------------------------------- |
| `title_bar`                   | 由 `tui label --titlebar` 创建的标题栏                       | `{ fg: white, bg: blue, attr: b }`             |
| `status_bar`                  | 由 `tui label --status` 创建的状态栏                         | `{ fg: white, bg: dark_gray }`                 |
| `border` / `border_focused`   | 部件边框以及聚焦部件的边框                                   | `{ fg: dark_gray }` / `{ fg: cyan }`           |
| `border_type`                 | 所有边框的线型（线型名称而非颜色）                           | `"single"`                                     |
| `selected`                    | 表格、树形视图、选择列表和菜单中的高亮行                     | `{ attr: r }`                                  |
| `header`                      | 表格列标题栏                                                 | `{ fg: green, attr: b }`                       |
| `muted`                       | 占位提示符与空状态文本                                       | `{ fg: dark_gray }`                            |
| `highlight`                   | 搜索查询词高亮和勾选标记                                     | `{ fg: yellow, attr: b }`                      |
| `tab_active` / `tab_inactive` | 标签栏激活与未激活标签                                       | `{ fg: cyan, attr: bu }` / `{ fg: dark_gray }` |
| `progress`                    | 进度条已填充部分                                             | `{ fg: green }`                                |
| `button`                      | 按钮标签文本                                                 | `{ fg: white, bg: blue }`                      |
| `surface` / `backdrop`        | 部件背后的底色以及 `--dialog` 背后的底色（仅使用 `bg` 属性） | 未设置（近黑底色）                             |

```nu
$env.config.tui.title_bar = { fg: black, bg: yellow, attr: b }
$env.config.tui.border_focused = { fg: "#ff8800" }
```

运行 `config nu --doc` 可以查看所有配置键的完整文档。

表格和树形视图单元格的配色与 `table` 和 `ls` 输出一致：普通值通过 `color_config` 按数据类型着色，路径列则通过 `LS_COLORS`（遵循 `$env.config.ls.use_ls_colors`）着色。当 `$env.config.use_ansi_coloring` 关闭时，TUI 会以单色模式绘制，并使用反色显示当前选中的行。

### 边框线型

边框线型的命名与 [`table --theme`](/commands/docs/table.md) 的主题名称保持一致。`$env.config.tui.border_type` 为所有边框设置默认线型，包括菜单下拉列表和 `--dialog` 弹窗外框。部件的 `--border` 选项可单独覆盖该部件的线型。该选项支持与 `table --theme` 相同的名称补全：

```nu
[a b c] | tui table --border rounded | tui debug --size [30 6] | get screen
# => ╭ table (3) ─────────────────╮
# => │  item                      │
# => │▶ a                         │
# => │  b                         │
# => │  c                         │
# => ╰────────────────────────────╯

$env.config.tui.border_type = "double"
[a b c] | tui table | tui debug --size [30 6] | get screen
# => ╔ table (3) ═════════════════╗
# => ║  item                      ║
# => ║▶ a                         ║
# => ║  b                         ║
# => ║  c                         ║
# => ╚════════════════════════════╝
```

`--border` 支持用于 `tui table`、`tui tree`、`tui select`、`tui log`、`tui preview`、`tui search`、`tui textbox` 以及 `tui box`。在 `tui menu` 上，它用于设置下拉菜单周围的边框。默认线型为 `single`。每种名称绘制该表格主题最贴近的边框样式：

| 线型名称                                                 | 外观样式                                      |
| -------------------------------------------------------- | --------------------------------------------- |
| `single`, `thin`                                         | `┌─┐ │ └─┘`                                   |
| `rounded`                                                | `╭─╮ │ ╰─╯`                                   |
| `double`                                                 | `╔═╗ ║ ╚═╝`                                   |
| `heavy`                                                  | `┏━┓ ┃ ┗━┛`                                   |
| `reinforced`                                             | `┏─┓ │ ┗─┛`                                   |
| `basic`, `basic_compact`                                 | `+-+ \| +-+`                                  |
| `ascii_rounded`                                          | `.-. \| '-'`                                  |
| `dots`                                                   | 顶部 `.`，侧边 `:`，底部 `:..:`               |
| `compact`, `compact_double`, `restructured`, `with_love` | 顶底为 `─`、`═`、`=` 或 `❤` 边框线，侧边留空 |
| `markdown`                                               | 侧边为 `\|`，顶部和底部留空                   |
| `frameless`, `light`, `psql`                             | 全四周均无线条                                |

边框始终占据 1 个单元格宽度，因此 `none` 和 `default` 不是合法的边框名称。如需完全无线条的边框轮廓，请使用 `frameless`。它依然保留所占单元格，且部件的标题保持可见。

## 实用范例

### 带有预览与搜索的文件选择器

```nu
ls
| tui label --titlebar "files"
| tui search --bind /
| tui split [ (tui table --columns [name type size]) (tui preview { nu-highlight }) ]
| tui label --status "enter: pick  /: filter  q: quit"
| tui run
```

### 主从联动视图

表格展示树形视图中高亮选中的目录内容，右侧预览窗格跟随当前获得焦点的列表：

```nu
ls
| tui split --sizes [30 1fr] [
    (tui tree --walk --id dirs)
    (tui split --vertical [
        (tui table --from dirs {|node| ls $node.name } --columns [name size modified])
        (tui preview)
    ])
  ]
| tui run
```

### 操作确认对话框

```nu
def confirm [question: string]: nothing -> bool {
    let r = tui label $question | tui button Yes | tui button No | tui run --dialog --size [40 8]
    $r.action == "submit" and $r.selected == "Yes"
}

if (confirm "Delete build output?") {
    print "Deleting..."
}
```

### 多文件勾选器

针对 `ls` 输出的复选清单：按 `Space` 勾选文件，按 `Enter` 返回所有已勾选的数据行。在未勾选任何文件时，按 `Enter` 仅返回当前高亮行，因此该选择器对单选和多选场景同样适用：

```nu
def "pick files" [] {
    let r = ls
        | tui label --titlebar "pick files"
        | tui search --bind / --columns [name]
        | tui table --multi --columns [name type size modified]
        | tui label --status "space: check  /: filter  enter: accept  q: cancel"
        | tui run
    if $r.action == "submit" { $r.selected } else { [] }
}

pick files | each {|f| cp $f.name backup/ }
```

### 快捷键历史命令选择器

使用模糊搜索查找历史执行过的命令，并直接回填至命令行。该命令本身由原生 Nushell 编写，通过快捷键绑定分配给 `Ctrl+H`：

```nu
def "history ui" [] {
    let r = history
        | get command
        | reverse
        | uniq
        | wrap command
        | tui label --titlebar "history"
        | tui search --focus --bind / --fuzzy --columns [command] --placeholder "fuzzy filter"
        | tui table --columns [command]
        | tui label --status "type to filter  enter: put on the command line  esc esc: cancel"
        | tui run --dialog --size [100 24]
    if $r.action == "submit" {
        commandline edit --replace $r.selected.command
    }
}

$env.config.keybindings ++= [{
    name: history_ui
    modifier: control
    keycode: char_h
    mode: [emacs vi_insert vi_normal]
    event: { send: executehostcommand, cmd: "history ui" }
}]
```

最新的命令排在最前，并自动剔除重复项。因为搜索框指定了 `--focus`，键入内容将直接输入模糊过滤器，按 `Enter` 会用选中的匹配项直接替换当前命令行内容。

::: tip
在不支持 kitty 键盘协议的终端中，`Ctrl+H` 发送的键码与 `Backspace` 相同。在这些终端中请配置其它组合键。
:::

### Git 分支切换器

左侧显示分支名称及其更新时间和最新提交说明，右侧展示该分支的最近日志，按 `Enter` 快速切换分支：

```nu
def "git switch-ui" [] {
    let branches = ^git branch --format="%(refname:short)|%(committerdate:relative)|%(subject)"
        | lines
        | parse "{name}|{when}|{subject}"
    let r = $branches
        | tui label --titlebar "branches"
        | tui search --bind / --fuzzy --columns [name]
        | tui split --sizes [45% 1fr] [
            (tui table --columns [name when subject])
            (tui preview {|b| ^git log --color=always --oneline -20 $b.name })
          ]
        | tui label --status "/: filter  enter: switch  q: cancel"
        | tui run
    if $r.action == "submit" {
        ^git switch $r.selected.name
    }
}
```

预览闭包接收当前高亮行，因此随着光标移动日志窗格会联动刷新，`--color=always` 保留 git 原生彩色输出。

::: tip
在类似脚本中请优先使用 `^git`。如果你加载了 git 自动补全脚本，`git branch` 可能会被定义为带参数列表的 [`extern`](externs.md)，Nushell 随后会根据该签名严格校验 `--format=`。使用 `^git` 可确保始终直接调用外部原生二进制程序。
:::

### 进程监控器

一个每两秒自动刷新一次的 `ps` 监视器，支持按名称筛选，展示当前高亮进程的完整记录，并支持通过 `Ctrl+K` 终止进程：

```nu
def "ps ui" [] {
    let snapshot = {|| ps | compact cpu | sort-by cpu -r | update cpu { math round -p 1 } | first 200 }
    do $snapshot
    | tui label --titlebar "processes"
    | tui search --bind / --columns [name]
    | tui split --sizes [1fr 44] [
        (tui table --columns [pid name cpu mem])
        (tui preview {|p| $p | transpose field value | table -w $env.TUI_WIDTH })
      ]
    | tui bind ctrl+k {|s| kill $s.selected.pid; do $snapshot }
    | tui label --status "/: filter  ctrl+k: kill  enter: pick  q: quit"
    | tui run --refresh 2sec $snapshot
    | get selected?
}
```

同一闭包同时驱动首帧渲染、定时器刷新以及终止进程后的重新加载，因此列表始终以相同规则排序。`compact cpu` 会过滤掉操作系统未报告 CPU 使用率的进程（例如 macOS 上其他用户的进程），以防止 `math round` 因遇到 `null` 而报错。

### 浏览结构化数据文件

将 JSON、TOML、YAML 或 NUON 文件作为树形视图打开，筛选其键名，并将当前高亮节点以表格形式渲染：

```nu
def "explore-data" [file: path] {
    open $file
    | tui label --titlebar ($file | path basename)
    | tui search --bind /
    | tui split --sizes [40% 1fr] [
        (tui tree)
        (tui preview {|node| $node | table -e -w $env.TUI_WIDTH })
      ]
    | tui label --status "right/left: open and close  /: filter  enter: pick  q: quit"
    | tui run
    | get selected?
}

explore-data Cargo.toml
```

按 `Enter` 会返回当前高亮节点的值，因此只需定位到任意嵌套字段并按 `Enter` 即可提取该值。
