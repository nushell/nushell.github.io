---
title: ansi strip
version: 0.64.0
usage: |
  Strip ANSI escape sequences from a string
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> ansi strip ...column path```

## Parameters

 -  `...column path`: optionally, remove ANSI sequences by column paths

## Examples

Strip ANSI escape sequences from a string
```shell
> echo [ (ansi green) (ansi cursor_on) "hello" ] | str collect | ansi strip
```
