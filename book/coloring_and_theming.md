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
- `frameless`
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

The names ignore case, so `'PSQL'` works too. `default` is another name for `rounded`, so after you assign `'default'`, the setting reads back as `rounded`.

To draw one table in a different mode, pass it to [`table --theme`](/commands/docs/table.md) (`-t`) and leave the setting alone. To use a mode for a whole session, start Nushell with `nu --table-mode <mode>` (`-m`). The flag overrides the mode from `config.nu`, but `$env.config.table.mode` keeps the configured value, and the override lasts only until something changes `$env.config`. After any assignment, even `$env.config.footer_mode = 30`, tables go back to the configured mode.

```nu
[[a b]; [1 2]] | table --theme markdown
# => | # | a | b |
# => |---|---|---|
# => | 0 | 1 | 2 |
```

Examples:

```nu
$env.config.table.mode = 'rounded'
table --list | first 5
# => ╭───┬────────────────╮
# => │ 0 │ basic          │
# => │ 1 │ compact        │
# => │ 2 │ compact_double │
# => │ 3 │ default        │
# => │ 4 │ frameless      │
# => ╰───┴────────────────╯

$env.config.table.mode = 'psql'
table --list | first 5
# =>  0 | basic
# =>  1 | compact
# =>  2 | compact_double
# =>  3 | default
# =>  4 | frameless

$env.config.table.mode = 'rounded' # back to the default
```

## Other table display settings

`$env.config.footer_mode` decides when a table repeats its column names below the last row. Only tables with a header row get a footer, such as a list of records. A plain list never does.

- `"always"` and `"never"` do what their names say.
- An integer adds the footer once the table has at least that many rows. The default is `25`.
- `"auto"` adds the footer when the table's rows, counting the header row, fill the terminal's height, which is about when the header scrolls out of view.

```nu
$env.config.footer_mode = 3
[[name]; [a] [b] [c]]
# => ╭───┬──────╮
# => │ # │ name │
# => ├───┼──────┤
# => │ 0 │ a    │
# => │ 1 │ b    │
# => │ 2 │ c    │
# => ├───┼──────┤
# => │ # │ name │
# => ╰───┴──────╯
```

`$env.config.float_precision` sets how many decimal places a float gets when Nushell draws it inside a table, list, or record. The default is `2`. It only changes what you see. The float keeps its full precision, and a float printed on its own or converted to a string isn't rounded.

```nu
$env.config.float_precision = 4
[3.14159 2.0]
# => ╭───┬────────╮
# => │ 0 │ 3.1416 │
# => │ 1 │ 2.0000 │
# => ╰───┴────────╯
3.14159
# => 3.14159
3.14159 | into string
# => 3.14159
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

Color names are case-sensitive. `red` works, but `Red` and `RED` don't. Nushell doesn't report a name it doesn't know. It draws the text in the terminal's default color instead, so a typo shows up as missing color rather than as an error.

A string that starts with `{` is read as a JSON style record, so `'{"fg": "red", "attr": "u"}'` works like the record `{ fg: red attr: u }`. It has to be valid JSON, with every key and value in double quotes.

### Attributes

| code | name                      |
| ---- | ------------------------- |
| l    | `blink`                   |
| b    | `bold`                    |
| d    | `dimmed`                  |
| h    | `hidden`                  |
| i    | `italic`                  |
| r    | `reverse`                 |
| s    | `strike`, `strikethrough` |
| u    | `underline`               |
| n    | `normal` (no attribute)   |
|      | defaults to nothing       |

`attr` takes codes or names, in any case. Codes can run together, so `attr: bi` is bold italic, and names go in one string separated by spaces, as in `attr: 'bold italic'`. If any part of `attr` isn't a code or a name, or the string contains a comma, Nushell ignores the whole style, `fg` and `bg` included, and draws the value unstyled.

### Normal Colors and Abbreviations

These names set the foreground color. For a background color, use the record format, such as `{ bg: red }`. The `bg_*` names that the [`ansi`](/commands/docs/ansi.md) command accepts, such as `bg_red`, have no effect in `color_config`. Every color except `default` also has a `_blink` and a `_strike` form.

| code     | name                      |
| -------- | ------------------------- |
| `g`      | `green`                   |
| `gb`     | `green_bold`              |
| `gu`     | `green_underline`         |
| `gi`     | `green_italic`            |
| `gd`     | `green_dimmed`            |
| `gr`     | `green_reverse`           |
| `gbl`    | `green_blink`             |
| `gst`    | `green_strike`            |
| `lg`     | `light_green`             |
| `lgb`    | `light_green_bold`        |
| `lgu`    | `light_green_underline`   |
| `lgi`    | `light_green_italic`      |
| `lgd`    | `light_green_dimmed`      |
| `lgr`    | `light_green_reverse`     |
| `lgbl`   | `light_green_blink`       |
| `lgst`   | `light_green_strike`      |
| `r`      | `red`                     |
| `rb`     | `red_bold`                |
| `ru`     | `red_underline`           |
| `ri`     | `red_italic`              |
| `rd`     | `red_dimmed`              |
| `rr`     | `red_reverse`             |
| `rbl`    | `red_blink`               |
| `rst`    | `red_strike`              |
| `lr`     | `light_red`               |
| `lrb`    | `light_red_bold`          |
| `lru`    | `light_red_underline`     |
| `lri`    | `light_red_italic`        |
| `lrd`    | `light_red_dimmed`        |
| `lrr`    | `light_red_reverse`       |
| `lrbl`   | `light_red_blink`         |
| `lrst`   | `light_red_strike`        |
| `u`      | `blue`                    |
| `ub`     | `blue_bold`               |
| `uu`     | `blue_underline`          |
| `ui`     | `blue_italic`             |
| `ud`     | `blue_dimmed`             |
| `ur`     | `blue_reverse`            |
| `ubl`    | `blue_blink`              |
| `ust`    | `blue_strike`             |
| `lu`     | `light_blue`              |
| `lub`    | `light_blue_bold`         |
| `luu`    | `light_blue_underline`    |
| `lui`    | `light_blue_italic`       |
| `lud`    | `light_blue_dimmed`       |
| `lur`    | `light_blue_reverse`      |
| `lubl`   | `light_blue_blink`        |
| `lust`   | `light_blue_strike`       |
| `b`      | `black`                   |
| `bb`     | `black_bold`              |
| `bu`     | `black_underline`         |
| `bi`     | `black_italic`            |
| `bd`     | `black_dimmed`            |
| `br`     | `black_reverse`           |
| `bbl`    | `black_blink`             |
| `bst`    | `black_strike`            |
| `ligr`   | `light_gray`              |
| `ligrb`  | `light_gray_bold`         |
| `ligru`  | `light_gray_underline`    |
| `ligri`  | `light_gray_italic`       |
| `ligrd`  | `light_gray_dimmed`       |
| `ligrr`  | `light_gray_reverse`      |
| `ligrbl` | `light_gray_blink`        |
| `ligrst` | `light_gray_strike`       |
| `y`      | `yellow`                  |
| `yb`     | `yellow_bold`             |
| `yu`     | `yellow_underline`        |
| `yi`     | `yellow_italic`           |
| `yd`     | `yellow_dimmed`           |
| `yr`     | `yellow_reverse`          |
| `ybl`    | `yellow_blink`            |
| `yst`    | `yellow_strike`           |
| `ly`     | `light_yellow`            |
| `lyb`    | `light_yellow_bold`       |
| `lyu`    | `light_yellow_underline`  |
| `lyi`    | `light_yellow_italic`     |
| `lyd`    | `light_yellow_dimmed`     |
| `lyr`    | `light_yellow_reverse`    |
| `lybl`   | `light_yellow_blink`      |
| `lyst`   | `light_yellow_strike`     |
| `p`      | `purple`                  |
| `pb`     | `purple_bold`             |
| `pu`     | `purple_underline`        |
| `pi`     | `purple_italic`           |
| `pd`     | `purple_dimmed`           |
| `pr`     | `purple_reverse`          |
| `pbl`    | `purple_blink`            |
| `pst`    | `purple_strike`           |
| `lp`     | `light_purple`            |
| `lpb`    | `light_purple_bold`       |
| `lpu`    | `light_purple_underline`  |
| `lpi`    | `light_purple_italic`     |
| `lpd`    | `light_purple_dimmed`     |
| `lpr`    | `light_purple_reverse`    |
| `lpbl`   | `light_purple_blink`      |
| `lpst`   | `light_purple_strike`     |
| `m`      | `magenta`                 |
| `mb`     | `magenta_bold`            |
| `mu`     | `magenta_underline`       |
| `mi`     | `magenta_italic`          |
| `md`     | `magenta_dimmed`          |
| `mr`     | `magenta_reverse`         |
| `mbl`    | `magenta_blink`           |
| `mst`    | `magenta_strike`          |
| `lm`     | `light_magenta`           |
| `lmb`    | `light_magenta_bold`      |
| `lmu`    | `light_magenta_underline` |
| `lmi`    | `light_magenta_italic`    |
| `lmd`    | `light_magenta_dimmed`    |
| `lmr`    | `light_magenta_reverse`   |
| `lmbl`   | `light_magenta_blink`     |
| `lmst`   | `light_magenta_strike`    |
| `c`      | `cyan`                    |
| `cb`     | `cyan_bold`               |
| `cu`     | `cyan_underline`          |
| `ci`     | `cyan_italic`             |
| `cd`     | `cyan_dimmed`             |
| `cr`     | `cyan_reverse`            |
| `cbl`    | `cyan_blink`              |
| `cst`    | `cyan_strike`             |
| `lc`     | `light_cyan`              |
| `lcb`    | `light_cyan_bold`         |
| `lcu`    | `light_cyan_underline`    |
| `lci`    | `light_cyan_italic`       |
| `lcd`    | `light_cyan_dimmed`       |
| `lcr`    | `light_cyan_reverse`      |
| `lcbl`   | `light_cyan_blink`        |
| `lcst`   | `light_cyan_strike`       |
| `w`      | `white`                   |
| `wb`     | `white_bold`              |
| `wu`     | `white_underline`         |
| `wi`     | `white_italic`            |
| `wd`     | `white_dimmed`            |
| `wr`     | `white_reverse`           |
| `wbl`    | `white_blink`             |
| `wst`    | `white_strike`            |
| `dgr`    | `dark_gray`               |
| `dgrb`   | `dark_gray_bold`          |
| `dgru`   | `dark_gray_underline`     |
| `dgri`   | `dark_gray_italic`        |
| `dgrd`   | `dark_gray_dimmed`        |
| `dgrr`   | `dark_gray_reverse`       |
| `dgrbl`  | `dark_gray_blink`         |
| `dgrst`  | `dark_gray_strike`        |
| `def`    | `default`                 |
| `defb`   | `default_bold`            |
| `defu`   | `default_underline`       |
| `defi`   | `default_italic`          |
| `defd`   | `default_dimmed`          |
| `defr`   | `default_reverse`         |

<!-- These rows come from lookup_style() in crates/nu-color-config/src/nu_style.rs. Don't regenerate them from ansi --list: ansi uses k for black and b for blue where color_config uses b and u, and it has no _blink or _strike names. -->

`color_config` also accepts the 256 xterm colors that [`ansi --list`](/commands/docs/ansi.md) shows with an `xterm_` prefix, such as `xterm_navy` or `xterm_grey42`. Most of them also work under the name in the `short_name` column of `ansi --list`, such as `navy` or `grey42`, but the `xterm_` names are safer because the short names don't always match. `ansi` calls `xterm_purplec` `xpurplec`, while `color_config` calls it `purplec`. These colors have no `_bold` or other forms, so add attributes with a record, such as `{ fg: xterm_navy attr: b }`.

### `"#hex"` Format

The "#hex" format is one way you typically see colors represented. It's simply the `#` character followed by 6 characters. The first two are for `red`, the second two are for `green`, and the third two are for `blue`. It's important that this string be surrounded in quotes, otherwise Nushell thinks it's a commented out string.

Example: The primary `red` color is `"#ff0000"` or `"#FF0000"`. Upper and lower case in letters shouldn't make a difference.

Only the six-digit form works, as a plain string or as `fg` or `bg` in a record. The three-digit shorthand that CSS allows, such as `"#f00"`, gives no color.

This `"#hex"` format allows us to specify 24-bit truecolor tones to different parts of Nushell.

### Full `"#hex"` Format

The `full "#hex"` format is a take on the `"#hex"` format but allows one to specify the foreground, background, and attributes in one line.

Example: `{ fg: "#ff0000" bg: "#0000ff" attr: b }`

- foreground of red in "#hex" format
- background of blue in "#hex" format
- attribute of bold abbreviated

### Closure

Nushell runs these closures only when it draws a table, which includes lists and records, since Nushell draws those as tables too. A value printed on its own, such as a bare `3`, isn't styled at all, and the `shape_*` keys don't accept closures.

For example:

```nu
$env.config.color_config.filesize = {|x| if $x == 0b { 'dark_gray' } else if $x < 1mb { 'cyan' } else { 'blue' } }
$env.config.color_config.bool = {|x| if $x { 'green' } else { 'light_red' } }
{a:true,b:false,c:0mb,d:0.5mb,e:10mib}
# => ╭───┬──────────╮
# => │ a │ true     │
# => │ b │ false    │
# => │ c │ 0 B      │
# => │ d │ 500.0 kB │
# => │ e │ 10.4 MB  │
# => ╰───┴──────────╯
```

The table shows a green `true`, a light red `false`, a dark grey `0 B`, a cyan `500.0 kB`, and a blue `10.4 MB`.

The closure gets the value both as its parameter and as `$in`, so `{|| if $in { 'green' } else { 'light_red' } }` works the same as the `bool` closure above. It has to return a color string or a style record. Any other result, such as a number, leaves the value unstyled. If the closure raises an error, Nushell prints the error once for each value it was styling and draws those values unstyled.

## Primitive Values

Primitive values are things like `int` and `string`. Primitive values and shapes can be set with a variety of color symbologies seen above.

These keys style values of each type when Nushell draws them in a table, list, or record.

| key            | default style |
| -------------- | ------------- |
| `binary`       | `default`     |
| `block`        | `default`     |
| `bool`         | `light_cyan`  |
| `cell-path`    | `default`     |
| `closure`      | `green_bold`  |
| `custom`       | not set       |
| `datetime`     | `purple`      |
| `duration`     | `default`     |
| `filesize`     | `cyan`        |
| `float`        | `default`     |
| `glob`         | `cyan_bold`   |
| `int`          | `default`     |
| `list`         | `default`     |
| `nothing`      | `default`     |
| `range`        | `default`     |
| `record`       | `default`     |
| `semver`       | `cyan_bold`   |
| `semver-range` | `cyan_bold`   |
| `string`       | `default`     |

A few of these keys behave differently from the rest:

- `list` and `record` style the `[list 2 items]` and `{record 1 field}` summaries that a table shows in place of a nested value. `list` also styles the `[table 1 row]` summary of a nested table.
- `block` and `closure` are accepted but change nothing. A closure in a table is drawn unstyled whatever `closure` says.
- `custom` isn't part of the default `color_config`.

Other type names, such as `any`, `number`, or `table`, aren't `color_config` keys, and setting them has no effect.

### Special "primitives" (not really primitives but they exist solely for coloring)

| key                         | default style              | styles                                                         |
| --------------------------- | -------------------------- | -------------------------------------------------------------- |
| `leading_trailing_space_bg` | `{ attr: n }`              | spaces at the start and end of strings in tables               |
| `header`                    | `green_bold`               | column headers, the `#` heading, and the keys of a record      |
| `empty`                     | `blue`                     | the placeholder for a missing cell                             |
| `row_index`                 | `green_bold`               | the index numbers in the `#` column                            |
| `separator`                 | `default`                  | the borders of tables, lists, and records                      |
| `hints`                     | `dark_gray`                | inline hints in the line editor                                |
| `status_line`               | the `hints` style          | the [status line](line_editor.md#status-line) under the prompt |
| `status_line_error`         | `red`                      | an error shown in the status line                              |
| `search_result`             | `{ bg: red, fg: default }` | the matches that [`find`](/commands/docs/find.md) highlights   |
| `selection`                 | `{ attr: r }`              | text selected in Vi visual mode or Helix mode                  |
| `selection_cursor`          | `{ attr: n }`              | the character under the cursor inside a selection              |
| `binary_null_char`          | `grey42`                   | `00` bytes in the binary hex view                              |
| `binary_printable`          | `cyan_bold`                | printable ASCII bytes in the hex view                          |
| `binary_whitespace`         | `green_bold`               | ASCII whitespace bytes in the hex view                         |
| `binary_ascii_other`        | `purple_bold`              | other ASCII bytes, such as control characters                  |
| `binary_non_ascii`          | `yellow_bold`              | bytes above `0x7f`                                             |

`leading_trailing_space_bg` needs a background color, such as `{ bg: dark_gray }`, because a foreground color has nothing to draw on a space. The default `{ attr: n }` turns the highlight off.

`empty` styles the symbol that `$env.config.table.missing_value_symbol` sets for a cell a row doesn't have. The default symbol is an emoji, and many terminals draw emoji in their own colors, so `empty` may not change anything until you pick a plain-text symbol.

The `binary_*` keys color the hex view that Nushell shows for a binary value printed on its own, such as `0x[41 00 20 ff]`. Each key covers one class of byte.

Here's a small example of changing some of these values. Note that the color names are quoted: Nushell treats a bare word on the right side of `=` as a command name, so `= purple` is a parse error.

```nu
$env.config.color_config.separator = 'purple'
$env.config.color_config.leading_trailing_space_bg = { bg: "#ffffff" }
$env.config.color_config.header = 'gb'
$env.config.color_config.datetime = 'wd'
$env.config.color_config.filesize = 'c'
$env.config.color_config.row_index = 'cb'
$env.config.color_config.bool = 'red'
$env.config.color_config.int = 'green'
$env.config.color_config.duration = 'blue_bold'
$env.config.color_config.range = 'purple'
$env.config.color_config.float = 'red'
$env.config.color_config.string = 'white'
$env.config.color_config.nothing = 'red'
$env.config.color_config.binary = 'red'
$env.config.color_config.cell-path = 'cyan'
$env.config.color_config.hints = 'dark_gray'
```

Here's another small example using multiple color syntaxes with some comments.

```nu
$env.config.color_config.separator = "#88b719" # this sets only the foreground color like PR #486
$env.config.color_config.leading_trailing_space_bg = { bg: 'white' } # spaces have no foreground, so set a background
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

### Keys for the banner and for theme scripts

Three more keys color the welcome banner: `banner_foreground` (default `attr_normal`), `banner_highlight1` (default `green`), and `banner_highlight2` (default `purple`). They aren't in the default `color_config`, and the banner uses those defaults when they're missing. The [`banner`](/commands/docs/banner.md) command passes them to [`ansi`](/commands/docs/ansi.md), so they take what `ansi` takes: its names, such as `attr_normal` or `green`, `"#hex"` strings, and records. Short forms that only `color_config` knows, such as `gbl`, make `banner` fail with an "Unknown ansi code" error.

`foreground`, `background`, and `cursor` are also accepted, but Nushell never reads them. They're there for scripts that set the terminal's own colors, such as the `theme` commands in [nu_scripts](https://github.com/nushell/nu_scripts/tree/main/themes). None of the three is set by default.

## Shape Values

As mentioned above, `shape` is a term used to indicate the syntax coloring.

Here's the current list of flat shapes.

| shape                        | default style                       | colors                                                                                         |
| ---------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| `shape_binary`               | `purple_bold`                       | binary literals such as `0x[ff]`                                                               |
| `shape_block`                | `blue_bold`                         | the braces of a block, as in `if true { }`, and the parentheses of a subexpression             |
| `shape_bool`                 | `light_cyan`                        | `true` and `false`                                                                             |
| `shape_closure`              | `green_bold`                        | the braces and parameters of a closure                                                         |
| `shape_custom`               | `green`                             | not used                                                                                       |
| `shape_datetime`             | `cyan_bold`                         | datetime literals such as `2020-01-01`                                                         |
| `shape_directory`            | `cyan`                              | arguments that must be a directory, such as `foo` in `cd foo`                                  |
| `shape_external`             | `cyan`                              | a command that Nushell will run as an external command                                         |
| `shape_external_resolved`    | `light_yellow_bold`                 | an external command found in `PATH`, when `$env.config.highlight_resolved_externals` is `true` |
| `shape_externalarg`          | `green_bold`                        | the arguments of an external command                                                           |
| `shape_filepath`             | `cyan`                              | file path arguments, such as `out.txt` in `save out.txt`                                       |
| `shape_flag`                 | `blue_bold`                         | flags such as `--all` and `-a`                                                                 |
| `shape_float`                | `purple_bold`                       | float literals                                                                                 |
| `shape_garbage`              | `{ fg: default, bg: red, attr: b }` | text that doesn't parse, including an incomplete expression while you type                     |
| `shape_glob_interpolation`   | `cyan_bold`                         | deprecated                                                                                     |
| `shape_globpattern`          | `cyan_bold`                         | glob arguments, such as `*.txt` in `ls *.txt`                                                  |
| `shape_int`                  | `purple_bold`                       | integer literals                                                                               |
| `shape_internalcall`         | `cyan_bold`                         | the names of Nushell commands                                                                  |
| `shape_keyword`              | `cyan_bold`                         | keywords inside a command's syntax, such as `else`, `catch`, and the `in` of `for x in`        |
| `shape_list`                 | `cyan_bold`                         | the brackets of a list literal                                                                 |
| `shape_literal`              | `blue`                              | not used                                                                                       |
| `shape_match_pattern`        | `green`                             | the patterns of a `match` arm                                                                  |
| `shape_matching_brackets`    | `default_underline`                 | the bracket that pairs with the one under the cursor, on top of its usual style                |
| `shape_nothing`              | `light_cyan`                        | `null`                                                                                         |
| `shape_operator`             | `yellow`                            | operators such as `+` and `==`, and the `..` of a range                                        |
| `shape_pipe`                 | `purple_bold`                       | the pipe symbol                                                                                |
| `shape_range`                | `yellow_bold`                       | not used. A range such as `1..5` gets `shape_int` and `shape_operator`                         |
| `shape_raw_string`           | `light_purple`                      | raw strings such as `r#'text'#`                                                                |
| `shape_record`               | `cyan_bold`                         | the braces and colons of a record literal                                                      |
| `shape_redirection`          | `purple_bold`                       | redirections such as `o>` and `e>`                                                             |
| `shape_signature`            | `green_bold`                        | the parameter list of a `def`                                                                  |
| `shape_string`               | `green`                             | strings, including bare words that Nushell reads as strings                                    |
| `shape_string_interpolation` | `cyan_bold`                         | the `$"` and `"` around an interpolated string                                                 |
| `shape_table`                | `blue_bold`                         | the brackets and `;` of a table literal                                                        |
| `shape_variable`             | `purple`                            | variables such as `$env`                                                                       |
| `shape_vardecl`              | `purple`                            | the name a variable gets when it's declared, such as `x` in `let x = 1`                        |

A shape key that's missing, or set to something other than a string or a record, falls back to its default style. Shape keys don't accept closures.

Here's a small example of how to apply color to these items. Anything not overridden will receive its default color.

```nu
$env.config.color_config.shape_garbage = { fg: "#FFFFFF" bg: "#FF0000" attr: b}
$env.config.color_config.shape_bool = 'green'
$env.config.color_config.shape_int = { fg: "#0000ff" attr: b}
```

## Prompt Configuration and Coloring

The Nushell prompt is configurable through these environment variables and config items:

- `PROMPT_COMMAND`: Code to execute for setting up the prompt (block)
- `PROMPT_COMMAND_RIGHT`: Code to execute for setting up the _RIGHT_ prompt (block) (see oh-my.nu in nu_scripts)
- `PROMPT_INDICATOR` = "> ": The indicator printed after the prompt in Emacs mode
- `PROMPT_INDICATOR_VI_INSERT` = ": ": The indicator in Vi insert mode (and Helix insert mode)
- `PROMPT_INDICATOR_VI_NORMAL` = "> ": The indicator in Vi normal and visual mode (and Helix normal and select mode)
- `PROMPT_MULTILINE_INDICATOR` = "::: "
- `render_right_prompt_on_last_line`: Bool value to enable or disable the right prompt to be rendered on the last line of the prompt

Example: For a simple prompt one could do this. Each `PROMPT_*` variable takes either a string or a closure that returns one, and Nushell runs the closure every time it draws the prompt.

```nu
$env.PROMPT_COMMAND = { $"(date now | format date '%m/%d/%Y %I:%M:%S%.3f'): (pwd | path basename)" }
```

If you don't like the default `PROMPT_INDICATOR` you could change it like this.

```nu
$env.PROMPT_INDICATOR = "❯ "
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

::: details What the built-in LS_COLORS contains

The built-in setting has close to 700 entries. Most of them match file extensions or file names, and they fall into these groups. The numbers after `38;5;` and `48;5;` are 256-color palette indexes for the foreground and background.

| entries                                                               | style                 | looks like              |
| --------------------------------------------------------------------- | --------------------- | ----------------------- |
| `di` (directories)                                                    | `0;38;5;81`           | light blue              |
| `ex` (executables), and files such as `*.exe`, `*.dll`, `*.so`        | `1;38;5;203`          | bold red                |
| `ln` (symbolic links)                                                 | `0;38;5;203`          | red                     |
| `or` and `mi` (broken links), `do` (doors), `so` (sockets)            | `0;38;5;16;48;5;203`  | black on red            |
| `pi` (named pipes)                                                    | `0;38;5;16;48;5;81`   | black on light blue     |
| `bd` (block devices)                                                  | `0;38;5;81;48;5;236`  | light blue on dark grey |
| `cd` (character devices)                                              | `0;38;5;203;48;5;236` | red on dark grey        |
| source code, such as `*.rs`, `*.py`, `*.nu`, `*.sh`                   | `0;38;5;48`           | green                   |
| configuration and build files, such as `*.toml`, `*.json`, `Makefile` | `0;38;5;149`          | yellow-green            |
| text and markup, such as `*.md`, `*.txt`, `*.html`                    | `0;38;5;185`          | yellow                  |
| documents, such as `*.pdf`, `*.csv`, `*.docx`                         | `0;38;5;186`          | pale yellow             |
| images, audio, and video, such as `*.png`, `*.mp3`                    | `0;38;5;208`          | orange                  |
| archives, such as `*.zip`, `*.gz`                                     | `4;38;5;203`          | underlined red          |
| build output and temporary files, such as `*.o`, `*.log`, `*~`        | `0;38;5;243`          | grey                    |
| `README`, `CHANGELOG`, and similar files                              | `0;38;5;16;48;5;186`  | black on pale yellow    |
| `LICENSE`, `COPYING`, and similar files                               | `0;38;5;249`          | light grey              |
| `TODO`                                                                | `1`                   | bold                    |
| `fi` (regular files) and anything not listed                          | `0`                   | no color                |

:::

To stop [`ls`](/commands/docs/ls.md) output from using `LS_COLORS`, built-in or not, set `$env.config.ls.use_ls_colors = false`. File names then get the `color_config.string` style like any other string, and they lose the clickable links that `ls` adds when `shell_integration.osc8` is on. The setting defaults to `true`.

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

The key to making theming work is to make sure you define all themes and colors you're going to use in the `config.nu` file _before_ you assign them to `$env.config.color_config`.

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
    leading_trailing_space_bg: { bg: $base04 }
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

$env.config.color_config = $base16_theme # <-- this is the theme
$env.config.edit_mode = 'emacs' # emacs, vi, helix
$env.config.filesize.unit = 'metric'
$env.config.float_precision = 2
$env.config.footer_mode = 'always' # always, never, auto, or a number of rows
$env.config.ls.use_ls_colors = true
$env.config.table.mode = 'rounded' # ascii_rounded, basic, basic_compact, compact, compact_double, default, dots, double, frameless, heavy, light, markdown, none, psql, reinforced, restructured, rounded, single, thin, with_love
$env.config.use_ansi_coloring = 'auto' # auto, true, false
```

Assigning a record to `$env.config.color_config` replaces the whole map. Keys the theme leaves out disappear from `$env.config.color_config`, along with any value you gave them earlier, and Nushell draws those items in their built-in default style:

```nu
$env.config.color_config = { header: red }
$env.config.color_config | columns
# => ╭───┬────────╮
# => │ 0 │ header │
# => ╰───┴────────╯
```

After this, a `bool` in a table is still light cyan, its built-in default. Code that reads a key directly, such as `ansi $env.config.color_config.shape_external`, fails with "Cannot find column" once the key is gone, so read keys a theme might leave out with `?`, as in `$env.config.color_config.shape_external?`. To change only a few colors, set those keys one at a time (`$env.config.color_config.header = 'red'`) instead of assigning a record.

If you want to go full-tilt on theming, you'll want to theme all the items I mentioned at the very beginning, including LS_COLORS, and the prompt. Good luck!

### Working on Light Background Terminal

Nushell's [standard library](/book/standard_library.md) contains a `config` module with default light and dark themes.
If you are working on a light background terminal, you can apply the light theme easily.

```nu
# in $nu.config-path
use std/config light-theme   # add this line to load the theme into scope

$env.config.color_config = (light-theme)
```

You can also load the dark theme.

```nu
# in $nu.config-path
use std/config dark-theme

$env.config.color_config = (dark-theme)
```

Both commands return a record you can inspect or change before assigning it. `dark-theme` looks like the built-in default theme except for `search_result` and `shape_garbage`, which use white text where the defaults use the terminal's default color. `light-theme` draws most values (`int`, `string`, `float`, `duration`, and others) and the table borders in `dark_gray`, so they stay readable on a light background.

Neither theme sets `closure`, `glob`, `semver`, `semver-range`, `selection`, `selection_cursor`, or `status_line_error`. Since assigning a theme replaces the whole map, those keys disappear from `$env.config.color_config`, and Nushell draws those items in their built-in default style.

## Turning colors on and off

`$env.config.use_ansi_coloring` decides whether Nushell's own output, such as tables, help text, and error messages, uses color. It takes three values:

- `"auto"`, the default, decides from the environment, as described below.
- `true` always uses color, and `false` never does. The strings `"true"` and `"false"` work too. With either value, Nushell ignores the environment variables below.

In `"auto"` mode, Nushell goes through these checks in order and stops at the first one that applies:

1. If `FORCE_COLOR` is true, use color.
1. If `NO_COLOR` is true, don't use color.
1. If `CLICOLOR` is set, use color when it's true and don't when it's false.
1. If `TERM` is `dumb`, don't use color.
1. Otherwise, use color only when standard output is a terminal.

Nushell reads each of these variables as a boolean. An empty value, `0`, and `false` count as false, and anything else, including `no`, counts as true. So `NO_COLOR=0` doesn't turn colors off, although some other programs treat any non-empty `NO_COLOR` as a request for no color. The variable names match in any case, so `force_color` works as well, but the value of `TERM` has to be lowercase `dumb`.

[`config use-colors`](/commands/docs/config_use-colors.md) returns the result of this check, which is handy in scripts that build their own colored output:

```nu
$env.config.use_ansi_coloring = false
config use-colors
# => false
```

The setting doesn't affect the [`ansi`](/commands/docs/ansi.md) command. `ansi red` returns the escape code for red even when `use_ansi_coloring` is `false`.

## Gradient text

[`ansi gradient`](/commands/docs/ansi_gradient.md) colors a string one character at a time, shading from one color to another. `--fgstart` and `--fgend` set the foreground color at the two ends of the string, and `--bgstart` and `--bgend` do the same for the background. You need at least one of these flags, or one of the named gradients described below, otherwise the command fails with a "Missing parameter" error. If you give a start color without an end color, or the other way around, the missing one is black.

Write each color as `0x` followed by six hex digits, such as `0x40c9ff`. Any other form, including `#40c9ff`, quietly turns into black. In this example, `str replace` makes the escape codes visible:

```nu
'abcd' | ansi gradient --fgstart '0xff0000' --fgend '0x0000ff' | str replace --all (ansi escape) '\e'
# => \e[38;2;255;0;0ma\e[38;2;191;0;63mb\e[38;2;127;0;127mc\e[38;2;63;0;191md\e[0m
```

Each character gets the color for its position divided by the length of the string, so the last character stops one step short of the end color.

`--fgnamed` and `--bgnamed` take the name of a built-in gradient instead of two colors, such as `rainbow` or `forest`, in any case. `ansi gradient --list` returns a table with each `name` and a sample `text`. A named gradient can't be mixed with a start or end color for the same layer, but a named foreground works with a two-color background, and the other way around.

The input can be a string or a list of strings. For a record or a table, pass cell paths to choose which strings get the gradient, as in `ansi gradient --fgstart '0xff0000' name`. Without cell paths, a record or table input is an error, because every value has to be a string.

`ansi gradient` treats its input as plain characters. Escape codes already in the string get colored too, one character at a time, which breaks them and prints parts of them, such as `[31m`, as text. Remove them first with [`ansi strip`](/commands/docs/ansi_strip.md):

```nu
$"(ansi red)ab(ansi reset)" | ansi strip | ansi gradient --fgstart '0xffffff'
```

The gradient also counts Unicode characters (code points), not screen columns. A double-width character such as `日` takes one step like any other. A character built from several code points, such as an `e` followed by a combining accent, gets a color code between its parts.

## Accessibility

It's often desired to have the minimum amount of decorations when using a screen reader. In those cases, it's possible to disable borders and other decorations for both table and errors with the following options:

```nu
# in $nu.config-path
$env.config.table.mode = "none"
$env.config.error_style = "plain"
```

## Line Editor Menus (completion, history, help…)

Reedline (Nu’s line editor) menus don't use the `color_config` key.
Instead, each menu has its own style to be configured separately.
See the [section dedicated to Reedline’s menus configuration](line_editor.md#menus) to learn more on this.

The line editor does use a few `color_config` keys: `hints` styles the inline hints,
`selection` styles text selected in Vi visual mode or Helix mode, and `selection_cursor`
styles the character under the cursor inside a selection. `status_line` styles the
[status line](line_editor.md#status-line) under the prompt, and `status_line_error` styles
an error shown there. The `shape_*` keys above style the syntax highlighting of the command line.
