---
title: url path
version: 0.67.1
usage: |
  Get the path of a URL
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
