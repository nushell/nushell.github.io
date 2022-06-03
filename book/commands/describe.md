---
title: describe
version: 0.63.0
usage: |
  Describe the value(s) piped in.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> describe ```

## Examples

Describe the type of a string
```shell
> 'hello' | describe
```
