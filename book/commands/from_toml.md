---
title: from toml
version: 0.63.0
usage: |
  Parse text as .toml and create table.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> from toml ```

## Examples

Converts toml formatted string to table
```shell
> 'a = 1' | from toml
```

Converts toml formatted string to table
```shell
> 'a = 1
b = [1, 2]' | from toml
```
