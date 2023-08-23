---
title: path split
categories: |
  path
version: 0.84.0
path: |
  Split a path into a list based on the system's path separator.
usage: |
  Split a path into a list based on the system's path separator.
---

# <code>{{ $frontmatter.title }}</code> for path

<div class='command-title'>{{ $frontmatter.path }}</div>

## Signature

```> path split ```


## Input/output types:

| input        | output             |
| ------------ | ------------------ |
| list\<string\> | list\<list\<string\>\> |
| string       | list\<string\>       |
## Examples

Split a path into parts
```shell
> '/home/viking/spam.txt' | path split
╭───┬──────────╮
│ 0 │ /        │
│ 1 │ home     │
│ 2 │ viking   │
│ 3 │ spam.txt │
╰───┴──────────╯

```

Split paths in list into parts
```shell
> [ /home/viking/spam.txt /home/viking/eggs.txt ] | path split
╭───┬──────────────────╮
│ 0 │ ╭───┬──────────╮ │
│   │ │ 0 │ /        │ │
│   │ │ 1 │ home     │ │
│   │ │ 2 │ viking   │ │
│   │ │ 3 │ spam.txt │ │
│   │ ╰───┴──────────╯ │
│ 1 │ ╭───┬──────────╮ │
│   │ │ 0 │ /        │ │
│   │ │ 1 │ home     │ │
│   │ │ 2 │ viking   │ │
│   │ │ 3 │ eggs.txt │ │
│   │ ╰───┴──────────╯ │
╰───┴──────────────────╯

```
