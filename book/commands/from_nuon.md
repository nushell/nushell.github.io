---
title: from nuon
version: 0.63.0
usage: |
  Convert from nuon to structured data
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> from nuon ```

## Examples

Converts nuon formatted string to table
```shell
> '{ a:1 }' | from nuon
```

Converts nuon formatted string to table
```shell
> '{ a:1, b: [1, 2] }' | from nuon
```
