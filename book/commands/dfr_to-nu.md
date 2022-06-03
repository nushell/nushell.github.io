---
title: dfr to-nu
version: 0.63.0
usage: |
  Convert expression to a nu value for access and exploration
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr to-nu ```

## Examples

Convert a col expression into a nushell value
```shell
> dfr col col_a | dfr to-nu
```
