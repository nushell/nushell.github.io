# Farben und Themen in Nu

In vielen Teilen von Nushells Oberfläche sind die Farben anpassbar. Dies wird in der Konfigurationsdatei `config.nu` erstellt.
Ein Hashtag in der Konfigurationsdatei kommentiert den danach folgenden Text aus.

1. Tabellen Rahmen
2. Werte einfacher Typen
3. Formen (Kommandozeilen Syntax)
4. Prompt
5. LS_COLORS

## `Tabellen Rahmen`

---

Tabellen Rahmen werden mit der Einstellung `table_mode` in der `config.nu` konfiguriert.
Hier ein Beispiel:

```nu
> $env.config = {
    table_mode: rounded
}
```

Dies sind die aktuellen Optionen für `table_mode`:

- `rounded` # das ist natürlich der beste :)
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

### `Farb-Symbolik`

---

- `r` - Normale Farbe Abkürzung für rot
- `rb` - Normale Farbe rot mit `b` für `bold`, fette Schrift
- `red` - Normale Farbe rot
- `red_bold` - Normale Farbe rot mit fetter Schrift
- `"#ff0000"` - "#hex" Format Vordergrund-Farbe rot (Anführungszeichen benötigt)
- `{ fg: "#ff0000" bg: "#0000ff" attr: b }` - "komplettes #hex" Format Vordergrund rot in "#hex" Format mit einem blauen Hintergund in "#hex" Format mit `b` als Abkürzung für fette Schrift.

### `Attribute`

---

| Code | Bedeutung           |
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

### `Normale Farben` and `Abkürzungen`

| Code   | Name                   |
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

### `"#hex"` Format

---

Das "#hex" Format ist gebräuchlich um Farben zu repräsentieren. Es besteht immer aus dem `#` gefolgt von 6 Zeichen.
Die ersten zwei sind für `rot`, die nächsten zwei für `grün` und die letzten zwei für `blau`. Es ist wichtig, dass dieser Text mit
Anführungszeichen geschrieben wird, damit Nushell es nicht für einen Kommentar hält.

Beispiel: Die primäre Farbe `rot` ist `"#ff0000"` oder `"#FF0000"`. Gross- und Kleinschreibung sollten hier keine Rolle spielen.

Dieses `"#hex"` Format erlaubt es, 24-bit Echtfarben für verschiedene Bereiche von Nushell zu spezifizieren.

## `Volles "#hex"` Format

---

Das `volle "#hex"` Format ist eine Interpretation des `"#hex"` Formats, welches den Vordergrund, Hintergrund und Attribute in einer Zeile spezifizieren kann.

Beispiel: `{ fg: "#ff0000" bg: "#0000ff" attr: b }`

- Vordergrund rot in "#hex" format
- Hiuntergund blau in "#hex" format
- Attribute in fetter Schrift als Abkürzung spezifiziert

## `Primitive Typen`

---

Werte primitiver Typen sind z.B. `int` und `string`. Primitive Typen und Formen können ebenfalls mit verschiedenster Farben symbolisiert werden.

Hier die aktuelle Liste von Primitiven Typen. Nicht alle davon sind konfigurierbar. Die konfigurierbaren sind mit \* markiert.

| primitive    | default color         | configurable |
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

#### Spezielle "primitives" (keine wirklichen Primitiven Typen, denn sie existieren nur für die Farbgebung)

| primitive                   | default color              | configurable |
| --------------------------- | -------------------------- | ------------ |
| `leading_trailing_space_bg` | Color::Rgb(128, 128, 128)) | \*           |
| `header`                    | Color::Green.bold()        | \*           |
| `empty`                     | Color::Blue.normal()       | \*           |
| `row_index`                 | Color::Green.bold()        | \*           |
| `hints`                     | Color::DarkGray.normal()   | \*           |

Hier ein kleines Beispiel, wie diese Werte angewendet werden können.

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

Hier ein anderes Beispiel, welches mehrere Farben Schreibweisen sowie Kommentare verwendet.

```nu
> let config = {
    color_config: {
        separator: "#88b719" # Dies setzt nur die Vordergrundsfarbe wie in PR #486
        leading_trailing_space_bg: white # Dies setzt nur die Vordergrundsfarbe im ursprünglichen Stil
        header: { # Analog PR #489
            fg: "#B01455", # Hinweis, Bei Werten mit hex Farben, werden Anführungszeichen benötigt
            bg: "#ffb900",# Hinweis, Kommas werden nicht benötigt, es könnte auch alles auf eine Zeile passen
            attr: bli # Hinweis, Um diesen Wert sind keine Anführungszeichen, hier geht es auch ohne
        }
        date: "#75507B"
        filesize: "#729fcf"
        row_index: {
            # Hinweis, Dies ist eine andere Möglichkeit, nur den Vordergrund anzugeben, ohne Angabe von bg oder attr
            fg: "#e50914"
        }
    }
}
```

## `Formen` Werte

Wie oben bereits erwähnt, ist `Formen` oder `shapes` ein Begriff, der angibt, wie Syntax eingefärbt wird.

Hier die aktuelle Formen Liste.

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
| `shape_range`                | fg(Color::Yellow).bold()               | \*           |
| `shape_record`               | fg(Color::Cyan).bold()                 | \*           |
| `shape_signature`            | fg(Color::Green).bold()                | \*           |
| `shape_string`               | fg(Color::Green)                       | \*           |
| `shape_string_interpolation` | fg(Color::Cyan).bold()                 | \*           |
| `shape_table`                | fg(Color::Blue).bold()                 | \*           |
| `shape_variable`             | fg(Color::Purple)                      | \*           |

Hier ein kleines Beispiel wie Farben auf diese Teile angewendet werden. Was nicht spezifiziert wird, erhält die Standardfarbe.

```nu
> $env.config = {
    color_config: {
        shape_garbage: { fg: "#FFFFFF" bg: "#FF0000" attr: b}
        shape_bool: green
        shape_int: { fg: "#0000ff" attr: b}
    }
}
```

## `Prompt` Konfiguration und Farbgebung

Der Nushell Prompt ist konfigurierbar mit diesen Umgebungsvariablen:

- `PROMPT_COMMAND`: Code der ausgeführt wird beim Aufsetzen des Prompts (Block)
- `PROMPT_COMMAND_RIGHT`: Code um die rechte Seite, _RIGHT_ prompt (Block), auf zu setzen. (Siehe auch oh-my.nu in nu_scripts)
- `PROMPT_INDICATOR` = "〉": Der Indikator, welcher nach dem Prompt ausgegeben wird (Standardmässig das ">" Unicode Symbol)
- `PROMPT_INDICATOR_VI_INSERT` = ": "
- `PROMPT_INDICATOR_VI_NORMAL` = "v "
- `PROMPT_MULTILINE_INDICATOR` = "::: "

Beispiel: Für einen einfachen Prompt wäre folgendes mögllich. Hinweis `PROMPT_COMMAND` benötigt einen `block` wogegen die anderen einen `string` erwarten.

```nu
> $env.PROMPT_COMMAND = { build-string (date now | date format '%m/%d/%Y %I:%M:%S%.3f') ': ' (pwd | path basename) }
```

Soll der standard `PROMPT_INDICATOR` geändert werden, sieht das so aus.

```nu
> $env.PROMPT_INDICATOR = "> "
```

Den Prompt einfärben wird duch den `block` `PROMPT_COMMAND` kontrolliert und individualisiert.
In [nu_scripts repo](https://github.com/nushell/nu_scripts/blob/main/prompt/oh-my.nu) wurde ein recht ausgefallener geschrieben, welcher den git Status darstellt.

## `LS_COLORS` Farben für den `ls` Befehl

Nushell wird die Umgebungsvariable `LS_COLORS` auf Linu, Mac und Windows respektieren.
Diese Einstellung erlaubt es Farben anhand ihres Dateityps zu definieren, wenn ein [`ls`](commands/ls.md) ausgeführt wird.
Zum Beispiel können Verzeichnisse in einer Farbe, _.md Markdown Dateien in einer anderen Farbe, _.toml Dateien in einer dritten Farbe usw. dargestellt werden.

Es gibt verschiedenste Wege um Dateitypen ein zu färben.

[Hier](https://github.com/trapd00r/LS_COLORS) findet sich eine ausführliche Liste, welche ein rudimentäres Verständnis bietet, wie eine ls_colors Datei
ein `dircolors` in eine `LS_COLORS` Umgebungsvariable überführt.

[Dies](https://www.linuxhowto.net/how-to-set-colors-for-ls-command/) ist eine sehr gute Einführung in `LS_COLORS`.
Es finden sich sicher noch viele mehr im Internet.

Freunde der `vivid` Anwendung finden Informationen [hier](https://github.com/sharkdp/vivid). Die Konfiguration in `config.nu` erfolgt so:

`$env.LS_COLORS = (vivid generate molokai | str trim)`

Ist `LS_COLORS` nicht gesetzt, wird Nushell auf die eingebaute `LS_COLORS` Einstellung zurückgreifen, welche auf den erweiterten 8-bit ANSI Farben aufbaut.

## Theming

Theming kombiniert all die eben beschriebene Farbgebung. Hier ein einfaches Beispiel, welches die Fähigkeiten des Themings demonstriert.
Dies ist nur ein Ausschnitt der `base16` Themes, welche im Internet weit verbreitet sind.

Entscheidend damit Theming funktioniert ist, dass alle Farben und Themen in der `config.nu` definiert werden _bevor_ die `let config =` Zeile definiert wird.

```nu
# Definition von einigen Farben

let base00 = "#181818" # Standard Hinergrund
let base01 = "#282828" # Heller Hintergrund (Verwendet für Status Bar, Linien Nummern und Faltmarken)
let base02 = "#383838" # Auswahl Hintergrund
let base03 = "#585858" # Kommentare, Verstecktes, Zeilen Hervorhebungen
let base04 = "#b8b8b8" # Dunkler Vordergrund (Für Status Bars)
let base05 = "#d8d8d8" # Standard Vordergrund, Einfügebarken, Trennzeichen, Operatoren
let base06 = "#e8e8e8" # Heller Vordergrund (Nicht oft verwendet)
let base07 = "#f8f8f8" # Heller Hintergrund (Nicht oft verwendet)
let base08 = "#ab4642" # Variablen, XML Tags, Markup Link Text, Markup Listen, Diff gelöscht
let base09 = "#dc9656" # Ganzzahlen, Boolean, Konstanten, XML Attribute, Markup Link Url
let base0a = "#f7ca88" # Klassen, Markup fett, Such-Text Hintergrund
let base0b = "#a1b56c" # Strings, vererbte Klasse, Markup Code, Diff eingefügt
let base0c = "#86c1b9" # Support, Reguläre Ausdrücke, Escape Zeichen, Markup Quotes
let base0d = "#7cafc2" # Funktionen, Methoden, Attribut IDs, Überschriften
let base0e = "#ba8baf" # Keywörter, Speicher, Selectoren, Markup Italic, Diff geändert
let base0f = "#a16946" # Veraltet, Öffnende/Schliessende eingebettete Sprach Tags, z.B. <?php ?>

# und nund wird das Theme mit diesen Farbdefinitionen erstellt.

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

# nun werden die regulären Konfigurations Einstellungen sowie das "color_config:" Theme angewendet.

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

Wer in Sachen Theming aufs ganze gehen will, will bestimmt alle Parameter von LS_COLORS und den Prompt konfigurieren, viel Glück!
