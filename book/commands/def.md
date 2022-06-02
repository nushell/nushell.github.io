---
title: def
version: 0.63.0
usage: |
  Define a custom command
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> def (def_name) (params) (block)```

## Parameters

 -  `def_name`: definition name
 -  `params`: parameters
 -  `block`: body of the definition

## Notes
```text
This command is a parser keyword. For details, check
https://www.nushell.sh/book/thinking_in_nushell.html#parsing-and-evaluation-are-different-stages
```
## Examples

Define a command and run it
```shell
> def say-hi [] { echo 'hi' }; say-hi
```

Define a command and run it with parameter(s)
```shell
> def say-sth [sth: string] { echo $sth }; say-sth hi
```
