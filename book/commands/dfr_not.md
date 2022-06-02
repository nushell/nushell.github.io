---
title: dfr not
version: 0.63.0
usage: |
  Inverts boolean mask or creates a not expression
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr not ```

## Examples

Inverts boolean mask
```shell
> [true false true] | dfr to-df | dfr not
```

Creates a not expression from a column
```shell
> dfr col a | dfr not
```
