---
title: cp
categories: |
  filesystem
version: 0.76.1
filesystem: |
  Copy files.
usage: |
  Copy files.
---

# <code>{{ $frontmatter.title }}</code> for filesystem

<div class='command-title'>{{ $frontmatter.filesystem }}</div>

## Signature

```> cp (source) (destination) --recursive --verbose --interactive --no-symlink --progress```

## Parameters

 -  `source`: the place to copy from
 -  `destination`: the place to copy to
 -  `--recursive` `(-r)`: copy recursively through subdirectories
 -  `--verbose` `(-v)`: show successful copies in addition to failed copies (default:false)
 -  `--interactive` `(-i)`: ask user to confirm action
 -  `--no-symlink` `(-n)`: no symbolic links are followed, only works if -r is active
 -  `--progress` `(-p)`: enable progress bar

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
