---
title: reverse
version: 0.63.0
usage: |
  Reverses the table.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> reverse ```

## Examples

Reverse the items
```shell
> [0,1,2,3] | reverse
```
