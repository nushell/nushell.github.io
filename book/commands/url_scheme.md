---
title: url scheme
layout: command
version: 0.60.0
usage: |
  gets the scheme (eg http, file) of a url
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> url scheme ...rest`

## Parameters

- `...rest`: optionally operate by cell path

## Examples

Get scheme of a url

```shell
> echo 'http://www.example.com' | url scheme
```

You get an empty string if there is no scheme

```shell
> echo 'test' | url scheme
```
