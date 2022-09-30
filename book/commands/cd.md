---
title: cd
version: 0.69.1
usage: |
  Change directory.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
