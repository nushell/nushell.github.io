---
title: export
version: 0.68.0
usage: |
  Export definitions or environment variables from a module.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> export ```

## Notes
```text
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
```
## Examples

Export a definition from a module
```shell
> module utils { export def my-command [] { "hello" } }; use utils my-command; my-command
```
