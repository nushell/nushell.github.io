---
title: default
version: 0.63.0
usage: |
  Sets a default row's column if missing.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> default (default value) (column name)```

## Parameters

 -  `default value`: the value to use as a default
 -  `column name`: the name of the column

## Examples

Give a default 'target' column to all file entries
```shell
> ls -la | default 'nothing' target
```

Default the `$nothing` value in a list
```shell
> [1, 2, $nothing, 4] | default 3
```
