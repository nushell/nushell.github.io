---
title: url host
version: 0.64.0
usage: |
  Get the host of a URL
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> url host ...rest```

## Parameters

 -  `...rest`: optionally operate by cell path

## Examples

Get host of a url
```shell
> echo 'http://www.example.com/foo/bar' | url host
```
