---
title: url scheme
version: 0.69.1
network: |
  Get the scheme (e.g. http, file) of a URL
usage: |
  Get the scheme (e.g. http, file) of a URL
---

# <code>{{ $frontmatter.title }}</code> for network

<div class='command-title'>{{ $frontmatter.network }}</div>

## Signature

```> url scheme ...rest```

## Parameters

 -  `...rest`: optionally operate by cell path

## Examples

Get the scheme of a URL
```shell
> echo 'http://www.example.com' | url scheme
```

You get an empty string if there is no scheme
```shell
> echo 'test' | url scheme
```
