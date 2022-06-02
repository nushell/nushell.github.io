---
title: nu-highlight
version: 0.63.0
usage: |
  Syntax highlight the input string.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> nu-highlight ```

## Examples

Describe the type of a string
```shell
> 'let x = 3' | nu-highlight
```
