---
title: port
version: 0.65.1
usage: |
  Get a free port from system
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> port (start) (end)```

## Parameters

 -  `start`: The start port to scan (inclusive)
 -  `end`: The end port to scan (inclusive)

## Examples

get free port between 3121 and 4000
```shell
> port 3121 4000
```

get free port from system
```shell
> port
```
