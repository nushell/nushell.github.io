---
title: url path
version: 0.63.0
usage: |
  Get the path of a URL
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> url path ...rest```

## Parameters

 -  `...rest`: optionally operate by cell path

## Examples

Get path of a url
```shell
> echo 'http://www.example.com/foo/bar' | url path
```

A trailing slash will be reflected in the path
```shell
> echo 'http://www.example.com' | url path
```
