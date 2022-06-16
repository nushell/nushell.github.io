---
title: each while
version: 0.64.0
usage: |
  Run a block on each element of input until a $nothing is found
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> each while (block) --numbered```

## Parameters

 -  `block`: the block to run
 -  `--numbered`: iterate with an index

## Examples

Multiplies elements in list
```shell
> [1 2 3] | each while { |it| if $it < 3 {$it} else {$nothing} }
```

Iterate over each element, print the matching value and its index
```shell
> [1 2 3] | each while -n { |it| if $it.item < 2 { $"value ($it.item) at ($it.index)!"} else { $nothing } }
```
