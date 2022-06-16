---
title: export def
version: 0.64.0
usage: |
  Define a custom command and export it from a module
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> export def (name) (params) (block)```

## Parameters

 -  `name`: definition name
 -  `params`: parameters
 -  `block`: body of the definition

## Notes
```text
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nushell.html
```
## Examples

Define a custom command in a module and call it
```shell
> module spam { export def foo [] { "foo" } }; use spam foo; foo
```
