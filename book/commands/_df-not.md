---
title: df-not
version: 0.64.0
usage: |
  Inverts boolean mask
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> df-not ```

## Examples

Inverts boolean mask
```shell
> [true false true] | to-df | df-not
```
