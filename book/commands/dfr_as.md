---
title: dfr as
version: 0.63.0
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

```> dfr as (Alias name)```

## Parameters

 -  `Alias name`: Alias name for the expression

## Examples

Creates and alias expression
```shell
> (dfr col a | df as new_a)
```
