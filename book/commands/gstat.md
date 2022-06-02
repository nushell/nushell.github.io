---
title: gstat
version: 0.63.0
usage: |
  Get the git status of a repo
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> gstat (path)```

## Parameters

 -  `path`: path to repo
