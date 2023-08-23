---
title: fill
categories: |
  conversions
version: 0.84.0
conversions: |
  Fill and Align.
usage: |
  Fill and Align.
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> fill --width --alignment --character```

## Parameters

 -  `--width {int}`: The width of the output. Defaults to 1
 -  `--alignment {string}`: The alignment of the output. Defaults to Left (Left(l), Right(r), Center(c/m), MiddleRight(cr/mr))
 -  `--character {string}`: The character to fill with. Defaults to ' ' (space)


## Input/output types:

| input          | output       |
| -------------- | ------------ |
| filesize       | string       |
| int            | string       |
| list\<any\>      | list\<string\> |
| list\<filesize\> | list\<string\> |
| list\<int\>      | list\<string\> |
| list\<number\>   | list\<string\> |
| list\<string\>   | list\<string\> |
| number         | string       |
| string         | string       |
## Examples

Fill a string on the left side to a width of 15 with the character '─'
```shell
> 'nushell' | fill -a l -c '─' -w 15
nushell────────
```

Fill a string on the right side to a width of 15 with the character '─'
```shell
> 'nushell' | fill -a r -c '─' -w 15
────────nushell
```

Fill a string on both sides to a width of 15 with the character '─'
```shell
> 'nushell' | fill -a m -c '─' -w 15
────nushell────
```

Fill a number on the left side to a width of 5 with the character '0'
```shell
> 1 | fill --alignment right --character '0' --width 5
00001
```

Fill a number on both sides to a width of 5 with the character '0'
```shell
> 1.1 | fill --alignment center --character '0' --width 5
01.10
```

Fill a filesize on the left side to a width of 5 with the character '0'
```shell
> 1kib | fill --alignment middle --character '0' --width 10
0001024000
```
