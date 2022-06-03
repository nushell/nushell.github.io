---
title: cd
version: 0.63.0
usage: |
  Change directory.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> cd (path)```

## Parameters

 -  `path`: the path to change to

## Examples

Change to your home directory
```shell
> cd ~
```

Change to a directory via abbreviations
```shell
> cd d/s/9
```
