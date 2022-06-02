---
title: db select
version: 0.63.0
usage: |
  Creates a select statement for a DB
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> db select ...select```

## Parameters

 -  `...select`: Select expression(s) on the table

## Examples

selects a column from a database
```shell
> db open db.mysql | db select a | db describe
```

selects columns from a database
```shell
> db open db.mysql | db select a b c | db describe
```
