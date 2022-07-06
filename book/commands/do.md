---
title: do
version: 0.65.1
usage: |
  Run a block
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
