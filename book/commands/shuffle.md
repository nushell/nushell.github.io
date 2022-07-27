---
title: shuffle
version: 0.66.1
usage: |
  Shuffle rows randomly.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> shuffle ```

## Examples

Shuffle rows randomly (execute it several times and see the difference)
```shell
> echo [[version patch]; [1.0.0 false] [3.0.1 true] [2.0.0 false]] | shuffle
```
