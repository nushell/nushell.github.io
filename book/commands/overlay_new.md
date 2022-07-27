---
title: overlay new
version: 0.66.1
usage: |
  Create an empty overlay
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> overlay new (name)```

## Parameters

 -  `name`: Name of the overlay

## Notes
```text
The command will first create an empty module, then add it as an overlay.

This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nushell.html
```
## Examples

Create an empty overlay
```shell
> overlay new spam
```
