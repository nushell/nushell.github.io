---
title: to-dummies
version: 0.64.0
usage: |
  Creates a new dataframe with dummy variables
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> to-dummies ```

## Examples

Create new dataframe with dummy variables from a dataframe
```shell
> [[a b]; [1 2] [3 4]] | to-df | to-dummies
```

Create new dataframe with dummy variables from a series
```shell
> [1 2 2 3 3] | to-df | to-dummies
```
