---
title: query json
version: 0.64.0
usage: |
  execute json query on json file (open --raw <file> | query json 'query string')
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> query json (query)```

## Parameters

 -  `query`: json query
