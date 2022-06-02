---
title: db schema
version: 0.63.0
usage: |
  Show database information, including its schema.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> db schema ```

## Examples

Show the schema of a SQLite database
```shell
> open foo.db | db schema
```
