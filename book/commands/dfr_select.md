---
title: dfr select
version: 0.63.0
usage: |
  Selects columns from lazyframe
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr select (select expressions)```

## Parameters

 -  `select expressions`: Expression(s) that define the column selection

## Examples


```shell
>
```
