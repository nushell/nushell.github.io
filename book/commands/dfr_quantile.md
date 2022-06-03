---
title: dfr quantile
version: 0.63.0
usage: |
  Aggregates the columns to the selected quantile
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr quantile (quantile)```

## Parameters

 -  `quantile`: quantile value for quantile operation

## Examples


```shell
>
```
