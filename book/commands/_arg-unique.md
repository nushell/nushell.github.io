---
title: arg-unique
version: 0.64.0
usage: |
  Returns indexes for unique values
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> arg-unique ```

## Examples

Returns indexes for unique values
```shell
> [1 2 2 3 3] | to-df | arg-unique
```
