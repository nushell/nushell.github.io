---
title: keybindings listen
version: 0.63.0
usage: |
  Get input from the user.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> keybindings listen ```

## Examples

Type and see key event codes
```shell
> keybindings listen
```
