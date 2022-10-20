---
title: do
version: 0.70.0
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
 -  `--ignore-errors`: ignore errors as the block runs
 -  `--capture-errors`: capture errors as the block runs and return it

## Examples

Run the block
```shell
> do { echo hello }
```

Run the block and ignore errors
```shell
> do -i { thisisnotarealcommand }
```

Run the block, with a positional parameter
```shell
> do {|x| 100 + $x } 50
```
