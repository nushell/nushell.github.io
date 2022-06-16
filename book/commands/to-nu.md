---
title: to-nu
version: 0.64.0
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

```> to-nu ```

## Examples

Convert a col expression into a nushell value
```shell
> col a | to-nu
```
