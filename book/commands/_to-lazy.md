---
title: to-lazy
version: 0.64.0
usage: |
  Converts a dataframe into a lazy dataframe
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> to-lazy ```

## Examples

Takes a dictionary and creates a lazy dataframe
```shell
> [[a b];[1 2] [3 4]] | to-lazy
```
