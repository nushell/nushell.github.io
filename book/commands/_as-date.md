---
title: as-date
version: 0.64.0
usage: |
  Converts string to date.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> as-date (format) --not-exact```

## Parameters

 -  `format`: formatting date string
 -  `--not-exact`: the format string may be contained in the date (e.g. foo-2021-01-01-bar could match 2021-01-01)

## Notes
```text
Format example:
        "%Y-%m-%d"    => 2021-12-31
        "%d-%m-%Y"    => 31-12-2021
        "%Y%m%d"      => 2021319 (2021-03-19)
```
## Examples

Converts string to date
```shell
> ["2021-12-30" "2021-12-31"] | to-df | as-datetime "%Y-%m-%d"
```
