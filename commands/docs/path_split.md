---
title: path split
categories: |
  default
version: 0.83.0
default: |
  Split a path into a list based on the system's path separator.
usage: |
  Split a path into a list based on the system's path separator.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> path split ```

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
