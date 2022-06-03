---
title: dfr fill-null
version: 0.63.0
usage: |
  Replaces NULL values with the given expression
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr fill-null (fill)```

## Parameters

 -  `fill`: Expression to use to fill the null values

## Examples


```shell
>
```
