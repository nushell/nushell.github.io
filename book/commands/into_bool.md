---
title: into bool
version: 0.63.0
usage: |
  Convert value to boolean
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> into bool ...rest```

## Parameters

 -  `...rest`: column paths to convert to boolean (for table input)

## Examples

Convert value to boolean in table
```shell
> echo [[value]; ['false'] ['1'] [0] [1.0] [true]] | into bool value
```

Convert bool to boolean
```shell
> true | into bool
```

convert integer to boolean
```shell
> 1 | into bool
```

convert decimal string to boolean
```shell
> '0.0' | into bool
```

convert string to boolean
```shell
> 'true' | into bool
```
