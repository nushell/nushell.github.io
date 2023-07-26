---
title: export
categories: |
  core
version: 0.83.0
core: |
  Export definitions or environment variables from a module.
usage: |
  Export definitions or environment variables from a module.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> export ```

## Notes
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
## Examples

Export a definition from a module
```shell
> module utils { export def my-command [] { "hello" } }; use utils my-command; my-command
hello
```
