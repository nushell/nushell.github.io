---
title: seq
categories: |
  generators
version: 0.76.0
generators: |
  Output sequences of numbers.
usage: |
  Output sequences of numbers.
---

# <code>{{ $frontmatter.title }}</code> for generators

<div class='command-title'>{{ $frontmatter.generators }}</div>

## Signature

```> seq ...rest```

## Parameters

 -  `...rest`: sequence values

## Examples

sequence 1 to 10
```shell
> seq 1 10
```

sequence 1.0 to 2.0 by 0.1s
```shell
> seq 1.0 0.1 2.0
```

sequence 1 to 5, then convert to a string with a pipe separator
```shell
> seq 1 5 | str join '|'
```
