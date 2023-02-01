---
title: describe
categories: |
  core
version: 0.75.0
core: |
  Describe the type and structure of the value(s) piped in.
usage: |
  Describe the type and structure of the value(s) piped in.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> describe --no-collect```

## Parameters

 -  `--no-collect`: do not collect streams of structured data

## Examples

Describe the type of a string
```shell
> 'hello' | describe
```

Describe a stream of data, collecting it first
```shell
> [1 2 3] | each {|i| $i} | describe
```

Describe the input but do not collect streams
```shell
> [1 2 3] | each {|i| $i} | describe --no-collect
```
