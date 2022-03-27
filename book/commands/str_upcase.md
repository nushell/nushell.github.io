---
title: str upcase
layout: command
version: 0.60.0
usage: |
  upcases text
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> str upcase ...rest`

## Parameters

- `...rest`: optionally upcase text by column paths

## Examples

Upcase contents

```shell
> 'nu' | str upcase
```
