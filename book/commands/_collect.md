---
title: collect
version: 0.64.0
usage: |
  Collect lazy dataframe into eager dataframe
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> collect ```

## Examples

drop duplicates
```shell
> [[a b]; [1 2] [3 4]] | to-lazy | collect
```
