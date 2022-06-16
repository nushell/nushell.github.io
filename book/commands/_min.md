---
title: min
version: 0.64.0
usage: |
  Aggregates columns to their min value
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

Min value from columns in a dataframe
```shell
> [[a b]; [6 2] [1 4] [4 1]] | to-df | min
```
