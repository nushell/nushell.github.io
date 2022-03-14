---
title: dfr str-lengths
layout: command
version: 0.59.1
usage: |
  Get lengths of all strings
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr str-lengths ```

## Examples

Returns string lengths
```shell
> [a ab abc] | dfr to-df | dfr str-lengths
```
