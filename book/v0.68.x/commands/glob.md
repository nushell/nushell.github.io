---
title: glob
version: 0.68.0
usage: |
  Creates a list of files and/or folders based on the glob pattern provided.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> glob (glob) --depth```

## Parameters

 -  `glob`: the glob expression
 -  `--depth {int}`: directory depth to search

## Notes
```text
For more glob pattern help please refer to https://github.com/olson-sean-k/wax
```
## Examples

Search for *.rs files
```shell
> glob *.rs
```

Search for *.rs and *.toml files recursively up to 2 folders deep
```shell
> glob **/*.{rs,toml} --depth 2
```

Search for files and folders that begin with uppercase C and lowercase c
```shell
> glob "[Cc]*"
```

Search for files and folders like abc or xyz substituting a character for ?
```shell
> glob "{a?c,x?z}"
```

A case-insensitive search for files and folders that begin with c
```shell
> glob "(?i)c*"
```

Search for files for folders that do not begin with c, C, b, M, or s
```shell
> glob "[!cCbMs]*"
```

Search for files or folders with 3 a's in a row in the name
```shell
> glob <a*:3>
```

Search for files or folders with only a, b, c, or d in the file name between 1 and 10 times
```shell
> glob <[a-d]:1,10>
```
