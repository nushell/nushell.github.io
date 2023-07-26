---
title: path relative-to
categories: |
  default
version: 0.83.0
default: |
  Express a path as relative to another path.
usage: |
  Express a path as relative to another path.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> path relative-to (path)```

## Parameters

 -  `path`: Parent shared with the input path

## Notes
Can be used only when the input and the argument paths are either both
absolute or both relative. The argument path needs to be a parent of the input
path.
## Examples

Find a relative path from two absolute paths
```shell
> '/home/viking' | path relative-to '/home'
viking
```

Find a relative path from absolute paths in list
```shell
> [ /home/viking, /home/spam ] | path relative-to '/home'
╭───┬────────╮
│ 0 │ viking │
│ 1 │ spam   │
╰───┴────────╯

```

Find a relative path from two relative paths
```shell
> 'eggs/bacon/sausage/spam' | path relative-to 'eggs/bacon/sausage'
spam
```
