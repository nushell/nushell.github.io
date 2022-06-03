---
title: dfr column
version: 0.63.0
usage: |
  Returns the selected column
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr column (column)```

## Parameters

 -  `column`: column name

## Examples

Returns the selected column as series
```shell
> [[a b]; [1 2] [3 4]] | dfr to-df | dfr column a
```
