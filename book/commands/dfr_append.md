---
title: dfr append
version: 0.63.0
usage: |
  Appends a new dataframe
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr append (other) --col```

## Parameters

 -  `other`: dataframe to be appended
 -  `--col`: appends in col orientation

## Examples

Appends a dataframe as new columns
```shell
> let a = ([[a b]; [1 2] [3 4]] | dfr to-df);
    $a | dfr append $a
```

Appends a dataframe merging at the end of columns
```shell
> let a = ([[a b]; [1 2] [3 4]] | dfr to-df);
    $a | dfr append $a --col
```
