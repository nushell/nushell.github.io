---
title: str title-case
version: 0.64.0
usage: |
  Convert a string to Title Case
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> str title-case ...rest```

## Parameters

 -  `...rest`: optionally convert text to Title Case by column paths

## Examples

convert a string to Title Case
```shell
> 'nu-shell' | str title-case
```

convert a string to Title Case
```shell
> 'this is a test case' | str title-case
```

convert a column from a table to Title Case
```shell
> [[title, count]; ['nu test', 100]] | str title-case title
```
