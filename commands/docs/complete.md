---
title: complete
categories: |
  system
version: 0.82.0
system: |
  Capture the outputs and exit code from an external piped in command in a nushell table.
usage: |
  Capture the outputs and exit code from an external piped in command in a nushell table.
---

# <code>{{ $frontmatter.title }}</code> for system

<div class='command-title'>{{ $frontmatter.system }}</div>

## Signature

```> complete ```

## Notes
In order to capture stdout, stderr, and exit_code, externally piped in commands need to be wrapped with `do`
## Examples

Run the external command to completion, capturing stdout and exit_code
```shell
> ^external arg1 | complete

```

Run external command to completion, capturing, stdout, stderr and exit_code
```shell
> do { ^external arg1 } | complete

```
