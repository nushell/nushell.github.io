---
title: term size
version: 0.64.0
usage: |
  Returns the terminal size
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> term size --columns --rows```

## Parameters

 -  `--columns`: Report only the width of the terminal
 -  `--rows`: Report only the height of the terminal

## Examples

Return the width height of the terminal
```shell
> term size
```

Return the width (columns) of the terminal
```shell
> term size -c
```

Return the height (rows) of the terminal
```shell
> term size -r
```
