---
title: ansi gradient
categories: |
  platform
version: 0.106.0
platform: |
  Add a color gradient (using ANSI color codes) to the given string.
usage: |
  Add a color gradient (using ANSI color codes) to the given string.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `ansi gradient` for [platform](/commands/categories/platform.md)

<div class='command-title'>Add a color gradient (using ANSI color codes) to the given string.</div>

## Signature

```> ansi gradient {flags} ...rest```

## Flags

 -  `--fgstart, -a {string}`: foreground gradient start color in hex (0x123456)
 -  `--fgend, -b {string}`: foreground gradient end color in hex
 -  `--bgstart, -c {string}`: background gradient start color in hex
 -  `--bgend, -d {string}`: background gradient end color in hex

## Parameters

 -  `...rest`: For a data structure input, add a gradient to strings at the given cell paths.


## Input/output types:

| input        | output       |
| ------------ | ------------ |
| string       | string       |
| list&lt;string&gt; | list&lt;string&gt; |
| table        | table        |
| record       | record       |
## Examples

draw text in a gradient with foreground start and end colors
```nu
> 'Hello, Nushell! This is a gradient.' | ansi gradient --fgstart '0x40c9ff' --fgend '0xe81cff'

```

draw text in a gradient with foreground start and end colors and background start and end colors
```nu
> 'Hello, Nushell! This is a gradient.' | ansi gradient --fgstart '0x40c9ff' --fgend '0xe81cff' --bgstart '0xe81cff' --bgend '0x40c9ff'

```

draw text in a gradient by specifying foreground start color - end color is assumed to be black
```nu
> 'Hello, Nushell! This is a gradient.' | ansi gradient --fgstart '0x40c9ff'

```

draw text in a gradient by specifying foreground end color - start color is assumed to be black
```nu
> 'Hello, Nushell! This is a gradient.' | ansi gradient --fgend '0xe81cff'

```
