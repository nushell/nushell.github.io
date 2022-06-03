---
title: histogram
version: 0.63.0
usage: |
  Creates a new table with a histogram based on the column name passed in.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> histogram (column-name) (frequency-column-name) --percentage-type```

## Parameters

 -  `column-name`: column name to calc frequency, no need to provide if input is just a list
 -  `frequency-column-name`: histogram's frequency column, default to be frequency column output
 -  `--percentage-type {string}`: percentage calculate method, can be 'normalize' or 'relative', in 'normalize', defaults to be 'normalize'

## Examples

Get a histogram for the types of files
```shell
> ls | histogram type
```

Get a histogram for the types of files, with frequency column named freq
```shell
> ls | histogram type freq
```

Get a histogram for a list of numbers
```shell
> echo [1 2 3 1 1 1 2 2 1 1] | histogram
```

Get a histogram for a list of numbers, and percentage is based on the maximum value
```shell
> echo [1 2 3 1 1 1 2 2 1 1] | histogram --percentage-type relative
```
