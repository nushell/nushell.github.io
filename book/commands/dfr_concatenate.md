---
title: dfr concatenate
layout: command
version: 0.63.0
usage: |
  Concatenates strings with other array
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr concatenate (other)```

## Parameters

 -  `other`: Other array with string to be concatenated

## Examples

Concatenate string
```shell
> let other = ([za xs cd] | dfr to-df);
    [abc abc abc] | dfr to-df | dfr concatenate $other
```
