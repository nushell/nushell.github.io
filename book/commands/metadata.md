---
title: metadata
version: 0.63.0
usage: |
  Get the metadata for items in the stream
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> metadata (expression)```

## Parameters

 -  `expression`: the expression you want metadata for

## Examples

Get the metadata of a variable
```shell
> metadata $a
```

Get the metadata of the input
```shell
> ls | metadata
```
