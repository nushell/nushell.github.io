---
title: str-slice
version: 0.64.0
usage: |
  Slices the string from the start position until the selected length
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> str-slice (start) --length```

## Parameters

 -  `start`: start of slice
 -  `--length {int}`: optional length

## Examples

Creates slices from the strings
```shell
> [abcded abc321 abc123] | to-df | str-slice 1 -l 2
```
