---
title: config env
version: 0.64.0
usage: |
  Edit nu environment configurations
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> config env ```

## Examples

allow user to open and update nu env
```shell
> config env
```
