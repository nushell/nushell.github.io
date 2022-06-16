---
title: take
version: 0.64.0
usage: |
  Take the first n elements of the input.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> take (n)```

## Parameters

 -  `n`: the number of elements to take

## Examples

Take two elements
```shell
> echo [[editions]; [2015] [2018] [2021]] | take 2
```

Take the first value
```shell
> echo [2 4 6 8] | take
```
