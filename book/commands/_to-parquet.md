---
title: to-parquet
version: 0.64.0
usage: |
  Saves dataframe to parquet file
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> to-parquet (file)```

## Parameters

 -  `file`: file path to save dataframe

## Examples

Saves dataframe to parquet file
```shell
> [[a b]; [1 2] [3 4]] | to-df | to-parquet test.parquet
```
