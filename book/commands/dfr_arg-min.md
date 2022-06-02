---
title: dfr arg-min
version: 0.63.0
usage: |
  Return index for min value in series
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr arg-min ```

## Examples

Returns index for min value
```shell
> [1 3 2] | dfr to-df | dfr arg-min
```
