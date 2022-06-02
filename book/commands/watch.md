---
title: watch
layout: command
version: 0.63.0
usage: |
  Watch for file changes and execute Nu code when they happen.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> watch (path) (block) --debounce-ms --glob --recursive --verbose```

## Parameters

 -  `path`: the path to watch. Can be a file or directory
 -  `block`: A Nu block of code to run whenever a file changes. The block will be passed `operation`, `path`, and `new_path` (for renames only) arguments in that order
 -  `--debounce-ms {int}`: Debounce changes for this many milliseconds (default: 100). Adjust if you find that single writes are reported as multiple events
 -  `--glob {string}`: Only report changes for files that match this glob pattern (default: all files)
 -  `--recursive {bool}`: Watch all directories under <path> recursively. Will be ignored if <path> is a file (default: true)
 -  `--verbose`: Operate in verbose mode (default: false)

## Examples

Run `cargo test` whenever a Rust file changes
```shell
> watch . --glob=**/*.rs { cargo test }
```

Watch all changes in the current directory
```shell
> watch . { |op, path, new_path| $"($op) ($path) ($new_path)"}
```

Log all changes in a directory
```shell
> watch /foo/bar { |op, path| $"($op) - ($path)(char nl)" | save --append changes_in_bar.log }
```
