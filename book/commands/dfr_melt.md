---
title: dfr melt
version: 0.63.0
usage: |
  Unpivot a DataFrame from wide to long format
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr melt --columns --values --variable-name --value-name```

## Parameters

 -  `--columns {table}`: column names for melting
 -  `--values {table}`: column names used as value columns
 -  `--variable-name {string}`: optional name for variable column
 -  `--value-name {string}`: optional name for value column

## Examples

melt dataframe
```shell
> [[a b c d]; [x 1 4 a] [y 2 5 b] [z 3 6 c]] | dfr to-df | dfr melt -c [b c] -v [a d]
```
