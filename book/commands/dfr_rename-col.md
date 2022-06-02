---
title: dfr rename-col
version: 0.63.0
usage: |
  Rename a dataframe column
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr rename-col (columns) (new names)```

## Parameters

 -  `columns`: Column(s) to be renamed. A string or list of strings
 -  `new names`: New names for the selected column(s). A string or list of strings

## Examples

Renames a dataframe column
```shell
> [[a b]; [1 2] [3 4]] | dfr to-df | dfr rename-col a a_new
```
