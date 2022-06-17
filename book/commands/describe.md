---
title: describe
version: 0.64.0
usage: |
  Describe the type and structure of the value(s) piped in.
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
