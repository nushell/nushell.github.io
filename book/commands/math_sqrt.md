---
title: math sqrt
version: 0.63.0
usage: |
  Applies the square root function to a list of numbers
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> math sqrt ```

## Examples

Apply the square root function to a list of numbers
```shell
> [9 16] | math sqrt
```
