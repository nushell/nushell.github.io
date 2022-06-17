---
title: n-unique
version: 0.64.0
usage: |
  creates a n-unique expression
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> n-unique ```

## Examples

Creates a is n-unique expression from a column
```shell
> col a | n-unique
```
