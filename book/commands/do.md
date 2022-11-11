---
title: do
categories: |
  core
version: 0.71.0
core: |
  Run a block
usage: |
  Run a block
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> do (block) ...rest --ignore-errors --capture-errors```

## Parameters

 -  `block`: the block to run
 -  `...rest`: the parameter(s) for the block
 -  `--ignore-errors`: ignore shell errors as the block runs
 -  `--capture-errors`: capture errors as the block runs and return it

## Examples

Run the block
```shell
> do { echo hello }
```

Run the block and ignore shell errors
```shell
> do -i { thisisnotarealcommand }
```

Abort the pipeline if a program returns a non-zero exit code
```shell
> do -c { nu -c 'exit 1' } | myscarycommand
```

Run the block, with a positional parameter
```shell
> do {|x| 100 + $x } 50
```
