---
title: from ics
version: 0.64.0
usage: |
  Parse text as .ics and create table.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> from ics ```

## Examples

Converts ics formatted string to table
```shell
> 'BEGIN:VCALENDAR
END:VCALENDAR' | from ics
```
