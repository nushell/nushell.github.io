---
title: dfr fill-na
version: 0.63.0
usage: |
  Replaces NA values with the given expression
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr fill-na (fill)```

## Parameters

 -  `fill`: Expression to use to fill the NAN values

## Examples


```shell
>
```
