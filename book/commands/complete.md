---
title: complete
version: 0.63.0
usage: |
  Complete the external piped in, collecting outputs and exit code
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> complete ```

## Examples

Run the external completion
```shell
> ^external arg1 | complete
```
