---
title: table
version: 0.63.0
usage: |
  Render the table.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> table --start-number --list```

## Parameters

 -  `--start-number {int}`: row number to start viewing from
 -  `--list`: list available table modes/themes

## Examples

List the files in current directory with index number start from 1.
```shell
> ls | table -n 1
```

Render data in table view
```shell
> echo [[a b]; [1 2] [3 4]] | table
```
