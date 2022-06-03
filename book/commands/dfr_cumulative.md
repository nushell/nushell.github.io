---
title: dfr cumulative
version: 0.63.0
usage: |
  Cumulative calculation for a series
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr cumulative (type) --reverse```

## Parameters

 -  `type`: rolling operation
 -  `--reverse`: Reverse cumulative calculation

## Examples

Cumulative sum for a series
```shell
> [1 2 3 4 5] | dfr to-df | dfr cumulative sum
```
