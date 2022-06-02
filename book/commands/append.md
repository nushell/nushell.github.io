---
title: append
version: 0.63.0
usage: |
  Append any number of rows to a table.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> append (row)```

## Parameters

 -  `row`: the row, list, or table to append

## Examples

Append one Int item
```shell
> [0,1,2,3] | append 4
```

Append three Int items
```shell
> [0,1] | append [2,3,4]
```

Append Ints and Strings
```shell
> [0,1] | append [2,nu,4,shell]
```
