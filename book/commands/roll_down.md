---
title: roll down
version: 0.64.0
usage: |
  Roll table rows down
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> roll down --by```

## Parameters

 -  `--by {int}`: Number of rows to roll

## Examples

Rolls rows down
```shell
> [[a b]; [1 2] [3 4] [5 6]] | roll down
```
