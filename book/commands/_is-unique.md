---
title: is-unique
version: 0.64.0
usage: |
  Creates mask indicating unique values
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> is-unique ```

## Examples

Create mask indicating unique values
```shell
> [5 6 6 6 8 8 8] | to-df | is-unique
```
