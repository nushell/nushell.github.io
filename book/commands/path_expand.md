---
title: path expand
version: 0.64.0
usage: |
  Try to expand a path to its absolute form
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> path expand --strict --columns```

## Parameters

 -  `--strict`: Throw an error if the path could not be expanded
 -  `--columns {table}`: Optionally operate by column path

## Examples

Expand an absolute path
```shell
> '/home/joe/foo/../bar' | path expand
```

Expand a path in a column
```shell
> ls | path expand -c [ name ]
```

Expand a relative path
```shell
> 'foo/../bar' | path expand
```
