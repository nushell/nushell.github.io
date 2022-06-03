---
title: random chars
version: 0.63.0
usage: |
  Generate random chars
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> random chars --length```

## Parameters

 -  `--length {int}`: Number of chars

## Examples

Generate random chars
```shell
> random chars
```

Generate random chars with specified length
```shell
> random chars -l 20
```
