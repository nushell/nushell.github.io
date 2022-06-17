---
title: exit
version: 0.64.0
usage: |
  Exit a Nu shell or exit Nu entirely.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> exit (exit_code) --now```

## Parameters

 -  `exit_code`: Exit code to return immediately with
 -  `--now`: Exit out of all shells immediately (exiting Nu)

## Examples

Exit the current shell
```shell
> exit
```

Exit all shells (exiting Nu)
```shell
> exit --now
```
