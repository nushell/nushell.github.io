---
title: math min
version: 0.63.0
usage: |
  Finds the minimum within a list of numbers or tables
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> math min ```

## Examples

Get the minimum of a list of numbers
```shell
> [-50 100 25] | math min
```
