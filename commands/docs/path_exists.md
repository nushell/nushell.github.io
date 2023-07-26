---
title: path exists
categories: |
  default
version: 0.83.0
default: |
  Check whether a path exists.
usage: |
  Check whether a path exists.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> path exists ```

## Notes
This only checks if it is possible to either `open` or `cd` to the given path.
If you need to distinguish dirs and files, please use `path type`.
## Examples

Check if a file exists
```shell
> '/home/joe/todo.txt' | path exists
false
```

Check if files in list exist
```shell
> [ /home/joe/todo.txt, /home/doe/todo.txt ] | path exists
╭───┬───────╮
│ 0 │ false │
│ 1 │ false │
╰───┴───────╯

```
