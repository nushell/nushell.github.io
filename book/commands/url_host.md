---
title: url host
version: 0.69.1
network: |
  Get the host of a URL
usage: |
  Get the host of a URL
---

# <code>{{ $frontmatter.title }}</code> for network

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.network }}</div>

## Signature

```> url host ...rest```

## Parameters

 -  `...rest`: optionally operate by cell path

## Examples

Get host of a url
```shell
> echo 'http://www.example.com/foo/bar' | url host
```
