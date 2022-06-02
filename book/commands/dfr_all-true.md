---
title: dfr all-true
version: 0.63.0
usage: |
  Returns true if all values are true
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr all-true ```

## Examples

Returns true if all values are true
```shell
> [true true true] | dfr to-df | dfr all-true
```

Checks the result from a comparison
```shell
> let s = ([5 6 2 8] | dfr to-df);
    let res = ($s > 9);
    $res | dfr all-true
```
