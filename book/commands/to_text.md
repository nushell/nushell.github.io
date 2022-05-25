---
title: to text
layout: command
version: 0.63.0
usage: |
  Converts data into simple text.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> to text ```

## Examples

Outputs data as simple text
```shell
> 1 | to text
```

Outputs external data as simple text
```shell
> git help -a | lines | find -r '^ ' |  to text
```

Outputs records as simple text
```shell
> ls |  to text
```
