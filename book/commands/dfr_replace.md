---
title: dfr replace
layout: command
version: 0.63.0
usage: |
  Replace the leftmost (sub)string by a regex pattern
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr replace --pattern --replace```

## Parameters

 -  `--pattern {string}`: Regex pattern to be matched
 -  `--replace {string}`: replacing string

## Examples

Replaces string
```shell
> [abc abc abc] | dfr to-df | dfr replace -p ab -r AB
```
