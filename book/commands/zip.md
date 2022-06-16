---
title: zip
version: 0.64.0
usage: |
  Combine a stream with the input
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> zip (other)```

## Parameters

 -  `other`: the other input

## Examples

Zip multiple streams and get one of the results
```shell
> 1..3 | zip 4..6
```
