---
title: touch
layout: command
version: 0.60.0
usage: |
  Creates one or more files.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> touch (filename) ...rest```

## Parameters

 -  `filename`: the path of the file you want to create
 -  `...rest`: additional files to create

## Examples

Creates "fixture.json"
```shell
> touch fixture.json
```

Creates files a, b and c
```shell
> touch a b c
```
