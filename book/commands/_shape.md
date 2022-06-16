---
title: shape
version: 0.64.0
usage: |
  Shows column and row size for a dataframe
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> shape ```

## Examples

Shows row and column shape
```shell
> [[a b]; [1 2] [3 4]] | to-df | shape
```
