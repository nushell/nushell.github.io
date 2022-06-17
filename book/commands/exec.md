---
title: exec
version: 0.64.0
usage: |
  Execute a command, replacing the current process.
---

<script>
  import { usePageFrontmatter } from '@vuepress/client';
  export default { computed: { frontmatter() { return usePageFrontmatter().value; } } }
</script>

# <code>{{ frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ frontmatter.usage }}</div>

## Signature

```> exec (command) ...rest```

## Parameters

 -  `command`: the command to execute
 -  `...rest`: any additional arguments for the command

## Notes
```text
Currently supported only on Unix-based systems.
```
## Examples

Execute external 'ps aux' tool
```shell
> exec ps aux
```

Execute 'nautilus'
```shell
> exec nautilus
```
