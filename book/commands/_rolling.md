---
title: rolling
version: 0.64.0
usage: |
  Rolling calculation for a series
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> rolling (type) (window)```

## Parameters

 -  `type`: rolling operation
 -  `window`: Window size for rolling

## Examples

Rolling sum for a series
```shell
> [1 2 3 4 5] | to-df | rolling sum 2 | drop-nulls
```

Rolling max for a series
```shell
> [1 2 3 4 5] | to-df | rolling max 2 | drop-nulls
```
