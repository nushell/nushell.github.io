---
title: dfr set
version: 0.63.0
usage: |
  Sets value where given mask is true
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr set (value) --mask```

## Parameters

 -  `value`: value to be inserted in series
 -  `--mask {any}`: mask indicating insertions

## Examples

Shifts the values by a given period
```shell
> let s = ([1 2 2 3 3] | dfr to-df | dfr shift 2);
    let mask = ($s | dfr is-null);
    $s | dfr set 0 --mask $mask
```
