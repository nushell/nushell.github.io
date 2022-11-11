---
title: str-lengths
categories: |
  dataframe
version: 0.71.0
dataframe: |
  Get lengths of all strings
usage: |
  Get lengths of all strings
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> str-lengths ```

## Examples

Returns string lengths
```shell
> [a ab abc] | into df | str-lengths
```
