---
title: to html
version: 0.69.1
formats: |
  Convert table into simple HTML
usage: |
  Convert table into simple HTML
---

# <code>{{ $frontmatter.title }}</code> for formats

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.formats }}</div>

## Signature

```> to html --html-color --no-color --dark --partial --theme --list```

## Parameters

 -  `--html-color`: change ansi colors to html colors
 -  `--no-color`: remove all ansi colors in output
 -  `--dark`: indicate your background color is a darker color
 -  `--partial`: only output the html for the content itself
 -  `--theme {string}`: the name of the theme to use (github, blulocolight, ...)
 -  `--list`: list the names of all available themes

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
