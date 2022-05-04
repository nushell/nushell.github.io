---
title: print
layout: command
version: 0.62.0
usage: |
  Prints the values given
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> print ...rest```

## Parameters

 -  `...rest`: the values to print

## Examples

Print 'hello world'
```shell
> print "hello world"
```

Print the sum of 2 and 3
```shell
> print (2 + 3)
```
