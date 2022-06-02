---
title: dfr lit
version: 0.63.0
usage: |
  Creates a literal expression
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr lit (literal)```

## Parameters

 -  `literal`: literal to construct the expression

## Examples

Created a literal expression and converts it to a nu object
```shell
> dfr lit 2 | dfr to-nu
```
