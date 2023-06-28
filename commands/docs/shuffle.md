---
title: shuffle
categories: |
  filters
version: 0.82.1
filters: |
  Shuffle rows randomly.
usage: |
  Shuffle rows randomly.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> shuffle ```

## Examples

Shuffle rows randomly (execute it several times and see the difference)
```shell
> [[version patch]; ['1.0.0' false] ['3.0.1' true] ['2.0.0' false]] | shuffle

```
