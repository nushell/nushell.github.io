---
title: dfr get
version: 0.63.0
usage: |
  Creates dataframe with the selected columns
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr get ...rest```

## Parameters

 -  `...rest`: column names to sort dataframe

## Examples

Creates dataframe with selected columns
```shell
> [[a b]; [1 2] [3 4]] | dfr to-df | dfr get a
```
