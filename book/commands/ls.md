---
title: ls
categories: |
  filesystem
version: 0.74.0
filesystem: |
  List the filenames, sizes, and modification times of items in a directory.
usage: |
  List the filenames, sizes, and modification times of items in a directory.
---

# <code>{{ $frontmatter.title }}</code> for filesystem

<div class='command-title'>{{ $frontmatter.filesystem }}</div>

## Signature

```> ls (pattern) --all --long --short-names --full-paths --du --directory --mime-type```

## Parameters

 -  `pattern`: the glob pattern to use
 -  `--all`: Show hidden files
 -  `--long`: Get all available columns for each entry (slower; columns are platform-dependent)
 -  `--short-names`: Only print the file names, and not the path
 -  `--full-paths`: display paths as absolute paths
 -  `--du`: Display the apparent directory size ("disk usage") in place of the directory metadata size
 -  `--directory`: List the specified directory itself instead of its contents
 -  `--mime-type`: Show mime-type in type column instead of 'file' (based on filenames only; files' contents are not examined)

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
> ls -as ~ | where type == dir and modified < ((date now) - 7day)
```

List given paths and show directories themselves
```shell
> ['/path/to/directory' '/path/to/file'] | each { ls -D $in } | flatten
```
