---
title: continue
categories: |
  core
version: 0.76.1
core: |
  Continue a loop from the next iteration.
usage: |
  Continue a loop from the next iteration.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> continue ```

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
## Examples

Continue a loop from the next iteration
```shell
> for i in 1..10 { if $i == 5 { continue }; print $i }
```
