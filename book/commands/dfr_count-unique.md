---
title: dfr count-unique
version: 0.63.0
usage: |
  Counts unique values or creates a n-unique expression
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr count-unique ```

## Examples

Counts unique values
```shell
> [1 1 2 2 3 3 4] | dfr to-df | dfr count-unique
```

Creates a is n-unique expression from a column
```shell
> dfr col a | dfr n-unique
```
