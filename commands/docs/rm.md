---
title: rm
categories: |
  filesystem
version: 0.76.0
filesystem: |
  Remove files and directories.
usage: |
  Remove files and directories.
---

# <code>{{ $frontmatter.title }}</code> for filesystem

<div class='command-title'>{{ $frontmatter.filesystem }}</div>

## Signature

```> rm (filename) ...rest --trash --permanent --recursive --force --verbose --interactive --interactive-once```

## Parameters

 -  `filename`: the path of the file you want to remove
 -  `...rest`: additional file path(s) to remove
 -  `--trash` `(-t)`: move to the platform's trash instead of permanently deleting
 -  `--permanent` `(-p)`: delete permanently, ignoring the 'always_trash' config option
 -  `--recursive` `(-r)`: delete subdirectories recursively
 -  `--force` `(-f)`: suppress error when no file
 -  `--verbose` `(-v)`: print names of deleted files
 -  `--interactive` `(-i)`: ask user to confirm action
 -  `--interactive-once` `(-I)`: ask user to confirm action only once

## Examples

Delete, or move a file to the trash (based on the 'always_trash' config option)
```shell
> rm file.txt
```

Move a file to the trash
```shell
> rm --trash file.txt
```

Delete a file permanently, even if the 'always_trash' config option is true
```shell
> rm --permanent file.txt
```

Delete a file, ignoring 'file not found' errors
```shell
> rm --force file.txt
```

Delete all 0KB files in the current directory
```shell
> ls | where size == 0KB and type == file | each { rm $in.name } | null
```
