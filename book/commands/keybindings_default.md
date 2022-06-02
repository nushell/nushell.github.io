---
title: keybindings default
version: 0.63.0
usage: |
  List default keybindings
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> keybindings default ```

## Examples

Get list with default keybindings
```shell
> keybindings default
```
