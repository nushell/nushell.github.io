---
title: ansi link
categories: |
  platform
version: 0.79.0
platform: |
  Add a link (using OSC 8 escape sequence) to the given string.
usage: |
  Add a link (using OSC 8 escape sequence) to the given string.
---

# <code>{{ $frontmatter.title }}</code> for platform

<div class='command-title'>{{ $frontmatter.platform }}</div>

## Signature

```> ansi link ...rest --text```

## Parameters

 -  `...rest`: for a data structure input, add links to all strings at the given cell paths
 -  `--text {string}`: Link text. Uses uri as text if absent. In case of
                tables, records and lists applies this text to all elements

## Examples

Create a link to open some file
```shell
> 'file:///file.txt' | ansi link --text 'Open Me!'
Open Me!
```

Create a link without text
```shell
> 'https://www.nushell.sh/' | ansi link
https://www.nushell.sh/
```

Format a table column into links
```shell
> [[url text]; [https://example.com Text]] | ansi link url

```
