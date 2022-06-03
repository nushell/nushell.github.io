---
title: random dice
version: 0.63.0
usage: |
  Generate a random dice roll
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> random dice --dice --sides```

## Parameters

 -  `--dice {int}`: The amount of dice being rolled
 -  `--sides {int}`: The amount of sides a die has

## Examples

Roll 1 dice with 6 sides each
```shell
> random dice
```

Roll 10 dice with 12 sides each
```shell
> random dice -d 10 -s 12
```
