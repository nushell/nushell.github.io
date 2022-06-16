---
title: url query
version: 0.64.0
usage: |
  Get the query string of a URL
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> url query ...rest```

## Parameters

 -  `...rest`: optionally operate by cell path

## Examples

Get a query string
```shell
> echo 'http://www.example.com/?foo=bar&baz=quux' | url query
```

Returns an empty string if there is no query string
```shell
> echo 'http://www.example.com/' | url query
```
