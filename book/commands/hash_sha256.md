---
title: hash sha256
version: 0.63.0
usage: |
  Hash a value using the sha256 hash algorithm
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> hash sha256 ...rest```

## Parameters

 -  `...rest`: optionally sha256 hash data by cell path

## Examples

sha256 encode a string
```shell
> echo 'abcdefghijklmnopqrstuvwxyz' | hash sha256
```

sha256 encode a file
```shell
> open ./nu_0_24_1_windows.zip | hash sha256
```
