---
title: transpose
version: 0.63.0
usage: |
  Transposes the table contents so rows become columns and columns become rows.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> transpose ...rest --header-row --ignore-titles```

## Parameters

 -  `...rest`: the names to give columns once transposed
 -  `--header-row`: treat the first row as column names
 -  `--ignore-titles`: don't transpose the column names into values

## Examples

Transposes the table contents with default column names
```shell
> echo [[c1 c2]; [1 2]] | transpose
```

Transposes the table contents with specified column names
```shell
> echo [[c1 c2]; [1 2]] | transpose key val
```

Transposes the table without column names and specify a new column name
```shell
> echo [[c1 c2]; [1 2]] | transpose -i val
```
