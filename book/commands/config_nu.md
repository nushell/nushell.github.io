---
title: config nu
version: 0.63.0
usage: |
  Edit nu configurations
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> config nu ```

## Examples

allow user to open and update nu config
```shell
> config nu
```
