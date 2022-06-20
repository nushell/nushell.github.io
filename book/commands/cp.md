---
title: cp
version: 0.64.0
usage: |
  Copy files.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> cp (source) (destination) --recursive --verbose --interactive --no-dereference```

## Parameters

 -  `source`: the place to copy from
 -  `destination`: the place to copy to
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
