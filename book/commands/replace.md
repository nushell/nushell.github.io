---
title: replace
version: 0.69.1
dataframe: |
  Replace the leftmost (sub)string by a regex pattern
usage: |
  Replace the leftmost (sub)string by a regex pattern
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

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
