---
title: dfr otherwise
version: 0.63.1
usage: |
  completes a when expression
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr otherwise (otherwise expression)```

## Parameters

 -  `otherwise expression`: expressioini to apply when no when predicate matches

## Examples

Create a when conditions
```shell
> dfr when ((dfr col a) > 2) 4 | dfr otherwise 5
```

Create a when conditions
```shell
> dfr when ((dfr col a) > 2) 4 | dfr when ((dfr col a) < 0) 6 | dfr otherwise 0
```

Create a new column for the dataframe
```shell
> [[a b]; [6 2] [1 4] [4 1]]
   | dfr to-lazy
   | dfr with-column (
       dfr when ((dfr col a) > 2) 4 | dfr otherwise 5 | dfr as c
     )
   | dfr with-column (
       dfr when ((dfr col a) > 5) 10 | dfr when ((dfr col a) < 2) 6 | dfr otherwise 0 | dfr as d
     )
   | dfr collect
```
