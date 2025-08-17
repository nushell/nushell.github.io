# Nu 的配色和主题

Nushell 界面的许多部分都可以定制它们的颜色。所有这些都可以在`config.nu`配置文件中设置。如果你在配置文件中看到 `#` 符号，这意味着它后面的文字被注释掉了。

## 表格边框

表格边框由 `$env.config.table.mode` 设置控制。它可以在运行时更改，也可以在 `config.nu` 文件中更改：

```nu
$env.config.table.mode = 'rounded'
```

`$env.config.table.mode` 的选项可以用 `table --list` 列出：

<!-- Generated with table --list | each {|| $"- `($in)`"} | sort | str join "\n"` -->

- `ascii_rounded`
- `basic_compact`
- `basic`
- `compact_double`
- `compact`
- `default`
- `dots`
- `double`
- `heavy`
- `light`
- `markdown`
- `none`
- `psql`
- `reinforced`
- `restructured`
- `rounded`
- `single`
- `thin`
- `with_love`

示例：

```nu
$env.config.table.mode = 'rounded'
table --list | first 5
# => ╭───┬────────────────╮
# => │ 0 │ basic          │
# => │ 1 │ compact        │
# => │ 2 │ compact_double │
# => │ 3 │ default        │
# => │ 4 │ heavy          │
# => ╰───┴────────────────╯

$env.config.table.mode = 'psql'
table --list | first 5
# =>  0 | basic
# =>  1 | compact
# =>  2 | compact_double
# =>  3 | default
# =>  4 | heavy
```

## 颜色配置

颜色配置在 `$env.config.color_config` 中定义。当前的配置可以用以下命令打印：

```nu
$env.config.color_config | sort
```

颜色和样式属性可以用多种替代格式声明。

- `r` - 标准颜色红色的缩写
- `rb` - 标准颜色红色的缩写，带有粗体属性
- `red` - 标准颜色红色
- `red_bold` - 带有粗体属性的标准颜色红色
- `"#ff0000"` - "#hex" 格式的前景色红色（需要引号）
- `{ fg: "#ff0000" bg: "#0000ff" attr: b }` - "完整 #hex" 格式：前景为红色，背景为蓝色的 "#hex" 格式，属性为粗体缩写。
- `{|x| 'yellow' }` - 返回带有上述颜色表示之一的字符串的闭包
- `{|x| { fg: "#ff0000" bg: "#0000ff" attr: b } }` - 返回有效记录的闭包

### 属性

| 编码 | 含义     |
| ---- | -------- |
| l    | 闪烁     |
| b    | 加粗     |
| d    | 暗淡     |
| h    | 隐藏     |
| i    | 斜体     |
| r    | 反转     |
| s    | 删除     |
| u    | 下划线   |
| n    | 无       |
|      | 默认为无 |

### "标准颜色"和缩写

| 代码      | 名称                      |
| --------- | ------------------------- |
| `g`       | `green`                   |
| `gb`      | `green_bold`              |
| `gu`      | `green_underline`         |
| `gi`      | `green_italic`            |
| `gd`      | `green_dimmed`            |
| `gr`      | `green_reverse`           |
| `bg_g`    | `bg_green`                |
| `lg`      | `light_green`             |
| `lgb`     | `light_green_bold`        |
| `lgu`     | `light_green_underline`   |
| `lgi`     | `light_green_italic`      |
| `lgd`     | `light_green_dimmed`      |
| `lgr`     | `light_green_reverse`     |
| `bg_lg`   | `bg_light_green`          |
| `r`       | `red`                     |
| `rb`      | `red_bold`                |
| `ru`      | `red_underline`           |
| `ri`      | `red_italic`              |
| `rd`      | `red_dimmed`              |
| `rr`      | `red_reverse`             |
| `bg_r`    | `bg_red`                  |
| `lr`      | `light_red`               |
| `lrb`     | `light_red_bold`          |
| `lru`     | `light_red_underline`     |
| `lri`     | `light_red_italic`        |
| `lrd`     | `light_red_dimmed`        |
| `lrr`     | `light_red_reverse`       |
| `bg_lr`   | `bg_light_red`            |
| `u`       | `blue`                    |
| `ub`      | `blue_bold`               |
| `uu`      | `blue_underline`          |
| `ui`      | `blue_italic`             |
| `ud`      | `blue_dimmed`             |
| `ur`      | `blue_reverse`            |
| `bg_u`    | `bg_blue`                 |
| `lu`      | `light_blue`              |
| `lub`     | `light_blue_bold`         |
| `luu`     | `light_blue_underline`    |
| `lui`     | `light_blue_italic`       |
| `lud`     | `light_blue_dimmed`       |
| `lur`     | `light_blue_reverse`      |
| `bg_lu`   | `bg_light_blue`           |
| `b`       | `black`                   |
| `bb`      | `black_bold`              |
| `bu`      | `black_underline`         |
| `bi`      | `black_italic`            |
| `bd`      | `black_dimmed`            |
| `br`      | `black_reverse`           |
| `bg_b`    | `bg_black`                |
| `ligr`    | `light_gray`              |
| `ligrb`   | `light_gray_bold`         |
| `ligru`   | `light_gray_underline`    |
| `ligri`   | `light_gray_italic`       |
| `ligrd`   | `light_gray_dimmed`       |
| `ligrr`   | `light_gray_reverse`      |
| `bg_ligr` | `bg_light_gray`           |
| `y`       | `yellow`                  |
| `yb`      | `yellow_bold`             |
| `yu`      | `yellow_underline`        |
| `yi`      | `yellow_italic`           |
| `yd`      | `yellow_dimmed`           |
| `yr`      | `yellow_reverse`          |
| `bg_y`    | `bg_yellow`               |
| `ly`      | `light_yellow`            |
| `lyb`     | `light_yellow_bold`       |
| `lyu`     | `light_yellow_underline`  |
| `lyi`     | `light_yellow_italic`     |
| `lyd`     | `light_yellow_dimmed`     |
| `lyr`     | `light_yellow_reverse`    |
| `bg_ly`   | `bg_light_yellow`         |
| `p`       | `purple`                  |
| `pb`      | `purple_bold`             |
| `pu`      | `purple_underline`        |
| `pi`      | `purple_italic`           |
| `pd`      | `purple_dimmed`           |
| `pr`      | `purple_reverse`          |
| `bg_p`    | `bg_purple`               |
| `lp`      | `light_purple`            |
| `lpb`     | `light_purple_bold`       |
| `lpu`     | `light_purple_underline`  |
| `lpi`     | `light_purple_italic`     |
| `lpd`     | `light_purple_dimmed`     |
| `lpr`     | `light_purple_reverse`    |
| `bg_lp`   | `bg_light_purple`         |
| `m`       | `magenta`                 |
| `mb`      | `magenta_bold`            |
| `mu`      | `magenta_underline`       |
| `mi`      | `magenta_italic`          |
| `md`      | `magenta_dimmed`          |
| `mr`      | `magenta_reverse`         |
| `bg_m`    | `bg_magenta`              |
| `lm`      | `light_magenta`           |
| `lmb`     | `light_magenta_bold`      |
| `lmu`     | `light_magenta_underline` |
| `lmi`     | `light_magenta_italic`    |
| `lmd`     | `light_magenta_dimmed`    |
| `lmr`     | `light_magenta_reverse`   |
| `bg_lm`   | `bg_light_magenta`        |
| `c`       | `cyan`                    |
| `cb`      | `cyan_bold`               |
| `cu`      | `cyan_underline`          |
| `ci`      | `cyan_italic`             |
| `cd`      | `cyan_dimmed`             |
| `cr`      | `cyan_reverse`            |
| `bg_c`    | `bg_cyan`                 |
| `lc`      | `light_cyan`              |
| `lcb`     | `light_cyan_bold`         |
| `lcu`     | `light_cyan_underline`    |
| `lci`     | `light_cyan_italic`       |
| `lcd`     | `light_cyan_dimmed`       |
| `lcr`     | `light_cyan_reverse`      |
| `bg_lc`   | `bg_light_cyan`           |
| `w`       | `white`                   |
| `wb`      | `white_bold`              |
| `wu`      | `white_underline`         |
| `wi`      | `white_italic`            |
| `wd`      | `white_dimmed`            |
| `wr`      | `white_reverse`           |
| `bg_w`    | `bg_white`                |
| `dgr`     | `dark_gray`               |
| `dgrb`    | `dark_gray_bold`          |
| `dgru`    | `dark_gray_underline`     |
| `dgri`    | `dark_gray_italic`        |
| `dgrd`    | `dark_gray_dimmed`        |
| `dgrr`    | `dark_gray_reverse`       |
| `bg_dgr`  | `bg_dark_gray`            |
| `def`     | `default`                 |
| `defb`    | `default_bold`            |
| `defu`    | `default_underline`       |
| `defi`    | `default_italic`          |
| `defd`    | `default_dimmed`          |
| `defr`    | `default_reverse`         |
| `bg_def`  | `bg_default`              |

<!-- The table body can be printed with ansi --list | select 'short name' name | each {|| $"| `($in.'short name')` | `($in.name)` |"} | first 133 | str join "\n" -->

### `"#hex"` 格式

"#hex" 格式是你通常看到的一种表示颜色的方式。它由简单的`#`字符以及后面的 6 个字符组成。前两个代表 `红色`，接下来两个代表 `绿色`，最后两个代表 `蓝色`。重要的是，这个字符串必须用引号包围，否则 Nushell 会认为它是一个被注释掉的字符串。

例子：红色的主要颜色是 "#ff0000" 或 "#FF0000"。字母的大写和小写没有区别。

这种 `"#hex"`格式允许我们为 Nushell 的不同部分指定 24 位真彩色调。

### 完整 `"#hex"` 格式

`完整 "#hex"`格式是对 `"#hex"` 格式的一种改进，但允许人们在一行中指定前景色、背景色和属性。

例如：`{ fg: "#ff0000" bg: "#0000ff" attr: b }`

- 前景色红色为 "#hex" 格式
- 背景色蓝色为 "#hex" 格式
- 属性为加粗的缩写形式

### 闭包

注意：闭包仅对表格输出执行。它们在其他上下文中不起作用，例如对于 `shape_` 配置，当直接打印值时，或作为列表中的值时。

例如：

```nu
$env.config.color_config.filesize = {|x| if $x == 0b { 'dark_gray' } else if $x < 1mb { 'cyan' } else { 'blue' } }
$env.config.color_config.bool = {|x| if $x { 'green' } else { 'light_red' } }
{a:true,b:false,c:0mb,d:0.5mb,e:10mib}
```

打印

```nu
╭───┬───────────╮
│ a │ true      │
│ b │ false     │
│ c │ 0 B       │
│ d │ 488.3 KiB │
│ e │ 10.0 MiB  │
╰───┴───────────╯
```

其中 `true` 是绿色的，`false` 是浅红色的，`0 B` 是深灰色的，`488.3 KiB` 是青色的，`10.0 MiB` 是蓝色的。

## 原始值

原始值是像`int`和`string`这样的值。原始值和形状可以用上面看到的各种颜色符号来设置。

这是当前的原始值列表。并非所有这些都是可配置的。可配置的被标记为 `*`。

| 原始值       | 默认颜色              | 可配置 |
| ------------ | --------------------- | ------ |
| `any`        |                       |        |
| `binary`     | Color::White.normal() | \*     |
| `block`      | Color::White.normal() | \*     |
| `bool`       | Color::White.normal() | \*     |
| `cellpath`   | Color::White.normal() | \*     |
| `condition`  |                       |        |
| `custom`     |                       |        |
| `date`       | Color::White.normal() | \*     |
| `duration`   | Color::White.normal() | \*     |
| `expression` |                       |        |
| `filesize`   | Color::White.normal() | \*     |
| `float`      | Color::White.normal() | \*     |
| `glob`       |                       |        |
| `import`     |                       |        |
| `int`        | Color::White.normal() | \*     |
| `list`       | Color::White.normal() | \*     |
| `nothing`    | Color::White.normal() | \*     |
| `number`     |                       |        |
| `operator`   |                       |        |
| `path`       |                       |        |
| `range`      | Color::White.normal() | \*     |
| `record`     | Color::White.normal() | \*     |
| `signature`  |                       |        |
| `string`     | Color::White.normal() | \*     |
| `table`      |                       |        |
| `var`        |                       |        |
| `vardecl`    |                       |        |
| `variable`   |                       |        |

### 特殊的 "原始值"（不是真正的原始值，它们的存在仅仅是为了着色）

| 原始值                      | 默认颜色                   | 可配置 |
| --------------------------- | -------------------------- | ------ |
| `leading_trailing_space_bg` | Color::Rgb(128, 128, 128)) | \*     |
| `header`                    | Color::Green.bold()        | \*     |
| `empty`                     | Color::Blue.normal()       | \*     |
| `row_index`                 | Color::Green.bold()        | \*     |
| `hints`                     | Color::DarkGray.normal()   | \*     |

下面是一个改变其中一些数值的小例子。

```nu
$env.config.color_config.separator = purple
$env.config.color_config.leading_trailing_space_bg = "#ffffff"
$env.config.color_config.header = gb
$env.config.color_config.date = wd
$env.config.color_config.filesize = c
$env.config.color_config.row_index = cb
$env.config.color_config.bool = red
$env.config.color_config.int = green
$env.config.color_config.duration = blue_bold
$env.config.color_config.range = purple
$env.config.color_config.float = red
$env.config.color_config.string = white
$env.config.color_config.nothing = red
$env.config.color_config.binary = red
$env.config.color_config.cellpath = cyan
$env.config.color_config.hints = dark_gray
```

下面是另一个使用多种颜色语法的小例子，其中有一些注释：

```nu
$env.config.color_config.separator = "#88b719" # this sets only the foreground color like PR #486
$env.config.color_config.leading_trailing_space_bg = white # this sets only the foreground color in the original style
$env.config.color_config.header = { # this is like PR #489
    fg: "#B01455", # note, quotes are required on the values with hex colors
    bg: "#ffb900", # note, commas are not required, it could also be all on one line
    attr: bli # note, there are no quotes around this value. it works with or without quotes
}
$env.config.color_config.date = "#75507B"
$env.config.color_config.filesize = "#729fcf"
$env.config.color_config.row_index = {
    # note, that this is another way to set only the foreground, no need to specify bg and attr
    fg: "#e50914"
}
```

## `Shape` 值

如上所述，"形状" 是一个用来表示语法着色的术语。

下面是当前支持的平面形状列表：

| 形状                         | 默认样式                               | 可配置 |
| ---------------------------- | -------------------------------------- | ------ |
| `shape_block`                | fg(Color::Blue).bold()                 | \*     |
| `shape_bool`                 | fg(Color::LightCyan)                   | \*     |
| `shape_custom`               | bold()                                 | \*     |
| `shape_external`             | fg(Color::Cyan)                        | \*     |
| `shape_externalarg`          | fg(Color::Green).bold()                | \*     |
| `shape_filepath`             | fg(Color::Cyan)                        | \*     |
| `shape_flag`                 | fg(Color::Blue).bold()                 | \*     |
| `shape_float`                | fg(Color::Purple).bold()               | \*     |
| `shape_garbage`              | fg(Color::White).on(Color::Red).bold() | \*     |
| `shape_globpattern`          | fg(Color::Cyan).bold()                 | \*     |
| `shape_int`                  | fg(Color::Purple).bold()               | \*     |
| `shape_internalcall`         | fg(Color::Cyan).bold()                 | \*     |
| `shape_list`                 | fg(Color::Cyan).bold()                 | \*     |
| `shape_literal`              | fg(Color::Blue)                        | \*     |
| `shape_nothing`              | fg(Color::LightCyan)                   | \*     |
| `shape_operator`             | fg(Color::Yellow)                      | \*     |
| `shape_pipe`                 | fg(Color::Purple).bold()               | \*     |
| `shape_range`                | fg(Color::Yellow).bold()               | \*     |
| `shape_record`               | fg(Color::Cyan).bold()                 | \*     |
| `shape_signature`            | fg(Color::Green).bold()                | \*     |
| `shape_string`               | fg(Color::Green)                       | \*     |
| `shape_string_interpolation` | fg(Color::Cyan).bold()                 | \*     |
| `shape_table`                | fg(Color::Blue).bold()                 | \*     |
| `shape_variable`             | fg(Color::Purple)                      | \*     |

这里有一个小例子，说明如何对这些项目应用颜色。任何没有显示指定的都会被设置为默认的颜色。

```nu
$env.config.color_config.shape_garbage: { fg: "#FFFFFF" bg: "#FF0000" attr: b}
$env.config.color_config.shape_bool: green
$env.config.color_config.shape_int: { fg: "#0000ff" attr: b}
```

## "提示"的配置和着色

Nushell 的提示符可以通过这些环境变量进行配置：

- `PROMPT_COMMAND`: 为设置提示而执行的代码（块）
- `PROMPT_COMMAND_RIGHT`: 为设置 _RIGHT_ 提示而执行的代码（块）(参考 nu_scripts 里的 oh-my.nu)
- `PROMPT_INDICATOR` = "〉": 提示后打印的标识（默认为">"类 Unicode 符号）
- `PROMPT_INDICATOR_VI_INSERT` = ": "
- `PROMPT_INDICATOR_VI_NORMAL` = "v "
- `PROMPT_MULTILINE_INDICATOR` = "::: "
- `render_right_prompt_on_last_line`: 布尔值，用于启用或禁用在提示的最后一行呈现右提示

例如：对于一个简单的提示，我们可以这样做。注意`PROMPT_COMMAND`需要一个`block`而其他的需要一个`string`。

```nu
$env.PROMPT_COMMAND = { $"(date now | format date '%m/%d/%Y %I:%M:%S%.3f'): (pwd | path basename)" }
```

如果你不喜欢默认的`PROMPT_INDICATOR`，你可以这样改变它：

```nu
$env.PROMPT_INDICATOR = "> "
```

如果你正在使用 `starship`，你很可能希望在提示的最后一行显示右提示，就像 zsh 或 fish 一样。你可以修改 `config.nu` 文件，只需将 `render_right_prompt_on_last_line` 设置为 true：

```nu
$env.config.render_right_prompt_on_last_line = true
```

提示的颜色由 `PROMPT_COMMAND` 中的 `block` 控制，在这里你可以编写自己的自定义提示。我们写了一个稍微花哨点的，有 git 状态的，位于 [nu_scripts 仓库](https://github.com/nushell/nu_scripts/blob/main/modules/prompt/oh-my.nu)。

### 瞬态提示符

如果你想为以前输入的命令显示不同的提示符，你可以使用 Nushell 的瞬态提示符功能。如果你的提示符有很多对于前几行来说没有必要显示的信息（例如时间和 Git 状态），这会很有用，因为你可以让前几行显示更短的提示符。

每个 `PROMPT_*` 变量都有一个相应的 `TRANSIENT_PROMPT_*` 变量，用于在显示过去的提示时更改该段：`TRANSIENT_PROMPT_COMMAND`、`TRANSIENT_PROMPT_COMMAND_RIGHT`、`TRANSIENT_PROMPT_INDICATOR`、`TRANSIENT_PROMPT_INDICATOR_VI_INSERT`、`TRANSIENT_PROMPT_INDICATOR_VI_NORMAL`、`TRANSIENT_PROMPT_MULTILINE_INDICATOR`。默认情况下，`PROMPT_*` 变量用于显示过去的提示。

例如，如果你想让过去的提示完全不显示左提示，只留下指示符，你可以使用：

```nu
$env.TRANSIENT_PROMPT_COMMAND = ""
```

如果你想回到正常的左提示，你必须取消设置 `TRANSIENT_PROMPT_COMMAND`：

```nu
hide-env TRANSIENT_PROMPT_COMMAND
```

## `LS_COLORS` 命令的配色:`LS_COLORS`

Nushell 将尊重并使用 Mac、Linux 和 Windows 上的 `LS_COLORS` 环境变量设置。这个设置允许你在做[`ls`](/zh-CN/commands/docs/ls.md)时定义文件类型的颜色。例如，你可以让目录变成一种颜色，`_.md` markdown 文件一种颜色，`_.toml` 文件变成另一种颜色，等等。有很多方法可以给你的文件类型着色。

如果没有设置 `LS_COLORS`，Nushell 将默认使用内置的 `LS_COLORS` 设置，基于 8 位（扩展）ANSI 颜色。

### 理解 `LS_COLORS`

`LS_COLORS` 包含一个以冒号（`:`）分隔的记录列表，这些记录将文件类型和文件名映射到样式属性（`selector=attributes`）。

选择器可以是一个文件类型，如 `di` 表示“目录标识符”，或 `*.nu` 表示具有 `.nu` 文件扩展名的文件。

属性是一个以分号（`;`）分隔的数字列表。请注意，支持哪些属性和属性格式取决于你使用的终端。

- 样式属性，如 `0` 正常，`1` 粗体，`3` 斜体，`5` 闪烁，[等](https://en.wikipedia.org/wiki/ANSI_escape_code#Select_Graphic_Rendition_parameters)
- [前景色](https://en.wikipedia.org/wiki/ANSI_escape_code#3-bit_and_4-bit) `30`-`37` 和 `90`-`97`
- [背景色](https://en.wikipedia.org/wiki/ANSI_escape_code#3-bit_and_4-bit) `40`-`47` 和 `100`-`107`
- [RGB 前景](https://en.wikipedia.org/wiki/ANSI_escape_code#24-bit) 前缀为 `38;2`，可选地后跟其他属性
- [RGB 背景](https://en.wikipedia.org/wiki/ANSI_escape_code#24-bit) 前缀为 `48;2`，可选地后跟其他属性

例如：

`$env.LS_COLORS = "di=1;34:*.nu=3;33;46"`：粗体目录，斜体黄色前景青色背景 `*.nu` 文件

`$env.LS_COLORS = "di=48;2;200;0;0;5"`：红色背景闪烁目录

### vivid 主题

例如，你可以使用第三方工具 [vivid](https://github.com/sharkdp/vivid)，它在多个平台上运行，有[许多已定义的主题](https://github.com/sharkdp/vivid/tree/master/themes)，并从中生成 `LS_COLORS` 配置。

下载并解压二进制文件后，你可以使用它：

```nu
$env.LS_COLORS = (vivid generate molokai)
```

或使用备用主题：

```nu
$env.LS_COLORS = (vivid generate ayu)
```

你可以将此命令放入你的 [Nushell 配置](/book/configuration.md)中，使其成为默认颜色。

## 主题

主题设计结合了上述所有的着色。这里有一个快速的例子，我们把它放在一起，以证明主题定制的能力。这是对我们在网络上看到的 `base16` 主题的一种转换。

使主题生效的关键是确保你在声明 `let config =` 行 _之前_，在`config.nu`文件中指定你要使用的所有主题和颜色：

```nu
# let's define some colors

let base00 = "#181818" # Default Background
let base01 = "#282828" # Lighter Background (Used for status bars, line number and folding marks)
let base02 = "#383838" # Selection Background
let base03 = "#585858" # Comments, Invisibles, Line Highlighting
let base04 = "#b8b8b8" # Dark Foreground (Used for status bars)
let base05 = "#d8d8d8" # Default Foreground, Caret, Delimiters, Operators
let base06 = "#e8e8e8" # Light Foreground (Not often used)
let base07 = "#f8f8f8" # Light Background (Not often used)
let base08 = "#ab4642" # Variables, XML Tags, Markup Link Text, Markup Lists, Diff Deleted
let base09 = "#dc9656" # Integers, Boolean, Constants, XML Attributes, Markup Link Url
let base0a = "#f7ca88" # Classes, Markup Bold, Search Text Background
let base0b = "#a1b56c" # Strings, Inherited Class, Markup Code, Diff Inserted
let base0c = "#86c1b9" # Support, Regular Expressions, Escape Characters, Markup Quotes
let base0d = "#7cafc2" # Functions, Methods, Attribute IDs, Headings
let base0e = "#ba8baf" # Keywords, Storage, Selector, Markup Italic, Diff Changed
let base0f = "#a16946" # Deprecated, Opening/Closing Embedded Language Tags, e.g. <?php ?>

# we're creating a theme here that uses the colors we defined above.

let base16_theme = {
    separator: $base03
    leading_trailing_space_bg: $base04
    header: $base0b
    date: $base0e
    filesize: $base0d
    row_index: $base0c
    bool: $base08
    int: $base0b
    duration: $base08
    range: $base08
    float: $base08
    string: $base04
    nothing: $base08
    binary: $base08
    cellpath: $base08
    hints: dark_gray

    # shape_garbage: { fg: $base07 bg: $base08 attr: b } # base16 white on red
    # but i like the regular white on red for parse errors
    shape_garbage: { fg: "#FFFFFF" bg: "#FF0000" attr: b }
    shape_bool: $base0d
    shape_int: { fg: $base0e attr: b }
    shape_float: { fg: $base0e attr: b }
    shape_range: { fg: $base0a attr: b }
    shape_internalcall: { fg: $base0c attr: b }
    shape_external: $base0c
    shape_externalarg: { fg: $base0b attr: b }
    shape_literal: $base0d
    shape_operator: $base0a
    shape_signature: { fg: $base0b attr: b }
    shape_string: $base0b
    shape_filepath: $base0d
    shape_globpattern: { fg: $base0d attr: b }
    shape_variable: $base0e
    shape_flag: { fg: $base0d attr: b }
    shape_custom: { attr: b }
}

# now let's apply our regular config settings but also apply the "color_config:" theme that we specified above.

$env.config.animate_prompt: false
$env.config.color_config: $base16_theme # <-- this is the theme
$env.config.edit_mode: emacs # vi
$env.config.filesize_format: "b" # b, kb, kib, mb, mib, gb, gib, tb, tib, pb, pib, eb, eib, auto
$env.config.filesize_metric: true
$env.config.float_precision: 2
$env.config.footer_mode: always #always, never, number_of_rows, auto
$env.config.log_level: error
$env.config.max_history_size: 10000
$env.config.table_mode: rounded # basic, compact, compact_double, light, thin, with_love, rounded, reinforced, heavy, none, other
$env.config.use_ansi_coloring: true
$env.config.use_grid_icons: true
$env.config.use_ls_colors: true
```

如果你想在主题设计上火力全开，你需要把我在一开始提到的所有项目作为主题，包括`LS_COLORS`和提示。祝您好运!

### 在浅色背景终端上工作

Nushell 的[标准库](/book/standard_library.md)包含一个带有默认浅色和深色主题的 `config` 模块。
如果你在浅色背景的终端上工作，你可以很容易地应用浅色主题。

```nu
# in $nu.config-path
use std/config light-theme   # add this line to load the theme into scope

$env.config = {
  # ...
  color_config: (light_theme)   # if you want a light theme, replace `$dark_theme` to `$light_theme`
  # ...
}
```

你也可以加载深色主题。

```nu
# in $nu.config-path
use std/config dark-theme

$env.config = {
  # ...
  color_config: (dark_theme)
  # ...
}
```

## 辅助功能

在使用屏幕阅读器时，通常希望有最少的装饰。在这些情况下，可以通过以下选项禁用表格和错误的边框和其他装饰：

```nu
# in $nu.config-path
$env.config = {
  ...
  table: {
   ...
    mode: "none"
   ...
  }
  error_style: "plain"
  ...
}
```

## 行编辑器菜单（补全、历史、帮助…）

Reedline（Nu 的行编辑器）样式不使用 `color_config` 键。
相反，每个菜单都有自己的样式需要单独配置。
有关此内容的更多信息，请参阅[专门介绍 Reedline 菜单配置的部分](line_editor.md#menus)。
