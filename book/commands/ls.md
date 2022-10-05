---
title: ls
version: 0.69.1
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
 -  `--long`: List all available columns for each entry
 -  `--short-names`: Only print the file names and not the path
 -  `--full-paths`: display paths as absolute paths
 -  `--du`: Display the apparent directory size in place of the directory metadata size
 -  `--directory`: List the specified directory itself instead of its contents

## Examples

List all files in the current directory
```shell
> ls
```

List all files in a subdirectory
```shell
> ls subdir
```

List all files with full path in the parent directory
```shell
> ls -f ..
```

List all rust files
```shell
> ls *.rs
```

List all files and directories whose name do not contain 'bar'
```shell
> ls -s | where name !~ bar
```

List all dirs in your home directory
```shell
> ls ~ | where type == dir
```

List all dirs in your home directory which have not been modified in 7 days
```shell
> ls -s ~ | where type == dir && modified < ((date now) - 7day)
```

List given paths, show directories themselves
```shell
> ['/path/to/directory' '/path/to/file'] | each { |it| ls -D $it } | flatten
```
