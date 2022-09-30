---
title: export use
version: 0.69.1
usage: |
  Use definitions from a module and export them from this module
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> export use (pattern)```

## Parameters

 -  `pattern`: import pattern

## Notes
```text
This command is a parser keyword. For details, check:
  https://www.nushell.sh/book/thinking_in_nu.html
```
## Examples

Re-export a command from another module
```shell
> module spam { export def foo [] { "foo" } }
    module eggs { export use spam foo }
    use eggs foo
    foo

```
