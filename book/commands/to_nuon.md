---
title: to nuon
version: 0.67.0
usage: |
  Converts table data into Nuon (Nushell Object Notation) text.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> to nuon ```

## Examples

Outputs a nuon string representing the contents of this list
```shell
> [1 2 3] | to nuon
```
