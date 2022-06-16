---
title: is-null
version: 0.64.0
usage: |
  creates a is null expression
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> is-null ```

## Examples

Creates a is null expression from a column
```shell
> col a | is-null
```
