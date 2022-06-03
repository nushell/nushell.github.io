---
title: dfr sample
version: 0.63.0
usage: |
  Create sample dataframe
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr sample --n-rows --fraction --seed --replace```

## Parameters

 -  `--n-rows {int}`: number of rows to be taken from dataframe
 -  `--fraction {number}`: fraction of dataframe to be taken
 -  `--seed {number}`: seed for the selection
 -  `--replace`: sample with replace

## Examples

Sample rows from dataframe
```shell
> [[a b]; [1 2] [3 4]] | dfr to-df | dfr sample -n 1
```

Shows sample row using fraction and replace
```shell
> [[a b]; [1 2] [3 4] [5 6]] | dfr to-df | dfr sample -f 0.5 -e
```
