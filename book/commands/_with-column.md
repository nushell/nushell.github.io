---
title: with-column
version: 0.64.0
usage: |
  Adds a series to the dataframe
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> with-column ...series or expressions --name```

## Parameters

 -  `...series or expressions`: series to be added or expressions used to define the new columns
 -  `--name {string}`: new column name

## Examples

Adds a series to the dataframe
```shell
> [[a b]; [1 2] [3 4]]
    | to-df
    | with-column ([5 6] | to-df) --name c
```

Adds a series to the dataframe
```shell
> [[a b]; [1 2] [3 4]]
    | to-lazy
    | with-column [
        ((col a) * 2 | as "c")
        ((col a) * 3 | as "d")
      ]
    | collect
```
