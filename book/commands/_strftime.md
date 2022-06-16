---
title: strftime
version: 0.64.0
usage: |
  Formats date based on string rule
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> strftime (fmt)```

## Parameters

 -  `fmt`: Format rule

## Examples

Formats date
```shell
> let dt = ('2020-08-04T16:39:18+00:00' | into datetime -z 'UTC');
    let df = ([$dt $dt] | to-df);
    $df | strftime "%Y/%m/%d"
```
