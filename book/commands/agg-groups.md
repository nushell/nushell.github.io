---
title: agg-groups
version: 0.64.0
usage: |
  creates an agg_groups expression
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> agg-groups ```

## Examples


```shell
>
```
