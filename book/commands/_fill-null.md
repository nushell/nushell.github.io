---
title: fill-null
version: 0.64.0
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

```> fill-null (fill)```

## Parameters

 -  `fill`: Expression to use to fill the null values

## Examples

Fills the null values by 0
```shell
> [1 2 2 3 3] | to-df | shift 2 | fill-null 0
```
