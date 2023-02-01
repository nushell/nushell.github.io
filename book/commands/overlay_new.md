---
title: overlay new
categories: |
  core
version: 0.75.0
core: |
  Create an empty overlay
usage: |
  Create an empty overlay
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> overlay new (name)```

## Parameters

 -  `name`: Name of the overlay

## Notes
The command will first create an empty module, then add it as an overlay.

This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
## Examples

Create an empty overlay
```shell
> overlay new spam
```
