---
title: ls
categories: |
  filesystem
version: 0.71.0
filesystem: |
  List the files in a directory.
usage: |
  List the files in a directory.
---

# <code>{{ $frontmatter.title }}</code> for filesystem

<div class='command-title'>{{ $frontmatter.filesystem }}</div>

## Signature

```> ls (pattern) --all --long --short-names --full-paths --du --directory```

## Parameters

 -  `pattern`: the glob pattern to use
 -  `--all`: Show hidden files
 -  `--long`: Get all available columns for each entry (slower; columns are platform-dependent)
 -  `--short-names`: Only print the file names, and not the path
 -  `--full-paths`: display paths as absolute paths
 -  `--du`: Display the apparent directory size in place of the directory metadata size
 -  `--directory`: List the specified directory itself instead of its contents

## Examples

List visible files in the current directory
```shell
> ls
```

List visible files in a subdirectory
```shell
> ls subdir
```

List visible files with full path in the parent directory
```shell
> ls -f ..
```

List Rust files
```shell
> ls *.rs
```

List files and directories whose name do not contain 'bar'
```shell
> ls -s | where name !~ bar
```

List all dirs in your home directory
```shell
> ls -a ~ | where type == dir
```

List all dirs in your home directory which have not been modified in 7 days
```shell
> ls -as ~ | where type == dir && modified < ((date now) - 7day)
```

List given paths and show directories themselves
```shell
> ['/path/to/directory' '/path/to/file'] | each { ls -D $in } | flatten
```
