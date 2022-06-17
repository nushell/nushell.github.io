---
title: to nuon
version: 0.64.0
usage: |
  Converts table data into Nuon (Nushell Object Notation) text.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> to nuon ```

## Examples

Outputs a nuon string representing the contents of this list
```shell
> [1 2 3] | to nuon
```
