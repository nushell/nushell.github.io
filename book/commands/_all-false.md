---
title: all-false
version: 0.64.0
usage: |
  Returns true if all values are false
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> all-false ```

## Examples

Returns true if all values are false
```shell
> [false false false] | to-df | all-false
```

Checks the result from a comparison
```shell
> let s = ([5 6 2 10] | to-df);
    let res = ($s > 9);
    $res | all-false
```
