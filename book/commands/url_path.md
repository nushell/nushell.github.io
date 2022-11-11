---
title: url path
categories: |
  network
version: 0.71.0
network: |
  Get the path of a URL
usage: |
  Get the path of a URL
---

# <code>{{ $frontmatter.title }}</code> for network

<div class='command-title'>{{ $frontmatter.network }}</div>

## Signature

```> url path ...rest```

## Parameters

 -  `...rest`: optionally operate by cell path

## Examples

Get path of a url
```shell
> echo 'http://www.example.com/foo/bar' | url path
```

A trailing slash will be reflected in the path
```shell
> echo 'http://www.example.com' | url path
```
