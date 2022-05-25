---
title: url host
layout: command
version: 0.63.0
usage: |
  Get the host of a URL
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> url host ...rest```

## Parameters

 -  `...rest`: optionally operate by cell path

## Examples

Get host of a url
```shell
> echo 'http://www.example.com/foo/bar' | url host
```
