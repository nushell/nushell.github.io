# Nu의 색상 지정 및 테마 설정

누셸 인터페이스의 여러 부분의 색상을 사용자 지정할 수 있습니다. 이 모든 것은 `config.nu` 구성 파일에서 설정할 수 있습니다. 구성 파일에서 텍스트 값 외부에 `#`이 표시되면 그 뒤의 텍스트가 주석 처리되었음을 의미합니다.

## 테이블 테두리

테이블 테두리는 `$env.config.table.mode` 설정으로 제어됩니다. 런타임에 또는 `config.nu` 파일에서 변경할 수 있습니다.

```nu
$env.config.table.mode = 'rounded'
```

`$env.config.table.mode`에 대한 옵션은 `table --list`로 나열할 수 있습니다.

<!-- table --list | each {|| $"- `($in)`"} | sort | str join "\n"`으로 생성됨 -->

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

예시:

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

## 색상 구성

색상 구성은 `$env.config.color_config`에 정의되어 있습니다. 현재 구성은 다음으로 인쇄할 수 있습니다.

```nu
$env.config.color_config | sort
```

색상 및 스타일 속성은 여러 대체 형식으로 선언할 수 있습니다.

- `r` - 일반 색상 빨강의 약어
- `rb` - 굵은 속성이 있는 일반 색상 빨강의 약어
- `red` - 일반 색상 빨강
- `red_bold` - 굵은 속성이 있는 일반 색상 빨강
- `"#ff0000"` - "#hex" 형식 전경색 빨강(따옴표 필요)
- `{ fg: "#ff0000" bg: "#0000ff" attr: b }` - "#hex" 형식의 전경 빨강과 "#hex" 형식의 배경 파랑, 굵게 약어 속성이 있는 "전체 #hex" 형식.
- `{|x| 'yellow' }` - 위에 나열된 색상 표현 중 하나가 포함된 문자열을 반환하는 클로저
- `{|x| { fg: "#ff0000" bg: "#0000ff" attr: b } }` - 유효한 레코드를 반환하는 클로저

### 속성

| 코드 | 의미             |
| ---- | ------------------- |
| l    | 깜박임               |
| b    | 굵게                |
| d    | 흐리게              |
| h    | 숨김              |
| i    | 기울임꼴            |
| r    | 반전             |
| s    | 취소선       |
| u    | 밑줄           |
| n    | 없음             |
|      | 기본값 없음 |

### 일반 색상 및 약어

| 코드      | 이름                      |
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

<!-- 테이블 본문은 ansi --list | select 'short name' name | each {|| $"| `($in.'short name')` | `($in.name)` |"} | first 133 | str join "\n" 으로 인쇄할 수 있습니다. -->

### `"#hex"` 형식

"#hex" 형식은 일반적으로 색상을 나타내는 한 가지 방법입니다. `#` 문자 뒤에 6개의 문자가 오는 것입니다. 처음 두 개는 `빨강`, 다음 두 개는 `녹색`, 마지막 두 개는 `파랑`입니다. 이 문자열을 따옴표로 묶는 것이 중요합니다. 그렇지 않으면 누셸이 주석 처리된 문자열로 인식합니다.

예시: 기본 `빨강` 색상은 `"#ff0000"` 또는 `"#FF0000"`입니다. 문자의 대소문자는 중요하지 않습니다.

이 `"#hex"` 형식을 사용하면 누셸의 다른 부분에 24비트 트루컬러 톤을 지정할 수 있습니다.

### 전체 `"#hex"` 형식

`전체 "#hex"` 형식은 `"#hex"` 형식을 기반으로 하지만 한 줄에 전경, 배경 및 속성을 지정할 수 있습니다.

예시: `{ fg: "#ff0000" bg: "#0000ff" attr: b }`

- "#hex" 형식의 빨강 전경
- "#hex" 형식의 파랑 배경
- 굵게 약어 속성

### 클로저

참고: 클로저는 테이블 출력에 대해서만 실행됩니다. `shape_` 구성, 값을 직접 인쇄할 때 또는 목록의 값과 같은 다른 컨텍스트에서는 작동하지 않습니다.

예시:

```nu
$env.config.color_config.filesize = {|x| if $x == 0b { 'dark_gray' } else if $x < 1mb { 'cyan' } else { 'blue' } }
$env.config.color_config.bool = {|x| if $x { 'green' } else { 'light_red' } }
{a:true,b:false,c:0mb,d:0.5mb,e:10mib}
```

인쇄물

```nu
╭───┬───────────╮
│ a │ true      │
│ b │ false     │
│ c │ 0 B       │
│ d │ 488.3 KiB │
│ e │ 10.0 MiB  │
╰───┴───────────╯
```

녹색 `true`, 밝은 빨강 `false`, 어두운 회색 `0 B`, 청록색 `488.3 KiB`, 파란색 `10.0 MiB`가 있습니다.

## 기본 값

기본 값은 `int` 및 `string`과 같은 것입니다. 기본 값과 모양은 위에서 본 다양한 색상 기호로 설정할 수 있습니다.

다음은 현재 기본 목록입니다. 이들 모두가 구성 가능한 것은 아닙니다. 구성 가능한 것은 \*로 표시됩니다.

| 기본형    | 기본 색상         | 구성 가능 |
| ------------ | --------------------- | ------------ |
| `any`        |                       |              |
| `binary`     | Color::White.normal() | \*           |
| `block`      | Color::White.normal() | \*           |
| `bool`       | Color::White.normal() | \*           |
| `cellpath`   | Color::White.normal() | \*           |
| `condition`  |                       |              |
| `custom`     |                       |              |
| `date`       | Color::White.normal() | \*           |
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

### 특수 "기본형" (실제로는 기본형이 아니지만 색상 지정을 위해서만 존재)

| 기본형                   | 기본 색상              | 구성 가능 |
| --------------------------- | -------------------------- | ------------ |
| `leading_trailing_space_bg` | Color::Rgb(128, 128, 128)) | \*           |
| `header`                    | Color::Green.bold()        | \*           |
| `empty`                     | Color::Blue.normal()       | \*           |
| `row_index`                 | Color::Green.bold()        | \*           |
| `hints`                     | Color::DarkGray.normal()   | \*           |

다음은 이러한 값 중 일부를 변경하는 작은 예입니다.

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

다음은 일부 주석과 함께 여러 색상 구문을 사용하는 또 다른 작은 예입니다.

```nu
$env.config.color_config.separator = "#88b719" # PR #486과 같이 전경색만 설정합니다.
$env.config.color_config.leading_trailing_space_bg = white # 원래 스타일로 전경색만 설정합니다.
$env.config.color_config.header = { # PR #489와 같습니다.
    fg: "#B01455", # 16진수 색상이 있는 값에는 따옴표가 필요합니다.
    bg: "#ffb900", # 쉼표는 필요하지 않으며 한 줄에 모두 있을 수도 있습니다.
    attr: bli # 이 값 주위에는 따옴표가 없습니다. 따옴표가 있거나 없는 경우에도 작동합니다.
}
$env.config.color_config.date = "#75507B"
$env.config.color_config.filesize = "#729fcf"
$env.config.color_config.row_index = {
    # 전경만 설정하는 또 다른 방법이며 bg 및 attr을 지정할 필요가 없습니다.
    fg: "#e50914"
}
```

## 모양 값

위에서 언급했듯이 `shape`는 구문 색상 지정을 나타내는 데 사용되는 용어입니다.

다음은 현재 플랫 모양 목록입니다.

| 모양                        | 기본 스타일                          | 구성 가능 |
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

다음은 이러한 항목에 색상을 적용하는 방법에 대한 작은 예입니다. 재정의되지 않은 모든 항목은 기본 색상을 받습니다.

```nu
$env.config.color_config.shape_garbage: { fg: "#FFFFFF" bg: "#FF0000" attr: b}
$env.config.color_config.shape_bool: green
$env.config.color_config.shape_int: { fg: "#0000ff" attr: b}
```

## 프롬프트 구성 및 색상 지정

누셸 프롬프트는 다음 환경 변수 및 구성 항목을 통해 구성할 수 있습니다.

- `PROMPT_COMMAND`: 프롬프트를 설정하기 위해 실행할 코드(블록)
- `PROMPT_COMMAND_RIGHT`: _오른쪽_ 프롬프트를 설정하기 위해 실행할 코드(블록) (nu_scripts의 oh-my.nu 참조)
- `PROMPT_INDICATOR` = "〉": 프롬프트 뒤에 인쇄되는 표시기(기본적으로 ">"와 유사한 유니코드 기호)
- `PROMPT_INDICATOR_VI_INSERT` = ": "
- `PROMPT_INDICATOR_VI_NORMAL` = "v "
- `PROMPT_MULTILINE_INDICATOR` = "::: "
- `render_right_prompt_on_last_line`: 프롬프트의 마지막 줄에 오른쪽 프롬프트를 렌더링할지 여부를 활성화 또는 비활성화하는 부울 값

예시: 간단한 프롬프트의 경우 다음과 같이 할 수 있습니다. `PROMPT_COMMAND`는 `블록`이 필요하고 다른 것들은 `문자열`이 필요합니다.

```nu
$env.PROMPT_COMMAND = { $"(date now | format date '%m/%d/%Y %I:%M:%S%.3f'): (pwd | path basename)" }
```

기본 `PROMPT_INDICATOR`가 마음에 들지 않으면 다음과 같이 변경할 수 있습니다.

```nu
$env.PROMPT_INDICATOR = "> "
```

`starship`을 사용하는 경우 zsh 또는 fish와 마찬가지로 프롬프트의 마지막 줄에 오른쪽 프롬프트를 표시하고 싶을 것입니다. `config.nu` 파일을 수정하고 `render_right_prompt_on_last_line`을 true로 설정하면 됩니다.

```nu
$env.config.render_right_prompt_on_last_line = true
```

프롬프트의 색상 지정은 `PROMPT_COMMAND`의 `블록`에서 제어되며, 여기서 사용자 지정 프롬프트를 작성할 수 있습니다. [nu_scripts 저장소](https://github.com/nushell/nu_scripts/blob/main/modules/prompt/oh-my.nu)에 git 상태가 있는 약간 멋진 프롬프트를 작성했습니다.

### 임시 프롬프트

이전에 입력한 명령에 대해 다른 프롬프트를 표시하려면 누셸의 임시 프롬프트 기능을 사용할 수 있습니다. 프롬프트에 이전 줄에 표시할 필요가 없는 정보(예: 시간 및 Git 상태)가 많은 경우 유용할 수 있습니다. 이전 줄이 더 짧은 프롬프트로 표시되도록 할 수 있기 때문입니다.

각 `PROMPT_*` 변수에는 과거 프롬프트를 표시할 때 해당 세그먼트를 변경하는 데 사용할 해당 `TRANSIENT_PROMPT_*` 변수가 있습니다. `TRANSIENT_PROMPT_COMMAND`, `TRANSIENT_PROMPT_COMMAND_RIGHT`, `TRANSIENT_PROMPT_INDICATOR`, `TRANSIENT_PROMPT_INDICATOR_VI_INSERT`, `TRANSIENT_PROMPT_INDICATOR_VI_NORMAL`, `TRANSIENT_PROMPT_MULTILINE_INDICATOR`가 있습니다. 기본적으로 `PROMPT_*` 변수는 과거 프롬프트를 표시하는 데 사용됩니다.

예를 들어, 과거 프롬프트를 왼쪽 프롬프트 없이 완전히 표시하고 표시기만 남기려면 다음을 사용할 수 있습니다.

```nu
$env.TRANSIENT_PROMPT_COMMAND = ""
```

일반 왼쪽 프롬프트로 돌아가려면 `TRANSIENT_PROMPT_COMMAND`를 설정 해제해야 합니다.

```nu
hide-env TRANSIENT_PROMPT_COMMAND
```

## [`ls`](/commands/docs/ls.md) 명령에 대한 `LS_COLORS` 색상

누셸은 Mac, Linux 및 Windows에서 `LS_COLORS` 환경 변수 설정을 존중하고 사용합니다. 이 설정을 사용하면 [`ls`](/commands/docs/ls.md)를 수행할 때 파일 형식의 색상을 정의할 수 있습니다. 예를 들어 디렉터리를 한 가지 색상으로, `.md` 마크다운 파일을 다른 색상으로, `.toml` 파일을 또 다른 색상으로 지정할 수 있습니다. 파일 형식을 색상 지정하고 스타일을 지정하는 다양한 방법이 있습니다.

`LS_COLORS`가 설정되지 않은 경우 nushell은 [8비트(확장) ANSI 색상](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit)을 기반으로 하는 내장 `LS_COLORS` 설정으로 기본 설정됩니다.

### `LS_COLORS` 이해하기

`LS_COLORS`에는 파일 형식과 파일 이름을 스타일링 속성(`선택기=속성`)에 매핑하는 콜론(`:`)으로 구분된 레코드 목록이 포함되어 있습니다.

선택기는 "디렉터리 식별자"에 대한 `di`와 같이 지정된 파일 형식이거나 `.nu` 파일 확장자를 가진 파일에 대한 `*.nu`일 수 있습니다.

속성은 세미콜론(`;`)으로 구분된 숫자 목록입니다. 어떤 속성과 속성 형식이 지원되는지는 사용 중인 터미널에 따라 다릅니다.

- `0` 일반, `1` 굵게, `3` 기울임꼴, `5` 깜박임 등과 같은 스타일 속성([기타](https://en.wikipedia.org/wiki/ANSI_escape_code#Select_Graphic_Rendition_parameters))
- [전경색](https://en.wikipedia.org/wiki/ANSI_escape_code#3-bit_and_4-bit) `30`-`37` 및 `90`-`97`
- [배경색](https://en.wikipedia.org/wiki/ANSI_escape_code#3-bit_and_4-bit) `40`-`47` 및 `100`-`107`
- `38;2` 접두사가 붙은 [RGB 전경](https://en.wikipedia.org/wiki/ANSI_escape_code#24-bit), 선택적으로 추가 속성이 뒤따름
- `48;2` 접두사가 붙은 [RGB 배경](https://en.wikipedia.org/wiki/ANSI_escape_code#24-bit), 선택적으로 추가 속성이 뒤따름

예시:

`$env.LS_COLORS = "di=1;34:*.nu=3;33;46"`: 굵은 디렉터리, 기울임꼴 노란색 전경 청록색 배경 `*.nu` 파일

`$env.LS_COLORS = "di=48;2;200;0;0;5"`: 빨간색 배경 깜박이는 디렉터리

### 생생한 테마

예를 들어, 여러 플랫폼에서 실행되고 [많은 테마가 정의된](https://github.com/sharkdp/vivid/tree/master/themes) 타사 도구 [vivid](https://github.com/sharkdp/vivid)를 사용하고 여기에서 `LS_COLORS` 구성을 생성할 수 있습니다.

바이너리를 다운로드하고 추출한 후 다음을 사용하여 사용할 수 있습니다.

```nu
$env.LS_COLORS = (vivid generate molokai)
```

또는 대체 테마 사용:

```nu
$env.LS_COLORS = (vivid generate ayu)
```

이 명령을 [누셸 구성](/book/configuration.md)에 넣어 기본 색상 지정으로 만들 수 있습니다.

## 테마 설정

테마 설정은 위의 모든 색상 지정을 결합합니다. 다음은 테마 설정 기능을 시연하기 위해 신속하게 구성한 간단한 예입니다. 이것은 웹에서 널리 볼 수 있는 `base16` 테마를 변형한 것입니다.

테마 설정을 작동시키는 핵심은 `config.nu` 파일에서 `let config = ` 줄을 선언하기 전에 사용할 모든 테마와 색상을 지정하는 것입니다.

```nu
# 몇 가지 색상을 정의해 보겠습니다.

let base00 = "#181818" # 기본 배경
let base01 = "#282828" # 더 밝은 배경(상태 표시줄, 줄 번호 및 접는 표시에 사용됨)
let base02 = "#383838" # 선택 배경
let base03 = "#585858" # 주석, 보이지 않는 문자, 줄 강조 표시
let base04 = "#b8b8b8" # 어두운 전경(상태 표시줄에 사용됨)
let base05 = "#d8d8d8" # 기본 전경, 캐럿, 구분 기호, 연산자
let base06 = "#e8e8e8" # 밝은 전경(자주 사용되지 않음)
let base07 = "#f8f8f8" # 밝은 배경(자주 사용되지 않음)
let base08 = "#ab4642" # 변수, XML 태그, 마크업 링크 텍스트, 마크업 목록, Diff 삭제됨
let base09 = "#dc9656" # 정수, 부울, 상수, XML 속성, 마크업 링크 URL
let base0a = "#f7ca88" # 클래스, 마크업 굵게, 검색 텍스트 배경
let base0b = "#a1b56c" # 문자열, 상속된 클래스, 마크업 코드, Diff 삽입됨
let base0c = "#86c1b9" # 지원, 정규식, 이스케이프 문자, 마크업 인용문
let base0d = "#7cafc2" # 함수, 메서드, 속성 ID, 제목
let base0e = "#ba8baf" # 키워드, 스토리지, 선택기, 마크업 기울임꼴, Diff 변경됨
let base0f = "#a16946" # 더 이상 사용되지 않음, 포함된 언어 태그 열기/닫기(예: <?php ?>)

# 위에서 정의한 색상을 사용하는 테마를 만들고 있습니다.

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

    # shape_garbage: { fg: $base07 bg: $base08 attr: b } # base16 흰색 바탕에 빨간색
    # 하지만 구문 분석 오류에는 일반적인 흰색 바탕에 빨간색이 더 좋습니다.
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

# 이제 일반 구성 설정을 적용하고 위에서 지정한 "color_config:" 테마도 적용해 보겠습니다.

$env.config.animate_prompt: false
$env.config.color_config: $base16_theme # <-- 이것이 테마입니다.
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

테마 설정을 완전히 하려면 LS_COLORS 및 프롬프트를 포함하여 처음에 언급한 모든 항목을 테마로 설정해야 합니다. 행운을 빕니다!

### 밝은 배경 터미널에서 작업하기

누셸의 [표준 라이브러리](/book/standard_library.md)에는 기본 밝은 테마와 어두운 테마가 있는 `config` 모듈이 포함되어 있습니다.
밝은 배경 터미널에서 작업하는 경우 밝은 테마를 쉽게 적용할 수 있습니다.

```nu
# $nu.config-path에서
use std/config light-theme   # 테마를 범위로 로드하려면 이 줄을 추가합니다.

$env.config = {
  # ...
  color_config: (light_theme)   # 밝은 테마를 원하면 `$dark_theme`을 `$light_theme`으로 바꿉니다.
  # ...
}
```

어두운 테마를 로드할 수도 있습니다.

```nu
# $nu.config-path에서
use std/config dark-theme

$env.config = {
  # ...
  color_config: (dark_theme)
  # ...
}
```

## 접근성

화면 판독기를 사용할 때 장식을 최소화하는 것이 종종 바람직합니다. 이러한 경우 다음 옵션을 사용하여 테이블과 오류 모두에 대해 테두리 및 기타 장식을 비활성화할 수 있습니다.

```nu
# $nu.config-path에서
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

## 줄 편집기 메뉴(완성, 기록, 도움말...)

Reedline(Nu의 줄 편집기) 스타일은 `color_config` 키를 사용하지 않습니다.
대신 각 메뉴에는 별도로 구성할 수 있는 자체 스타일이 있습니다.
자세한 내용은 [Reedline 메뉴 구성 전용 섹션](line_editor.md#menus)을 참조하십시오.
