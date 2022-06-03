---
title: dfr to-lowercase
version: 0.63.0
usage: |
  Lowercase the strings in the column
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr to-lowercase ```

## Examples

Modifies strings to lowercase
```shell
> [Abc aBc abC] | dfr to-df | dfr to-lowercase
```
