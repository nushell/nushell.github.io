---
title: dfr is-in
version: 0.63.0
usage: |
  Checks if elements from a series are contained in right series
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr is-in (other)```

## Parameters

 -  `other`: right series

## Examples

Checks if elements from a series are contained in right series
```shell
> let other = ([1 3 6] | dfr to-df);
    [5 6 6 6 8 8 8] | dfr to-df | dfr is-in $other
```
