---
title: dfr dtypes
version: 0.63.0
usage: |
  Show dataframe data types
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr dtypes ```

## Examples

Dataframe dtypes
```shell
> [[a b]; [1 2] [3 4]] | dfr to-df | dfr dtypes
```
