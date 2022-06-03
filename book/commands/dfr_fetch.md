---
title: dfr fetch
version: 0.63.0
usage: |
  collects the lazyframe to the selected rows
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr fetch (rows)```

## Parameters

 -  `rows`: number of rows to be fetched from lazyframe

## Examples


```shell
>
```
