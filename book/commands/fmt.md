---
title: fmt
version: 0.63.0
usage: |
  Format a number
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> fmt ```

## Examples

Get a record containing multiple formats for the number 42
```shell
> 42 | fmt
```
