---
title: to csv
version: 0.63.0
usage: |
  Convert table into .csv text
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> to csv --separator --noheaders```

## Parameters

 -  `--separator {string}`: a character to separate columns, defaults to ','
 -  `--noheaders`: do not output the columns names as the first row

## Examples

Outputs an CSV string representing the contents of this table
```shell
> [[foo bar]; [1 2]] | to csv
```

Outputs an CSV string representing the contents of this table
```shell
> [[foo bar]; [1 2]] | to csv -s ';'
```
