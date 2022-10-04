---
title: complete
version: 0.69.1
system: |
  Complete the external piped in, collecting outputs and exit code
usage: |
  Complete the external piped in, collecting outputs and exit code
---

# <code>{{ $frontmatter.title }}</code> for system

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.system }}</div>

## Signature

```> complete ```

## Examples

Run the external completion
```shell
> ^external arg1 | complete
```
