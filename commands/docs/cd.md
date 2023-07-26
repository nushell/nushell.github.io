---
title: cd
categories: |
  filesystem
version: 0.83.0
filesystem: |
  Change directory.
usage: |
  Change directory.
---

# <code>{{ $frontmatter.title }}</code> for filesystem

<div class='command-title'>{{ $frontmatter.filesystem }}</div>

## Signature

```> cd (path)```

## Parameters

 -  `path`: the path to change to

## Examples

Change to your home directory
```shell
> cd ~

```

Change to a directory via abbreviations
```shell
> cd d/s/9

```

Change to the previous working directory ($OLDPWD)
```shell
> cd -

```
