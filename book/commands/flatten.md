---
title: flatten
version: 0.64.0
usage: |
  Flatten the table.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> flatten ...rest --all```

## Parameters

 -  `...rest`: optionally flatten data by column
 -  `--all`: flatten inner table out

## Examples

flatten a table
```shell
> [[N, u, s, h, e, l, l]] | flatten
```

flatten a table, get the first item
```shell
> [[N, u, s, h, e, l, l]] | flatten | first
```

flatten a column having a nested table
```shell
> [[origin, people]; [Ecuador, ([[name, meal]; ['Andres', 'arepa']])]] | flatten --all | get meal
```

restrict the flattening by passing column names
```shell
> [[origin, crate, versions]; [World, ([[name]; ['nu-cli']]), ['0.21', '0.22']]] | flatten versions --all | last | get versions
```

Flatten inner table
```shell
> { a: b, d: [ 1 2 3 4 ],  e: [ 4 3  ] } | flatten d --all
```
