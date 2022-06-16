---
title: random uuid
version: 0.64.0
usage: |
  Generate a random uuid4 string
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> random uuid ```

## Examples

Generate a random uuid4 string
```shell
> random uuid
```
