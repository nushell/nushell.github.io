---
title: lit
version: 0.64.0
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

```> lit (literal)```

## Parameters

 -  `literal`: literal to construct the expression

## Examples

Created a literal expression and converts it to a nu object
```shell
> lit 2 | to-nu
```
