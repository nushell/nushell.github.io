---
title: url query
layout: command
version: 0.60.1
usage: |
  gets the query of a url
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> url query ...rest`

## Parameters

- `...rest`: optionally operate by cell path

## Examples

Get query of a url

```shell
> echo 'http://www.example.com/?foo=bar&baz=quux' | url query
```

No query gives the empty string

```shell
> echo 'http://www.example.com/' | url query
```
