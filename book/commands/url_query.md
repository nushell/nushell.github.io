---
title: url query
version: 0.69.1
network: |
  Get the query string of a URL
usage: |
  Get the query string of a URL
---

# <code>{{ $frontmatter.title }}</code> for network

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.network }}</div>

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
