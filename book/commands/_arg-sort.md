---
title: arg-sort
version: 0.64.0
usage: |
  Returns indexes for a sorted series
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> arg-sort --reverse --nulls-last```

## Parameters

 -  `--reverse`: reverse order
 -  `--nulls-last`: nulls ordered last

## Examples

Returns indexes for a sorted series
```shell
> [1 2 2 3 3] | to-df | arg-sort
```

Returns indexes for a sorted series
```shell
> [1 2 2 3 3] | to-df | arg-sort -r
```
