---
title: drop
version: 0.63.0
usage: |
  Remove the last number of rows or columns.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> drop (rows)```

## Parameters

 -  `rows`: starting from the back, the number of rows to remove

## Examples

Remove the last item of a list/table
```shell
> [0,1,2,3] | drop
```

Remove zero item of a list/table
```shell
> [0,1,2,3] | drop 0
```

Remove the last two items of a list/table
```shell
> [0,1,2,3] | drop 2
```
