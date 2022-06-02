---
title: dfr is-duplicated
version: 0.63.0
usage: |
  Creates mask indicating duplicated values
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr is-duplicated ```

## Examples

Create mask indicating duplicated values
```shell
> [5 6 6 6 8 8 8] | dfr to-df | dfr is-duplicated
```
