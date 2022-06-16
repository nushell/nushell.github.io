---
title: str upcase
version: 0.64.0
usage: |
  Make text uppercase
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> str upcase ...rest```

## Parameters

 -  `...rest`: optionally upcase text by column paths

## Examples

Upcase contents
```shell
> 'nu' | str upcase
```
