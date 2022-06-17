---
title: random integer
version: 0.64.0
usage: |
  Generate a random integer [min..max]
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> random integer (range)```

## Parameters

 -  `range`: Range of values

## Examples

Generate an unconstrained random integer
```shell
> random integer
```

Generate a random integer less than or equal to 500
```shell
> random integer ..500
```

Generate a random integer greater than or equal to 100000
```shell
> random integer 100000..
```

Generate a random integer between 1 and 10
```shell
> random integer 1..10
```
