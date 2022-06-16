---
title: contains
version: 0.64.0
usage: |
  Checks if a pattern is contained in a string
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> contains (pattern)```

## Parameters

 -  `pattern`: Regex pattern to be searched

## Examples

Returns boolean indicating if pattern was found
```shell
> [abc acb acb] | to-df | contains ab
```
