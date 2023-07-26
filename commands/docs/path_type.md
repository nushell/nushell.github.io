---
title: path type
categories: |
  default
version: 0.83.0
default: |
  Get the type of the object a path refers to (e.g., file, dir, symlink).
usage: |
  Get the type of the object a path refers to (e.g., file, dir, symlink).
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> path type ```

## Notes
This checks the file system to confirm the path's object type.
If nothing is found, an empty string will be returned.
## Examples

Show type of a filepath
```shell
> '.' | path type
dir
```

Show type of a filepaths in a list
```shell
> ls | get name | path type

```
