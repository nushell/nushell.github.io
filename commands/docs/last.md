---
title: last
categories: |
  filters
version: 0.84.0
filters: |
  Return only the last several rows of the input. Counterpart of `first`. Opposite of `drop`.
usage: |
  Return only the last several rows of the input. Counterpart of `first`. Opposite of `drop`.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> last (rows)```

## Parameters

 -  `rows`: starting from the back, the number of rows to return


## Input/output types:

| input     | output    |
| --------- | --------- |
| binary    | binary    |
| list\<any\> | list\<any\> |
## Examples

Return the last 2 items of a list/table
```shell
> [1,2,3] | last 2
╭───┬───╮
│ 0 │ 2 │
│ 1 │ 3 │
╰───┴───╯

```

Return the last item of a list/table
```shell
> [1,2,3] | last
3
```

Return the last 2 bytes of a binary value
```shell
> 0x[01 23 45] | last 2
Length: 2 (0x2) bytes | printable whitespace ascii_other non_ascii
00000000:   23 45                                                #E

```
