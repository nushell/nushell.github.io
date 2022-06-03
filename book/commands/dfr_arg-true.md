---
title: dfr arg-true
version: 0.63.0
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

```> dfr arg-true ```

## Examples

Returns indexes where values are true
```shell
> [false true false] | dfr to-df | dfr arg-true
```
