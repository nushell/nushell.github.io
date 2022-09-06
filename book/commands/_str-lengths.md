---
title: str-lengths
version: 0.67.1
usage: |
  Get lengths of all strings
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> str-lengths ```

## Examples

Returns string lengths
```shell
> [a ab abc] | into df | str-lengths
```
