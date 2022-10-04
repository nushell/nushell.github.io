---
title: split chars
version: 0.69.1
strings: |
  Split a string's characters into separate rows
usage: |
  Split a string's characters into separate rows
---

# <code>{{ $frontmatter.title }}</code> for strings

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.strings }}</div>

## Signature

```> split chars ```

## Examples

Split the string's characters into separate rows
```shell
> 'hello' | split chars
```
