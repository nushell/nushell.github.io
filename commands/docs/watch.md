---
title: watch
categories: |
  filesystem
version: 0.76.1
filesystem: |
  Watch for file changes and execute Nu code when they happen.
usage: |
  Watch for file changes and execute Nu code when they happen.
---

# <code>{{ $frontmatter.title }}</code> for filesystem

<div class='command-title'>{{ $frontmatter.filesystem }}</div>

## Signature

```> watch (path) (closure) --glob --recursive --verbose```

## Parameters

 -  `path`: the path to watch. Can be a file or directory
 -  `closure`: Some Nu code to run whenever a file changes. The closure will be passed `operation`, `path`, and `new_path` (for renames only) arguments in that order
 -  `--glob {string}`: Only report changes for files that match this glob pattern (default: all files)
 -  `--recursive {bool}`: Watch all directories under `<path>` recursively. Will be ignored if `<path>` is a file (default: true)
 -  `--verbose` `(-v)`: Operate in verbose mode (default: false)

## Examples

Run `cargo test` whenever a Rust file changes
```shell
> watch . --glob=**/*.rs { cargo test }
```

Watch all changes in the current directory
```shell
> watch . { |op, path| $"($op) ($path)"}
```

Log all changes in a directory
```shell
> watch /foo/bar { |op, path| $"($op) - ($path)(char nl)" | save --append changes_in_bar.log }
```
