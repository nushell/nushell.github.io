---
title: arg-true
version: 0.64.0
usage: |
  Returns indexes where values are true
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> arg-true ```

## Examples

Returns indexes where values are true
```shell
> [false true false] | to-df | arg-true
```
