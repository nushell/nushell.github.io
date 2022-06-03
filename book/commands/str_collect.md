---
title: str collect
version: 0.63.0
usage: |
  Concatenate multiple strings into a single string, with an optional separator between each
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> str collect (separator)```

## Parameters

 -  `separator`: optional separator to use when creating string

## Examples

Create a string from input
```shell
> ['nu', 'shell'] | str collect
```

Create a string from input with a separator
```shell
> ['nu', 'shell'] | str collect '-'
```
