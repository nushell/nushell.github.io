---
title: replace-all
categories: |
  dataframe
version: 0.75.0
dataframe: |
  Replace all (sub)strings by a regex pattern
usage: |
  Replace all (sub)strings by a regex pattern
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> replace-all ```

## Examples

Replaces string
```shell
> [abac abac abac] | into df | replace-all -p a -r A
```
