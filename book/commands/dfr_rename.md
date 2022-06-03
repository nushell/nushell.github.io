---
title: dfr rename
version: 0.63.0
usage: |
  Renames a series
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr rename (name)```

## Parameters

 -  `name`: new series name

## Examples

Renames a series
```shell
> [5 6 7 8] | dfr to-df | dfr rename new_name
```
