---
title: db group-by
version: 0.64.0
usage: |
  Group by query
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> db group-by ...select```

## Parameters

 -  `...select`: Select expression(s) on the table

## Examples

orders query by a column
```shell
> db open db.mysql
    | db from table_a
    | db select a
    | db group-by a
    | db describe
```
