---
title: math abs
version: 0.63.0
usage: |
  Returns absolute values of a list of numbers
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> math abs ```

## Examples

Get absolute of each value in a list of numbers
```shell
> [-50 -100.0 25] | math abs
```
