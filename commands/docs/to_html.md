---
title: to html
categories: |
  formats
version: 0.76.0
formats: |
  Convert table into simple HTML
usage: |
  Convert table into simple HTML
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
Screenshots of the themes can be browsed here: https://github.com/mbadolato/iTerm2-Color-Schemes
## Examples

Outputs an  HTML string representing the contents of this table
```shell
> [[foo bar]; [1 2]] | to html
```

Optionally, only output the html for the content itself
```shell
> [[foo bar]; [1 2]] | to html --partial
```

Optionally, output the string with a dark background
```shell
> [[foo bar]; [1 2]] | to html --dark
```
