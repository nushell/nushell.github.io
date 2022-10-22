---
title: url host
categories: |
  network
version: 0.70.0
network: |
  Get the host of a URL
usage: |
  Get the host of a URL
---

# <code>{{ $frontmatter.title }}</code> for network

<div class='command-title'>{{ $frontmatter.network }}</div>

## Signature

```> url host ...rest```

## Parameters

 -  `...rest`: optionally operate by cell path

## Examples

Get host of a url
```shell
> echo 'http://www.example.com/foo/bar' | url host
```
