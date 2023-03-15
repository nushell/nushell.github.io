---
title: char
categories: |
  strings
version: 0.76.0
strings: |
  Output special characters (e.g., 'newline').
usage: |
  Output special characters (e.g., 'newline').
---

# <code>{{ $frontmatter.title }}</code> for strings

<div class='command-title'>{{ $frontmatter.strings }}</div>

## Signature

```> char (character) ...rest --list --unicode --integer```

## Parameters

 -  `character`: the name of the character to output
 -  `...rest`: multiple Unicode bytes
 -  `--list` `(-l)`: List all supported character names
 -  `--unicode` `(-u)`: Unicode string i.e. 1f378
 -  `--integer` `(-i)`: Create a codepoint from an integer

## Examples

Output newline
```shell
> char newline
```

Output prompt character, newline and a hamburger menu character
```shell
> (char prompt) + (char newline) + (char hamburger)
```

Output Unicode character
```shell
> char -u 1f378
```

Create Unicode from integer codepoint values
```shell
> char -i (0x60 + 1) (0x60 + 2)
```

Output multi-byte Unicode character
```shell
> char -u 1F468 200D 1F466 200D 1F466
```

## Supported characters

### Standard characters

Nushell | Equivalent
:-------|:----------
`newline`<br />`enter`<br />`nl`<br />`line_feed`<br />`lf` | `\n`
`carriage_return`<br />`cr` | `\r`
`crlf` | `\r\n`
`tab` | `\t`
`sp`<br />`space` | ` `
`pipe` | `|`
`left_brace`<br />`lbrace` | `{`
`right_brace`<br />`rbrace` | `}`
`left_paren`<br />`lp`<br />`lparen` | `(`
`right_paren`<br />`rp`<br />`rparen` | `)`
`left_bracket`<br />`lbracket`<br /> | `[`
`right_bracket`<br />`rbracket`<br /> | `[`
`single_quote`<br />`squote`<br />`sq` | `\'`
`double_quote`<br />`dquote`<br />`dq` | `\"`
`path_sep`<br />`psep`<br />`separator` | `/` on Unix, `\` on Windows
`esep`<br />`env_sep` | `:` on Unix, `;` on Windows
`tilde`<br />`twiddle`<br />`squiggly`<br />`home`<br />`pound_sign`<br />`sharp`<br />`root` | `~`
`hash`<br />`hashtag` | `#`

### Unicode

Unicode character names are derived from [this source](https://www.compart.com/en/unicode).

Nushell | Equivalent
:-------|:----------
`nf_branch` | `\u{e0a0}`
`nf_segment`<br />`nf_left_segment` | `\u{e0b0}`
`nf_left_segment_thin` | `\u{e0b1}`
`nf_right_segment` | `\u{e0b2}`
`nf_right_segment_thin` | `\u{e0b3}`
`nf_git` | `\u{f1d3}`
`nf_git_branch` | `\u{e709}\u{e0a0}`
`nf_folder1` | `\u{f07c}`
`nf_folder2` | `\u{f115}`
`nf_house1` | `\u{f015}`
`nf_house2` | `\u{f7db}`
`identical_to`<br />`hamburger` | `\u{2261}` (≡)
`not_identical_to`<br />`branch_untracked`| `\u{2262}` (≢)
`strictly_equivalent_to`<br />`branch_identical` | `\u{2263}` (≣)
`upwards_arrow`<br />`branch_ahead` | `\u{2191}` (↑)
`downwards_arrow`<br />`branch_behind` | `\u{2193}` (↓)
`up_down_arrow`<br />`branch_ahead_behind` | `\u{2195}` (↕)
`black_right_pointing_triangle`<br />`prompt` | `\u{25b6}` (▶)
`vector_or_cross_product`<br />`failed` | `\u{2a2f}` (⨯)
`high_voltage_sign`<br />`elevated` | `\u{26a1}` (⚡)

### Emoji

Nushell | Equivalent
:-------|:----------
`sun`<br />`sunny`<br />`sunrise` | ☀️
`moon` | 🌛
`cloudy`<br />`cloud`<br />`cloud` | ☁️
`rainy`<br />`rain` | 🌦️
`foggy`<br />`fog` | 🌫️
`mist`<br />`haze` | `\u{2591}`
`snowy`<br />`snow` | ❄️
`thunderstorm`<br />`thunder` | 🌩️

### Other

Nushell | Equivalent
:-------|:----------
`bel` | `\x07`
`backspace` | `\x08`

### Separators

Nushell | Equivalent
:-------|:----------
`file_separator`<br />`file_sep`<br />`fs` | `\x1c`
`group_separator`<br />`group_sep`<br />`gs` | `\x1d`
`record_separator`<br />`record_sep`<br />`rs` | `\x1e`
`unit_separator`<br />`unit_sep`<br />`us` | `\x1f`