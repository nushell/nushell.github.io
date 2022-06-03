---
title: dfr count-null
version: 0.63.0
usage: |
  Counts null values
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr count-null ```

## Examples

Counts null values
```shell
> let s = ([1 1 0 0 3 3 4] | dfr to-df);
    ($s / $s) | dfr count-null
```
