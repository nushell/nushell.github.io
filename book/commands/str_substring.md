---
title: str substring
version: 0.64.0
usage: |
  Get part of a string. Note that the start is included but the end is excluded, and that the first character of a string is index 0.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> str substring (range) ...rest```

## Parameters

 -  `range`: the indexes to substring [start end]
 -  `...rest`: optionally substring text by column paths

## Examples

Get a substring "nushell" from the text "good nushell"
```shell
>  'good nushell' | str substring [5 12]
```

Alternatively, you can use the form
```shell
>  'good nushell' | str substring '5,12'
```

Drop the last `n` characters from the string
```shell
>  'good nushell' | str substring ',-5'
```

Get the remaining characters from a starting index
```shell
>  'good nushell' | str substring '5,'
```

Get the characters from the beginning until ending index
```shell
>  'good nushell' | str substring ',7'
```
