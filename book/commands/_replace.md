---
title: replace
version: 0.67.0
usage: |
  Replace the leftmost (sub)string by a regex pattern
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> replace --pattern --replace```

## Parameters

 -  `--pattern {string}`: Regex pattern to be matched
 -  `--replace {string}`: replacing string

## Examples

Replaces string
```shell
> [abc abc abc] | into df | replace -p ab -r AB
```
