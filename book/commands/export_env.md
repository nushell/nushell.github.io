---
title: export env
version: 0.63.0
usage: |
  Export a block from a module that will be evaluated as an environment variable when imported.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> export env (name) (block)```

## Parameters

 -  `name`: name of the environment variable
 -  `block`: body of the environment variable definition

## Notes
```text
This command is a parser keyword. For details, check
https://www.nushell.sh/book/thinking_in_nushell.html#parsing-and-evaluation-are-different-stages
```
## Examples

Import and evaluate environment variable from a module
```shell
> module foo { export env FOO_ENV { "BAZ" } }; use foo FOO_ENV; $env.FOO_ENV
```
