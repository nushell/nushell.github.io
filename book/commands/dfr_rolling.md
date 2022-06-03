---
title: dfr rolling
version: 0.63.0
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

```> dfr rolling (type) (window)```

## Parameters

 -  `type`: rolling operation
 -  `window`: Window size for rolling

## Examples

Rolling sum for a series
```shell
> [1 2 3 4 5] | dfr to-df | dfr rolling sum 2 | dfr drop-nulls
```

Rolling max for a series
```shell
> [1 2 3 4 5] | dfr to-df | dfr rolling max 2 | dfr drop-nulls
```
