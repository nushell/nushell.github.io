---
title: dfr sort-by
version: 0.63.0
usage: |
  sorts a lazy dataframe based on expression(s)
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr sort-by (filter expression) --reverse```

## Parameters

 -  `filter expression`: filtering expression
 -  `--reverse {list<bool>}`: list indicating if reverse search should be done in the column. Default is false

## Examples


```shell
>
```
