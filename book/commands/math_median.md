---
title: math median
version: 0.63.0
usage: |
  Gets the median of a list of numbers
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> math median ```

## Examples

Get the median of a list of numbers
```shell
> [3 8 9 12 12 15] | math median
```
