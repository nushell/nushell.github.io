---
title: empty?
version: 0.63.0
usage: |
  Check for empty values.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> empty? ...rest```

## Parameters

 -  `...rest`: the names of the columns to check emptiness

## Examples

Check if a string is empty
```shell
> '' | empty?
```

Check if a list is empty
```shell
> [] | empty?
```

Check if more than one column are empty
```shell
> [[meal size]; [arepa small] [taco '']] | empty? meal size
```
