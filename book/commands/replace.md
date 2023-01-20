---
title: replace
categories: |
  dataframe
version: 0.74.0
dataframe: |
  Replace the leftmost (sub)string by a regex pattern
usage: |
  Replace the leftmost (sub)string by a regex pattern
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> replace ```

## Examples

Replaces string
```shell
> [abc abc abc] | into df | replace -p ab -r AB
```
