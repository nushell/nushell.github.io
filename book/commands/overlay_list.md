---
title: overlay list
version: 0.64.0
usage: |
  List all active overlays
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> overlay list ```

## Notes
```text
The overlays are listed in the order they were activated.
```
## Examples

Get the last activated overlay
```shell
> module spam { export def foo [] { "foo" } }
    overlay add spam
    overlay list | last
```
