---
title: median
version: 0.64.0
usage: |
  Aggregates columns to their median value
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> median ```

## Examples

Median value from columns in a dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | to-df | median
```
