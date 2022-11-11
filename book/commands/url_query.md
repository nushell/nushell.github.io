---
title: url query
categories: |
  network
version: 0.71.0
network: |
  Get the query string of a URL
usage: |
  Get the query string of a URL
---

# <code>{{ $frontmatter.title }}</code> for network

<div class='command-title'>{{ $frontmatter.network }}</div>

## Signature

```> url query ...rest```

## Parameters

 -  `...rest`: optionally operate by cell path

## Examples

Get a query string
```shell
> echo 'http://www.example.com/?foo=bar&baz=quux' | url query
```

Returns an empty string if there is no query string
```shell
> echo 'http://www.example.com/' | url query
```
