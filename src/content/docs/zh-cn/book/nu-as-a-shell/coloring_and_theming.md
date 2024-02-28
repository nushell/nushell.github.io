---
title: Nu 的配色和主题
---

Nushell 界面的许多部分都可以定制它们的颜色，所有这些都可以在`config.nu`配置文件中设置。如果你在配置文件中看到 hash/hashtag/pound 符号 `#`，这意味着它后面的文字被注释掉了。

1. 表的边框
2. 原始值
3. 形状（这是命令行的语法）
4. 提示
5. LS_COLORS

## 表格边框

---

表的边框由`config.nu`中的`table_mode`设置来控制。下面是一个例子：

```nu
> $env.config = {
    table_mode: rounded
}
```

下面是目前`table_mode`的可能选项：

- `rounded` # 当然了，这个是最好的 :)
- `basic`
- `compact`
- `compact_double`
- `light`
- `thin`
- `with_love`
- `reinforced`
- `heavy`
- `none`
- `other`

### 颜色符号

---

- `r` - 标准颜色红色的缩写
- `rb` - 标准颜色红色的缩写，带有粗体属性
- `red` - 标准颜色红色
- `red_bold` - 带有粗体属性的标准颜色红色
- `"#ff0000"` - "#hex" 格式的颜色：前景色为红色（需要引号）
- `{ fg: "#ff0000" bg: "#0000ff" attr: b }` - 完整 "#hex" 格式：前景为红色，背景为蓝色的 "#hex" 格式，属性为粗体缩写。

### 属性

---

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

| 代码   | 名称                   |
| ------ | ---------------------- |
| g      | green                  |
| gb     | green_bold             |
| gu     | green_underline        |
| gi     | green_italic           |
| gd     | green_dimmed           |
| gr     | green_reverse          |
| gbl    | green_blink            |
| gst    | green_strike           |
| lg     | light_green            |
| lgb    | light_green_bold       |
| lgu    | light_green_underline  |
| lgi    | light_green_italic     |
| lgd    | light_green_dimmed     |
| lgr    | light_green_reverse    |
| lgbl   | light_green_blink      |
| lgst   | light_green_strike     |
| r      | red                    |
| rb     | red_bold               |
| ru     | red_underline          |
| ri     | red_italic             |
| rd     | red_dimmed             |
| rr     | red_reverse            |
| rbl    | red_blink              |
| rst    | red_strike             |
| lr     | light_red              |
| lrb    | light_red_bold         |
| lru    | light_red_underline    |
| lri    | light_red_italic       |
| lrd    | light_red_dimmed       |
| lrr    | light_red_reverse      |
| lrbl   | light_red_blink        |
| lrst   | light_red_strike       |
| u      | blue                   |
| ub     | blue_bold              |
| uu     | blue_underline         |
| ui     | blue_italic            |
| ud     | blue_dimmed            |
| ur     | blue_reverse           |
| ubl    | blue_blink             |
| ust    | blue_strike            |
| lu     | light_blue             |
| lub    | light_blue_bold        |
| luu    | light_blue_underline   |
| lui    | light_blue_italic      |
| lud    | light_blue_dimmed      |
| lur    | light_blue_reverse     |
| lubl   | light_blue_blink       |
| lust   | light_blue_strike      |
| b      | black                  |
| bb     | black_bold             |
| bu     | black_underline        |
| bi     | black_italic           |
| bd     | black_dimmed           |
| br     | black_reverse          |
| bbl    | black_blink            |
| bst    | black_strike           |
| ligr   | light_gray             |
| ligrb  | light_gray_bold        |
| ligru  | light_gray_underline   |
| ligri  | light_gray_italic      |
| ligrd  | light_gray_dimmed      |
| ligrr  | light_gray_reverse     |
| ligrbl | light_gray_blink       |
| ligrst | light_gray_strike      |
| y      | yellow                 |
| yb     | yellow_bold            |
| yu     | yellow_underline       |
| yi     | yellow_italic          |
| yd     | yellow_dimmed          |
| yr     | yellow_reverse         |
| ybl    | yellow_blink           |
| yst    | yellow_strike          |
| ly     | light_yellow           |
| lyb    | light_yellow_bold      |
| lyu    | light_yellow_underline |
| lyi    | light_yellow_italic    |
| lyd    | light_yellow_dimmed    |
| lyr    | light_yellow_reverse   |
| lybl   | light_yellow_blink     |
| lyst   | light_yellow_strike    |
| p      | purple                 |
| pb     | purple_bold            |
| pu     | purple_underline       |
| pi     | purple_italic          |
| pd     | purple_dimmed          |
| pr     | purple_reverse         |
| pbl    | purple_blink           |
| pst    | purple_strike          |
| lp     | light_purple           |
| lpb    | light_purple_bold      |
| lpu    | light_purple_underline |
| lpi    | light_purple_italic    |
| lpd    | light_purple_dimmed    |
| lpr    | light_purple_reverse   |
| lpbl   | light_purple_blink     |
| lpst   | light_purple_strike    |
| c      | cyan                   |
| cb     | cyan_bold              |
| cu     | cyan_underline         |
| ci     | cyan_italic            |
| cd     | cyan_dimmed            |
| cr     | cyan_reverse           |
| cbl    | cyan_blink             |
| cst    | cyan_strike            |
| lc     | light_cyan             |
| lcb    | light_cyan_bold        |
| lcu    | light_cyan_underline   |
| lci    | light_cyan_italic      |
| lcd    | light_cyan_dimmed      |
| lcr    | light_cyan_reverse     |
| lcbl   | light_cyan_blink       |
| lcst   | light_cyan_strike      |
| w      | white                  |
| wb     | white_bold             |
| wu     | white_underline        |
| wi     | white_italic           |
| wd     | white_dimmed           |
| wr     | white_reverse          |
| wbl    | white_blink            |
| wst    | white_strike           |
| dgr    | dark_gray              |
| dgrb   | dark_gray_bold         |
| dgru   | dark_gray_underline    |
| dgri   | dark_gray_italic       |
| dgrd   | dark_gray_dimmed       |
| dgrr   | dark_gray_reverse      |
| dgrbl  | dark_gray_blink        |
| dgrst  | dark_gray_strike       |

### `"#hex"` 格式

---

"#hex" 格式是你通常看到的一种表示颜色的方式。它由简单的`#`字符以及后面的 6 个字符组成。前两个代表 `红色`，接下来两个代表 `绿色`，最后两个代表 `蓝色`。重要的是，这个字符串必须用引号包围，否则 Nushell 会认为它是一个被注释掉的字符串。

例子：红色的主要颜色是 "#ff0000" 或 "#FF0000"。字母的大写和小写没有区别。

这种 `"#hex"`格式允许我们为 Nushell 的不同部分指定 24 位真彩色调。

## `完整 "#hex"` 格式

---

`完整 "#hex"`格式是对 `"#hex"` 格式的一种改进，但允许人们在一行中指定前景色、背景色和属性。

例如：`{ fg: "#ff0000" bg: "#0000ff" attr: b }`

- 前景色红色为 "#hex" 格式
- 背景色蓝色为 "#hex" 格式
- 属性为加粗的缩写形式

## 原始值

---

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

#### 特殊的 "原始值"（不是真正的原始值，它们的存在仅仅是为了着色）

| 原始值                      | 默认颜色                   | 可配置 |
| --------------------------- | -------------------------- | ------ |
| `leading_trailing_space_bg` | Color::Rgb(128, 128, 128)) | \*     |
| `header`                    | Color::Green.bold()        | \*     |
| `empty`                     | Color::Blue.normal()       | \*     |
| `row_index`                 | Color::Green.bold()        | \*     |
| `hints`                     | Color::DarkGray.normal()   | \*     |

下面是一个改变其中一些数值的小例子。

```nu
> let config = {
    color_config: {
        separator: purple
        leading_trailing_space_bg: "#ffffff"
        header: gb
        date: wd
        filesize: c
        row_index: cb
        bool: red
        int: green
        duration: blue_bold
        range: purple
        float: red
        string: white
        nothing: red
        binary: red
        cellpath: cyan
        hints: dark_gray
    }
}
```

下面是另一个使用多种颜色语法的小例子，其中有一些注释：

```nu
> let config = {
    color_config: {
        separator: "#88b719" # this sets only the foreground color like PR #486
        leading_trailing_space_bg: white # this sets only the foreground color in the original style
        header: { # this is like PR #489
            fg: "#B01455", # note, quotes are required on the values with hex colors
            bg: "#ffb900",# note, commas are not required, it could also be all on one line
            attr: bli # note, there are no quotes around this value. it works with or without quotes
        }
        date: "#75507B"
        filesize: "#729fcf"
        row_index: {
            # note that this is another way to set only the foreground, no need to specify bg and attr
            fg: "#e50914"
        }
    }
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
| `shape_range`                | fg(Color::Yellow).bold()               | \*     |
| `shape_record`               | fg(Color::Cyan).bold()                 | \*     |
| `shape_signature`            | fg(Color::Green).bold()                | \*     |
| `shape_string`               | fg(Color::Green)                       | \*     |
| `shape_string_interpolation` | fg(Color::Cyan).bold()                 | \*     |
| `shape_table`                | fg(Color::Blue).bold()                 | \*     |
| `shape_variable`             | fg(Color::Purple)                      | \*     |

这里有一个小例子，说明如何对这些项目应用颜色。任何没有显示指定的都会被设置为默认的颜色。

```nu
> $env.config = {
    color_config: {
        shape_garbage: { fg: "#FFFFFF" bg: "#FF0000" attr: b}
        shape_bool: green
        shape_int: { fg: "#0000ff" attr: b}
    }
}
```

## "提示"的配置和着色

Nushell 的提示符可以通过这些环境变量进行配置：

- `PROMPT_COMMAND`: 为设置提示而执行的代码（块）
- `PROMPT_COMMAND_RIGHT`: 为设置 _RIGHT_ 提示而执行的代码（块）(参考 nu_scripts 里的 oh-my.nu)
- `PROMPT_INDICATOR` = "〉": 提示后打印的标识（默认为">"类 Unicode 符号）
- `PROMPT_INDICATOR_VI_INSERT` = ": "
- `PROMPT_INDICATOR_VI_NORMAL` = "v "
- `PROMPT_MULTILINE_INDICATOR` = "::: "

例如：对于一个简单的提示，我们可以这样做。注意`PROMPT_COMMAND`需要一个`block`而其他的需要一个`string`。

```nu
> $env.PROMPT_COMMAND = { build-string (date now | format date '%m/%d/%Y %I:%M:%S%.3f') ': ' (pwd | path basename) }
```

如果你不喜欢默认的`PROMPT_INDICATOR`，你可以这样改变它：

```nu
> $env.PROMPT_INDICATOR = "> "
```

提示的颜色由 `PROMPT_COMMAND` 中的 `block` 控制，在这里你可以编写自己的自定义提示。我们写了一个稍微花哨点的，有 git 状态的，位于 [nu_scripts 仓库](https://github.com/nushell/nu_scripts/blob/main/prompt/oh-my.nu)。

## `ls` 命令的配色:`LS_COLORS`

Nushell 将尊重并使用 Mac、Linux 和 Windows 上的 `LS_COLORS` 环境变量设置。这个设置允许你在做[`ls`](/commands/docs/ls.md)时定义文件类型的颜色。例如，你可以让目录变成一种颜色，`_.md` markdown 文件一种颜色，`_.toml` 文件变成另一种颜色，等等。有很多方法可以给你的文件类型着色。

有一个详尽的清单可以在 [这里](https://github.com/trapd00r/LS_COLORS) 看到，不过它可能太多了，但可以让你初步了解如何创建一个`ls_colors`文件，而`dircolors`可以把它变成`LS_COLORS`环境变量。

[这](https://www.linuxhowto.net/how-to-set-colors-for-ls-command/) 是对`LS_COLORS`的一个相当好的介绍。我相信你可以在网上找到更多相关教程。

我喜欢`vivid`应用程序，目前在我的`config.nu`中是这样配置的。你可以在 [这里](https://github.com/sharkdp/vivid) 找到`vivid`。

`$env.LS_COLORS = (vivid generate molokai | str trim)`。

如果没有设置 `LS_COLORS`，Nushell 将默认使用内置的 `LS_COLORS` 设置，基于 8 位（扩展）ANSI 颜色。

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

    # shape_garbage: { fg: $base07 bg: $base08 attr: b} # base16 white on red
    # but i like the regular white on red for parse errors
    shape_garbage: { fg: "#FFFFFF" bg: "#FF0000" attr: b}
    shape_bool: $base0d
    shape_int: { fg: $base0e attr: b}
    shape_float: { fg: $base0e attr: b}
    shape_range: { fg: $base0a attr: b}
    shape_internalcall: { fg: $base0c attr: b}
    shape_external: $base0c
    shape_externalarg: { fg: $base0b attr: b}
    shape_literal: $base0d
    shape_operator: $base0a
    shape_signature: { fg: $base0b attr: b}
    shape_string: $base0b
    shape_filepath: $base0d
    shape_globpattern: { fg: $base0d attr: b}
    shape_variable: $base0e
    shape_flag: { fg: $base0d attr: b}
    shape_custom: {attr: b}
}

# now let's apply our regular config settings but also apply the "color_config:" theme that we specified above.

let config = {
  filesize_metric: true
  table_mode: rounded # basic, compact, compact_double, light, thin, with_love, rounded, reinforced, heavy, none, other
  use_ls_colors: true
  color_config: $base16_theme # <-- this is the theme
  use_grid_icons: true
  footer_mode: always #always, never, number_of_rows, auto
  animate_prompt: false
  float_precision: 2
  use_ansi_coloring: true
  filesize_format: "b" # b, kb, kib, mb, mib, gb, gib, tb, tib, pb, pib, eb, eib, auto
  edit_mode: emacs # vi
  max_history_size: 10000
  log_level: error
}
```

如果你想在主题设计上火力全开，你需要把我在一开始提到的所有项目作为主题，包括`LS_COLORS`和提示。祝您好运!

### 在终端上使用浅色背景

Nushell 的默认配置文件包含一个浅色主题定义，如果你在浅色背景的终端上工作，你可以很容易地应用浅色主题：

```nu
# in $nu.config-file
$env.config = {
  ...
  color_config: $dark_theme   # 如果你需要浅色主题, 可以将 `$dark_theme` 替换为 `$light_theme`
  ...
}
```

你只需要将 `$dark_theme` 替换为 `$light_theme` 就可以切换到浅色主题了：

```nu
# in $nu.config-file
$env.config = {
  ...
  color_config: $light_theme   # if you want a light theme, replace `$dark_theme` to `$light_theme`
  ...
}
```
