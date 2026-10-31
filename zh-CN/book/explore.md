# `explore`

[`explore`](/commands/docs/explore.md) 是一个表格分页器，类似于 `less`，但面向结构化数据。把任意值用管道传给它，就可以滚动浏览、深入查看嵌套的记录和表格、搜索，并对你正在查看的内容运行 Nushell 命令。

## 签名

`> explore --head <bool> --index --tail --peek`

### 参数

- `--head <bool>`：显示或隐藏列标题（默认 `true`）
- `--index, -i`：查看列表时显示行索引
- `--tail, -t`：视口初始滚动到底部
- `--peek, -p`：退出时输出光标所在单元格的值

## 快速开始

```nu
ls | explore -i
```

![explore-ls-png](https://user-images.githubusercontent.com/20165848/207849604-421312e3-537f-4b2e-b83e-f1f83f2a79d5.png)

还有几种启动方式：

```nu
# Explore the system host information record
sys host | explore

# Explore the output of ls without column names
ls | explore --head false

# Start at the end of a long list
help commands | explore --tail

# Explore a JSON file, then save the part you were looking at when you quit
open file.json | explore --peek | to json | save part.json
```

## 移动浏览

| 按键                                                           | 动作                                         |
| -------------------------------------------------------------- | -------------------------------------------- |
| 方向键，或 `h` `j` `k` `l`                                     | 移动光标                                     |
| `Ctrl+p` / `Ctrl+n`                                            | 向上 / 向下移动（Emacs 风格）                |
| `PageUp` / `PageDown`、`Ctrl+b` / `Ctrl+f`、`Alt+v` / `Ctrl+v` | 向上 / 向下翻页                              |
| `Home` / `End`，或 `g` / `G`                                   | 跳到第一行 / 最后一行                        |
| `Enter` 或 `i`                                                 | 进入光标模式；在光标模式下深入查看所选单元格 |
| `Esc` 或 `q`                                                   | 退出光标模式；否则返回上一层，在顶层则退出   |
| `t`                                                            | 转置（行列互换），在视图模式下               |
| `e`                                                            | 展开（显示所有嵌套数据）                     |

`explore` 以 _视图_ 模式启动（状态栏显示 `VIEW`），此时方向键滚动表格。按 `Enter`（或 `i`）切换到 _光标_ 模式（状态栏显示 `EDIT`），此时方向键让光标在单元格之间移动。在存放记录或列表的单元格上再按一次 `Enter`，会在新视图中打开它，这样你就能逐层深入嵌套数据。按 `Esc` 退出光标模式，再按一次则返回上一层。

## 搜索

按 `/` 向前搜索，或按 `?` 向后搜索。结果会随着你的输入高亮显示。然后用 `n` 和 `N` 在匹配项之间移动。

## 命令

[`explore`](/commands/docs/explore.md) 带有几个内置命令。按 `:` 然后输入命令名称：

| 命令        | 动作                          |
| ----------- | ----------------------------- |
| `:help`     | 显示帮助页面                  |
| `:try`      | 在当前数据上打开交互式 REPL   |
| `:nu <cmd>` | 在当前数据上运行 Nushell 命令 |
| `:q`        | 退出 `explore`                |

## 配置

`explore` 的颜色在 `$env.config.explore` 中配置。每个取值都与 [`color_config`](coloring_and_theming.md) 的形式相同：颜色名、`#RRGGBB` 十六进制代码，或 `{fg, bg, attr}` 记录。例如：

```nu
$env.config.explore = {
    selected_cell: { bg: light_blue }
    highlight: { fg: black, bg: yellow }
    title_bar_text: { fg: white }
    title_bar_background: { bg: blue }
    status: {
        success: { fg: black, bg: green }
        error: { fg: white, bg: red }
    }
    try: { reactive: false }
}
```

支持的键有 `selected_cell`、`highlight`、`status_bar_text`、`status_bar_background`、`command_bar_text`、`command_bar_background`、`title_bar_text`、`title_bar_background`、`status`（包含 `info`、`success`、`warn` 和 `error` 条目），以及 `try.reactive`。当 `try.reactive` 为 `true` 时，`:try` 会在你输入时重新运行命令，而不只是在你按 `Enter` 时才运行。

运行 `config nu --doc` 可以查看每个键的文档和默认值。

## 示例

### 查看值

```nu
$nu | explore --peek
```

![explore-peek-gif](https://user-images.githubusercontent.com/20165848/207854897-35cb7b1d-7f7d-4ae2-9ec8-df19ac04ac99.gif)

### `:try` 命令

有一个交互式环境，你可以用 `nu` 在其中浏览数据。

![explore-try-gif](https://user-images.githubusercontent.com/20165848/208159049-0954c327-9cdf-4cb3-a6e9-e3ba86fde55c.gif)

#### 用 `$nu` 保留所选的值

记住你可以将它与 `--peek` 结合使用。

![explore-try-nu-gif](https://user-images.githubusercontent.com/20165848/208161203-96b51209-726d-449a-959a-48b205c6f55a.gif)

## 浏览你的配置

[`explore config`](/commands/docs/explore_config.md) 会把你当前的 `$env.config` 作为一棵树打开，并带有一个编辑窗格。用 `Tab` 在树和编辑器之间切换，用方向键移动以及展开或折叠节点，用 `Enter` 开始编辑某个值。按 `Ctrl+S` 应用编辑。用 `q` 退出时，你的改动会应用到当前会话；`Ctrl+C` 则不保存退出。

```nu
# Browse and edit the running configuration
explore config

# Explore any JSON data as a tree
open --raw data.json | explore config

# Print the tree without starting the TUI
open --raw data.json | explore config --tree
```

## 构建正则表达式

[`explore regex`](/commands/docs/explore_regex.md) 会打开一个交互式编辑器，用于在示例文本上构建和测试正则表达式。按 `Ctrl+Q` 退出，你所构建的表达式会被返回：

```nu
let pattern = open notes.txt | explore regex
open notes.txt | lines | where $it =~ $pattern
```

## 构建你自己的界面

`explore` 是一个现成的查看器。要构建你自己的交互式界面，例如选择器、表单或仪表板，请参阅[用 `tui` 构建终端用户界面](tui.md)。
