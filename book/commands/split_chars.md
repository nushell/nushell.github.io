---
title: split chars
version: 0.63.0
usage: |
  Split a string's characters into separate rows
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> split chars ```

## Examples

Split the string's characters into separate rows
```shell
> 'hello' | split chars
```
