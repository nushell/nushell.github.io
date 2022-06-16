---
title: format filesize
version: 0.64.0
usage: |
  Converts a column of filesizes to some specified format
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> format filesize (field) (format value)```

## Parameters

 -  `field`: the name of the column to update
 -  `format value`: the format into which convert the filesizes

## Examples

Convert the size row to KB
```shell
> ls | format filesize size KB
```

Convert the apparent row to B
```shell
> du | format filesize apparent B
```
