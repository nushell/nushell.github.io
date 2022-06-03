---
title: dfr drop
version: 0.63.0
usage: |
  Creates a new dataframe by dropping the selected columns
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr drop ...rest```

## Parameters

 -  `...rest`: column names to be dropped

## Examples

drop column a
```shell
> [[a b]; [1 2] [3 4]] | dfr to-df | dfr drop a
```
