---
title: ast
version: 0.67.1
usage: |
  Print the abstract syntax tree (ast) for a pipeline.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
