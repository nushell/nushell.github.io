---
title: dfr last
version: 0.63.0
usage: |
  Creates new dataframe with tail rows or creates a last expression
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr last (rows)```

## Parameters

 -  `rows`: Number of rows for tail

## Examples

Create new dataframe with last rows
```shell
> [[a b]; [1 2] [3 4]] | dfr to-df | dfr last 1
```

Creates a last expression from a column
```shell
> dfr col a | dfr last
```
