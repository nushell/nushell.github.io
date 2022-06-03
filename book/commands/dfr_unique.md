---
title: dfr unique
version: 0.63.0
usage: |
  Returns unique values from a series
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr unique --subset --last --maintain-order```

## Parameters

 -  `--subset {any}`: Subset of column(s) to use to maintain rows (lazy df)
 -  `--last`: Keeps last unique value. Default keeps first value (lazy df)
 -  `--maintain-order`: Keep the same order as the original DataFrame (lazy df)

## Examples

Returns unique values from a series
```shell
> [2 2 2 2 2] | dfr to-df | dfr unique
```
