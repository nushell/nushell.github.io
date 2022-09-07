---
title: rm
version: 0.68.0
usage: |
  Remove file(s).
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> rm ...rest --trash --permanent --recursive --force --verbose --interactive```

## Parameters

 -  `...rest`: the file path(s) to remove
 -  `--trash`: use the platform's recycle bin instead of permanently deleting
 -  `--permanent`: don't use recycle bin, delete permanently
 -  `--recursive`: delete subdirectories recursively
 -  `--force`: suppress error when no file
 -  `--verbose`: make rm to be verbose, showing files been deleted
 -  `--interactive`: ask user to confirm action

## Examples

Delete or move a file to the system trash (depending on 'rm_always_trash' config option)
```shell
> rm file.txt
```

Move a file to the system trash
```shell
> rm --trash file.txt
```

Delete a file permanently
```shell
> rm --permanent file.txt
```

Delete a file, and suppress errors if no file is found
```shell
> rm --force file.txt
```
