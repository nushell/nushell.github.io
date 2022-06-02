---
title: path parse
version: 0.63.0
usage: |
  Convert a path into structured data.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> path parse --columns --extension```

## Parameters

 -  `--columns {table}`: Optionally operate by column path
 -  `--extension {string}`: Manually supply the extension (without the dot)

## Notes
```text
Each path is split into a table with 'parent', 'stem' and 'extension' fields.
On Windows, an extra 'prefix' column is added.
```
## Examples

Parse a path
```shell
> '/home/viking/spam.txt' | path parse
```

Replace a complex extension
```shell
> '/home/viking/spam.tar.gz' | path parse -e tar.gz | upsert extension { 'txt' }
```

Ignore the extension
```shell
> '/etc/conf.d' | path parse -e ''
```

Parse all paths under the 'name' column
```shell
> ls | path parse -c [ name ]
```
