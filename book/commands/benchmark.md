---
title: benchmark
version: 0.63.0
usage: |
  Time the running time of a block
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> benchmark (block)```

## Parameters

 -  `block`: the block to run

## Examples

Benchmarks a command within a block
```shell
> benchmark { sleep 500ms }
```
