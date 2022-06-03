---
title: str ends-with
version: 0.63.0
usage: |
  Check if a string ends with a pattern
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> str ends-with (pattern) ...rest```

## Parameters

 -  `pattern`: the pattern to match
 -  `...rest`: optionally matches suffix of text by column paths

## Examples

Checks if string ends with '.rb' pattern
```shell
> 'my_library.rb' | str ends-with '.rb'
```

Checks if string ends with '.txt' pattern
```shell
> 'my_library.rb' | str ends-with '.txt'
```
