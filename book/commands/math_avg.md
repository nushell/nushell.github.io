---
title: math avg
version: 0.63.0
usage: |
  Finds the average of a list of numbers or tables
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> math avg ```

## Examples

Get the average of a list of numbers
```shell
> [-50 100.0 25] | math avg
```
