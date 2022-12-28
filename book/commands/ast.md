---
title: ast
categories: |
  core
version: 0.73.1
core: |
  Print the abstract syntax tree (ast) for a pipeline.
usage: |
  Print the abstract syntax tree (ast) for a pipeline.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> ast (pipeline)```

## Parameters

 -  `pipeline`: the pipeline to print the ast for

## Examples

Print the ast of a string
```shell
> ast 'hello'
```

Print the ast of a pipeline
```shell
> ast 'ls | where name =~ README'
```

Print the ast of a pipeline with an error
```shell
> ast 'for x in 1..10 { echo $x '
```
