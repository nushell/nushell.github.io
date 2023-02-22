---
title: port
categories: |
  network
version: 0.76.0
network: |
  Get a free port from system
usage: |
  Get a free port from system
---

# <code>{{ $frontmatter.title }}</code> for network

<div class='command-title'>{{ $frontmatter.network }}</div>

## Signature

```> port (start) (end)```

## Parameters

 -  `start`: The start port to scan (inclusive)
 -  `end`: The end port to scan (inclusive)

## Examples

get a free port between 3121 and 4000
```shell
> port 3121 4000
```

get a free port from system
```shell
> port
```
