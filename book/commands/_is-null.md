---
title: is-null
version: 0.64.0
usage: |
  Creates mask where value is null
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> is-null ```

## Examples

Create mask where values are null
```shell
> let s = ([5 6 0 8] | to-df);
    let res = ($s / $s);
    $res | is-null
```
