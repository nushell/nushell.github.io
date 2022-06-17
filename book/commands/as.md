---
title: as
version: 0.64.0
usage: |
  Creates an alias expression
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> as (Alias name)```

## Parameters

 -  `Alias name`: Alias name for the expression

## Examples

Creates and alias expression
```shell
> col a | as new_a | to-nu
```
