---
title: ast
categories: |
  debug
version: 0.82.0
debug: |
  Print the abstract syntax tree (ast) for a pipeline.
usage: |
  Print the abstract syntax tree (ast) for a pipeline.
---

# <code>{{ $frontmatter.title }}</code> for debug

<div class='command-title'>{{ $frontmatter.debug }}</div>

## Signature

```> ast (pipeline) --json --minify```

## Parameters

 -  `pipeline`: the pipeline to print the ast for
 -  `--json` `(-j)`: serialize to json
 -  `--minify` `(-m)`: minify the nuon or json output

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

Print the ast of a pipeline with an error, as json, in a nushell table
```shell
> ast 'for x in 1..10 { echo $x ' --json | get block | from json

```

Print the ast of a pipeline with an error, as json, minified
```shell
> ast 'for x in 1..10 { echo $x ' -j -m

```
