---
title: replace-all
version: 0.70.0
dataframe: |
  Replace all (sub)strings by a regex pattern
usage: |
  Replace all (sub)strings by a regex pattern
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

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
