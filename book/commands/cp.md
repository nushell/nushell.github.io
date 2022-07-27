---
title: cp
version: 0.66.1
usage: |
  Copy files.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> cp (destination) ...source(s) --recursive --verbose --interactive --no-dereference```

## Parameters

 -  `destination`: the place to copy to
 -  `...source(s)`: the place(s) to copy from
 -  `--recursive`: copy recursively through subdirectories
 -  `--verbose`: do copy in verbose mode (default:false)
 -  `--interactive`: ask user to confirm action
 -  `--no-dereference`: If the -r option is specified, no symbolic links are followed.

## Examples

Copy myfile to dir_b
```shell
> cp myfile dir_b
```

Recursively copy dir_a to dir_b
```shell
> cp -r dir_a dir_b
```

Recursively copy dir_a to dir_b, and print the feedbacks
```shell
> cp -r -v dir_a dir_b
```

Move many files into a directory
```shell
> cp *.txt dir_a
```
