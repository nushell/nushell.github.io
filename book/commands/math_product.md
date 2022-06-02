---
title: math product
version: 0.63.0
usage: |
  Finds the product of a list of numbers or tables
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> math product ```

## Examples

Get the product of a list of numbers
```shell
> [2 3 3 4] | math product
```
