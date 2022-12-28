---
title: ansi gradient
categories: |
  platform
version: 0.73.1
platform: |
  Add a color gradient (using ANSI color codes) to the given string
usage: |
  Add a color gradient (using ANSI color codes) to the given string
---

# <code>{{ $frontmatter.title }}</code> for platform

<div class='command-title'>{{ $frontmatter.platform }}</div>

## Signature

```> ansi gradient ...rest --fgstart --fgend --bgstart --bgend```

## Parameters

 -  `...rest`: for a data structure input, add a gradient to strings at the given cell paths
 -  `--fgstart {string}`: foreground gradient start color in hex (0x123456)
 -  `--fgend {string}`: foreground gradient end color in hex
 -  `--bgstart {string}`: background gradient start color in hex
 -  `--bgend {string}`: background gradient end color in hex

## Examples

draw text in a gradient with foreground start and end colors
```shell
> 'Hello, Nushell! This is a gradient.' | ansi gradient --fgstart 0x40c9ff --fgend 0xe81cff
```

draw text in a gradient with foreground start and end colors and background start and end colors
```shell
> 'Hello, Nushell! This is a gradient.' | ansi gradient --fgstart 0x40c9ff --fgend 0xe81cff --bgstart 0xe81cff --bgend 0x40c9ff
```

draw text in a gradient by specifying foreground start color - end color is assumed to be black
```shell
> 'Hello, Nushell! This is a gradient.' | ansi gradient --fgstart 0x40c9ff
```

draw text in a gradient by specifying foreground end color - start color is assumed to be black
```shell
> 'Hello, Nushell! This is a gradient.' | ansi gradient --fgend 0xe81cff
```
