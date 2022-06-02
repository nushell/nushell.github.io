---
title: to tsv
version: 0.63.0
usage: |
  Convert table into .tsv text
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> to tsv --noheaders```

## Parameters

 -  `--noheaders`: do not output the column names as the first row

## Examples

Outputs an TSV string representing the contents of this table
```shell
> [[foo bar]; [1 2]] | to tsv
```
