---
title: echo
version: 0.63.0
usage: |
  Echo the arguments back to the user.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> echo ...rest```

## Parameters

 -  `...rest`: the values to echo

## Examples

Put a hello message in the pipeline
```shell
> echo 'hello'
```

Print the value of the special '$nu' variable
```shell
> echo $nu
```
