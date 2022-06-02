---
title: dfr cache
version: 0.63.0
usage: |
  Caches operations in a new LazyFrame
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr cache ```

## Examples


```shell
>
```
