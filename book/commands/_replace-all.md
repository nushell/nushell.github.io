---
title: replace-all
version: 0.67.1
usage: |
  Replace all (sub)strings by a regex pattern
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> replace-all --pattern --replace```

## Parameters

 -  `--pattern {string}`: Regex pattern to be matched
 -  `--replace {string}`: replacing string

## Examples

Replaces string
```shell
> [abac abac abac] | into df | replace-all -p a -r A
```
