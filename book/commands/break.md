---
title: break
categories: |
  core
version: 0.73.1
core: |
  Break a loop
usage: |
  Break a loop
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> break ```

## Notes
```text
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
```
## Examples

Break out of a loop
```shell
> loop { break }
```
