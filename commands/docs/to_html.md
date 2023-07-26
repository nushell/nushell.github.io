---
title: to html
categories: |
  formats
version: 0.83.0
formats: |
  Convert table into simple HTML.
usage: |
  Convert table into simple HTML.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> to html --html-color --no-color --dark --partial --theme --list```

## Parameters

 -  `--html-color` `(-c)`: change ansi colors to html colors
 -  `--no-color` `(-n)`: remove all ansi colors in output
 -  `--dark` `(-d)`: indicate your background color is a darker color
 -  `--partial` `(-p)`: only output the html for the content itself
 -  `--theme {string}`: the name of the theme to use (github, blulocolight, ...)
 -  `--list` `(-l)`: produce a color table of all available themes

## Notes
Screenshots of the themes can be browsed here: https://github.com/mbadolato/iTerm2-Color-Schemes.
## Examples

Outputs an  HTML string representing the contents of this table
```shell
> [[foo bar]; [1 2]] | to html
<html><style>body { background-color:white;color:black; }</style><body><table><thead><tr><th>foo</th><th>bar</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table></body></html>
```

Optionally, only output the html for the content itself
```shell
> [[foo bar]; [1 2]] | to html --partial
<div style="background-color:white;color:black;"><table><thead><tr><th>foo</th><th>bar</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table></div>
```

Optionally, output the string with a dark background
```shell
> [[foo bar]; [1 2]] | to html --dark
<html><style>body { background-color:black;color:white; }</style><body><table><thead><tr><th>foo</th><th>bar</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table></body></html>
```
