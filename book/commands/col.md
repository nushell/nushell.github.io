---
title: col
version: 0.64.0
usage: |
  Creates a named column expression
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> col (column name)```

## Parameters

 -  `column name`: Name of column to be used

## Examples

Creates a named column expression and converts it to a nu object
```shell
> col a | to-nu
```
