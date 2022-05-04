---
title: url scheme
layout: command
version: 0.62.0
usage: |
  Get the scheme (e.g. http, file) of a URL
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
