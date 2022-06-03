---
title: dfr when
version: 0.63.0
usage: |
  Creates a when expression
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> dfr when (when predicate) --then --otherwise```

## Parameters

 -  `when predicate`: Name of column to be used
 -  `--then {any}`: Expression that will be applied when predicate is true
 -  `--otherwise {any}`: Expression that will be applied when predicate is false

## Examples

Create a new column for the dataframe
```shell
> [[a b]; [1 2] [3 4]]
   | dfr to-df
   | dfr to-lazy
   | dfr with-column (
       dfr when ((dfr col a) > 2) --then 4 --otherwise 5  | dfr as "c"
     )
   | dfr collect
```
