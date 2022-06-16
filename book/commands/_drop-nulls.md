---
title: drop-nulls
version: 0.64.0
usage: |
  Drops null values in dataframe
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> drop-nulls (subset)```

## Parameters

 -  `subset`: subset of columns to drop nulls

## Examples

drop null values in dataframe
```shell
> let df = ([[a b]; [1 2] [3 0] [1 2]] | to-df);
    let res = ($df.b / $df.b);
    let a = ($df | with-column $res --name res);
    $a | drop-nulls
```

drop null values in dataframe
```shell
> let s = ([1 2 0 0 3 4] | to-df);
    ($s / $s) | drop-nulls
```
