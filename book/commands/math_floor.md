---
title: math floor
version: 0.63.0
usage: |
  Applies the floor function to a list of numbers
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> math floor ```

## Examples

Apply the floor function to a list of numbers
```shell
> [1.5 2.3 -3.1] | math floor
```
