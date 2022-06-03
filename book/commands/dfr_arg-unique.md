---
title: dfr arg-unique
version: 0.63.0
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

```> dfr arg-unique ```

## Examples

Returns indexes for unique values
```shell
> [1 2 2 3 3] | dfr to-df | dfr arg-unique
```
