---
title: expr-not
version: 0.64.0
usage: |
  creates a not expression
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> expr-not ```

## Examples

Creates a not expression
```shell
> (col a) > 2) | expr-not
```
