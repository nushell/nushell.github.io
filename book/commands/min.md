---
title: min
version: 0.64.0
usage: |
  Creates a min expression
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> min ```

## Examples

Min aggregation for a group by
```shell
> [[a b]; [one 2] [one 4] [two 1]]
    | to-df
    | group-by a
    | agg (col b | min)
```
