---
title: from ini
version: 0.64.0
usage: |
  Parse text as .ini and create table
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> from ini ```

## Examples

Converts ini formatted string to table
```shell
> '[foo]
a=1
b=2' | from ini
```
