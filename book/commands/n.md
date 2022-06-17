---
title: n
version: 0.64.0
usage: |
  Switch to the next shell.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> n ```

## Examples

Make two directories and enter new shells for them, use `n` to jump to the next shell
```shell
> mkdir foo bar; enter foo; enter ../bar; n
```

Run `n` several times and note the changes of current directory
```shell
> n
```
