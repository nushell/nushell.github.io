---
title: db testing
version: 0.64.0
usage: |
  Create query object
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> db testing (query)```

## Parameters

 -  `query`: SQL to execute to create the query object

## Examples


```shell
>
```
