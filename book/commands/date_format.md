---
title: date format
version: 0.63.0
usage: |
  Format a given date using a format string.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> date format (format string) --list```

## Parameters

 -  `format string`: the desired date format
 -  `--list`: lists strftime cheatsheet

## Examples

Format a given date using the default format (RFC 2822).
```shell
> "2021-10-22 20:00:12 +01:00" | date format
```

Format a given date using a given format string.
```shell
> date format '%Y-%m-%d'
```

Format a given date using a given format string.
```shell
> date format "%Y-%m-%d %H:%M:%S"
```

Format a given date using a given format string.
```shell
> "2021-10-22 20:00:12 +01:00" | date format "%Y-%m-%d"
```
