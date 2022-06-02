---
title: hash md5
version: 0.63.0
usage: |
  Hash a value using the md5 hash algorithm
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> hash md5 ...rest```

## Parameters

 -  `...rest`: optionally md5 hash data by cell path

## Examples

md5 encode a string
```shell
> echo 'abcdefghijklmnopqrstuvwxyz' | hash md5
```

md5 encode a file
```shell
> open ./nu_0_24_1_windows.zip | hash md5
```
