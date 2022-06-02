---
title: db describe
version: 0.63.0
usage: |
  Describes connection and query of the DB object
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> db describe ```

## Examples

Describe SQLite database constructed query
```shell
> db open foo.db | db select table_1 | db describe
```
