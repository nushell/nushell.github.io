---
title: path type
version: 0.63.0
usage: |
  Get the type of the object a path refers to (e.g., file, dir, symlink)
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> path type --columns```

## Parameters

 -  `--columns {table}`: Optionally operate by column path

## Examples

Show type of a filepath
```shell
> '.' | path type
```

Show type of a filepath in a column
```shell
> ls | path type -c [ name ]
```
