---
title: from ods
version: 0.63.0
usage: |
  Parse OpenDocument Spreadsheet(.ods) data and create table.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> from ods --sheets```

## Parameters

 -  `--sheets {list<string>}`: Only convert specified sheets

## Examples

Convert binary .ods data to a table
```shell
> open test.txt | from ods
```

Convert binary .ods data to a table, specifying the tables
```shell
> open test.txt | from ods -s [Spreadsheet1]
```
