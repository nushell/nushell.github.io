---
title: is-not-null
version: 0.64.0
usage: |
  creates a is not null expression
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> is-not-null ```

## Examples

Creates a is not null expression from a column
```shell
> col a | is-not-null
```
