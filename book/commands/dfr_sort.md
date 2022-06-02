---
title: dfr sort
version: 0.63.0
usage: |
  Creates new sorted dataframe or series
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr sort ...rest --reverse```

## Parameters

 -  `...rest`: column names to sort dataframe
 -  `--reverse`: invert sort

## Examples

Create new sorted dataframe
```shell
> [[a b]; [3 4] [1 2]] | dfr to-df | dfr sort a
```

Create new sorted series
```shell
> [3 4 1 2] | dfr to-df | dfr sort
```
