---
title: cp
version: 0.69.1
filesystem: |
  Copy files.
usage: |
  Copy files.
---

# <code>{{ $frontmatter.title }}</code> for filesystem

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.filesystem }}</div>

## Signature

```> cp (source) (destination) --recursive --verbose --interactive --no-symlink```

## Parameters

 -  `source`: the place to copy from
 -  `destination`: the place to copy to
 -  `--recursive`: copy recursively through subdirectories
 -  `--verbose`: show successful copies in addition to failed copies (default:false)
 -  `--interactive`: ask user to confirm action
 -  `--no-symlink`: no symbolic links are followed, only works if -r is active

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
