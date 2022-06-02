---
title: dfr filter-with
version: 0.63.0
usage: |
  Filters dataframe using a mask or expression as reference
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr filter-with (mask or expression)```

## Parameters

 -  `mask or expression`: boolean mask used to filter data

## Examples

Filter dataframe using a bool mask
```shell
> let mask = ([true false] | dfr to-df);
    [[a b]; [1 2] [3 4]] | dfr to-df | dfr filter-with $mask
```
