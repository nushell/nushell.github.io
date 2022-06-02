---
title: to yaml
version: 0.63.0
usage: |
  Convert table into .yaml/.yml text
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> to yaml ```

## Examples

Outputs an YAML string representing the contents of this table
```shell
> [[foo bar]; ["1" "2"]] | to yaml
```
