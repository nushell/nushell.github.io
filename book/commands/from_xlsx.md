---
title: from xlsx
version: 0.63.0
usage: |
  Parse binary Excel(.xlsx) data and create table.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> from xlsx --sheets```

## Parameters

 -  `--sheets {list<string>}`: Only convert specified sheets

## Examples

Convert binary .xlsx data to a table
```shell
> open test.txt | from xlsx
```

Convert binary .xlsx data to a table, specifying the tables
```shell
> open test.txt | from xlsx -s [Spreadsheet1]
```
