---
title: do
layout: command
version: 0.62.0
usage: |
  Run a block
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> do (block) ...rest --ignore-errors```

## Parameters

 -  `block`: the block to run
 -  `...rest`: the parameter(s) for the block
 -  `--ignore-errors`: ignore errors as the block runs

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
