---
title: from url
version: 0.64.0
usage: |
  Parse url-encoded string as a table.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> from url ```

## Examples

Convert url encoded string into a table
```shell
> 'bread=baguette&cheese=comt%C3%A9&meat=ham&fat=butter' | from url
```
