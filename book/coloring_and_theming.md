# Coloring and Theming in Nu

Many parts of Nushell's interface can have their color customized. All of these can be set in the `config.nu` configuration file. If you see the `#` outside of a text value in the config file it means the text after it is commented out.

## Table Borders

Table borders are controlled by the `$env.config.table.mode` setting. It can be changed at run time, or in the `config.nu` file:

```nu
$env.config.table.mode = 'rounded'
```

The options for `$env.config.table.mode` can be listed with `table --list`:

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

Examples:

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

## Color Configuration

The color configuration is defined in `$env.config.color_config`. The current configuration can be printed with:

```nu
$env.config.color_config | sort
```

The color and style-attributes can be declared in multiple alternative formats.

- `r` - normal color red's abbreviation
- `rb` - normal color red's abbreviation with bold attribute
- `red` - normal color red
- `red_bold` - normal color red with bold attribute
- `"#ff0000"` - "#hex" format foreground color red (quotes are required)
- `{ fg: "#ff0000" bg: "#0000ff" attr: b }` - "full #hex" format foreground red in "#hex" format with a background of blue in "#hex" format with an attribute of bold abbreviated.
- `{|x| 'yellow' }` - closure returning a string with one of the color representations listed above
- `{|x| { fg: "#ff0000" bg: "#0000ff" attr: b } }` - closure returning a valid record

### Attributes

| code | meaning             |
| ---- | ------------------- |
| l    | blink               |
| b    | bold                |
| d    | dimmed              |
| h    | hidden              |
| i    | italic              |
| r    | reverse             |
| s    | strikethrough       |
| u    | underline           |
| n    | nothing             |
|      | defaults to nothing |

### Normal Colors and Abbreviations

| code      | name                      |
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

### `"#hex"` Format

The "#hex" format is one way you typically see colors represented. It's simply the `#` character followed by 6 characters. The first two are for `red`, the second two are for `green`, and the third two are for `blue`. It's important that this string be surrounded in quotes, otherwise Nushell thinks it's a commented out string.

Example: The primary `red` color is `"#ff0000"` or `"#FF0000"`. Upper and lower case in letters shouldn't make a difference.

This `"#hex"` format allows us to specify 24-bit truecolor tones to different parts of Nushell.

### Full `"#hex"` Format

The `full "#hex"` format is a take on the `"#hex"` format but allows one to specify the foreground, background, and attributes in one line.

Example: `{ fg: "#ff0000" bg: "#0000ff" attr: b }`

- foreground of red in "#hex" format
- background of blue in "#hex" format
- attribute of bold abbreviated

### Closure

Note: Closures are only executed for table output. They do not work in other contexts like for `shape_` configurations, when printing a value directly, or as a value in a list.

For example:

```nu
$env.config.color_config.filesize = {|x| if $x == 0b { 'dark_gray' } else if $x < 1mb { 'cyan' } else { 'blue' } }
$env.config.color_config.bool = {|x| if $x { 'green' } else { 'light_red' } }
{a:true,b:false,c:0mb,d:0.5mb,e:10mib}
```

prints

```nu
╭───┬───────────╮
│ a │ true      │
│ b │ false     │
│ c │ 0 B       │
│ d │ 488.3 KiB │
│ e │ 10.0 MiB  │
╰───┴───────────╯
```

with a green `true`, a light red `false`, a dark grey `0 B`, a cyan `488.3 KiB`, and a blue `10.0 MiB`.

## Primitive Values

Primitive values are things like `int` and `string`. Primitive values and shapes can be set with a variety of color symbologies seen above.

This is the current list of primitives. Not all of these are configurable. The configurable ones are marked with \*.

| primitive    | default color         | configurable |
| ------------ | --------------------- | ------------ |
| `any`        |                       |              |
| `binary`     | Color::White.normal() | \*           |
| `block`      | Color::White.normal() | \*           |
| `bool`       | Color::White.normal() | \*           |
| `cell-path`   | Color::White.normal() | \*           |
| `condition`  |                       |              |
| `custom`     |                       |              |
| `datetime`       | Color::White.normal() | \*           |
| `duration`   | Color::White.normal() | \*           |
| `expression` |                       |              |
| `filesize`   | Color::White.normal() | \*           |
| `float`      | Color::White.normal() | \*           |
| `glob`       |                       |              |
| `import`     |                       |              |
| `int`        | Color::White.normal() | \*           |
| `list`       | Color::White.normal() | \*           |
| `nothing`    | Color::White.normal() | \*           |
| `number`     |                       |              |
| `operator`   |                       |              |
| `path`       |                       |              |
| `range`      | Color::White.normal() | \*           |
| `record`     | Color::White.normal() | \*           |
| `signature`  |                       |              |
| `string`     | Color::White.normal() | \*           |
| `table`      |                       |              |
| `var`        |                       |              |
| `vardecl`    |                       |              |
| `variable`   |                       |              |

### Special "primitives" (not really primitives but they exist solely for coloring)

| primitive                   | default color              | configurable |
| --------------------------- | -------------------------- | ------------ |
| `leading_trailing_space_bg` | Color::Rgb(128, 128, 128)) | \*           |
| `header`                    | Color::Green.bold()        | \*           |
| `empty`                     | Color::Blue.normal()       | \*           |
| `row_index`                 | Color::Green.bold()        | \*           |
| `hints`                     | Color::DarkGray.normal()   | \*           |

Here's a small example of changing some of these values.

```nu
$env.config.color_config.separator = purple
$env.config.color_config.leading_trailing_space_bg = "#ffffff"
$env.config.color_config.header = gb
$env.config.color_config.datetime = wd
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
$env.config.color_config.cell-path = cyan
$env.config.color_config.hints = dark_gray
```

Here's another small example using multiple color syntaxes with some comments.

```nu
$env.config.color_config.separator = "#88b719" # this sets only the foreground color like PR #486
$env.config.color_config.leading_trailing_space_bg = white # this sets only the foreground color in the original style
$env.config.color_config.header = { # this is like PR #489
    fg: "#B01455", # note, quotes are required on the values with hex colors
    bg: "#ffb900", # note, commas are not required, it could also be all on one line
    attr: bli # note, there are no quotes around this value. it works with or without quotes
}
$env.config.color_config.datetime = "#75507B"
$env.config.color_config.filesize = "#729fcf"
$env.config.color_config.row_index = {
    # note, that this is another way to set only the foreground, no need to specify bg and attr
    fg: "#e50914"
}
```

## Shape Values

As mentioned above, `shape` is a term used to indicate the syntax coloring.

Here's the current list of flat shapes.

| shape                        | default style                          | configurable |
| ---------------------------- | -------------------------------------- | ------------ |
| `shape_block`                | fg(Color::Blue).bold()                 | \*           |
| `shape_bool`                 | fg(Color::LightCyan)                   | \*           |
| `shape_custom`               | bold()                                 | \*           |
| `shape_external`             | fg(Color::Cyan)                        | \*           |
| `shape_externalarg`          | fg(Color::Green).bold()                | \*           |
| `shape_filepath`             | fg(Color::Cyan)                        | \*           |
| `shape_flag`                 | fg(Color::Blue).bold()                 | \*           |
| `shape_float`                | fg(Color::Purple).bold()               | \*           |
| `shape_garbage`              | fg(Color::White).on(Color::Red).bold() | \*           |
| `shape_globpattern`          | fg(Color::Cyan).bold()                 | \*           |
| `shape_int`                  | fg(Color::Purple).bold()               | \*           |
| `shape_internalcall`         | fg(Color::Cyan).bold()                 | \*           |
| `shape_list`                 | fg(Color::Cyan).bold()                 | \*           |
| `shape_literal`              | fg(Color::Blue)                        | \*           |
| `shape_nothing`              | fg(Color::LightCyan)                   | \*           |
| `shape_operator`             | fg(Color::Yellow)                      | \*           |
| `shape_pipe`                 | fg(Color::Purple).bold()               | \*           |
| `shape_range`                | fg(Color::Yellow).bold()               | \*           |
| `shape_record`               | fg(Color::Cyan).bold()                 | \*           |
| `shape_signature`            | fg(Color::Green).bold()                | \*           |
| `shape_string`               | fg(Color::Green)                       | \*           |
| `shape_string_interpolation` | fg(Color::Cyan).bold()                 | \*           |
| `shape_table`                | fg(Color::Blue).bold()                 | \*           |
| `shape_variable`             | fg(Color::Purple)                      | \*           |

Here's a small example of how to apply color to these items. Anything not overridden will receive its default color.

```nu
$env.config.color_config.shape_garbage: { fg: "#FFFFFF" bg: "#FF0000" attr: b}
$env.config.color_config.shape_bool: green
$env.config.color_config.shape_int: { fg: "#0000ff" attr: b}
```

## Prompt Configuration and Coloring

The Nushell prompt is configurable through these environment variables and config items:

- `PROMPT_COMMAND`: Code to execute for setting up the prompt (block)
- `PROMPT_COMMAND_RIGHT`: Code to execute for setting up the _RIGHT_ prompt (block) (see oh-my.nu in nu_scripts)
- `PROMPT_INDICATOR` = "〉": The indicator printed after the prompt (by default ">"-like Unicode symbol)
- `PROMPT_INDICATOR_VI_INSERT` = ": "
- `PROMPT_INDICATOR_VI_NORMAL` = "v "
- `PROMPT_MULTILINE_INDICATOR` = "::: "
- `render_right_prompt_on_last_line`: Bool value to enable or disable the right prompt to be rendered on the last line of the prompt

Example: For a simple prompt one could do this. Note that `PROMPT_COMMAND` requires a `block` whereas the others require a `string`.

```nu
$env.PROMPT_COMMAND = { $"(date now | format date '%m/%d/%Y %I:%M:%S%.3f'): (pwd | path basename)" }
```

If you don't like the default `PROMPT_INDICATOR` you could change it like this.

```nu
$env.PROMPT_INDICATOR = "> "
```

If you're using `starship`, you'll most likely want to show the right prompt on the last line of the prompt, just like zsh or fish. You could modify the `config.nu` file, just set `render_right_prompt_on_last_line` to true:

```nu
$env.config.render_right_prompt_on_last_line = true
```

Coloring of the prompt is controlled by the `block` in `PROMPT_COMMAND` where you can write your own custom prompt. We've written a slightly fancy one that has git statuses located in the [nu_scripts repo](https://github.com/nushell/nu_scripts/blob/main/modules/prompt/oh-my.nu).

### Transient Prompt

If you want a different prompt displayed for previously entered commands, you can use Nushell's transient prompt feature. This can be useful if your prompt has lots of information that is unnecessary to show for previous lines (e.g. time and Git status), since you can make it so that previous lines show with a shorter prompt.

Each of the `PROMPT_*` variables has a corresponding `TRANSIENT_PROMPT_*` variable to be used for changing that segment when displaying past prompts: `TRANSIENT_PROMPT_COMMAND`, `TRANSIENT_PROMPT_COMMAND_RIGHT`, `TRANSIENT_PROMPT_INDICATOR`, `TRANSIENT_PROMPT_INDICATOR_VI_INSERT`, `TRANSIENT_PROMPT_INDICATOR_VI_NORMAL`, `TRANSIENT_PROMPT_MULTILINE_INDICATOR`. By default, the `PROMPT_*` variables are used for displaying past prompts.

For example, if you want to make past prompts show up without a left prompt entirely and leave only the indicator, you can use:

```nu
$env.TRANSIENT_PROMPT_COMMAND = ""
```

If you want to go back to the normal left prompt, you'll have to unset `TRANSIENT_PROMPT_COMMAND`:

```nu
hide-env TRANSIENT_PROMPT_COMMAND
```

## `LS_COLORS` Colors for the [`ls`](/commands/docs/ls.md) Command

Nushell will respect and use the `LS_COLORS` environment variable setting on Mac, Linux, and Windows. This setting allows you to define the coloring of file types when you do a [`ls`](/commands/docs/ls.md). For instance, you can make directories one color, `.md` Markdown files another color, `.toml` files yet another color, etc. There are a variety of ways to color and style your file types.

If `LS_COLORS` is not set, nushell will default to a built-in `LS_COLORS` setting, based on [8-bit (extended) ANSI colors](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit).

### Understanding `LS_COLORS`

`LS_COLORS` contains a colon (`:`) separated list of records that map file types and file names to styling attributes (`selector=attributes`).

The selector can be a file type specified like `di` for "directory identifier", or `*.nu` for files with the `.nu` file extension.

The attributes are a list of semicolon (`;`) separated numbers. Note that which attributes and attribute formats are supported depends on the terminal you are using.

- Style attributes like `0` normal, `1` bold, `3` italic, `5` blink, [etc](https://en.wikipedia.org/wiki/ANSI_escape_code#Select_Graphic_Rendition_parameters)
- [Foreground colors](https://en.wikipedia.org/wiki/ANSI_escape_code#3-bit_and_4-bit) `30`-`37` and `90`-`97`
- [Background colors](https://en.wikipedia.org/wiki/ANSI_escape_code#3-bit_and_4-bit) `40`-`47` and `100`-`107`
- [RGB foreground](https://en.wikipedia.org/wiki/ANSI_escape_code#24-bit) prefixed with `38;2`, optionally followed by additional attributes
- [RGB background](https://en.wikipedia.org/wiki/ANSI_escape_code#24-bit) prefixed with `48;2`, optionally followed by additional attributes

For example:

`$env.LS_COLORS = "di=1;34:*.nu=3;33;46"`: Bold directories, italic yellow foreground cyan background `*.nu` files

`$env.LS_COLORS = "di=48;2;200;0;0;5"`: Red background blinking directories

### vivid Themes

For example, you can use the third-party tool [vivid](https://github.com/sharkdp/vivid), which runs on multiple platforms, has [many themes defined](https://github.com/sharkdp/vivid/tree/master/themes), and generates a `LS_COLORS` configuration from it.

After downloading and extracting the binary, you can use it with:

```nu
$env.LS_COLORS = (vivid generate molokai)
```

or with an alternative theme:

```nu
$env.LS_COLORS = (vivid generate ayu)
```

You can put this command into your [Nushell configuration](/book/configuration.md) for it to become the default coloring.

## Theming

Theming combines all the coloring above. Here's a quick example of one we put together quickly to demonstrate the ability to theme. This is a spin on the `base16` themes that we see so widespread on the web.

The key to making theming work is to make sure you specify all themes and colors you're going to use in the `config.nu` file _before_ you declare the `let config = ` line.

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
    datetime: $base0e
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
    cell-path: $base08
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
$env.config.ls.use_ls_colors: true
$env.config.max_history_size: 10000
$env.config.table_mode: rounded # basic, compact, compact_double, light, thin, with_love, rounded, reinforced, heavy, none, other
$env.config.use_ansi_coloring: true
$env.config.use_grid_icons: true
```

if you want to go full-tilt on theming, you'll want to theme all the items I mentioned at the very beginning, including LS_COLORS, and the prompt. Good luck!

### Working on Light Background Terminal

Nushell's [standard library](/book/standard_library.md) contains a `config` module with default light and dark themes.
If you are working on a light background terminal, you can apply the light theme easily.

```nu
# in $nu.config-path
use std/config light-theme   # add this line to load the theme into scope

$env.config = {
  # ...
  color_config: (light-theme)   # after using dark-theme or light-theme from std, you can change this with `(dark-theme)` in place of `(light-theme)`.
  # ...
}
```

You can also load the dark theme.

```nu
# in $nu.config-path
use std/config dark-theme

$env.config = {
  # ...
  color_config: (dark-theme)
  # ...
}
```

## Accessibility

It's often desired to have the minimum amount of decorations when using a screen reader. In those cases, it's possible to disable borders and other decorations for both table and errors with the following options:

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

## Line Editor Menus (completion, history, help…)

Reedline (Nu’s line editor) style is not using the `color_config` key.
Instead, each menu has its own style to be configured separately.
See the [section dedicated to Reedline’s menus configuration](line_editor.md#menus) to learn more on this.
