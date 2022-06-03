---
title: dfr arg-max
version: 0.63.0
usage: |
  Return index for max value in series
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr arg-max ```

## Examples

Returns index for max value
```shell
> [1 3 2] | dfr to-df | dfr arg-max
```
